/**
 * panel-c.js — Panel C: Espectro RBS interactivo avanzado
 *
 * Mejoras visuales y analíticas:
 *   1. Deconvolución visual: curvas gaussianas individuales por elemento con sus colores propios.
 *   2. Curva total envolvente: trazo brillante que suma todas las contribuciones estequiométricas.
 *   3. Frontera cinemática del haz: línea de referencia en E₀ = 2.0 MeV.
 *   4. Marcador de masa M₂ sincronizado en vivo con Panel B.
 *   5. Tooltip flotante enriquecido con ratio de sección eficaz respecto al Carbono (hasta ×173.4).
 *   6. Sliders de concentración atómica N_i (0–100%) con actualización inmediata.
 *
 * Depende de: constants.js, physics.js
 */
'use strict';

const panelC = (() => {

  const canvas = document.getElementById('canvasC');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width;   // 800
  const H = canvas.height;  // 280

  const PAD = { L: 64, R: 24, T: 32, B: 52 };
  const PW  = W - PAD.L - PAD.R;
  const PH  = H - PAD.T - PAD.B;
  const E_MIN = 0.0, E_MAX = 2.15;

  let M2_marker    = 197;
  let hoveredPeak  = null;
  let selectedPeak = null;

  const concentrations = {};
  ELEMENTS.forEach(el => { concentrations[el.sym] = 1.0; });

  let peakPositions = [];

  function eToX(e) {
    return PAD.L + (e - E_MIN) / (E_MAX - E_MIN) * PW;
  }

  function gauss(e, e_center, height) {
    const sigma = PHYS.SIGMA_SPEC; // ~0.028 MeV (FWHM ≈ 66 keV)
    return height * Math.exp(-0.5 * ((e - e_center) / sigma) ** 2);
  }

  function buildPeaks() {
    const peaks = ELEMENTS.map(el => {
      const K  = Physics.calcK(el.M2, PHYS.THETA_DET);
      const E1 = K !== null ? K * PHYS.E0_RBS : null;
      const xs = Physics.relCrossSection(el.Z2);
      const Ni = concentrations[el.sym];
      const h  = xs * Ni;
      return { ...el, E1, K, xs, Ni, h };
    }).filter(p => p.E1 !== null);

    const hMax = Math.max(...peaks.map(p => p.h), 1e-9);
    peaks.forEach(p => { p.hNorm = p.h / hMax; });
    return peaks;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const peaks = buildPeaks();
    peakPositions = [];

    // Fondo del área gráfica
    ctx.fillStyle = 'rgba(6, 12, 26, 0.65)';
    ctx.fillRect(PAD.L, PAD.T, PW, PH);

    // Rejilla horizontal tenue
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const yg = PAD.T + PH * i / 4;
      ctx.beginPath(); ctx.moveTo(PAD.L, yg); ctx.lineTo(PAD.L + PW, yg); ctx.stroke();
    }

    const N = 600;

    // ── 1. DIBUJAR PICOS INDIVIDUALES DECONVOLUCIONADOS ──
    peaks.forEach(p => {
      if (p.hNorm < 0.001) return;
      const isHov = hoveredPeak === p.sym;
      const isSel = selectedPeak === p.sym;
      const active = isHov || isSel;

      ctx.beginPath();
      ctx.moveTo(PAD.L, PAD.T + PH);
      for (let i = 0; i <= N; i++) {
        const e = E_MIN + (E_MAX - E_MIN) * i / N;
        const val = gauss(e, p.E1, p.hNorm);
        ctx.lineTo(eToX(e), PAD.T + PH - val * PH * 0.88);
      }
      ctx.lineTo(PAD.L + PW, PAD.T + PH);
      ctx.closePath();

      // Relleno coloreado de cada elemento
      ctx.fillStyle = active ? p.color + '44' : p.color + '22';
      ctx.fill();

      // Contorno suave de la componente
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const e = E_MIN + (E_MAX - E_MIN) * i / N;
        const val = gauss(e, p.E1, p.hNorm);
        const x = eToX(e), y = PAD.T + PH - val * PH * 0.88;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = active ? p.color : p.color + '66';
      ctx.lineWidth   = active ? 1.8 : 1.0;
      ctx.stroke();
    });

    // ── 2. DIBUJAR CURVA TOTAL ENVOLVENTE (ESPECTRO SUMA) ──
    const sp = [];
    for (let i = 0; i <= N; i++) {
      const e = E_MIN + (E_MAX - E_MIN) * i / N;
      let totalVal = 0;
      for (const p of peaks) {
        if (p.hNorm > 0.0005) totalVal += gauss(e, p.E1, p.hNorm);
      }
      sp.push([eToX(e), PAD.T + PH - totalVal * PH * 0.88]);
    }

    ctx.beginPath();
    ctx.moveTo(sp[0][0], sp[0][1]);
    for (let i = 1; i < sp.length; i++) ctx.lineTo(sp[i][0], sp[i][1]);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth   = 2.0;
    ctx.stroke();

    // ── 3. MARCADORES, ETIQUETAS Y PUNTOS DE PICOS ──
    ctx.textAlign = 'center';
    for (const p of peaks) {
      const xp     = eToX(p.E1);
      const yp     = PAD.T + PH - p.hNorm * PH * 0.88;
      const isHov  = hoveredPeak  === p.sym;
      const isSel  = selectedPeak === p.sym;
      const active = isHov || isSel;

      peakPositions.push({ sym: p.sym, xp, yp, peak: p });
      if (p.Ni < 0.001) continue;

      // Línea vertical punteada al eje
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = active ? p.color : p.color + '44';
      ctx.lineWidth   = active ? 1.6 : 1.0;
      ctx.beginPath(); ctx.moveTo(xp, PAD.T + PH); ctx.lineTo(xp, yp - 4); ctx.stroke();
      ctx.setLineDash([]);

      // Punto en la cúspide
      const dotR = active ? 6.0 : 4.0;
      if (active) {
        const g = ctx.createRadialGradient(xp, yp, 0, xp, yp, dotR * 3);
        g.addColorStop(0, p.color + 'aa'); g.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(xp, yp, dotR * 3, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(xp, yp, dotR, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.fill();

      // Etiqueta del elemento (Símbolo)
      ctx.font = 'bold ' + (active ? 13 : 11) + 'px Inter, sans-serif';
      ctx.fillStyle = active ? '#ffffff' : p.color;
      ctx.fillText(p.sym, xp, yp - 10);

      // Energía E₁
      ctx.font = '9.5px JetBrains Mono, monospace';
      ctx.fillStyle = active ? p.color : p.color + 'bb';
      ctx.fillText(p.E1.toFixed(3) + ' MeV', xp, yp - 23);
    }
    ctx.textAlign = 'left';

    // ── 4. LÍNEA DE REFERENCIA DE ENERGÍA INCIDENTE E₀ (2.0 MeV) ──
    const xE0 = eToX(PHYS.E0_RBS);
    if (xE0 >= PAD.L && xE0 <= PAD.L + PW) {
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(xE0, PAD.T); ctx.lineTo(xE0, PAD.T + PH); ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = '9.5px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.textAlign = 'center';
      ctx.fillText('E₀ = 2.0 MeV (Haz)', xE0, PAD.T + 12);
      ctx.textAlign = 'left';
    }

    // ── 5. MARCADOR DINÁMICO DE MASA M₂ (Sincronizado con Panel B) ──
    const K_m = Physics.calcK(M2_marker, PHYS.THETA_DET);
    if (K_m !== null) {
      const E1_m = K_m * PHYS.E0_RBS;
      const xm   = eToX(E1_m);
      if (xm >= PAD.L && xm <= PAD.L + PW) {
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(xm, PAD.T); ctx.lineTo(xm, PAD.T + PH); ctx.stroke();
        ctx.setLineDash([]);

        // Flecha / Puntero superior
        ctx.beginPath();
        ctx.moveTo(xm, PAD.T);
        ctx.lineTo(xm - 5, PAD.T - 8); ctx.lineTo(xm + 5, PAD.T - 8);
        ctx.closePath();
        ctx.fillStyle = '#38bdf8'; ctx.fill();

        const elClosest = Physics.closestElement(M2_marker);
        ctx.font = 'bold 9.5px JetBrains Mono, monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText(`M₂=${M2_marker.toFixed(0)}u (${elClosest.sym}) ➔ E₁=${E1_m.toFixed(3)} MeV`, xm, PAD.T - 12);
        ctx.textAlign = 'left';
      }
    }

    // ── 6. TOOLTIP FLOTANTE ENRIQUECIDO ──
    if (hoveredPeak) {
      const pp = peakPositions.find(p => p.sym === hoveredPeak);
      if (pp && pp.peak.Ni > 0.001) drawTooltip(pp);
    }

    drawAxes();
  }

  function drawTooltip(pp) {
    const p = pp.peak;
    const EL_NAMES = { C: 'Carbono', Si: 'Silicio', Fe: 'Hierro', Ag: 'Plata', Au: 'Oro' };
    const elName = p.name || EL_NAMES[p.sym] || p.sym;
    const ratioC = (p.xs / 36).toFixed(1); // ratio de sección eficaz frente a Carbono (Z=6 -> Z²=36)
    const lines = [
      `${elName} (${p.sym}) — Z₂ = ${p.Z2},  M₂ = ${p.M2} u`,
      `Factor K:         ${p.K.toFixed(4)}`,
      `Energía peak E₁:  ${p.E1.toFixed(4)} MeV`,
      `Sección eficaz:   σ ∝ Z₂² = ${p.xs}  (×${ratioC} vs C)`,
      `Concentración N:  ${Math.round(p.Ni * 100)} %`,
      `Rendimiento peak: ${(p.hNorm * 100).toFixed(1)} % del máximo`
    ];

    const pad = 12, lh = 17, tw = 252, th = lines.length * lh + pad * 2 - 2;
    let tx = pp.xp + 16;
    let ty = pp.yp - th / 2;
    if (tx + tw > W - 10) tx = pp.xp - tw - 16;
    ty = Math.max(PAD.T, Math.min(H - th - 8, ty));

    // Caja con efecto Dark Tech Glass
    ctx.save();
    ctx.fillStyle   = 'rgba(4, 8, 20, 0.96)';
    ctx.strokeStyle = p.color;
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.roundRect(tx, ty, tw, th, 6);
    ctx.fill();
    ctx.stroke();

    // Barra lateral de color
    ctx.fillStyle = p.color;
    ctx.fillRect(tx, ty, 4, th);

    ctx.textAlign = 'left';
    ctx.font      = 'bold 11.5px Inter, sans-serif';
    ctx.fillStyle = p.color;
    ctx.fillText(lines[0], tx + pad + 2, ty + pad + 10);

    ctx.font      = '9.5px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(215, 230, 250, 0.90)';
    for (let i = 1; i < lines.length; i++) {
      ctx.fillText(lines[i], tx + pad + 2, ty + pad + 10 + i * lh);
    }
    ctx.restore();
  }

  function drawAxes() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.20)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD.L, PAD.T + PH + 1); ctx.lineTo(PAD.L + PW, PAD.T + PH + 1); ctx.stroke();

    // Eje X: Energía E₁
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(180, 200, 220, 0.70)';
    for (let e = 0.0; e <= 2.1; e += 0.25) {
      const xp = eToX(e);
      ctx.beginPath(); ctx.moveTo(xp, PAD.T + PH); ctx.lineTo(xp, PAD.T + PH + 5); ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillText(e.toFixed(2), xp, PAD.T + PH + 18);
    }

    ctx.textAlign = 'center';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(200, 220, 240, 0.75)';
    ctx.fillText('Energía del proyectil retrodispersado  E₁  (MeV)', PAD.L + PW / 2, H - 6);

    // Eje Y: Intensidad
    ctx.save();
    ctx.translate(14, PAD.T + PH / 2); ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center'; ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(200, 220, 240, 0.75)';
    ctx.fillText('Intensidad / Cuentas  (∝ Z₂² · Nᵢ)', 0, 0);
    ctx.restore();

    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(160, 180, 200, 0.55)'; ctx.textAlign = 'left';
    for (let i = 0; i <= 4; i++) {
      const yg = PAD.T + PH * (1 - i / 4);
      ctx.fillText((i * 25) + '%', PAD.L - 32, yg + 4);
      ctx.beginPath(); ctx.moveTo(PAD.L - 4, yg); ctx.lineTo(PAD.L, yg); ctx.stroke();
    }
  }

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mx   = (e.clientX - rect.left) * (W / rect.width);
    const my   = (e.clientY - rect.top)  * (H / rect.height);
    const HIT  = 26;
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
        '</b><span style="color:var(--muted);font-size:0.71rem">(Z₂=' + el.Z2 + ')</span>';

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
