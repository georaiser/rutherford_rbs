/**
 * panelC.js — Panel C: Espectro RBS
 *
 * Dibuja el espectro de energía con:
 *   - Posiciones de picos: calculadas con K(M₂, θ) para cada elemento
 *   - Alturas de picos: proporcionales a Z₂² (sección eficaz de Rutherford real)
 *   - Picos: gaussianas con σ = PHYS.SIGMA_SPEC (resolución del detector)
 *   - Marcador azul: sincronizado con el slider M₂ del Panel B
 *
 * La física de las alturas es REAL, no ilustrativa.
 * La sección eficaz diferencial de Rutherford ∝ Z₂² (θ y E₀ fijos).
 *
 * Depende de: constants.js, physics.js
 */
'use strict';

const panelC = (() => {

  // ── Canvas ──
  const canvas = document.getElementById('canvasC');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width;   // 800
  const H = canvas.height;  // 280

  // ── Márgenes del área de gráfico ──
  const PAD = { L: 62, R: 22, T: 26, B: 54 };
  const PW  = W - PAD.L - PAD.R; // ancho del área de plot
  const PH  = H - PAD.T - PAD.B; // alto del área de plot

  // Rango del eje X (energía E₁ en MeV)
  const E_MIN = 0.0, E_MAX = 2.15;

  // Referencia al M₂ actual (sincronizado desde Panel B)
  let M2_marker = 197;

  // ── Conversión energía → posición X en canvas ──
  function eToX(e) {
    return PAD.L + (e - E_MIN) / (E_MAX - E_MIN) * PW;
  }

  // ── Gaussiana para cada pico (resolución del detector) ──
  function gauss(e, e_center, height) {
    const σ = PHYS.SIGMA_SPEC;
    return height * Math.exp(-0.5 * Math.pow((e - e_center) / σ, 2));
  }

  // ── Dibuja el espectro completo ──
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // ── Precalcular picos ──
    const peaks = ELEMENTS.map(el => {
      const K  = Physics.calcK(el.M2, PHYS.THETA_DET);
      const E1 = K !== null ? K * PHYS.E0_RBS : null;
      // Altura proporcional a Z₂² (sección eficaz real)
      const h  = Physics.relCrossSection(el.Z2);
      return { ...el, E1, h };
    }).filter(p => p.E1 !== null);

    // Normalizar alturas para que el pico más alto ocupe 88% del área
    const hMax = Math.max(...peaks.map(p => p.h));
    peaks.forEach(p => { p.hNorm = p.h / hMax; });

    // ── Fondo del área de gráfico ──
    ctx.fillStyle = 'rgba(255,255,255,0.018)';
    ctx.fillRect(PAD.L, PAD.T, PW, PH);

    // ── Grilla horizontal ──
    ctx.strokeStyle = 'rgba(255,255,255,0.055)'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const yg = PAD.T + PH * i / 4;
      ctx.beginPath(); ctx.moveTo(PAD.L, yg); ctx.lineTo(PAD.L + PW, yg); ctx.stroke();
    }

    // ── Espectro (suma de gaussianas) ──
    const N  = 600;
    const sp = [];
    for (let i = 0; i <= N; i++) {
      const e   = E_MIN + (E_MAX - E_MIN) * i / N;
      let val   = 0;
      for (const p of peaks) val += gauss(e, p.E1, p.hNorm);
      sp.push([eToX(e), PAD.T + PH - val * PH * 0.88]);
    }

    // Relleno degradado
    ctx.beginPath();
    ctx.moveTo(sp[0][0], sp[0][1]);
    for (let i = 1; i < sp.length; i++) ctx.lineTo(sp[i][0], sp[i][1]);
    ctx.lineTo(PAD.L + PW, PAD.T + PH);
    ctx.lineTo(PAD.L, PAD.T + PH);
    ctx.closePath();
    const sg = ctx.createLinearGradient(0, PAD.T, 0, PAD.T + PH);
    sg.addColorStop(0, 'rgba(232,168,51,0.55)');
    sg.addColorStop(1, 'rgba(232,168,51,0.04)');
    ctx.fillStyle = sg; ctx.fill();

    // Línea del espectro
    ctx.beginPath();
    ctx.moveTo(sp[0][0], sp[0][1]);
    for (let i = 1; i < sp.length; i++) ctx.lineTo(sp[i][0], sp[i][1]);
    ctx.strokeStyle = 'rgba(232,168,51,0.9)'; ctx.lineWidth = 1.6; ctx.stroke();

    // ── Etiquetas de cada pico ──
    ctx.textAlign = 'center';
    for (const p of peaks) {
      const xp = eToX(p.E1);
      const yp = PAD.T + PH - p.hNorm * PH * 0.88;

      // Línea punteada desde la base del pico
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = p.color + '55'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(xp, PAD.T + PH); ctx.lineTo(xp, yp - 4); ctx.stroke();
      ctx.setLineDash([]);

      // Punto en la cima
      ctx.beginPath(); ctx.arc(xp, yp, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.fill();

      // Símbolo del elemento
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillStyle = p.color;
      ctx.fillText(p.sym, xp, yp - 10);

      // Energía del pico (E₁)
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillStyle = p.color + 'aa';
      ctx.fillText(p.E1.toFixed(3) + ' MeV', xp, yp - 22);

      // Z₂² (sección eficaz relativa, debajo del eje)
      ctx.fillStyle = 'rgba(160,180,200,0.5)';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText('Z₂²=' + (p.Z2 * p.Z2), xp, PAD.T + PH + 28);
    }
    ctx.textAlign = 'left';

    // ── Marcador sincronizado con M₂ del Panel B ──
    const K_m = Physics.calcK(M2_marker, PHYS.THETA_DET);
    if (K_m !== null) {
      const E1_m = K_m * PHYS.E0_RBS;
      const xm   = eToX(E1_m);
      if (xm >= PAD.L && xm <= PAD.L + PW) {
        // Línea punteada vertical
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(100,200,255,0.8)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(xm, PAD.T); ctx.lineTo(xm, PAD.T + PH); ctx.stroke();
        ctx.setLineDash([]);

        // Triángulo indicador en la parte superior
        ctx.beginPath();
        ctx.moveTo(xm, PAD.T);
        ctx.lineTo(xm - 6, PAD.T - 9);
        ctx.lineTo(xm + 6, PAD.T - 9);
        ctx.closePath();
        ctx.fillStyle = 'rgba(100,200,255,0.85)'; ctx.fill();

        // Texto del marcador
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(100,200,255,0.9)';
        ctx.textAlign = 'center';
        ctx.fillText(
          'M₂=' + M2_marker.toFixed(0) + ' u → E₁=' + E1_m.toFixed(3) + ' MeV',
          xm, PAD.T - 13
        );
        ctx.textAlign = 'left';
      }
    }

    // ── Eje X ──
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD.L, PAD.T + PH + 1);
    ctx.lineTo(PAD.L + PW, PAD.T + PH + 1);
    ctx.stroke();

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(180,200,220,0.65)';
    for (let e = 0.0; e <= 2.1; e += 0.25) {
      const xp = eToX(e);
      ctx.beginPath(); ctx.moveTo(xp, PAD.T + PH); ctx.lineTo(xp, PAD.T + PH + 5); ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillText(e.toFixed(2), xp, PAD.T + PH + 18);
    }

    // Título eje X
    ctx.textAlign = 'center';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(200,220,240,0.7)';
    ctx.fillText(
      'Energía del proyectil retrodispersado  E₁  (MeV)',
      PAD.L + PW / 2, H - 6
    );

    // ── Eje Y ──
    ctx.save();
    ctx.translate(14, PAD.T + PH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(200,220,240,0.7)';
    ctx.fillText('Intensidad  (∝ Z₂² · N_i, u.a.)', 0, 0);
    ctx.restore();
    ctx.textAlign = 'left';

    // Ticks eje Y
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(160,180,200,0.5)';
    for (let i = 0; i <= 4; i++) {
      const yg   = PAD.T + PH * (1 - i / 4);
      const label = (i * 25) + '%';
      ctx.fillText(label, PAD.L - 30, yg + 4);
      ctx.beginPath(); ctx.moveTo(PAD.L - 4, yg); ctx.lineTo(PAD.L, yg); ctx.stroke();
    }
  }

  // ── API pública ──
  function setM2Marker(M2) {
    M2_marker = M2;
    draw();
  }

  function init() {
    draw();
  }

  return { init, draw, setM2Marker };

})();
