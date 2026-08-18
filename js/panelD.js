/**
 * panelD.js — Panel D: RBS en acción (síntesis)
 *
 * Dos canvas lado a lado:
 *   canvasDsamp — animación de partículas alfa vs muestra estratificada
 *   canvasDspec — espectro acumulado en vivo (histograma que crece)
 *
 * Muestra fija (ejemplo clásico de RBS):
 *   C   capa superficial fina (contaminación)   Z₂=6,  M₂=12
 *   Au  película fina                           Z₂=79, M₂=197
 *   Si  substrato grueso                        Z₂=14, M₂=28
 *
 * Física real implementada:
 *   - K(M₂, θ=170°) calculado con Physics.calcK()
 *   - Peso de disparo ∝ Z₂² (sección eficaz de Rutherford)
 *   - Resolución del detector: σ = 0.030 MeV (gaussiana)
 *   - Velocidad de rebote visual ∝ √K
 *
 * Depende de: constants.js, physics.js
 */
'use strict';

const panelD = (() => {

  // ── Canvas: muestra ──
  const cvS = document.getElementById('canvasDsamp');
  const cxS = cvS.getContext('2d');
  const WS = cvS.width;   // 520
  const HS = cvS.height;  // 300

  // ── Canvas: espectro ──
  const cvP = document.getElementById('canvasDspec');
  const cxP = cvP.getContext('2d');
  const WP = cvP.width;   // 520
  const HP = cvP.height;  // 300

  // ── Capas fijas de la muestra ──
  // Orden de arriba hacia abajo en la sección transversal
  const LAYERS = [
    { sym:'C',  Z2:6,  M2:12,  color:'#94a3b8', label:'C — contaminación superficial',  yFrac:0.08, hFrac:0.16 },
    { sym:'Au', Z2:79, M2:197, color:'#f59e0b', label:'Au — película fina (20 nm equiv)', yFrac:0.24, hFrac:0.26 },
    { sym:'Si', Z2:14, M2:28,  color:'#60a5fa', label:'Si — substrato',                  yFrac:0.50, hFrac:0.43 },
  ];

  // Posición absoluta + K calculado
  LAYERS.forEach(l => {
    l.y  = l.yFrac * HS;
    l.h  = l.hFrac * HS;
    l.cy = l.y + l.h / 2;
    l.K  = Physics.calcK(l.M2, PHYS.THETA_DET);
    l.E1 = l.K !== null ? l.K * PHYS.E0_RBS : null;
  });

  // ── Layout de la muestra ──
  const SURF_X = 198;  // x de la superficie de la muestra
  const SAMP_W = 120;  // ancho visible de la muestra
  const DET_X  = 28;   // detector (triángulo)
  const DET_Y  = 15;

  // ── Espectro acumulado ──
  const NUM_BINS  = 120;
  const E_MAX_SP  = 2.20;
  const SIGMA_DET = 0.030;  // resolución del detector en MeV

  const perEl = {};
  LAYERS.forEach(l => { perEl[l.sym] = new Float32Array(NUM_BINS); });
  const totalBins = new Float32Array(NUM_BINS);

  function addCount(layer) {
    if (layer.E1 === null) return;
    for (let i = 0; i < NUM_BINS; i++) {
      const e = (i + 0.5) * E_MAX_SP / NUM_BINS;
      const v = Math.exp(-0.5 * ((e - layer.E1) / SIGMA_DET) ** 2);
      perEl[layer.sym][i] += v;
      totalBins[i]         += v;
    }
  }

  // ── Partículas ──
  const particles = [];
  let lastTs     = null;
  let spawnTimer = 0;
  const SPAWN_MS  = 460;
  const DUR_APP   = 820;
  const DUR_FLASH = 180;

  function pickLayer() {
    // Probabilidad ∝ Z₂² (sección eficaz de Rutherford, θ y E fijos)
    const total = LAYERS.reduce((s, l) => s + l.Z2 * l.Z2, 0);
    let r = Math.random() * total;
    for (const l of LAYERS) {
      r -= l.Z2 * l.Z2;
      if (r <= 0) return l;
    }
    return LAYERS[LAYERS.length - 1];
  }

  function spawnParticle() {
    const layer = pickLayer();
    if (!layer.E1) return;
    particles.push({
      layer,
      phase: 'approach',
      t: 0,
      x: 82,
      y: layer.cy,
      hitX: SURF_X,
      hitY: layer.cy,
    });
  }

  function updateParticle(p, dt) {
    p.t += dt;
    const DUR_REB = DUR_APP * 0.65 / Math.sqrt(p.layer.K);

    if (p.phase === 'approach') {
      p.x = 82 + Math.min(p.t / DUR_APP, 1) * (p.hitX - 82);
      if (p.t >= DUR_APP) { p.phase = 'flash'; p.t = 0; }

    } else if (p.phase === 'flash') {
      if (p.t >= DUR_FLASH) { p.phase = 'rebound'; p.t = 0; }

    } else if (p.phase === 'rebound') {
      const f = Math.min(p.t / DUR_REB, 1);
      p.x = p.hitX + f * (DET_X - p.hitX);
      p.y = p.hitY  + f * (DET_Y - p.hitY);
      if (p.t >= DUR_REB) { p.phase = 'done'; addCount(p.layer); }
    }
  }

  // ── Dibujo: canvas de muestra ──
  function drawSample() {
    cxS.clearRect(0, 0, WS, HS);

    // Guías de haz (líneas punteadas por capa)
    LAYERS.forEach(l => {
      cxS.setLineDash([4, 8]);
      cxS.strokeStyle = 'rgba(100,160,255,0.06)';
      cxS.lineWidth = 1;
      cxS.beginPath(); cxS.moveTo(82, l.cy); cxS.lineTo(SURF_X - 2, l.cy); cxS.stroke();
      cxS.setLineDash([]);
    });

    // Fuente del haz
    cxS.textAlign = 'center';
    cxS.font = 'bold 10px Inter, sans-serif';
    cxS.fillStyle = 'rgba(100,160,255,0.75)';
    cxS.fillText('α  He²⁺', 40, HS / 2 - 8);
    cxS.font = '9px JetBrains Mono, monospace';
    cxS.fillStyle = 'rgba(100,160,255,0.6)';
    cxS.fillText(PHYS.E0_RBS + ' MeV', 40, HS / 2 + 5);
    cxS.fillText('→', 68, HS / 2 - 1);
    cxS.textAlign = 'left';

    // Detector
    cxS.beginPath();
    cxS.moveTo(DET_X-11, DET_Y+5); cxS.lineTo(DET_X+11, DET_Y+5); cxS.lineTo(DET_X, DET_Y+18);
    cxS.closePath();
    cxS.fillStyle   = 'rgba(100,200,255,0.25)'; cxS.fill();
    cxS.strokeStyle = 'rgba(100,200,255,0.65)'; cxS.lineWidth = 1.2; cxS.stroke();
    cxS.font = '9px Inter, sans-serif'; cxS.fillStyle = 'rgba(100,200,255,0.7)';
    cxS.textAlign = 'center'; cxS.fillText('Detector  170°', DET_X, DET_Y - 5); cxS.textAlign = 'left';

    // Línea de superficie
    const yTop = LAYERS[0].y - 4;
    const yBot = LAYERS[LAYERS.length - 1].y + LAYERS[LAYERS.length - 1].h + 4;
    cxS.strokeStyle = 'rgba(255,255,255,0.28)'; cxS.lineWidth = 1.8;
    cxS.beginPath(); cxS.moveTo(SURF_X, yTop); cxS.lineTo(SURF_X, yBot); cxS.stroke();
    cxS.fillStyle = 'rgba(200,220,240,0.5)'; cxS.font = '10px Inter, sans-serif';
    cxS.textAlign = 'center';
    cxS.fillText('Muestra', SURF_X + SAMP_W / 2, LAYERS[0].y - 10);
    cxS.textAlign = 'left';

    // Capas
    LAYERS.forEach(l => {
      // Relleno de capa
      cxS.fillStyle = l.color + '25';
      cxS.fillRect(SURF_X, l.y, SAMP_W, l.h);
      cxS.strokeStyle = l.color + '50'; cxS.lineWidth = 1;
      cxS.strokeRect(SURF_X, l.y, SAMP_W, l.h);

      // Átomos (radio ∝ M₂^(1/3))
      const atomR = Math.cbrt(l.M2 / 12) * 4.0;
      const cols = 4;
      const rows = Math.max(2, Math.round(l.h / (atomR * 3.2)));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ax = SURF_X + 14 + c * (SAMP_W - 22) / (cols - 1);
          const ay = l.y + atomR + (r + 0.5) * (l.h - 2 * atomR) / rows;
          cxS.beginPath(); cxS.arc(ax, ay, atomR, 0, Math.PI * 2);
          cxS.fillStyle = l.color + 'aa'; cxS.fill();
        }
      }

      // Etiquetas (derecha)
      const lx = SURF_X + SAMP_W + 10;
      cxS.font = 'bold 10px Inter, sans-serif'; cxS.fillStyle = l.color;
      cxS.fillText(l.label, lx, l.cy - 6);
      if (l.E1 !== null) {
        cxS.font = '9px JetBrains Mono, monospace'; cxS.fillStyle = l.color + 'aa';
        cxS.fillText('K=' + l.K.toFixed(4) + '   E₁=' + l.E1.toFixed(3) + ' MeV', lx, l.cy + 8);
      }
    });

    // Partículas
    for (const p of particles) {
      if (p.phase !== 'done') drawParticle(p);
    }
  }

  function drawParticle(p) {
    const col = p.layer.color;

    if (p.phase === 'approach') {
      // Trail azul
      cxS.beginPath(); cxS.moveTo(82, p.y); cxS.lineTo(p.x - 4, p.y);
      cxS.strokeStyle = 'rgba(100,160,255,0.35)'; cxS.lineWidth = 1.5; cxS.stroke();
      // Halo
      const ga = cxS.createRadialGradient(p.x, p.y, 0, p.x, p.y, 9);
      ga.addColorStop(0, 'rgba(100,160,255,0.9)'); ga.addColorStop(1, 'transparent');
      cxS.beginPath(); cxS.arc(p.x, p.y, 9, 0, Math.PI * 2); cxS.fillStyle = ga; cxS.fill();
      cxS.beginPath(); cxS.arc(p.x, p.y, 3.5, 0, Math.PI * 2); cxS.fillStyle = '#60a5fa'; cxS.fill();

    } else if (p.phase === 'flash') {
      const prog = Math.min(p.t / DUR_FLASH, 1);
      const r = 10 + prog * 26, a = Math.max(0, 0.9 - prog);
      const gf = cxS.createRadialGradient(p.hitX, p.hitY, 0, p.hitX, p.hitY, r);
      gf.addColorStop(0, `rgba(255,255,255,${a})`);
      gf.addColorStop(0.3, col + Math.round(a * 200).toString(16).padStart(2,'0'));
      gf.addColorStop(1, 'transparent');
      cxS.beginPath(); cxS.arc(p.hitX, p.hitY, r, 0, Math.PI * 2); cxS.fillStyle = gf; cxS.fill();

    } else if (p.phase === 'rebound') {
      // Trail de color del elemento
      cxS.beginPath(); cxS.moveTo(p.hitX, p.hitY); cxS.lineTo(p.x, p.y);
      cxS.strokeStyle = col + '55'; cxS.lineWidth = 1.5; cxS.stroke();
      // Halo
      const gr = cxS.createRadialGradient(p.x, p.y, 0, p.x, p.y, 9);
      gr.addColorStop(0, col + 'cc'); gr.addColorStop(1, 'transparent');
      cxS.beginPath(); cxS.arc(p.x, p.y, 9, 0, Math.PI * 2); cxS.fillStyle = gr; cxS.fill();
      cxS.beginPath(); cxS.arc(p.x, p.y, 4, 0, Math.PI * 2); cxS.fillStyle = col; cxS.fill();
      // Etiqueta E₁
      const DUR_REB = DUR_APP * 0.65 / Math.sqrt(p.layer.K);
      const frac = p.t / DUR_REB;
      if (frac > 0.12 && frac < 0.82) {
        cxS.font = '9px JetBrains Mono, monospace'; cxS.fillStyle = col;
        cxS.textAlign = 'center';
        cxS.fillText('E₁=' + p.layer.E1.toFixed(3) + ' MeV', p.x + 2, p.y - 11);
        cxS.textAlign = 'left';
      }
    }
  }

  // ── Dibujo: espectro acumulado ──
  const PAD = { L:52, R:14, T:28, B:46 };
  const PW  = WP - PAD.L - PAD.R;
  const PH  = HP - PAD.T - PAD.B;

  function eToX(e) { return PAD.L + (e / E_MAX_SP) * PW; }

  function drawSpectrum() {
    cxP.clearRect(0, 0, WP, HP);

    // Fondo del área de gráfico
    cxP.fillStyle = 'rgba(255,255,255,0.015)';
    cxP.fillRect(PAD.L, PAD.T, PW, PH);

    // Grilla
    cxP.strokeStyle = 'rgba(255,255,255,0.05)'; cxP.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const yg = PAD.T + PH * i / 4;
      cxP.beginPath(); cxP.moveTo(PAD.L, yg); cxP.lineTo(PAD.L + PW, yg); cxP.stroke();
    }

    const maxT = Math.max(...totalBins, 1);

    // Cada elemento: área coloreada + línea
    LAYERS.forEach(l => {
      const eb = perEl[l.sym];
      const y0 = PAD.T + PH;

      // Área rellena
      cxP.beginPath();
      cxP.moveTo(PAD.L, y0);
      for (let i = 0; i < NUM_BINS; i++) {
        const x = PAD.L + (i + 0.5) * PW / NUM_BINS;
        const h = (eb[i] / maxT) * PH * 0.88;
        cxP.lineTo(x, y0 - h);
      }
      cxP.lineTo(PAD.L + PW, y0); cxP.closePath();
      cxP.fillStyle = l.color + '38'; cxP.fill();

      // Línea del espectro
      cxP.beginPath();
      for (let i = 0; i < NUM_BINS; i++) {
        const x = PAD.L + (i + 0.5) * PW / NUM_BINS;
        const h = (eb[i] / maxT) * PH * 0.88;
        i === 0 ? cxP.moveTo(x, y0 - h) : cxP.lineTo(x, y0 - h);
      }
      cxP.strokeStyle = l.color + 'cc'; cxP.lineWidth = 1.5; cxP.stroke();

      // Etiqueta del pico
      if (l.E1 !== null && maxT > 0.5) {
        const idx = Math.round(l.E1 / E_MAX_SP * NUM_BINS);
        if (idx >= 0 && idx < NUM_BINS) {
          const h = (eb[idx] / maxT) * PH * 0.88;
          const px = eToX(l.E1);
          const py = PAD.T + PH - h;
          if (h > 4) {
            cxP.font = 'bold 11px Inter, sans-serif'; cxP.fillStyle = l.color;
            cxP.textAlign = 'center'; cxP.fillText(l.sym, px, py - 12);
            cxP.font = '9px JetBrains Mono, monospace'; cxP.fillStyle = l.color + 'aa';
            cxP.fillText(l.E1.toFixed(3) + ' MeV', px, py - 24);
            cxP.textAlign = 'left';
          }
        }
      }
    });

    // Eje X
    cxP.strokeStyle = 'rgba(255,255,255,0.20)'; cxP.lineWidth = 1;
    cxP.beginPath(); cxP.moveTo(PAD.L, PAD.T + PH); cxP.lineTo(PAD.L + PW, PAD.T + PH); cxP.stroke();
    cxP.font = '9.5px JetBrains Mono, monospace'; cxP.fillStyle = 'rgba(180,200,220,0.65)';
    for (let e = 0; e <= 2.05; e += 0.25) {
      const xp = eToX(e);
      cxP.beginPath(); cxP.moveTo(xp, PAD.T + PH); cxP.lineTo(xp, PAD.T + PH + 5); cxP.stroke();
      cxP.textAlign = 'center'; cxP.fillText(e.toFixed(2), xp, PAD.T + PH + 18);
    }
    cxP.textAlign = 'center'; cxP.font = '10px Inter, sans-serif'; cxP.fillStyle = 'rgba(200,220,240,0.65)';
    cxP.fillText('Energía retrodispersada  E₁  (MeV)', PAD.L + PW / 2, HP - 6);

    // Eje Y
    cxP.save(); cxP.translate(13, PAD.T + PH / 2); cxP.rotate(-Math.PI / 2);
    cxP.textAlign = 'center'; cxP.font = '10px Inter, sans-serif'; cxP.fillStyle = 'rgba(200,220,240,0.65)';
    cxP.fillText('Cuentas acumuladas (u.a.)', 0, 0); cxP.restore();

    // Número de cuentas totales aproximado
    const nTot = Math.round(totalBins.reduce((s, v) => s + v, 0) / 12);
    cxP.font = '9px JetBrains Mono, monospace'; cxP.fillStyle = 'rgba(160,180,200,0.5)';
    cxP.textAlign = 'right';
    cxP.fillText('N≈' + nTot + ' eventos', PAD.L + PW, PAD.T + 14);
    cxP.textAlign = 'left';

    // Mensaje inicial si no hay cuentas
    if (nTot === 0) {
      cxP.font = '12px Inter, sans-serif'; cxP.fillStyle = 'rgba(200,220,240,0.3)';
      cxP.textAlign = 'center';
      cxP.fillText('El espectro se construye con cada detección...', PAD.L + PW / 2, PAD.T + PH / 2);
      cxP.textAlign = 'left';
    }
  }

  // ── Loop de animación ──
  function tick(ts) {
    if (lastTs === null) lastTs = ts;
    const dt = Math.min(ts - lastTs, 50); // cap at 50ms para evitar saltos
    lastTs = ts;

    spawnTimer += dt;
    const active = particles.filter(p => p.phase !== 'done').length;
    if (spawnTimer >= SPAWN_MS && active < 5) { spawnParticle(); spawnTimer = 0; }
    for (const p of particles) { if (p.phase !== 'done') updateParticle(p, dt); }
    while (particles.length > 16) particles.shift();

    drawSample();
    drawSpectrum();
  }

  function reset() {
    LAYERS.forEach(l => { perEl[l.sym].fill(0); });
    totalBins.fill(0);
    particles.length = 0;
    spawnTimer = 0;
    lastTs = null;
  }

  function init() {}

  return { init, tick, reset };

})();
