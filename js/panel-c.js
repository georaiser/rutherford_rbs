/**
 * panel-c.js — Panel C: Espectro RBS interactivo
 *
 * Visualizacion del espectro Y(E1) con deconvolucion elemental:
 *   1. Curvas gaussianas individuales por elemento (color propio, sigma fijo).
 *   2. Curva envolvente total: suma de todas las contribuciones.
 *   3. Linea de referencia cinematica: E0 = 2.0 MeV (frontera del haz).
 *   4. Marcador dinamico M2 sincronizado con Panel B.
 *   5. Tooltip flotante: K, E1, Z2^2, A_i relativa y ratio vs Carbono.
 *   6. Sliders de concentracion superficial N_i (0-100%).
 *
 * Modelo fisico:
 *   Posicion:  E1 = K(M2, theta) * E0       [factor cinematico, Chu et al. 1978]
 *   Area:      A_i prop H_i prop N_i * Z2^2  [seccion eficaz Rutherford, theta y E0 fijos]
 *   Relacion area-altura: A_i = H_i * sigma * sqrt(2pi)  [detector gaussiano, sigma = 28 keV]
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
  let selectedPeak = null;  // simbolo del elemento seleccionado con clic

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
    const peaks = ELEMENTS.map(el => {
      const K  = Physics.calcK(el.M2, PHYS.THETA_DET);
      const E1 = K !== null ? K * PHYS.E0_RBS : null;
      const xs = Physics.relCrossSection(el.Z2); // Z₂²
      const Ni = concentrations[el.sym] !== undefined ? concentrations[el.sym] : 1.0;
      const h  = xs * Ni;  // Rendimiento físico: A_i ∝ N_i · Z₂²
      const hNorm = h / MAX_REF; // Altura normalizada respecto a la referencia de escala
      return { ...el, E1, K, xs, Ni, h, hNorm };
    }).filter(p => p.E1 !== null);

    return peaks;
  }

  // ── Renderizado principal ──────────────────────────────────────────────────

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const peaks = buildPeaks();
    peakPositions = [];

    // Fondo del area grafica
    ctx.fillStyle = 'rgba(6, 12, 26, 0.65)';
    ctx.fillRect(PAD.L, PAD.T, PW, PH);

    // Rejilla horizontal tenue (cuartiles de intensidad)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const yg = PAD.T + PH * i / 4;
      ctx.beginPath(); ctx.moveTo(PAD.L, yg); ctx.lineTo(PAD.L + PW, yg); ctx.stroke();
    }

    const N_PTS = 600; // puntos de muestreo del espectro

    // ── 1. PEAKS INDIVIDUALES DECONVOLUCIONADOS ──
    peaks.forEach(p => {
      if (p.hNorm < 0.001) return;
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
      ctx.fillStyle = active ? p.color + '44' : p.color + '22';
      ctx.fill();

      // Contorno de la componente gaussiana
      ctx.beginPath();
      for (let i = 0; i <= N_PTS; i++) {
        const e   = E_MIN + (E_MAX - E_MIN) * i / N_PTS;
        const val = gauss(e, p.E1, p.hNorm);
        const x   = eToX(e), y = PAD.T + PH - val * PH * 0.88;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = active ? p.color : p.color + '66';
      ctx.lineWidth   = active ? 1.8 : 1.0;
      ctx.stroke();
    });

    // ── 2. CURVA ENVOLVENTE TOTAL (ESPECTRO SUMA) ──
    const sp = [];
    for (let i = 0; i <= N_PTS; i++) {
      const e = E_MIN + (E_MAX - E_MIN) * i / N_PTS;
      let total = 0;
      for (const p of peaks) {
        if (p.hNorm > 0.0005) total += gauss(e, p.E1, p.hNorm);
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
      const dotR = active ? 6.0 : 4.0;
      if (active) {
        const g = ctx.createRadialGradient(xp, yp, 0, xp, yp, dotR * 3);
        g.addColorStop(0, p.color + 'aa'); g.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(xp, yp, dotR * 3, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(xp, yp, dotR, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.fill();

      // Simbolo del elemento
      ctx.font      = 'bold ' + (active ? 13 : 11) + 'px Inter, sans-serif';
      ctx.fillStyle = active ? '#ffffff' : p.color;
      ctx.fillText(p.sym, xp, yp - 10);

      // Energia E1 en MeV
      ctx.font      = '9.5px JetBrains Mono, monospace';
      ctx.fillStyle = active ? p.color : p.color + 'bb';
      ctx.fillText(p.E1.toFixed(3) + ' MeV', xp, yp - 23);
    }
    ctx.textAlign = 'left';

    // ── 4. LINEA DE REFERENCIA: ENERGIA INCIDENTE E0 ──
    const xE0 = eToX(PHYS.E0_RBS);
    if (xE0 >= PAD.L && xE0 <= PAD.L + PW) {
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth   = 1.2;
      ctx.beginPath(); ctx.moveTo(xE0, PAD.T); ctx.lineTo(xE0, PAD.T + PH); ctx.stroke();
      ctx.setLineDash([]);

      ctx.font      = '9.5px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.textAlign = 'center';
      ctx.fillText('E\u2080 = 2.0 MeV (haz)', xE0, PAD.T + 12);
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

    // ── 6. TOOLTIP FLOTANTE ──
    if (hoveredPeak) {
      const pp = peakPositions.find(p => p.sym === hoveredPeak);
      if (pp && pp.peak.Ni > 0.001) drawTooltip(pp);
    }

    drawAxes();
  }

  // ── Tooltip con datos fisicos del peak ────────────────────────────────────

  function drawTooltip(pp) {
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
      'Rendimiento A\u1d62:        ' + (p.hNorm * 100).toFixed(1) + ' %'
    ];

    const pad = 12, lh = 17, tw = 258, th = lines.length * lh + pad * 2 - 2;
    let tx = pp.xp + 16;
    let ty = pp.yp - th / 2;
    if (tx + tw > W - 10) tx = pp.xp - tw - 16;
    ty = Math.max(PAD.T, Math.min(H - th - 8, ty));

    // Caja Dark Glass
    ctx.save();
    ctx.fillStyle   = 'rgba(4, 8, 20, 0.96)';
    ctx.strokeStyle = p.color;
    ctx.lineWidth   = 1.5;
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
    ctx.fillStyle = 'rgba(215, 230, 250, 0.90)';
    for (let i = 1; i < lines.length; i++) {
      ctx.fillText(lines[i], tx + pad + 2, ty + pad + 10 + i * lh);
    }
    ctx.restore();
  }

  // ── Ejes y escala ─────────────────────────────────────────────────────────

  function drawAxes() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.20)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD.L, PAD.T + PH + 1); ctx.lineTo(PAD.L + PW, PAD.T + PH + 1); ctx.stroke();

    // Eje X: Energia E1 (MeV)
    ctx.font      = '10px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(180, 200, 220, 0.70)';
    for (let e = 0.0; e <= 2.1; e += 0.25) {
      const xp = eToX(e);
      ctx.beginPath(); ctx.moveTo(xp, PAD.T + PH); ctx.lineTo(xp, PAD.T + PH + 5); ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillText(e.toFixed(2), xp, PAD.T + PH + 18);
    }
    ctx.textAlign = 'center';
    ctx.font      = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(200, 220, 240, 0.75)';
    ctx.fillText('Energ\u00eda del proyectil retrodispersado  E\u2081  (MeV)', PAD.L + PW / 2, H - 6);

    // Eje Y: Intensidad (prop Z2^2 * N_i)
    ctx.save();
    ctx.translate(14, PAD.T + PH / 2); ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center'; ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(200, 220, 240, 0.75)';
    ctx.fillText('Intensidad / Cuentas  (\u221d Z\u2082\u00b2 \u00b7 N\u1d62)', 0, 0);
    ctx.restore();

    // Marcas porcentuales del eje Y
    ctx.font      = '9px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(160, 180, 200, 0.55)'; ctx.textAlign = 'left';
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
    const HIT  = 26; // px — radio de deteccion horizontal
    let found  = null;
    for (const pp of peakPositions) {
      if (pp.peak.Ni > 0.001 && Math.abs(mx - pp.xp) < HIT && my > PAD.T && my < pp.yp + 25) {
        found = pp.sym; break;
      }
    }
    if (found !== hoveredPeak) {
      hoveredPeak = found;
      canvas.style.cursor = found ? 'pointer' : 'default';
      draw();
    }
  }

  function onMouseLeave() {
    if (hoveredPeak) { hoveredPeak = null; canvas.style.cursor = 'default'; draw(); }
  }

  function onClick(e) {
    const rect = canvas.getBoundingClientRect();
    const mx   = (e.clientX - rect.left) * (W / rect.width);
    const HIT  = 26;
    let found  = null;
    for (const pp of peakPositions) {
      if (pp.peak.Ni > 0.001 && Math.abs(mx - pp.xp) < HIT) { found = pp.sym; break; }
    }
    selectedPeak = (found === selectedPeak) ? null : found;
    draw();
  }

  // ── Controles de concentracion N_i ────────────────────────────────────────

  function buildConcControls() {
    const container = document.getElementById('concSliders');
    if (!container) return;
    container.innerHTML = '';
    ELEMENTS.forEach(el => {
      const row = document.createElement('div');
      row.className = 'slider-row';
      row.style.marginBottom = '4px';

      const label = document.createElement('span');
      label.className = 'slider-label';
      label.style.cssText = 'display:flex;align-items:center;gap:6px;width:126px;flex-shrink:0';
      label.innerHTML =
        '<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:' +
        el.color + ';flex-shrink:0"></span><b style="color:' + el.color + '">' + el.sym +
        '</b><span style="color:var(--muted);font-size:0.71rem">(Z\u2082=' + el.Z2 + ')</span>';

      const slider = document.createElement('input');
      slider.type  = 'range';
      slider.min   = '0'; slider.max = '100'; slider.step = '1'; slider.value = '100';
      slider.style.accentColor = el.color;

      const valSpan = document.createElement('span');
      valSpan.className   = 'slider-val';
      valSpan.style.color = el.color;
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

  return { init, draw, setM2Marker };

})();
