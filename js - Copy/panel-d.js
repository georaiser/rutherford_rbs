/**
 * panel-d.js — Panel D: RBS en acción (versión interactiva)
 *
 * Interactividad:
 *   1. Slider E₀ (energía del haz 1–3 MeV): picos se desplazan, K permanece fijo
 *   2. Sliders de concentración por capa: altura del pico cambia, posición no
 *   3. Pausa / Continuar + Reiniciar espectro
 *   4. Hover en espectro: tooltip con K, E₁, Z₂², cuentas
 *   5. Click en capa de la muestra: resalta capa y su pico en el espectro
 *
 * Física real:
 *   - K(M₂, θ=170°) con Physics.calcK()
 *   - Probabilidad de impacto ∝ Z₂² × concentración (sección eficaz de Rutherford)
 *   - Resolución del detector: σ = 0.030 MeV (gaussiana)
 *   - Velocidad de rebote visual ∝ √K (proporcional a √(E₁/E₀))
 *
 * Depende de: constants.js, physics.js
 */
'use strict';

const panelD = (() => {

  // Canvas: muestra (izquierda)
  const cvS = document.getElementById('canvasDsamp');
  const cxS = cvS.getContext('2d');
  const WS = cvS.width;   // 520
  const HS = cvS.height;  // 300

  // Canvas: espectro (derecha)
  const cvP = document.getElementById('canvasDspec');
  const cxP = cvP.getContext('2d');
  const WP = cvP.width;   // 520
  const HP = cvP.height;  // 300

  // ─── Capas de la muestra ───
  // C, Ag, Au, Fe, Si ordenados superficie → substrato.
  // Fe y Ag comienzan en conc=0 (sin efecto hasta que el usuario los active).
  const LAYERS = [
    { sym:'C',  Z2:6,  M2:12,  color:'#94a3b8', label:'C  — superficie',       yFrac:0.06, hFrac:0.10 },
    { sym:'Ag', Z2:47, M2:108, color:'#c084fc', label:'Ag — capa opcional',     yFrac:0.16, hFrac:0.14 },
    { sym:'Au', Z2:79, M2:197, color:'#f59e0b', label:'Au — película fina',     yFrac:0.30, hFrac:0.18 },
    { sym:'Fe', Z2:26, M2:56,  color:'#fb923c', label:'Fe — capa opcional',     yFrac:0.48, hFrac:0.14 },
    { sym:'Si', Z2:14, M2:28,  color:'#60a5fa', label:'Si — substrato',         yFrac:0.62, hFrac:0.30 },
  ];

  // Posiciones absolutas en canvas
  LAYERS.forEach(l => {
    l.y  = l.yFrac  * HS;
    l.h  = l.hFrac  * HS;
    l.cy = l.y + l.h / 2;
    l.K  = Physics.calcK(l.M2, PHYS.THETA_DET);
  });

  // ─── Estado mutable ───
  let E0_D        = 2.0;   // energía del haz (MeV), ajustable
  let isPaused    = false;
  let selectedLyr = null;  // capa seleccionada con click
  let hoveredSpec = null;  // pico bajo el cursor en el espectro

  // Concentraciones relativas (0–1). Ag y Fe comienzan en 0 (capas opcionales).
  const conc = { C: 0.30, Ag: 0.0, Au: 1.0, Fe: 0.0, Si: 1.0 };

  // Calcular E₁ usando E0_D actual
  function getE1(layer) {
    return layer.K !== null ? layer.K * E0_D : null;
  }

  // ─── Layout de la muestra ───
  const SURF_X = 198;
  const SAMP_W = 118;
  const DET_X  = 28;
  const DET_Y  = 15;

  // ─── Espectro acumulado ───
  const NUM_BINS  = 120;
  const E_MAX_SP  = 3.20; // MeV (máximo mayor que E0 máximo × K máximo ≈ 3 × 0.93 = 2.79)
  const SIGMA_DET = 0.030;

  const perEl     = {};
  LAYERS.forEach(l => { perEl[l.sym] = new Float32Array(NUM_BINS); });
  const totalBins = new Float32Array(NUM_BINS);

  let peakAreas = []; // para hover detection

  function eToBin(e) { return Math.round(e / E_MAX_SP * NUM_BINS); }
  function binToE(i)  { return (i + 0.5) * E_MAX_SP / NUM_BINS; }

  function addCount(layer) {
    const E1 = getE1(layer);
    if (E1 === null) return;
    for (let i = 0; i < NUM_BINS; i++) {
      const e = binToE(i);
      const v = Math.exp(-0.5 * ((e - E1) / SIGMA_DET) ** 2);
      perEl[layer.sym][i] += v;
      totalBins[i]         += v;
    }
  }

  // ─── Partículas ───
  const particles = [];
  let lastTs     = null;
  let spawnTimer = 0;
  // Corriente del haz: 9200 / I_nA => a 20 nA = 460 ms (default), a 100 nA = 92 ms
  let I_nA    = 20;
  let spawnMs = 9200 / I_nA;   // ms entre spawns — controlado por slider
  const DUR_APP   = 820;
  const DUR_FLASH = 180;

  function pickLayer() {
    const weights = LAYERS.map(l => ({ l, w: conc[l.sym] * l.Z2 * l.Z2 })).filter(x => x.w > 0);
    if (!weights.length) return null;
    const total = weights.reduce((s, x) => s + x.w, 0);
    let r = Math.random() * total;
    for (const x of weights) { r -= x.w; if (r <= 0) return x.l; }
    return weights[weights.length - 1].l;
  }

  function spawnParticle() {
    const layer = pickLayer();
    if (!layer || getE1(layer) === null) return;
    particles.push({ layer, phase:'approach', t:0, x:82, y:layer.cy, hitX:SURF_X, hitY:layer.cy });
  }

  function updateParticle(p, dt) {
    p.t += dt;
    const E1     = getE1(p.layer);
    const DUR_RB = DUR_APP * 0.65 / Math.sqrt(p.layer.K);

    if (p.phase === 'approach') {
      p.x = 82 + Math.min(p.t / DUR_APP, 1) * (p.hitX - 82);
      if (p.t >= DUR_APP) { p.phase = 'flash'; p.t = 0; }

    } else if (p.phase === 'flash') {
      if (p.t >= DUR_FLASH) { p.phase = 'rebound'; p.t = 0; }

    } else if (p.phase === 'rebound') {
      const f = Math.min(p.t / DUR_RB, 1);
      p.x = p.hitX + f * (DET_X - p.hitX);
      p.y = p.hitY  + f * (DET_Y - p.hitY);
      if (p.t >= DUR_RB) { p.phase = 'done'; addCount(p.layer); }
    }
  }

  // ─── Dibujo: canvas de muestra ───
  function drawSample() {
    cxS.clearRect(0, 0, WS, HS);

    // Guías de haz (punteadas)
    LAYERS.forEach(l => {
      if (conc[l.sym] < 0.05) return;
      cxS.setLineDash([4, 8]); cxS.strokeStyle = 'rgba(100,160,255,0.07)'; cxS.lineWidth = 1;
      cxS.beginPath(); cxS.moveTo(82, l.cy); cxS.lineTo(SURF_X - 2, l.cy); cxS.stroke();
      cxS.setLineDash([]);
    });

    // Fuente del haz
    cxS.textAlign = 'center';
    cxS.font = 'bold 10px Inter, sans-serif'; cxS.fillStyle = 'rgba(100,160,255,0.75)';
    cxS.fillText('α  He²⁺', 40, HS / 2 - 9);
    cxS.font = '9px JetBrains Mono, monospace'; cxS.fillStyle = 'rgba(100,160,255,0.6)';
    cxS.fillText(E0_D.toFixed(1) + ' MeV', 40, HS / 2 + 5);
    cxS.fillText('→', 68, HS / 2 - 1);
    cxS.textAlign = 'left';

    // Detector
    cxS.beginPath(); cxS.moveTo(DET_X-11,DET_Y+5); cxS.lineTo(DET_X+11,DET_Y+5); cxS.lineTo(DET_X,DET_Y+18); cxS.closePath();
    cxS.fillStyle = 'rgba(100,200,255,0.25)'; cxS.fill();
    cxS.strokeStyle = 'rgba(100,200,255,0.65)'; cxS.lineWidth = 1.2; cxS.stroke();
    cxS.font = '9px Inter, sans-serif'; cxS.fillStyle = 'rgba(100,200,255,0.7)';
    cxS.textAlign = 'center'; cxS.fillText('Detector  170°', DET_X, DET_Y - 5); cxS.textAlign = 'left';

    // Línea de superficie
    const yTop = LAYERS[0].y - 4;
    const yBot = LAYERS[LAYERS.length - 1].y + LAYERS[LAYERS.length - 1].h + 4;
    cxS.strokeStyle = 'rgba(255,255,255,0.28)'; cxS.lineWidth = 1.8;
    cxS.beginPath(); cxS.moveTo(SURF_X, yTop); cxS.lineTo(SURF_X, yBot); cxS.stroke();
    cxS.fillStyle = 'rgba(200,220,240,0.5)'; cxS.font = '10px Inter, sans-serif';
    cxS.textAlign = 'center'; cxS.fillText('Muestra', SURF_X + SAMP_W / 2, LAYERS[0].y - 10); cxS.textAlign = 'left';

    // Capas
    LAYERS.forEach(l => {
      const isSel   = selectedLyr === l.sym;
      const Ni      = conc[l.sym];
      const alpha   = Ni * 0.45 + (Ni > 0.01 ? 0.06 : 0);
      const visible = Ni > 0.02;

      // Halo si seleccionada
      if (isSel) {
        cxS.shadowColor = l.color; cxS.shadowBlur = 14;
        cxS.fillStyle = l.color + '18';
        cxS.fillRect(SURF_X - 4, l.y - 2, SAMP_W + 8, l.h + 4);
        cxS.shadowBlur = 0;
      }

      // Relleno de la capa
      cxS.fillStyle = l.color + Math.round(alpha * 255).toString(16).padStart(2,'0').slice(0,2);
      cxS.fillRect(SURF_X, l.y, SAMP_W, l.h);
      cxS.strokeStyle = isSel ? l.color + 'aa' : l.color + '40';
      cxS.lineWidth = isSel ? 1.5 : 1;
      cxS.strokeRect(SURF_X, l.y, SAMP_W, l.h);

      if (visible) {
        // Átomos (radio ∝ M₂^(1/3))
        const atomR = Math.cbrt(l.M2 / 12) * 4.0;
        const cols  = 4;
        const rows  = Math.max(2, Math.round(l.h / (atomR * 3.2)));
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const ax = SURF_X + 14 + c * (SAMP_W - 22) / (cols - 1);
            const ay = l.y + atomR + (r + 0.5) * (l.h - 2 * atomR) / rows;
            cxS.beginPath(); cxS.arc(ax, ay, atomR, 0, Math.PI * 2);
            cxS.fillStyle = l.color + Math.round(Ni * 180 + 40).toString(16).padStart(2,'0');
            cxS.fill();
          }
        }
      }

      // Etiquetas a la derecha
      const lx = SURF_X + SAMP_W + 10;
      const E1 = getE1(l);
      cxS.font = 'bold 10px Inter, sans-serif';
      cxS.fillStyle = visible ? l.color : l.color + '44';
      cxS.fillText(l.label, lx, l.cy - 6);
      if (E1 !== null && visible) {
        cxS.font = '9px JetBrains Mono, monospace'; cxS.fillStyle = l.color + 'aa';
        cxS.fillText('K=' + l.K.toFixed(4) + '   E₁=' + E1.toFixed(3) + ' MeV', lx, l.cy + 8);
      }
    });

    // Partículas
    for (const p of particles) { if (p.phase !== 'done') drawParticle(p); }

    // Estado PAUSA
    if (isPaused) {
      cxS.fillStyle = 'rgba(0,0,0,0.45)';
      cxS.fillRect(0, 0, WS, HS);
      cxS.font = 'bold 16px Inter, sans-serif'; cxS.fillStyle = 'rgba(255,255,255,0.7)';
      cxS.textAlign = 'center'; cxS.fillText('⏸ Pausado', WS / 2, HS / 2); cxS.textAlign = 'left';
    }
  }

  function drawParticle(p) {
    const col = p.layer.color;
    const E1  = getE1(p.layer);

    if (p.phase === 'approach') {
      cxS.beginPath(); cxS.moveTo(82, p.y); cxS.lineTo(p.x - 4, p.y);
      cxS.strokeStyle = 'rgba(100,160,255,0.35)'; cxS.lineWidth = 1.5; cxS.stroke();
      const g = cxS.createRadialGradient(p.x,p.y,0,p.x,p.y,9);
      g.addColorStop(0,'rgba(100,160,255,0.9)'); g.addColorStop(1,'transparent');
      cxS.beginPath(); cxS.arc(p.x,p.y,9,0,Math.PI*2); cxS.fillStyle=g; cxS.fill();
      cxS.beginPath(); cxS.arc(p.x,p.y,3.5,0,Math.PI*2); cxS.fillStyle='#60a5fa'; cxS.fill();

    } else if (p.phase === 'flash') {
      const prog = Math.min(p.t / DUR_FLASH, 1);
      const r = 10 + prog * 26, a = Math.max(0, 0.9 - prog);
      const gf = cxS.createRadialGradient(p.hitX,p.hitY,0,p.hitX,p.hitY,r);
      gf.addColorStop(0,`rgba(255,255,255,${a})`);
      gf.addColorStop(0.3, col + Math.round(a*200).toString(16).padStart(2,'0'));
      gf.addColorStop(1,'transparent');
      cxS.beginPath(); cxS.arc(p.hitX,p.hitY,r,0,Math.PI*2); cxS.fillStyle=gf; cxS.fill();

    } else if (p.phase === 'rebound') {
      cxS.beginPath(); cxS.moveTo(p.hitX,p.hitY); cxS.lineTo(p.x,p.y);
      cxS.strokeStyle = col+'55'; cxS.lineWidth = 1.5; cxS.stroke();
      const gr = cxS.createRadialGradient(p.x,p.y,0,p.x,p.y,9);
      gr.addColorStop(0,col+'cc'); gr.addColorStop(1,'transparent');
      cxS.beginPath(); cxS.arc(p.x,p.y,9,0,Math.PI*2); cxS.fillStyle=gr; cxS.fill();
      cxS.beginPath(); cxS.arc(p.x,p.y,4,0,Math.PI*2); cxS.fillStyle=col; cxS.fill();
      // Etiqueta E₁
      const DUR_RB = DUR_APP * 0.65 / Math.sqrt(p.layer.K);
      const frac   = p.t / DUR_RB;
      if (frac > 0.12 && frac < 0.82 && E1 !== null) {
        cxS.font = '9px JetBrains Mono, monospace'; cxS.fillStyle = col;
        cxS.textAlign = 'center'; cxS.fillText('E₁='+E1.toFixed(3)+' MeV', p.x+2, p.y-11); cxS.textAlign='left';
      }
    }
  }

  // ─── Dibujo: espectro ───
  const PAD = { L:52, R:14, T:28, B:46 };
  const PW  = WP - PAD.L - PAD.R;
  const PH  = HP - PAD.T - PAD.B;

  function eToX(e) { return PAD.L + (e / E_MAX_SP) * PW; }

  function drawSpectrum() {
    cxP.clearRect(0, 0, WP, HP);
    cxP.fillStyle = 'rgba(255,255,255,0.012)'; cxP.fillRect(0, 0, WP, HP);
    cxP.fillStyle = 'rgba(255,255,255,0.015)'; cxP.fillRect(PAD.L, PAD.T, PW, PH);

    // Grilla
    cxP.strokeStyle = 'rgba(255,255,255,0.05)'; cxP.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const yg = PAD.T + PH * i / 4;
      cxP.beginPath(); cxP.moveTo(PAD.L, yg); cxP.lineTo(PAD.L + PW, yg); cxP.stroke();
    }

    const maxT = Math.max(...totalBins, 1);
    peakAreas  = [];

    // Área y línea por elemento
    LAYERS.forEach(l => {
      const eb   = perEl[l.sym];
      const isSel = selectedLyr === l.sym || hoveredSpec === l.sym;
      const y0   = PAD.T + PH;

      cxP.beginPath(); cxP.moveTo(PAD.L, y0);
      for (let i = 0; i < NUM_BINS; i++) {
        const x = PAD.L + (i + 0.5) * PW / NUM_BINS;
        const h = (eb[i] / maxT) * PH * 0.88;
        cxP.lineTo(x, y0 - h);
      }
      cxP.lineTo(PAD.L + PW, y0); cxP.closePath();
      cxP.fillStyle = l.color + (isSel ? '5a' : '35'); cxP.fill();

      cxP.beginPath();
      for (let i = 0; i < NUM_BINS; i++) {
        const x = PAD.L + (i + 0.5) * PW / NUM_BINS;
        const h = (eb[i] / maxT) * PH * 0.88;
        i === 0 ? cxP.moveTo(x, y0 - h) : cxP.lineTo(x, y0 - h);
      }
      cxP.strokeStyle = l.color + (isSel ? 'ee' : 'bb'); cxP.lineWidth = isSel ? 2 : 1.4; cxP.stroke();

      // Etiqueta del pico + cache de posición para hover
      const E1  = getE1(l);
      if (E1 !== null && maxT > 0.5) {
        const idx = eToBin(E1);
        if (idx >= 0 && idx < NUM_BINS) {
          const h  = (eb[idx] / maxT) * PH * 0.88;
          const px = eToX(E1);
          const py = PAD.T + PH - h;
          peakAreas.push({ sym: l.sym, x: px, layer: l, counts: eb[idx], h });
          if (h > 4) {
            cxP.font = `bold ${isSel ? 12 : 10}px Inter, sans-serif`;
            cxP.fillStyle = l.color; cxP.textAlign = 'center';
            cxP.fillText(l.sym, px, py - 12);
            cxP.font = '9px JetBrains Mono, monospace'; cxP.fillStyle = l.color + 'aa';
            cxP.fillText(E1.toFixed(3) + ' MeV', px, py - 24); cxP.textAlign = 'left';
          }
        }
      }
    });

    // Marcadores E₀ en eje (para mostrar dónde estaría E0 si K=1)
    const xE0 = eToX(E0_D);
    if (xE0 >= PAD.L && xE0 <= PAD.L + PW) {
      cxP.setLineDash([4,5]);
      cxP.strokeStyle = 'rgba(255,255,255,0.12)'; cxP.lineWidth = 1;
      cxP.beginPath(); cxP.moveTo(xE0, PAD.T); cxP.lineTo(xE0, PAD.T + PH); cxP.stroke();
      cxP.setLineDash([]);
      cxP.font = '9px Inter, sans-serif'; cxP.fillStyle = 'rgba(255,255,255,0.3)';
      cxP.textAlign = 'center'; cxP.fillText('E₀', xE0, PAD.T + 10); cxP.textAlign = 'left';
    }

    // Ejes
    cxP.strokeStyle = 'rgba(255,255,255,0.20)'; cxP.lineWidth = 1;
    cxP.beginPath(); cxP.moveTo(PAD.L, PAD.T+PH); cxP.lineTo(PAD.L+PW, PAD.T+PH); cxP.stroke();
    cxP.font = '9.5px JetBrains Mono, monospace'; cxP.fillStyle = 'rgba(180,200,220,0.65)';
    for (let e = 0; e <= E_MAX_SP - 0.1; e += 0.5) {
      const xp = eToX(e);
      if (xp < PAD.L || xp > PAD.L + PW) continue;
      cxP.beginPath(); cxP.moveTo(xp, PAD.T+PH); cxP.lineTo(xp, PAD.T+PH+5); cxP.stroke();
      cxP.textAlign = 'center'; cxP.fillText(e.toFixed(1), xp, PAD.T+PH+18);
    }
    cxP.textAlign = 'center'; cxP.font = '10px Inter, sans-serif'; cxP.fillStyle = 'rgba(200,220,240,0.65)';
    cxP.fillText('Energía retrodispersada  E₁  (MeV)', PAD.L + PW / 2, HP - 6);
    cxP.save(); cxP.translate(13, PAD.T+PH/2); cxP.rotate(-Math.PI/2);
    cxP.textAlign = 'center'; cxP.font = '10px Inter, sans-serif'; cxP.fillStyle = 'rgba(200,220,240,0.65)';
    cxP.fillText('Cuentas acumuladas (u.a.)', 0, 0); cxP.restore();

    // Contador
    const nTot = Math.round(totalBins.reduce((s,v)=>s+v,0) / 12);
    cxP.font = '9px JetBrains Mono, monospace'; cxP.fillStyle = 'rgba(160,180,200,0.5)';
    cxP.textAlign = 'right'; cxP.fillText('N≈'+nTot+' eventos', PAD.L+PW, PAD.T+14); cxP.textAlign = 'left';

    // Mensaje inicial
    if (nTot === 0) {
      cxP.font = '12px Inter, sans-serif'; cxP.fillStyle = 'rgba(200,220,240,0.3)';
      cxP.textAlign = 'center'; cxP.fillText('Esperando detecciones...', PAD.L+PW/2, PAD.T+PH/2); cxP.textAlign = 'left';
    }

    // Tooltip de hover
    if (hoveredSpec) {
      const pp = peakAreas.find(p => p.sym === hoveredSpec);
      if (pp) drawSpecTooltip(pp);
    }
  }

  function drawSpecTooltip(pp) {
    const l  = pp.layer;
    const E1 = getE1(l);
    const lines = [
      l.sym + '  (Z₂=' + l.Z2 + ',  M₂=' + l.M2 + ' u)',
      'K  =  ' + l.K.toFixed(4),
      'E₁ =  ' + (E1 !== null ? E1.toFixed(4) : '—') + ' MeV  (= K × E₀)',
      'Z₂² =  ' + (l.Z2 * l.Z2) + '  (sección eficaz rel.)',
      'Cuentas en pico:  ' + Math.round(pp.counts) + ' u.a.',
    ];
    const pad = 10, lh = 16, tw = 228, th = lines.length * lh + pad * 2;
    let tx = pp.x + 16, ty = PAD.T + PH - pp.h - th - 10;
    if (tx + tw > WP - 6) tx = pp.x - tw - 16;
    if (ty < PAD.T) ty = PAD.T;

    cxP.fillStyle = 'rgba(7,14,26,0.97)'; cxP.strokeStyle = l.color + 'cc'; cxP.lineWidth = 1.2;
    cxP.beginPath(); cxP.roundRect(tx, ty, tw, th, 6); cxP.fill(); cxP.stroke();
    cxP.textAlign = 'left';
    cxP.font = 'bold 11px Inter, sans-serif'; cxP.fillStyle = l.color;
    cxP.fillText(lines[0], tx+pad, ty+pad+11);
    cxP.font = '10px JetBrains Mono, monospace'; cxP.fillStyle = 'rgba(200,220,240,0.88)';
    for (let i = 1; i < lines.length; i++) cxP.fillText(lines[i], tx+pad, ty+pad+11+i*lh);
  }

  // ─── Eventos de interacción ───
  cvS.style.cursor = 'pointer';
  cvS.addEventListener('click', e => {
    const rect = cvS.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (WS / rect.width);
    const my = (e.clientY - rect.top)  * (HS / rect.height);
    let found = null;
    for (const l of LAYERS) {
      if (mx >= SURF_X && mx <= SURF_X + SAMP_W && my >= l.y && my <= l.y + l.h) { found = l.sym; break; }
    }
    selectedLyr = (found === selectedLyr) ? null : found;
    hoveredSpec = selectedLyr;
  });

  cvP.addEventListener('mousemove', e => {
    const rect = cvP.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (WP / rect.width);
    const my = (e.clientY - rect.top)  * (HP / rect.height);
    let found = null;
    for (const pp of peakAreas) {
      if (Math.abs(mx - pp.x) < 26 && my > PAD.T && my < PAD.T + PH) { found = pp.sym; break; }
    }
    if (found !== hoveredSpec) { hoveredSpec = found; cvP.style.cursor = found ? 'pointer' : 'default'; }
  });
  cvP.addEventListener('mouseleave', () => { if (!selectedLyr) hoveredSpec = null; });

  // ─── Controles dinámicos ───
  function buildControls() {
    const container = document.getElementById('panelD-sliders');
    if (!container) return;
    container.innerHTML = '';
    LAYERS.forEach(l => {
      const row   = document.createElement('div');
      row.className = 'slider-row'; row.style.marginBottom = '4px';
      const lbl   = document.createElement('span');
      lbl.className = 'slider-label';
      lbl.style.cssText = 'display:flex;align-items:center;gap:6px;width:130px;flex-shrink:0';
      lbl.innerHTML =
        '<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:'+l.color+';flex-shrink:0"></span>' +
        '<b style="color:'+l.color+'">'+l.sym+'</b>' +
        '<span style="color:var(--muted);font-size:0.71rem">(Z₂='+l.Z2+')</span>';
      const sld = document.createElement('input');
      sld.type = 'range'; sld.min = '0'; sld.max = '100'; sld.step = '1';
      sld.value = Math.round(conc[l.sym] * 100);
      sld.style.accentColor = l.color;
      const val = document.createElement('span');
      val.className = 'slider-val'; val.style.color = l.color;
      val.textContent = sld.value + '%';
      sld.addEventListener('input', function() { conc[l.sym] = parseInt(this.value)/100; val.textContent = this.value+'%'; });
      row.appendChild(lbl); row.appendChild(sld); row.appendChild(val);
      container.appendChild(row);
    });
  }

  // ─── Loop de animación ───
  function tick(ts) {
    if (lastTs === null) lastTs = ts;
    const dt = Math.min(ts - lastTs, 50);
    lastTs = ts;

    if (!isPaused) {
      spawnTimer += dt;
      const active = particles.filter(p => p.phase !== 'done').length;
      if (spawnTimer >= spawnMs && active < 5) { spawnParticle(); spawnTimer = 0; }
      for (const p of particles) { if (p.phase !== 'done') updateParticle(p, dt); }
      while (particles.length > 16) particles.shift();
    }

    drawSample();
    drawSpectrum();
  }

  // ─── API pública ───
  function setE0(val) {
    E0_D = parseFloat(val);
    // K no cambia; E1 = K × E0 cambia → el espectro anterior ya no es válido
    LAYERS.forEach(l => { perEl[l.sym].fill(0); }); totalBins.fill(0);
    const lbl = document.getElementById('valE0D');
    if (lbl) lbl.textContent = E0_D.toFixed(1) + ' MeV';
  }

  function togglePause() {
    isPaused = !isPaused;
    const btn = document.getElementById('btnDPause');
    if (btn) btn.textContent = isPaused ? '▶ Continuar' : '⏸ Pausar';
  }

  function reset() {
    LAYERS.forEach(l => { perEl[l.sym].fill(0); }); totalBins.fill(0);
    particles.length = 0; spawnTimer = 0; lastTs = null;
    if (isPaused) togglePause();
  }

  function init() { buildControls(); }

  function setCurrent(nA) {
    I_nA    = parseFloat(nA);
    spawnMs = 9200 / I_nA;
    const lbl = document.getElementById('valI_nA');
    if (lbl) lbl.textContent = I_nA.toFixed(0) + ' nA';
  }

  return { init, tick, reset, setE0, setCurrent, togglePause };

})();
