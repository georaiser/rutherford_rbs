/**
 * panelC.js — Panel C: Espectro RBS (interactivo)
 *
 * Interactividad implementada:
 *   1. Sliders de concentracion N_i por elemento — altura = Z2^2 * N_i (fisica real)
 *   2. Hover sobre picos: tooltip con K, E1, Z2, Z2^2, N_i, altura relativa
 *   3. Click en pico: resalta / deselecciona el elemento
 *
 * Formula completa de conteo RBS:
 *   A_i = Q * N_i * (dsigma/dOmega)_i * deltaOmega  prop  N_i * Z2^2
 * Fuente: Chu, Mayer & Nicolet (1978) ec. 4.1
 *
 * Depende de: constants.js, physics.js
 */
'use strict';

const panelC = (() => {

  const canvas = document.getElementById('canvasC');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  const PAD = { L: 62, R: 22, T: 30, B: 54 };
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
    const sigma = PHYS.SIGMA_SPEC;
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

    ctx.fillStyle = 'rgba(255,255,255,0.018)';
    ctx.fillRect(PAD.L, PAD.T, PW, PH);

    ctx.strokeStyle = 'rgba(255,255,255,0.055)'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const yg = PAD.T + PH * i / 4;
      ctx.beginPath(); ctx.moveTo(PAD.L, yg); ctx.lineTo(PAD.L + PW, yg); ctx.stroke();
    }

    const N  = 600;
    const sp = [];
    for (let i = 0; i <= N; i++) {
      const e = E_MIN + (E_MAX - E_MIN) * i / N;
      let val = 0;
      for (const p of peaks) {
        if (p.hNorm > 0.001) val += gauss(e, p.E1, p.hNorm);
      }
      sp.push([eToX(e), PAD.T + PH - val * PH * 0.88]);
    }

    ctx.beginPath();
    ctx.moveTo(sp[0][0], sp[0][1]);
    for (let i = 1; i < sp.length; i++) ctx.lineTo(sp[i][0], sp[i][1]);
    ctx.lineTo(PAD.L + PW, PAD.T + PH);
    ctx.lineTo(PAD.L, PAD.T + PH);
    ctx.closePath();
    const sg = ctx.createLinearGradient(0, PAD.T, 0, PAD.T + PH);
    sg.addColorStop(0, 'rgba(232,168,51,0.50)');
    sg.addColorStop(1, 'rgba(232,168,51,0.04)');
    ctx.fillStyle = sg; ctx.fill();

    ctx.beginPath();
    ctx.moveTo(sp[0][0], sp[0][1]);
    for (let i = 1; i < sp.length; i++) ctx.lineTo(sp[i][0], sp[i][1]);
    ctx.strokeStyle = 'rgba(232,168,51,0.9)'; ctx.lineWidth = 1.6; ctx.stroke();

    ctx.textAlign = 'center';
    for (const p of peaks) {
      const xp     = eToX(p.E1);
      const yp     = PAD.T + PH - p.hNorm * PH * 0.88;
      const isHov  = hoveredPeak  === p.sym;
      const isSel  = selectedPeak === p.sym;
      const active = isHov || isSel;

      peakPositions.push({ sym: p.sym, xp, yp, peak: p });
      if (p.Ni < 0.001) continue;

      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = active ? p.color + 'cc' : p.color + '44';
      ctx.lineWidth   = active ? 1.5 : 1;
      ctx.beginPath(); ctx.moveTo(xp, PAD.T + PH); ctx.lineTo(xp, yp - 4); ctx.stroke();
      ctx.setLineDash([]);

      const dotR = active ? 5.5 : 3.5;
      if (active) {
        const g = ctx.createRadialGradient(xp, yp, 0, xp, yp, dotR * 3);
        g.addColorStop(0, p.color + '88'); g.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(xp, yp, dotR * 3, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(xp, yp, dotR, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.fill();

      ctx.font = 'bold ' + (active ? 13 : 11) + 'px Inter, sans-serif';
      ctx.fillStyle = p.color;
      ctx.fillText(p.sym, xp, yp - 12);

      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillStyle = p.color + 'aa';
      ctx.fillText(p.E1.toFixed(3) + ' MeV', xp, yp - 24);

      ctx.fillStyle = 'rgba(160,180,200,0.45)';
      ctx.fillText('Z2^2=' + p.xs, xp, PAD.T + PH + 18);
      ctx.fillStyle = p.Ni < 0.05 ? 'rgba(230,100,100,0.75)' : 'rgba(160,180,200,0.45)';
      ctx.fillText('N=' + Math.round(p.Ni * 100) + '%', xp, PAD.T + PH + 30);
    }
    ctx.textAlign = 'left';

    const K_m = Physics.calcK(M2_marker, PHYS.THETA_DET);
    if (K_m !== null) {
      const E1_m = K_m * PHYS.E0_RBS;
      const xm   = eToX(E1_m);
      if (xm >= PAD.L && xm <= PAD.L + PW) {
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(100,200,255,0.8)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(xm, PAD.T); ctx.lineTo(xm, PAD.T + PH); ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(xm, PAD.T);
        ctx.lineTo(xm - 6, PAD.T - 9); ctx.lineTo(xm + 6, PAD.T - 9);
        ctx.closePath(); ctx.fillStyle = 'rgba(100,200,255,0.85)'; ctx.fill();
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(100,200,255,0.9)';
        ctx.textAlign = 'center';
        ctx.fillText('M2=' + M2_marker.toFixed(0) + ' u -> E1=' + E1_m.toFixed(3) + ' MeV', xm, PAD.T - 13);
        ctx.textAlign = 'left';
      }
    }

    if (hoveredPeak) {
      const pp = peakPositions.find(p => p.sym === hoveredPeak);
      if (pp && pp.peak.Ni > 0.001) drawTooltip(pp);
    }
    drawAxes();
  }

  function drawTooltip(pp) {
    const p = pp.peak;
    const lines = [
      p.sym + '  (Z2 = ' + p.Z2 + ',  M2 = ' + p.M2 + ' u)',
      'K  =  ' + p.K.toFixed(4),
      'E1 =  ' + p.E1.toFixed(4) + ' MeV',
      'Seccion eficaz:  Z2^2 = ' + p.xs,
      'Concentracion:   N = ' + Math.round(p.Ni * 100) + ' %',
      'Altura relativa: ' + (p.hNorm * 100).toFixed(1) + ' %',
    ];
    const pad = 10, lh = 16, tw = 218, th = lines.length * lh + pad * 2;
    let tx = pp.xp + 16;
    let ty = pp.yp - th / 2;
    if (tx + tw > W - 8) tx = pp.xp - tw - 16;
    ty = Math.max(PAD.T, Math.min(H - th - 6, ty));

    ctx.fillStyle   = 'rgba(7,14,26,0.97)';
    ctx.strokeStyle = p.color + 'cc';
    ctx.lineWidth   = 1.2;
    ctx.beginPath();
    ctx.roundRect(tx, ty, tw, th, 6);
    ctx.fill(); ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font      = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = p.color;
    ctx.fillText(lines[0], tx + pad, ty + pad + 11);
    ctx.font      = '10px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(200,220,240,0.88)';
    for (let i = 1; i < lines.length; i++) {
      ctx.fillText(lines[i], tx + pad, ty + pad + 11 + i * lh);
    }
  }

  function drawAxes() {
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD.L, PAD.T + PH + 1); ctx.lineTo(PAD.L + PW, PAD.T + PH + 1); ctx.stroke();
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(180,200,220,0.65)';
    for (let e = 0.0; e <= 2.1; e += 0.25) {
      const xp = eToX(e);
      ctx.beginPath(); ctx.moveTo(xp, PAD.T + PH); ctx.lineTo(xp, PAD.T + PH + 5); ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillText(e.toFixed(2), xp, PAD.T + PH + 18);
    }
    ctx.textAlign = 'center';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(200,220,240,0.7)';
    ctx.fillText('Energia del proyectil retrodispersado  E1  (MeV)', PAD.L + PW / 2, H - 6);
    ctx.save();
    ctx.translate(14, PAD.T + PH / 2); ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center'; ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(200,220,240,0.7)';
    ctx.fillText('Intensidad  (prop. Z2^2 * N_i, u.a.)', 0, 0);
    ctx.restore();
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(160,180,200,0.5)'; ctx.textAlign = 'left';
    for (let i = 0; i <= 4; i++) {
      const yg = PAD.T + PH * (1 - i / 4);
      ctx.fillText((i * 25) + '%', PAD.L - 30, yg + 4);
      ctx.beginPath(); ctx.moveTo(PAD.L - 4, yg); ctx.lineTo(PAD.L, yg); ctx.stroke();
    }
  }

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mx   = (e.clientX - rect.left) * (W / rect.width);
    const my   = (e.clientY - rect.top)  * (H / rect.height);
    const HIT  = 28;
    let found  = null;
    for (const pp of peakPositions) {
      if (pp.peak.Ni > 0.001 && Math.abs(mx - pp.xp) < HIT && my > PAD.T && my < pp.yp + 20) {
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
    const HIT  = 28;
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
      label.style.cssText = 'display:flex;align-items:center;gap:6px;width:124px;flex-shrink:0';
      label.innerHTML =
        '<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:' +
        el.color + ';flex-shrink:0"></span><b style="color:' + el.color + '">' + el.sym +
        '</b><span style="color:var(--muted);font-size:0.71rem">(Z2=' + el.Z2 + ')</span>';

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
