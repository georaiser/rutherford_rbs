/**
 * panel-d.js — Panel D: RBS en accion (Adquisicion estocastica y multicapas)
 *
 * Visualizacion de la dinamica estocastica y metrologia nanometrica:
 *   1. Interaccion fisica del haz alpha con la muestra multicapa (izq).
 *   2. Registro estocastico evento por evento (Poisson, N +- sqrt(N)).
 *   3. Espectro acumulado en tiempo real con deconvolucion por estrato (der).
 *   4. Controles de energia del haz E0, corriente I (nA) y abundancia de cada estrato.
 *   5. Tooltip interactivo Dark Glass con datos fisicos y estadistica de conteo.
 *
 * Modelo fisico:
 *   - Tasa de conteo: dot(N) = (I / Z1*e) * Omega * N_i * (dsigma/dOmega)_Ruth
 *   - Probabilidad estocastica por capa prop N_i * Z2^2
 *   - Factor cinematico: E1 = K(M2, theta) * E0
 *   - Resolucion del detector: sigma = 30 keV (FWHM aprox 70 keV)
 *
 * Depende de: constants.js (PHYS, ELEMENTS), physics.js (Physics)
 */
'use strict';

const panelD = (() => {

  const cvS = document.getElementById('canvasDsamp');
  const cxS = cvS.getContext('2d');
  const WS  = cvS.width;   // 520 px
  const HS  = cvS.height;  // 300 px

  const cvP = document.getElementById('canvasDspec');
  const cxP = cvP.getContext('2d');
  const WP  = cvP.width;   // 520 px
  const HP  = cvP.height;  // 300 px

  // Layout fisico de la muestra: 5 capas de igual espesor y mas compactas
  const SAMP_X1 = 142;   // borde izquierdo de la muestra
  const SAMP_X2 = 346;   // borde derecho de la muestra
  const SAMP_W  = SAMP_X2 - SAMP_X1;  // 204 px
  const LBL_X   = SAMP_X1 - 8;        // x texto izquierdo (sym / Z2)
  const INFO_X  = SAMP_X2 + 8;        // x texto derecho (K / E1)
  const SURF_Y  = 52;                 // linea de superficie
  const LAYER_H = 42;                 // espesor uniforme par a todas las capas (42 px = 50 nm cada una)
  const DET_X   = 16;
  const DET_Y   = 22;
  const SAMP_H  = LAYER_H * 5;        // 210 px en total (0 a 250 nm)

  const LAYERS = [
    { sym:'C',  name:'Carbono', Z2:6,  M2:12,  color:'#94a3b8' },
    { sym:'Ag', name:'Plata',   Z2:47, M2:108, color:'#c084fc' },
    { sym:'Au', name:'Oro',     Z2:79, M2:197, color:'#f59e0b' },
    { sym:'Fe', name:'Hierro',  Z2:26, M2:56,  color:'#fb923c' },
    { sym:'Si', name:'Silicio', Z2:14, M2:28,  color:'#60a5fa' },
  ];

  LAYERS.forEach((l, idx) => {
    l.y  = SURF_Y + idx * LAYER_H;
    l.h  = LAYER_H;
    l.cy = l.y + l.h / 2;
    l.K  = Physics.calcK(l.M2, PHYS.THETA_DET);
  });

  let E0_D = 2.0;
  let isPaused = false;
  let selectedLyr = null;
  let hoveredSpec = null;
  const conc = { C:0.30, Ag:0.20, Au:0.80, Fe:0.20, Si:0.70 };

  function getE1(l) {
    return l.K !== null ? l.K * E0_D : null;
  }

  const NUM_BINS = 130, E_MAX_SP = 3.20, SIGMA_DET = 0.030;
  const perEl = {};
  LAYERS.forEach(l => { perEl[l.sym] = new Float32Array(NUM_BINS); });
  const totalBins = new Float32Array(NUM_BINS);
  let peakAreas = [];

  function eToBin(e) { return Math.round(e / E_MAX_SP * NUM_BINS); }
  function binToE(i) { return (i + 0.5) * E_MAX_SP / NUM_BINS; }

  function addCount(layer) {
    const E1 = getE1(layer);
    if (E1 === null) return;
    for (let i = 0; i < NUM_BINS; i++) {
      const v = Math.exp(-0.5 * ((binToE(i) - E1) / SIGMA_DET) ** 2);
      perEl[layer.sym][i] += v;
      totalBins[i]        += v;
    }
  }

  const particles = [];
  let lastTs = null, spawnTimer = 0, I_nA = 20, spawnMs = 9200 / I_nA;
  const DUR_APP = 800, DUR_FLASH = 160;

  function pickLayer() {
    const w = LAYERS.map(l => ({ l, w: (conc[l.sym] || 0) * l.Z2 * l.Z2 })).filter(x => x.w > 0);
    if (!w.length) return null;
    const tot = w.reduce((s, x) => s + x.w, 0);
    let r = Math.random() * tot;
    for (const x of w) {
      r -= x.w;
      if (r <= 0) return x.l;
    }
    return w[w.length - 1].l;
  }

  function spawnParticle() {
    const layer = pickLayer();
    if (!layer || getE1(layer) === null) return;
    const hitX = SAMP_X1 + Math.random() * SAMP_W;
    particles.push({ layer, phase:'approach', t:0, x:hitX, y:0, hitX, hitY:layer.cy });
  }

  function updateParticle(p, dt) {
    p.t += dt;
    const DUR_RB = DUR_APP * 0.68 / Math.sqrt(p.layer.K);
    if (p.phase === 'approach') {
      p.y = Math.min(p.t / DUR_APP, 1) * p.hitY;
      if (p.t >= DUR_APP) { p.phase = 'flash'; p.t = 0; }
    } else if (p.phase === 'flash') {
      if (p.t >= DUR_FLASH) { p.phase = 'rebound'; p.t = 0; }
    } else if (p.phase === 'rebound') {
      const f = Math.min(p.t / DUR_RB, 1);
      p.x = p.hitX + f * (DET_X - p.hitX);
      p.y = p.hitY + f * (DET_Y - p.hitY);
      if (p.t >= DUR_RB) {
        p.phase = 'done';
        addCount(p.layer);
      }
    }
  }

  // ── Renderizado del corte transversal de la muestra (izq) ───────────────────

  function drawSample() {
    cxS.clearRect(0, 0, WS, HS);

    // Fondo del area estratificada
    cxS.fillStyle = 'rgba(6, 12, 26, 0.75)';
    cxS.fillRect(SAMP_X1, SURF_Y, SAMP_W, SAMP_H);

    // ── Capas de igual espesor (36px = 40nm cada una) ──
    LAYERS.forEach(l => {
      const isSel = (selectedLyr === l.sym) || (hoveredSpec === l.sym);
      const Ni    = conc[l.sym] || 0;
      const alpha = Ni * 0.52 + (Ni > 0.01 ? 0.08 : 0);
      const vis   = Ni > 0.02;

      // Halo de seleccion
      if (isSel) {
        cxS.shadowColor = l.color;
        cxS.shadowBlur  = 12;
        cxS.fillStyle   = l.color + '22';
        cxS.fillRect(SAMP_X1 - 3, l.y - 1, SAMP_W + 6, l.h + 2);
        cxS.shadowBlur  = 0;
      }

      // Relleno y contorno del estrato
      const hexA = Math.round(alpha * 255).toString(16).padStart(2, '0').slice(0, 2);
      cxS.fillStyle   = l.color + hexA;
      cxS.fillRect(SAMP_X1, l.y, SAMP_W, l.h);
      cxS.strokeStyle = isSel ? l.color : l.color + '44';
      cxS.lineWidth   = isSel ? 1.8 : 1.0;
      cxS.strokeRect(SAMP_X1, l.y, SAMP_W, l.h);

      // Celosía de átomos interior (sin texto dentro)
      if (vis) {
        const atomR = Math.min(Math.cbrt(l.M2 / 12) * 2.7, 6.2);
        const cols  = Math.max(3, Math.floor(SAMP_W / (atomR * 4.2)));
        const rows  = 2;
        const aA    = Math.round(Ni * 150 + 50).toString(16).padStart(2, '0');
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const ax = SAMP_X1 + atomR + 6 + c * (SAMP_W - 2 * atomR - 12) / Math.max(cols - 1, 1);
            const ay = l.y + atomR + 2 + r * (l.h - 2 * atomR - 4) / Math.max(rows - 1, 1);
            cxS.beginPath(); cxS.arc(ax, ay, atomR, 0, Math.PI * 2);
            cxS.fillStyle = l.color + aA; cxS.fill();
          }
        }
      }

      // ── Etiqueta IZQUIERDA (fuera de la capa) ──
      cxS.textAlign = 'right';
      cxS.font      = 'bold 11px Inter, sans-serif';
      cxS.fillStyle = vis ? (isSel ? '#ffffff' : l.color) : l.color + '44';
      cxS.fillText(l.sym, LBL_X, l.cy - 1);

      cxS.font      = '8px JetBrains Mono, monospace';
      cxS.fillStyle = vis ? (isSel ? '#ffffff' : l.color + 'bb') : l.color + '33';
      cxS.fillText('Z\u2082=' + l.Z2, LBL_X, l.cy + 10);
      cxS.textAlign = 'left';

      // ── Info DERECHA (fuera de la capa) ──
      const E1 = getE1(l);
      if (vis && E1 !== null) {
        cxS.font      = '8px JetBrains Mono, monospace';
        cxS.fillStyle = isSel ? '#ffffff' : l.color + 'dd';
        cxS.fillText('K=' + l.K.toFixed(3), INFO_X, l.cy - 1);
        cxS.fillText(E1.toFixed(3) + ' MeV', INFO_X, l.cy + 10);
      } else {
        cxS.font      = '7.5px JetBrains Mono, monospace';
        cxS.fillStyle = 'rgba(140, 160, 180, 0.30)';
        cxS.fillText('(0%)', INFO_X, l.cy + 4);
      }
    });

    // ── Línea de superficie ──
    cxS.strokeStyle = 'rgba(255, 255, 255, 0.45)'; cxS.lineWidth = 1.8;
    cxS.beginPath(); cxS.moveTo(SAMP_X1, SURF_Y); cxS.lineTo(SAMP_X2, SURF_Y); cxS.stroke();
    cxS.font      = '8.5px Inter, sans-serif';
    cxS.fillStyle = 'rgba(200, 220, 240, 0.70)';
    cxS.textAlign = 'center';
    cxS.fillText('Superficie (x = 0)', SAMP_X1 + SAMP_W / 2, SURF_Y - 7);
    cxS.textAlign = 'left';

    // ── Escala de profundidad lineal (0 - 200 nm, 40 nm/capa) ──
    const NM_TOTAL = 200;
    const NM_STEPS = [0, 50, 100, 150, 200];
    cxS.font      = '8px JetBrains Mono, monospace';
    cxS.fillStyle = 'rgba(160, 185, 210, 0.75)';
    cxS.textAlign = 'right';
    NM_STEPS.forEach(nm => {
      const yD = SURF_Y + (nm / NM_TOTAL) * SAMP_H;
      cxS.fillText(nm + ' nm', SAMP_X1 - 38, yD + 3);
      cxS.strokeStyle = 'rgba(160, 185, 210, 0.40)'; cxS.lineWidth = 0.8;
      cxS.beginPath(); cxS.moveTo(SAMP_X1 - 35, yD); cxS.lineTo(SAMP_X1 - 30, yD); cxS.stroke();
      cxS.setLineDash([2, 8]);
      cxS.strokeStyle = 'rgba(255, 255, 255, 0.07)'; cxS.lineWidth = 0.5;
      cxS.beginPath(); cxS.moveTo(SAMP_X1, yD); cxS.lineTo(SAMP_X2, yD); cxS.stroke();
      cxS.setLineDash([]);
    });

    cxS.save();
    cxS.translate(SAMP_X1 - 66, SURF_Y + SAMP_H / 2);
    cxS.rotate(-Math.PI / 2);
    cxS.font      = '8px Inter, sans-serif';
    cxS.fillStyle = 'rgba(150, 175, 200, 0.65)';
    cxS.textAlign = 'center';
    cxS.fillText('Profundidad x (nm)', 0, 0);
    cxS.restore();
    cxS.textAlign = 'left';

    // ── Detector ──
    cxS.beginPath(); cxS.moveTo(DET_X - 9, DET_Y); cxS.lineTo(DET_X + 9, DET_Y); cxS.lineTo(DET_X, DET_Y + 14); cxS.closePath();
    cxS.fillStyle = 'rgba(100, 200, 255, 0.25)'; cxS.fill();
    cxS.strokeStyle = 'rgba(100, 200, 255, 0.70)'; cxS.lineWidth = 1; cxS.stroke();
    cxS.font = '7px Inter, sans-serif'; cxS.fillStyle = 'rgba(100, 200, 255, 0.80)';
    cxS.textAlign = 'center'; cxS.fillText('Det.', DET_X, DET_Y - 8); cxS.fillText('170°', DET_X, DET_Y - 1); cxS.textAlign = 'left';

    // ── Haz incidente distribuido ──
    for (let b = 0; b < 5; b++) {
      const bx = SAMP_X1 + (b + 0.5) * SAMP_W / 5;
      cxS.strokeStyle = 'rgba(100, 160, 255, 0.12)'; cxS.lineWidth = 1; cxS.setLineDash([3, 6]);
      cxS.beginPath(); cxS.moveTo(bx, 0); cxS.lineTo(bx, SURF_Y - 2); cxS.stroke(); cxS.setLineDash([]);
      cxS.fillStyle = 'rgba(100, 160, 255, 0.25)';
      cxS.beginPath(); cxS.moveTo(bx, SURF_Y); cxS.lineTo(bx - 3, SURF_Y - 7); cxS.lineTo(bx + 3, SURF_Y - 7); cxS.closePath(); cxS.fill();
    }
    cxS.font = 'bold 11px Inter, sans-serif'; cxS.fillStyle = 'rgba(130, 180, 255, 0.90)';
    cxS.textAlign = 'center'; cxS.fillText('\u03b1  ' + E0_D.toFixed(1) + ' MeV  \u2193\u2193 haz', SAMP_X1 + SAMP_W / 2, 16); cxS.textAlign = 'left';

    // ── Partículas animadas ──
    for (const p of particles) {
      if (p.phase !== 'done') drawParticle(p);
    }

    if (isPaused) {
      cxS.fillStyle = 'rgba(4, 8, 20, 0.65)'; cxS.fillRect(0, 0, WS, HS);
      cxS.font = 'bold 15px Inter, sans-serif'; cxS.fillStyle = '#facc15';
      cxS.textAlign = 'center'; cxS.fillText('\u23f8 Simulación Pausada', WS / 2, HS / 2); cxS.textAlign = 'left';
    }
  }

  function drawParticle(p) {
    const col = p.layer.color;
    const E1  = getE1(p.layer);
    if (p.phase === 'approach') {
      cxS.beginPath(); cxS.moveTo(p.x, 0); cxS.lineTo(p.x, p.y - 3);
      cxS.strokeStyle = 'rgba(100, 160, 255, 0.35)'; cxS.lineWidth = 1.2; cxS.stroke();
      const g = cxS.createRadialGradient(p.x, p.y, 0, p.x, p.y, 7);
      g.addColorStop(0, 'rgba(100, 160, 255, 0.95)'); g.addColorStop(1, 'transparent');
      cxS.beginPath(); cxS.arc(p.x, p.y, 7, 0, Math.PI * 2); cxS.fillStyle = g; cxS.fill();
      cxS.beginPath(); cxS.arc(p.x, p.y, 3, 0, Math.PI * 2); cxS.fillStyle = '#60a5fa'; cxS.fill();
      const frac = p.t / DUR_APP;
      if (frac > 0.08 && frac < 0.90) {
        cxS.setLineDash([2, 4]); cxS.strokeStyle = col + '22'; cxS.lineWidth = 0.7;
        cxS.beginPath(); cxS.moveTo(p.x, p.y + 4); cxS.lineTo(p.x, p.hitY); cxS.stroke(); cxS.setLineDash([]);
      }
    } else if (p.phase === 'flash') {
      const prog = Math.min(p.t / DUR_FLASH, 1);
      const r = 8 + prog * 20, a = Math.max(0, 0.85 - prog);
      const gf = cxS.createRadialGradient(p.hitX, p.hitY, 0, p.hitX, p.hitY, r);
      gf.addColorStop(0, `rgba(255, 255, 255, ${a})`);
      gf.addColorStop(0.35, col + Math.round(a * 200).toString(16).padStart(2, '0'));
      gf.addColorStop(1, 'transparent');
      cxS.beginPath(); cxS.arc(p.hitX, p.hitY, r, 0, Math.PI * 2); cxS.fillStyle = gf; cxS.fill();
    } else if (p.phase === 'rebound') {
      cxS.beginPath(); cxS.moveTo(p.hitX, p.hitY); cxS.lineTo(p.x, p.y);
      cxS.strokeStyle = col + '50'; cxS.lineWidth = 1.3; cxS.stroke();
      const gr = cxS.createRadialGradient(p.x, p.y, 0, p.x, p.y, 7);
      gr.addColorStop(0, col + 'cc'); gr.addColorStop(1, 'transparent');
      cxS.beginPath(); cxS.arc(p.x, p.y, 7, 0, Math.PI * 2); cxS.fillStyle = gr; cxS.fill();
      cxS.beginPath(); cxS.arc(p.x, p.y, 3, 0, Math.PI * 2); cxS.fillStyle = col; cxS.fill();
      const DUR_RB = DUR_APP * 0.68 / Math.sqrt(p.layer.K);
      const frac = p.t / DUR_RB;
      if (frac > 0.15 && frac < 0.78 && E1 !== null) {
        cxS.font = '7.5px JetBrains Mono, monospace'; cxS.fillStyle = col;
        cxS.textAlign = 'center'; cxS.fillText('E\u2081=' + E1.toFixed(3), p.x, p.y - 10); cxS.textAlign = 'left';
      }
    }
  }

  // ── Renderizado del espectro acumulado en tiempo real (der) ─────────────────

  const PAD = { L: 52, R: 14, T: 28, B: 46 };
  const PW  = WP - PAD.L - PAD.R, PH = HP - PAD.T - PAD.B;
  function eToX(e) { return PAD.L + (e / E_MAX_SP) * PW; }

  function drawSpectrum() {
    cxP.clearRect(0, 0, WP, HP);
    cxP.fillStyle = 'rgba(6, 12, 26, 0.70)';
    cxP.fillRect(PAD.L, PAD.T, PW, PH);

    // Rejilla
    cxP.strokeStyle = 'rgba(255, 255, 255, 0.05)'; cxP.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const yg = PAD.T + PH * i / 4;
      cxP.beginPath(); cxP.moveTo(PAD.L, yg); cxP.lineTo(PAD.L + PW, yg); cxP.stroke();
    }

    const maxT = Math.max(...totalBins, 1);
    peakAreas = [];

    LAYERS.forEach(l => {
      const eb    = perEl[l.sym];
      const isSel = (selectedLyr === l.sym) || (hoveredSpec === l.sym);
      const y0    = PAD.T + PH;

      // Area bajo la campana del elemento
      cxP.beginPath();
      cxP.moveTo(PAD.L, y0);
      for (let i = 0; i < NUM_BINS; i++) {
        const x = PAD.L + (i + 0.5) * PW / NUM_BINS;
        cxP.lineTo(x, y0 - (eb[i] / maxT) * PH * 0.88);
      }
      cxP.lineTo(PAD.L + PW, y0);
      cxP.closePath();
      cxP.fillStyle = l.color + (isSel ? '5a' : '22');
      cxP.fill();

      // Contorno
      cxP.beginPath();
      for (let i = 0; i < NUM_BINS; i++) {
        const x = PAD.L + (i + 0.5) * PW / NUM_BINS;
        const h = (eb[i] / maxT) * PH * 0.88;
        if (i === 0) cxP.moveTo(x, y0 - h); else cxP.lineTo(x, y0 - h);
      }
      cxP.strokeStyle = l.color + (isSel ? 'ee' : '88');
      cxP.lineWidth   = isSel ? 2.0 : 1.2;
      cxP.stroke();

      const E1 = getE1(l);
      if (E1 !== null && maxT > 0.5) {
        const idx = eToBin(E1);
        if (idx >= 0 && idx < NUM_BINS) {
          const h = (eb[idx] / maxT) * PH * 0.88;
          const px = eToX(E1);
          const py = PAD.T + PH - h;
          const pySafe = Math.max(PAD.T + 22, py);

          peakAreas.push({ sym: l.sym, x: px, layer: l, counts: eb[idx], h });

          if (h > 3) {
            cxP.font      = `bold ${isSel ? 12 : 10.5}px Inter, sans-serif`;
            cxP.fillStyle = isSel ? '#ffffff' : l.color;
            cxP.textAlign = 'center';
            cxP.fillText(l.sym, px, pySafe - 10);

            cxP.font      = '8.5px JetBrains Mono, monospace';
            cxP.fillStyle = isSel ? l.color : 'rgba(215, 230, 250, 0.75)';
            cxP.fillText(E1.toFixed(3) + ' MeV', px, pySafe - 22);
            cxP.textAlign = 'left';
          }
        }
      }
    });

    // Línea de referencia E0
    const xE0 = eToX(E0_D);
    if (xE0 >= PAD.L && xE0 <= PAD.L + PW) {
      cxP.setLineDash([4, 5]); cxP.strokeStyle = 'rgba(255, 255, 255, 0.25)'; cxP.lineWidth = 1;
      cxP.beginPath(); cxP.moveTo(xE0, PAD.T); cxP.lineTo(xE0, PAD.T + PH); cxP.stroke(); cxP.setLineDash([]);
      cxP.font = '9px JetBrains Mono, monospace'; cxP.fillStyle = 'rgba(255, 255, 255, 0.45)';
      cxP.textAlign = 'center'; cxP.fillText('E\u2080=' + E0_D.toFixed(1) + ' MeV', xE0, PAD.T + 12); cxP.textAlign = 'left';
    }

    // Eje X
    cxP.strokeStyle = 'rgba(255, 255, 255, 0.20)'; cxP.lineWidth = 1;
    cxP.beginPath(); cxP.moveTo(PAD.L, PAD.T + PH); cxP.lineTo(PAD.L + PW, PAD.T + PH); cxP.stroke();
    cxP.font      = '9.5px JetBrains Mono, monospace';
    cxP.fillStyle = 'rgba(180, 200, 220, 0.70)';
    for (let e = 0; e <= E_MAX_SP - 0.1; e += 0.5) {
      const xp = eToX(e);
      if (xp < PAD.L || xp > PAD.L + PW) continue;
      cxP.beginPath(); cxP.moveTo(xp, PAD.T + PH); cxP.lineTo(xp, PAD.T + PH + 5); cxP.stroke();
      cxP.textAlign = 'center';
      cxP.fillText(e.toFixed(1), xp, PAD.T + PH + 17);
    }
    cxP.textAlign = 'center';
    cxP.font      = '10px Inter, sans-serif';
    cxP.fillStyle = 'rgba(200, 220, 240, 0.75)';
    cxP.fillText('Energ\u00eda retrodispersada  E\u2081  (MeV)', PAD.L + PW / 2, HP - 6);

    // Eje Y
    cxP.save();
    cxP.translate(13, PAD.T + PH / 2); cxP.rotate(-Math.PI / 2);
    cxP.textAlign = 'center'; cxP.font = '10px Inter, sans-serif';
    cxP.fillStyle = 'rgba(200, 220, 240, 0.75)';
    cxP.fillText('Cuentas acumuladas (u.a.)', 0, 0);
    cxP.restore();

    // Contador de eventos estocásticos
    const nTot = Math.round(totalBins.reduce((s, v) => s + v, 0) / 12);
    cxP.font      = '9px JetBrains Mono, monospace';
    cxP.fillStyle = 'rgba(160, 180, 200, 0.65)';
    cxP.textAlign = 'right';
    cxP.fillText('N \u2248 ' + nTot + ' eventos', PAD.L + PW, PAD.T + 13);
    cxP.textAlign = 'left';

    if (nTot === 0) {
      cxP.font      = '11.5px Inter, sans-serif';
      cxP.fillStyle = 'rgba(200, 220, 240, 0.35)';
      cxP.textAlign = 'center';
      cxP.fillText('Esperando eventos estoc\u00e1sticos...', PAD.L + PW / 2, PAD.T + PH / 2);
      cxP.textAlign = 'left';
    }

    // Tooltip
    if (hoveredSpec) {
      const pp = peakAreas.find(p => p.sym === hoveredSpec);
      if (pp) drawSpecTooltip(pp);
    }
  }

  // ── Tooltip Dark Glass para el espectro D ─────────────────────────────────

  function drawSpecTooltip(pp) {
    const l = pp.layer, E1 = getE1(l);
    const ratioC = (l.Z2 * l.Z2 / 36).toFixed(1);
    const lines = [
      (l.name || l.sym) + ' (' + l.sym + ')  \u2014  Z\u2082=' + l.Z2 + ',  M\u2082=' + l.M2 + ' u',
      'Factor cinem\u00e1tico K: ' + l.K.toFixed(4),
      'Energ\u00eda peak E\u2081:      ' + (E1 !== null ? E1.toFixed(4) : '--') + ' MeV',
      'Secci\u00f3n eficaz \u03c3:     Z\u2082\u00b2 = ' + (l.Z2 * l.Z2) + '  (\u00d7' + ratioC + ' vs C)',
      'Cuentas acumuladas: ' + Math.round(pp.counts) + ' eventos'
    ];

    const pad = 10, lh = 16, tw = 248, th = lines.length * lh + pad * 2 + 4;
    let tx = pp.x + 16, ty = PAD.T + PH - pp.h - th / 2;
    if (tx + tw > WP - 6) tx = pp.x - tw - 16;
    ty = Math.max(PAD.T, Math.min(HP - th - 6, ty));

    cxP.save();
    cxP.fillStyle   = 'rgba(4, 8, 20, 0.96)';
    cxP.strokeStyle = l.color;
    cxP.lineWidth   = 1.5;
    cxP.beginPath();
    cxP.roundRect(tx, ty, tw, th, 6);
    cxP.fill();
    cxP.stroke();

    cxP.fillStyle = l.color;
    cxP.fillRect(tx, ty, 4, th);

    cxP.textAlign = 'left';
    cxP.font      = 'bold 11px Inter, sans-serif';
    cxP.fillStyle = l.color;
    cxP.fillText(lines[0], tx + pad + 2, ty + pad + 10);

    cxP.font      = '9.5px JetBrains Mono, monospace';
    cxP.fillStyle = 'rgba(215, 230, 250, 0.90)';
    for (let i = 1; i < lines.length; i++) {
      cxP.fillText(lines[i], tx + pad + 2, ty + pad + 10 + i * lh);
    }
    cxP.restore();
  }

  // ── Eventos de interacción con el mouse ───────────────────────────────────

  cvS.style.cursor = 'pointer';
  cvS.addEventListener('click', e => {
    const rect = cvS.getBoundingClientRect();
    const mx   = (e.clientX - rect.left) * (WS / rect.width);
    const my   = (e.clientY - rect.top)  * (HS / rect.height);
    let found  = null;
    for (const l of LAYERS) {
      if (mx >= SAMP_X1 && mx <= SAMP_X2 && my >= l.y && my <= l.y + l.h) {
        found = l.sym; break;
      }
    }
    selectedLyr = (found === selectedLyr) ? null : found;
    hoveredSpec = selectedLyr;
  });

  cvP.addEventListener('mousemove', e => {
    const rect = cvP.getBoundingClientRect();
    const mx   = (e.clientX - rect.left) * (WP / rect.width);
    const my   = (e.clientY - rect.top)  * (HP / rect.height);
    let found  = null;
    for (const pp of peakAreas) {
      if (Math.abs(mx - pp.x) < 26 && my >= PAD.T && my <= PAD.T + PH + 6) {
        found = pp.sym; break;
      }
    }
    if (found !== hoveredSpec) {
      hoveredSpec = found;
      cvP.style.cursor = (found || selectedLyr) ? 'pointer' : 'default';
    }
  });

  cvP.addEventListener('click', e => {
    const rect = cvP.getBoundingClientRect();
    const mx   = (e.clientX - rect.left) * (WP / rect.width);
    const my   = (e.clientY - rect.top)  * (HP / rect.height);
    let found  = null;
    for (const pp of peakAreas) {
      if (Math.abs(mx - pp.x) < 26 && my >= PAD.T && my <= PAD.T + PH + 6) {
        found = pp.sym; break;
      }
    }
    selectedLyr = (found === selectedLyr) ? null : found;
    hoveredSpec = selectedLyr;
  });

  cvP.addEventListener('mouseleave', () => {
    if (!selectedLyr) hoveredSpec = null;
  });

  // ── Controles de concentración superficial compactos y neutrales ──────────

  function buildControls() {
    const container = document.getElementById('panelD-sliders');
    if (!container) return;
    container.innerHTML = '';
    container.style.cssText = 'display:grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 6px 16px; margin: 6px 0 2px;';

    LAYERS.forEach(l => {
      const row = document.createElement('div');
      row.className = 'slider-row';
      row.style.cssText = 'display:flex; align-items:center; gap:8px; margin:0; padding:2px 0;';

      const lbl = document.createElement('span');
      lbl.className = 'slider-label';
      lbl.style.cssText = 'display:flex; align-items:center; gap:5px; width:74px; flex-shrink:0;';
      lbl.innerHTML =
        '<span style="display:inline-block;width:7px;height:7px;border-radius:2px;background:' +
        l.color + ';flex-shrink:0"></span><b style="color:' + l.color + ';font-size:0.82rem;">' + l.sym +
        '</b><span style="color:var(--muted);font-size:0.68rem;margin-left:auto">(Z\u2082=' + l.Z2 + ')</span>';

      const sld = document.createElement('input');
      sld.type  = 'range';
      sld.min   = '0'; sld.max = '100'; sld.step = '1';
      sld.value = Math.round((conc[l.sym] || 0) * 100);
      sld.style.cssText = 'flex:1; min-width:60px; height:4px; cursor:pointer;';

      const val = document.createElement('span');
      val.className = 'slider-val';
      val.style.cssText = 'width:36px; text-align:right; font-family:"JetBrains Mono",monospace; font-size:0.75rem; color:var(--text);';
      val.textContent = sld.value + '%';

      sld.addEventListener('input', function () {
        conc[l.sym] = parseInt(this.value) / 100;
        val.textContent = this.value + '%';
      });

      row.appendChild(lbl);
      row.appendChild(sld);
      row.appendChild(val);
      container.appendChild(row);
    });
  }

  // ── Bucle de simulación en tiempo real ─────────────────────────────────────

  function tick(ts) {
    if (lastTs === null) lastTs = ts;
    const dt = Math.min(ts - lastTs, 50);
    lastTs   = ts;

    if (!isPaused) {
      spawnTimer += dt;
      const active = particles.filter(p => p.phase !== 'done').length;
      if (spawnTimer >= spawnMs && active < 6) {
        spawnParticle();
        spawnTimer = 0;
      }
      for (const p of particles) {
        if (p.phase !== 'done') updateParticle(p, dt);
      }
      while (particles.length > 18) particles.shift();
    }

    drawSample();
    drawSpectrum();
  }

  // ── API pública ───────────────────────────────────────────────────────────

  function setE0(val) {
    E0_D = parseFloat(val);
    LAYERS.forEach(l => { perEl[l.sym].fill(0); });
    totalBins.fill(0);
    const lbl = document.getElementById('valE0D');
    if (lbl) lbl.textContent = E0_D.toFixed(1) + ' MeV';
  }

  function togglePause() {
    isPaused = !isPaused;
    const btn = document.getElementById('btnDPause');
    if (btn) btn.textContent = isPaused ? '\u25b6 Continuar' : '\u23f8 Pausar';
  }

  function reset() {
    LAYERS.forEach(l => { perEl[l.sym].fill(0); });
    totalBins.fill(0);
    particles.length = 0;
    spawnTimer = 0;
    lastTs = null;
    if (isPaused) togglePause();
  }

  function setCurrent(nA) {
    I_nA = parseFloat(nA);
    spawnMs = 9200 / I_nA;
    const lbl = document.getElementById('valI_nA');
    if (lbl) lbl.textContent = I_nA.toFixed(0) + ' nA';
  }

  function init() {
    buildControls();
  }

  return { init, tick, reset, setE0, setCurrent, togglePause };

})();
