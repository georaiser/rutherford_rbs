/**
 * panel-c.js — Panel C: Espectro RBS interactivo
 *
 * Visualizacion del espectro Y(E1) con deconvolucion elemental:
 *   1. Curvas gaussianas individuales por elemento (color propio, sigma fijo).
 *   2. Curva envolvente total: suma continua de todas las contribuciones.
 *   3. Linea de referencia cinematica: E0 = 2.0 MeV (frontera del haz).
 *   4. Marcador dinamico M2 sincronizado con Panel B.
 *   5. Presets de muestras reales de laboratorio (Au/Si, Fe+C, Ag/Si, Multicomponente).
 *   6. Selector de Ganancia Y (x1, x5, x20, Auto-Escala).
 *   7. Selector de Capas de visualización (Ambas, Solo Total, Deconvolución).
 *   8. Cuantificación estequiométrica en tiempo real (standardless).
 *   9. Tooltip flotante interactivo (Dark Glass) con fijacion por clic.
 *  10. Sliders de concentracion superficial N_i (0-100%).
 *
 * Modelo fisico:
 *   Posicion:  E1 = K(M2, theta) * E0       [factor cinematico, Chu et al. 1978]
 *   Area:      A_i prop H_i prop N_i * Z2^2  [seccion eficaz Coulomb, theta y E0 fijos]
 *   Relacion area-altura: A_i = H_i * sigma * sqrt(2pi)  [detector gaussiano, sigma = 28 keV]
 *   Estequiometria: N_A / N_B = (A_A / Z_A^2) / (A_B / Z_B^2)  [analisis standardless]
 *
 * Depende de: constants.js (PHYS, ELEMENTS), physics.js (Physics)
 */
'use strict';

const panelC = (() => {

  const canvas = document.getElementById('canvasC');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width;   // 800 px
  const H = canvas.height;  // 280 px

  const PAD = { L: 64, R: 24, T: 32, B: 52 };
  const PW  = W - PAD.L - PAD.R;
  const PH  = H - PAD.T - PAD.B;
  const E_MIN = 0.0, E_MAX = 2.15; // MeV — rango del eje X

  let M2_marker    = 197;   // u — posicion del marcador dinamico (sincronizado con Panel B)
  let hoveredPeak  = null;  // simbolo del elemento bajo el cursor
  let selectedPeak = null;  // simbolo del elemento fijado con clic

  let currentGain   = 1;     // 1, 5, 20 o 'auto'
  let currentPreset = 'all'; // 'all', 'au_si', 'fe_c', 'ag_si'

  // Concentraciones relativas N_i: [0, 1] — inicialmente al maximo
  const concentrations = {};
  ELEMENTS.forEach(el => { concentrations[el.sym] = 1.0; });

  let peakPositions = []; // posiciones canvas de cada peak (para deteccion de mouse)

  // ── Utilidades de coordenadas ──────────────────────────────────────────────

  function eToX(e) {
    return PAD.L + (e - E_MIN) / (E_MAX - E_MIN) * PW;
  }

  // Perfil gaussiano normalizado: altura = hNorm, anchura = sigma (resolucion del detector)
  function gauss(e, e_center, hNorm) {
    const sigma = PHYS.SIGMA_SPEC; // 0.028 MeV — FWHM aprox 66 keV
    return hNorm * Math.exp(-0.5 * ((e - e_center) / sigma) ** 2);
  }

  // ── Construccion fisica de los peaks ──────────────────────────────────────

  function buildPeaks() {
    const MAX_REF = PHYS.Z2_AU * PHYS.Z2_AU; // 79² = 6241 (Au a N=100%, referencia nominal de fondo de escala)
    
    // 1. Rendimientos físicos exactos: A_i ∝ N_i · Z₂²
    const rawPeaks = ELEMENTS.map(el => {
      const K  = Physics.calcK(el.M2, PHYS.THETA_DET);
      const E1 = K !== null ? K * PHYS.E0_RBS : null;
      const xs = Physics.relCrossSection(el.Z2); // Z₂²
      const Ni = concentrations[el.sym] !== undefined ? concentrations[el.sym] : 1.0;
      const h  = xs * Ni;
      return { ...el, E1, K, xs, Ni, h };
    }).filter(p => p.E1 !== null);

    // 2. Determinar escala efectiva según la ganancia activa
    let scaleRef = MAX_REF;
    if (currentGain === 'auto') {
      const maxActive = Math.max(...rawPeaks.map(p => p.h), 1e-9);
      scaleRef = maxActive;
    } else {
      const mult = typeof currentGain === 'number' ? currentGain : 1;
      scaleRef = MAX_REF / mult;
    }

    const peaks = rawPeaks.map(p => {
      const hNorm    = Math.min(p.h / scaleRef, 1.15); // altura normalizada para el canvas
      const hRawNorm = p.h / MAX_REF;                 // porcentaje respecto al fondo de escala nominal
      return { ...p, hNorm, hRawNorm };
    });

    return peaks;
  }

  // ── Cuantificación estequiométrica en tiempo real (Materiales Reales) ─────

  const KNOWN_PHASES = {
    'Fe3C':   'Cementita (Acero templado)',
    'Fe2C':   'Carburo de hierro (Hägg)',
    'FeC':    'Carburo de hierro',
    'Au2Si':  'Siliciuro de oro (Fase de contacto)',
    'Au5Si':  'Siliciuro de oro (Eutéctico)',
    'AuSi':   'Siliciuro de oro',
    'SiC':    'Carburo de silicio (Semiconductor)',
    'Ag3Au':  'Electrum (Aleación noble)',
    'AgAu':   'Aleación Plata-Oro',
    'FeSi2':  'Siliciuro de hierro (Termoeléctrico)',
    'FeSi':   'Siliciuro de hierro',
    'Fe3Si':  'Siliciuro de hierro ferromagnético',
    'Ag3Si':  'Siliciuro de plata'
  };

  const SUBSCRIPTS = { '0':'₀', '1':'₁', '2':'₂', '3':'₃', '4':'₄', '5':'₅', '6':'₆', '7':'₇', '8':'₈', '9':'₉', '.':'·' };

  function toSubscript(numStr) {
    return numStr.split('').map(c => SUBSCRIPTS[c] || c).join('');
  }

  function updateStoichiometry() {
    const formulaEl = document.getElementById('stoichFormula');
    const ratioEl   = document.getElementById('stoichRatio');
    if (!formulaEl || !ratioEl) return;

    const active = ELEMENTS.filter(el => (concentrations[el.sym] || 0) > 0.001);

    if (active.length === 0) {
      formulaEl.textContent = 'Muestra vacía (Nᵢ = 0)';
      ratioEl.textContent   = 'Sin señal nuclear detectada';
      return;
    }

    const totalConc = active.reduce((sum, el) => sum + concentrations[el.sym], 0);

    // 1. Caso de un solo elemento activo (Elemento puro)
    if (active.length === 1) {
      const el = active[0];
      const pct = Math.round(concentrations[el.sym] * 100);
      formulaEl.innerHTML = `<b style="color:${el.color}">${el.name} (${el.sym})</b> — Elemento puro`;
      ratioEl.textContent   = `Concentración superficial relativa: ${pct}% (100% fracción atómica de ${el.sym})`;
      return;
    }

    // 2. Caso de 2 elementos activos (Compuesto binario / Aleación)
    if (active.length === 2) {
      // Ordenar por número atómico o masa para convención química
      const elA = active[0], elB = active[1];
      const nA = concentrations[elA.sym], nB = concentrations[elB.sym];
      const pctA = Math.round((nA / totalConc) * 100);
      const pctB = Math.round((nB / totalConc) * 100);
      const rAB = nA / nB;

      // Identificación de fases estequiométricas conocidas
      let phaseName = '';
      let formulaTag = '';

      if (elA.sym === 'C' && elB.sym === 'Fe' || elA.sym === 'Fe' && elB.sym === 'C') {
        const rFeC = elA.sym === 'Fe' ? rAB : 1 / rAB;
        if (Math.abs(rFeC - 3.0) < 0.20) { formulaTag = 'Fe₃C'; phaseName = 'Cementita en Acero'; }
        else if (Math.abs(rFeC - 2.0) < 0.20) { formulaTag = 'Fe₂C'; phaseName = 'Carburo de hierro (Hägg)'; }
        else if (Math.abs(rFeC - 1.0) < 0.15) { formulaTag = 'FeC'; phaseName = 'Carburo de hierro equiatómico'; }
      } else if (elA.sym === 'Si' && elB.sym === 'Au' || elA.sym === 'Au' && elB.sym === 'Si') {
        const rAuSi = elA.sym === 'Au' ? rAB : 1 / rAB;
        if (Math.abs(rAuSi - 2.0) < 0.20) { formulaTag = 'Au₂Si'; phaseName = 'Siliciuro de oro (Fase interfacial)'; }
        else if (Math.abs(rAuSi - 1.0) < 0.15) { formulaTag = 'AuSi'; phaseName = 'Siliciuro de oro equiatómico'; }
      } else if (elA.sym === 'C' && elB.sym === 'Si' || elA.sym === 'Si' && elB.sym === 'C') {
        const rSiC = elA.sym === 'Si' ? rAB : 1 / rAB;
        if (Math.abs(rSiC - 1.0) < 0.15) { formulaTag = 'SiC'; phaseName = 'Carburo de silicio (Semiconductor)'; }
      } else if (elA.sym === 'Ag' && elB.sym === 'Au' || elA.sym === 'Au' && elB.sym === 'Ag') {
        const rAgAu = elA.sym === 'Ag' ? rAB : 1 / rAB;
        if (Math.abs(rAgAu - 3.0) < 0.25) { formulaTag = 'Ag₃Au'; phaseName = 'Electrum (Aleación noble histórica)'; }
        else if (Math.abs(rAgAu - 1.0) < 0.15) { formulaTag = 'AgAu'; phaseName = 'Aleación Plata-Oro 50:50'; }
      }

      if (formulaTag && phaseName) {
        formulaEl.innerHTML = `<b style="color:var(--amber); font-size:0.95rem;">${formulaTag}</b> <span style="font-weight:400; color:var(--text); font-size:0.78rem;">— ${phaseName}</span>`;
      } else {
        formulaEl.innerHTML = `<span style="font-weight:600; color:var(--cyan);">Aleación binaria ${elA.sym}–${elB.sym}</span> <span style="font-size:0.78rem; color:var(--muted);">(${pctA}% ${elA.sym} · ${pctB}% ${elB.sym} atómico)</span>`;
      }

      ratioEl.textContent = `Razón atómica N(${elA.sym})/N(${elB.sym}) = ${rAB.toFixed(2)} (${pctA}% ${elA.sym}, ${pctB}% ${elB.sym} atómico)`;
      return;
    }

    // 3. Caso de 3 o más elementos activos (Multicomponente)
    const breakdown = active.map(el => {
      const pct = Math.round((concentrations[el.sym] / totalConc) * 100);
      return `<span style="color:${el.color};font-weight:600;">${pct}% ${el.sym}</span>`;
    }).join(' · ');

    formulaEl.innerHTML = `<b>Muestra Multicomponente</b> <span style="font-size:0.75rem; color:var(--muted);">(Análisis estequiométrico global)</span>`;
    ratioEl.innerHTML   = `Fracción atómica: ${breakdown} (deducida vía Nᵢ ∝ Aᵢ / Zᵢ²)`;
  }

  // ── Renderizado principal ──────────────────────────────────────────────────

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const peaks = buildPeaks();
    peakPositions = [];

    // Fondo del area grafica
    ctx.fillStyle = 'rgba(6, 12, 26, 0.70)';
    ctx.fillRect(PAD.L, PAD.T, PW, PH);

    // Rejilla horizontal tenue (cuartiles de intensidad)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const yg = PAD.T + PH * i / 4;
      ctx.beginPath(); ctx.moveTo(PAD.L, yg); ctx.lineTo(PAD.L + PW, yg); ctx.stroke();
    }

    const N_PTS = 600; // puntos de muestreo del espectro continuo

    // ── 1. PEAKS INDIVIDUALES DECONVOLUCIONADOS ──
    peaks.forEach(p => {
      if (p.hNorm < 0.0005) return;
      const active = (hoveredPeak === p.sym) || (selectedPeak === p.sym);

      // Area rellena bajo la campana gaussiana
      ctx.beginPath();
      ctx.moveTo(PAD.L, PAD.T + PH);
      for (let i = 0; i <= N_PTS; i++) {
        const e   = E_MIN + (E_MAX - E_MIN) * i / N_PTS;
        const val = gauss(e, p.E1, p.hNorm);
        ctx.lineTo(eToX(e), PAD.T + PH - val * PH * 0.88);
      }
      ctx.lineTo(PAD.L + PW, PAD.T + PH);
      ctx.closePath();
      ctx.fillStyle = active ? p.color + '40' : p.color + '1c';
      ctx.fill();

      // Contorno de la componente gaussiana
      ctx.beginPath();
      for (let i = 0; i <= N_PTS; i++) {
        const e   = E_MIN + (E_MAX - E_MIN) * i / N_PTS;
        const val = gauss(e, p.E1, p.hNorm);
        const x   = eToX(e), y = PAD.T + PH - val * PH * 0.88;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = active ? p.color : p.color + '70';
      ctx.lineWidth   = active ? 1.8 : 1.0;
      ctx.stroke();
    });

    // ── 2. CURVA ENVOLVENTE TOTAL (ESPECTRO SUMA) ──
    const sp = [];
    for (let i = 0; i <= N_PTS; i++) {
      const e = E_MIN + (E_MAX - E_MIN) * i / N_PTS;
      let total = 0;
      for (const p of peaks) {
        if (p.hNorm > 0.0001) total += gauss(e, p.E1, p.hNorm);
      }
      sp.push([eToX(e), PAD.T + PH - total * PH * 0.88]);
    }
    ctx.beginPath();
    ctx.moveTo(sp[0][0], sp[0][1]);
    for (let i = 1; i < sp.length; i++) ctx.lineTo(sp[i][0], sp[i][1]);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth   = 2.0;
    ctx.stroke();

    // ── 3. ETIQUETAS Y PUNTOS EN LA CUSPIDE DE CADA PEAK ──
    ctx.textAlign = 'center';
    for (const p of peaks) {
      const xp     = eToX(p.E1);
      const yp     = PAD.T + PH - p.hNorm * PH * 0.88;
      const active = (hoveredPeak === p.sym) || (selectedPeak === p.sym);

      peakPositions.push({ sym: p.sym, xp, yp, peak: p });
      if (p.Ni < 0.001) continue;

      // Linea vertical punteada desde la base hasta la cuspide
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = active ? p.color : p.color + '44';
      ctx.lineWidth   = active ? 1.6 : 1.0;
      ctx.beginPath(); ctx.moveTo(xp, PAD.T + PH); ctx.lineTo(xp, yp - 4); ctx.stroke();
      ctx.setLineDash([]);

      // Punto luminoso en la cuspide
      const dotR = active ? 5.5 : 4.0;
      if (active) {
        const g = ctx.createRadialGradient(xp, yp, 0, xp, yp, dotR * 3.5);
        g.addColorStop(0, p.color + 'bb'); g.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(xp, yp, dotR * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(xp, yp, dotR, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.fill();

      // Ajuste de altura segura para que los textos nunca se corten arriba
      const labelY = Math.max(yp, PAD.T + 22);

      // Simbolo del elemento
      ctx.font      = 'bold ' + (active ? 13 : 11) + 'px Inter, sans-serif';
      ctx.fillStyle = active ? '#ffffff' : p.color;
      ctx.fillText(p.sym, xp, labelY - 9);

      // Energia E1 en MeV
      ctx.font      = '9.5px JetBrains Mono, monospace';
      ctx.fillStyle = active ? p.color : 'rgba(215, 230, 250, 0.80)';
      ctx.fillText(p.E1.toFixed(3) + ' MeV', xp, labelY - 22);
    }
    ctx.textAlign = 'left';

    // ── 4. LINEA DE REFERENCIA: ENERGIA INCIDENTE E0 ──
    const xE0 = eToX(PHYS.E0_RBS);
    if (xE0 >= PAD.L && xE0 <= PAD.L + PW) {
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.30)';
      ctx.lineWidth   = 1.2;
      ctx.beginPath(); ctx.moveTo(xE0, PAD.T); ctx.lineTo(xE0, PAD.T + PH); ctx.stroke();
      ctx.setLineDash([]);

      ctx.font      = '9.5px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.textAlign = 'center';
      ctx.fillText('E\u2080 = 2.0 MeV (haz)', xE0, PAD.T + 13);
      ctx.textAlign = 'left';
    }

    // ── 5. MARCADOR DINAMICO M2 (sincronizado con Panel B) ──
    const K_m = Physics.calcK(M2_marker, PHYS.THETA_DET);
    if (K_m !== null) {
      const E1_m = K_m * PHYS.E0_RBS;
      const xm   = eToX(E1_m);
      if (xm >= PAD.L && xm <= PAD.L + PW) {
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth   = 1.6;
        ctx.beginPath(); ctx.moveTo(xm, PAD.T); ctx.lineTo(xm, PAD.T + PH); ctx.stroke();
        ctx.setLineDash([]);

        // Puntero triangular superior
        ctx.beginPath();
        ctx.moveTo(xm, PAD.T);
        ctx.lineTo(xm - 5, PAD.T - 8); ctx.lineTo(xm + 5, PAD.T - 8);
        ctx.closePath();
        ctx.fillStyle = '#38bdf8'; ctx.fill();

        const elClosest = Physics.closestElement(M2_marker);
        ctx.font      = 'bold 9.5px JetBrains Mono, monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText('M\u2082=' + M2_marker.toFixed(0) + ' u (' + elClosest.sym + ') \u2192 E\u2081=' + E1_m.toFixed(3) + ' MeV', xm, PAD.T - 12);
        ctx.textAlign = 'left';
      }
    }

    // ── 6. TOOLTIP FLOTANTE (HOVER O FIJADO POR CLIC) ──
    const activeTooltipSym = hoveredPeak || selectedPeak;
    if (activeTooltipSym) {
      const pp = peakPositions.find(p => p.sym === activeTooltipSym);
      if (pp && pp.peak.Ni > 0.001) drawTooltip(pp, activeTooltipSym === selectedPeak);
    }

    drawAxes();
    updateStoichiometry();
  }

  // ── Tooltip interactivo con datos fisicos del peak ─────────────────────────

  function drawTooltip(pp, isPinned) {
    const p = pp.peak;
    const EL_NAMES = { C: 'Carbono', Si: 'Silicio', Fe: 'Hierro', Ag: 'Plata', Au: 'Oro' };
    const elName = p.name || EL_NAMES[p.sym] || p.sym;
    const ratioC = (p.xs / 36).toFixed(1); // seccion eficaz relativa a C (Z2=6, Z2^2=36)

    const lines = [
      elName + ' (' + p.sym + ')  \u2014  Z\u2082=' + p.Z2 + ',  M\u2082=' + p.M2 + ' u',
      'Factor cinem\u00e1tico K: ' + p.K.toFixed(4),
      'Energ\u00eda peak E\u2081:      ' + p.E1.toFixed(4) + ' MeV',
      'Secci\u00f3n eficaz \u03c3:     Z\u2082\u00b2 = ' + p.xs + '  (\u00d7' + ratioC + ' vs C)',
      'Concentraci\u00f3n N\u1d62:    ' + Math.round(p.Ni * 100) + ' %',
      'Rendimiento A\u1d62:        ' + (p.hRawNorm * 100).toFixed(1) + ' % del m\u00e1x. nominal'
    ];

    const pad = 12, lh = 17, tw = 268, th = lines.length * lh + pad * 2 + 10;
    let tx = pp.xp + 16;
    let ty = pp.yp - th / 2;
    if (tx + tw > W - 10) tx = pp.xp - tw - 16;
    ty = Math.max(PAD.T, Math.min(H - th - 8, ty));

    // Caja Dark Glass
    ctx.save();
    ctx.fillStyle   = 'rgba(4, 8, 20, 0.96)';
    ctx.strokeStyle = isPinned ? '#facc15' : p.color;
    ctx.lineWidth   = isPinned ? 2.0 : 1.5;
    ctx.beginPath();
    ctx.roundRect(tx, ty, tw, th, 6);
    ctx.fill();
    ctx.stroke();

    // Barra lateral de color elemental
    ctx.fillStyle = p.color;
    ctx.fillRect(tx, ty, 4, th);

    // Encabezado: nombre del elemento
    ctx.textAlign = 'left';
    ctx.font      = 'bold 11.5px Inter, sans-serif';
    ctx.fillStyle = p.color;
    ctx.fillText(lines[0], tx + pad + 2, ty + pad + 10);

    // Datos fisicos
    ctx.font      = '9.5px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(215, 230, 250, 0.92)';
    for (let i = 1; i < lines.length; i++) {
      ctx.fillText(lines[i], tx + pad + 2, ty + pad + 10 + i * lh);
    }

    // Pie de estado de fijación
    ctx.font      = '8.5px Inter, sans-serif';
    ctx.fillStyle = isPinned ? '#facc15' : 'rgba(160, 180, 200, 0.55)';
    ctx.fillText(isPinned ? '\u2713 Peak fijado (clic para soltar)' : '\u2022 Clic para fijar datos', tx + pad + 2, ty + th - 6);

    ctx.restore();
  }

  // ── Ejes y escala ─────────────────────────────────────────────────────────

  function drawAxes() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD.L, PAD.T + PH + 1); ctx.lineTo(PAD.L + PW, PAD.T + PH + 1); ctx.stroke();

    // Eje X: Energia E1 (MeV)
    ctx.font      = '10px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(180, 200, 220, 0.75)';
    for (let e = 0.0; e <= 2.1; e += 0.25) {
      const xp = eToX(e);
      ctx.beginPath(); ctx.moveTo(xp, PAD.T + PH); ctx.lineTo(xp, PAD.T + PH + 5); ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillText(e.toFixed(2), xp, PAD.T + PH + 18);
    }
    ctx.textAlign = 'center';
    ctx.font      = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(200, 220, 240, 0.80)';
    ctx.fillText('Energ\u00eda del proyectil retrodispersado  E\u2081  (MeV)', PAD.L + PW / 2, H - 6);

    // Eje Y: Rendimiento / Cuentas con indicación de ganancia activa
    const gainStr = currentGain === 'auto' ? 'Auto-Escala' : (currentGain > 1 ? `\u00d7${currentGain}` : '1\u00d7');
    ctx.save();
    ctx.translate(14, PAD.T + PH / 2); ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center'; ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(200, 220, 240, 0.80)';
    ctx.fillText(`Rendimiento A\u1d62  [${gainStr}]  \u221d  Z\u2082\u00b2 \u00b7 N\u1d62`, 0, 0);
    ctx.restore();

    // Marcas porcentuales del eje Y
    ctx.font      = '9px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(160, 180, 200, 0.60)'; ctx.textAlign = 'left';
    for (let i = 0; i <= 4; i++) {
      const yg = PAD.T + PH * (1 - i / 4);
      ctx.fillText((i * 25) + '%', PAD.L - 32, yg + 4);
      ctx.beginPath(); ctx.moveTo(PAD.L - 4, yg); ctx.lineTo(PAD.L, yg); ctx.stroke();
    }
  }

  // ── Interaccion con el mouse ───────────────────────────────────────────────

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mx   = (e.clientX - rect.left) * (W / rect.width);
    const my   = (e.clientY - rect.top)  * (H / rect.height);
    const HIT  = 28; // px — radio de deteccion horizontal
    let found  = null;

    for (const pp of peakPositions) {
      if (pp.peak.Ni > 0.001 && Math.abs(mx - pp.xp) < HIT && my >= pp.yp - 28 && my <= PAD.T + PH + 8) {
        found = pp.sym; break;
      }
    }
    if (found !== hoveredPeak) {
      hoveredPeak = found;
      canvas.style.cursor = (found || selectedPeak) ? 'pointer' : 'default';
      draw();
    }
  }

  function onMouseLeave() {
    if (hoveredPeak) {
      hoveredPeak = null;
      canvas.style.cursor = selectedPeak ? 'pointer' : 'default';
      draw();
    }
  }

  function onClick(e) {
    const rect = canvas.getBoundingClientRect();
    const mx   = (e.clientX - rect.left) * (W / rect.width);
    const my   = (e.clientY - rect.top)  * (H / rect.height);
    const HIT  = 28;
    let found  = null;

    for (const pp of peakPositions) {
      if (pp.peak.Ni > 0.001 && Math.abs(mx - pp.xp) < HIT && my >= pp.yp - 28 && my <= PAD.T + PH + 8) {
        found = pp.sym; break;
      }
    }
    selectedPeak = (found === selectedPeak) ? null : found;
    draw();
  }

  // ── Controles de concentracion N_i ────────────────────────────────────────

  function buildConcControls() {
    const container = document.getElementById('concSliders');
    if (!container) return;
    container.innerHTML = '';
    container.style.cssText = 'display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 6px 16px; margin: 4px 0 2px;';

    ELEMENTS.forEach(el => {
      const row = document.createElement('div');
      row.className = 'slider-row';
      row.style.cssText = 'display:flex; align-items:center; gap:8px; margin:0; padding:2px 0;';

      const label = document.createElement('span');
      label.className = 'slider-label';
      label.style.cssText = 'display:flex; align-items:center; gap:5px; width:74px; flex-shrink:0;';
      label.innerHTML =
        '<span style="display:inline-block;width:7px;height:7px;border-radius:2px;background:' +
        el.color + ';flex-shrink:0"></span><b style="color:' + el.color + ';font-size:0.82rem;">' + el.sym +
        '</b><span style="color:var(--muted);font-size:0.68rem;margin-left:auto">(Z\u2082=' + el.Z2 + ')</span>';

      const slider = document.createElement('input');
      slider.type  = 'range';
      slider.min   = '0'; slider.max = '100'; slider.step = '1'; slider.value = '100';
      slider.style.cssText = 'flex:1; min-width:60px; height:4px; cursor:pointer;';

      const valSpan = document.createElement('span');
      valSpan.className   = 'slider-val';
      valSpan.style.cssText = 'width:36px; text-align:right; font-family:"JetBrains Mono",monospace; font-size:0.75rem; color:var(--text);';
      valSpan.textContent = '100%';

      slider.addEventListener('input', function () {
        concentrations[el.sym] = parseInt(this.value) / 100;
        valSpan.textContent    = this.value + '%';
        draw();
      });

      row.appendChild(label);
      row.appendChild(slider);
      row.appendChild(valSpan);
      container.appendChild(row);
    });
  }

  // ── Modos: Presets de Muestras y Ganancia Y ─────────────────────────────────

  function setGain(gain) {
    currentGain = gain;
    const btnIds = { 1: 'btnGain1', 5: 'btnGain5', 20: 'btnGain20', 'auto': 'btnGainAuto' };
    Object.keys(btnIds).forEach(k => {
      const b = document.getElementById(btnIds[k]);
      if (b) b.classList.toggle('active', (k == gain || (k === 'auto' && gain === 'auto')));
    });
    draw();
  }

  function setPreset(preset) {
    currentPreset = preset;
    const presetsMap = {
      all:    { C: 1.00, Si: 1.00, Fe: 1.00, Ag: 1.00, Au: 1.00 },
      fe3c:   { C: 0.33, Si: 0.00, Fe: 1.00, Ag: 0.00, Au: 0.00 }, // Fe:C = 3:1 (Cementita)
      au2si:  { C: 0.00, Si: 0.50, Fe: 0.00, Ag: 0.00, Au: 1.00 }, // Au:Si = 2:1 (Siliciuro de oro)
      sic:    { C: 1.00, Si: 1.00, Fe: 0.00, Ag: 0.00, Au: 0.00 }, // Si:C = 1:1 (Carburo de silicio)
      ag3au:  { C: 0.00, Si: 0.00, Fe: 0.00, Ag: 0.90, Au: 0.30 }, // Ag:Au = 3:1 (Electrum)
      reset:  { C: 1.00, Si: 1.00, Fe: 1.00, Ag: 1.00, Au: 1.00 }
    };
    const target = presetsMap[preset] || presetsMap.all;
    ELEMENTS.forEach(el => {
      concentrations[el.sym] = target[el.sym] !== undefined ? target[el.sym] : 1.0;
    });

    // Sincronizar sliders en el DOM
    const container = document.getElementById('concSliders');
    if (container) {
      const rows = container.querySelectorAll('.slider-row');
      rows.forEach((row, i) => {
        const el = ELEMENTS[i];
        if (el) {
          const slider  = row.querySelector('input[type=range]');
          const valSpan = row.querySelector('.slider-val');
          const pct = Math.round(concentrations[el.sym] * 100);
          if (slider)  slider.value = pct;
          if (valSpan) valSpan.textContent = pct + '%';
        }
      });
    }

    // Ganancia inteligente para que los peaks ligeros sean inmediatamente visibles
    if (preset === 'fe3c' || preset === 'sic') {
      setGain(5);
    } else if (preset === 'au2si' || preset === 'ag3au' || preset === 'all' || preset === 'reset') {
      setGain(1);
    }

    draw();
  }

  // ── API publica ───────────────────────────────────────────────────────────

  /** Actualiza el marcador de masa desde Panel B y redibuja. */
  function setM2Marker(M2) { M2_marker = M2; draw(); }

  function init() {
    buildConcControls();
    canvas.addEventListener('mousemove',  onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click',      onClick);
    draw();
  }

  return { init, draw, setM2Marker, setPreset, setGain };

})();
