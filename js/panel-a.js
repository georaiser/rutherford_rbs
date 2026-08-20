/**
 * panel-a.js -- Panel A: Dispersion de Rutherford
 *
 * Trayectorias hiperbolicas calculadas con integracion RK4 en tiempo real.
 * Modo Rutherford: modelo planetario (1911). Modo Thomson: esfera difusa (1904).
 *
 * Mejoras v2 (19-ago-2026):
 *   - Slider Z2 (elemento blanco, Z=10-92): demuestra que a0 proporcional a Z2
 *   - Trazas acumuladas (offscreen canvas): visualiza distribucion estadistica del haz
 *   - Pausa / paso unico: permite analizar trayectorias individualmente cuadro a cuadro
 *
 * Depende de: constants.js, physics.js
 */
'use strict';

const panelA = (() => {

  const canvas = document.getElementById('canvasA');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // Offscreen canvas para trazas acumuladas
  const traceCanvas = document.createElement('canvas');
  traceCanvas.width = W; traceCanvas.height = H;
  const traceCtx = traceCanvas.getContext('2d');

  // Estado
  let mode       = 'rutherford';
  let E_mev      = 7.0;
  let Z2         = 79;
  let paused     = false;
  let showTraces = false;

  // Elementos conocidos para etiquetas
  const KNOWN_EL = {
    10:'Ne',13:'Al',14:'Si',18:'Ar',20:'Ca',22:'Ti',
    24:'Cr',26:'Fe',29:'Cu',30:'Zn',35:'Br',47:'Ag',
    50:'Sn',74:'W', 78:'Pt',79:'Au',82:'Pb',83:'Bi',92:'U'
  };
  function elemLabel(Z) {
    return KNOWN_EL[Z] ? (KNOWN_EL[Z] + '  (Z=' + Z + ')') : ('Z = ' + Z);
  }

  // Parámetros de impacto como múltiplos de a₀: garantiza rango angular relevante
  // para cualquier Z₂ y E. Calculados en recompute() a partir de a₀ actual.
  const B_A0_MULT = [0.30, 0.72, 1.60, 3.38, 5.86, 9.55]; // b / a₀
  let   B_PHYS_FM = [5, 12, 26, 55, 95, 155];              // actualizado en recompute()
  const B_COLORS  = ['#ef4444','#f97316','#facc15','#4ade80','#38bdf8','#a78bfa'];

  const NUC_X   = W * 0.44;
  const NUC_Y   = H * 0.50;
  const R_START = 32;
  const SCALE   = NUC_X / (R_START + 2);

  let trajs  = [];
  let phases = [];
  const SPEED = 0.006;

  let atomImg = null;
  let imgLoaded = false;
  let thomsonParts = [];

  function genThomsonParts(z2) {
    thomsonParts = [];
    // Escalar con Z2 para coherencia visual: mostrar hasta 40 electrones y Z2 protones
    // (cap para no saturar la visualización con elementos pesados)
    const nP = Math.min(z2, 36);   // protones mostrados (representativo)
    const nE = Math.min(z2, 48);   // electrones mostrados
    for (let i = 0; i < nE + nP; i++) {
      let x, y, maxR = i < nE ? 0.94 : 0.88;
      do { x = (Math.random() - 0.5) * 2; y = (Math.random() - 0.5) * 2; }
      while (x * x + y * y > maxR * maxR);
      thomsonParts.push({ x, y, type: i < nE ? 'e' : 'p' });
    }
  }

  function toCan(x, y) { return [NUC_X + x * SCALE, NUC_Y - y * SCALE]; }

  function drawPath(pts, color, alpha) {
    if (pts.length < 2) return;
    ctx.beginPath();
    const [x0, y0] = toCan(pts[0][0], pts[0][1]);
    ctx.moveTo(x0, y0);
    for (let i = 1; i < pts.length; i++) {
      const [cx, cy] = toCan(pts[i][0], pts[i][1]);
      ctx.lineTo(cx, cy);
    }
    ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = 1.3;
    ctx.stroke(); ctx.globalAlpha = 1;
  }

  function drawDot(x, y, color, r) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.5);
    g.addColorStop(0, color + 'bb'); g.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(x, y, r * 3.5, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
  }

  function recompute() {
    const a0     = Physics.calcA0(E_mev, Z2);
    B_PHYS_FM    = B_A0_MULT.map(m => parseFloat((m * a0).toFixed(1)));
    const R_norm = PHYS.R_AU_FM / a0;
    const isR    = mode === 'rutherford';
    trajs  = B_PHYS_FM.map(b_fm => Physics.integrateTraj(b_fm / a0, isR, R_norm, R_START));
    phases = B_PHYS_FM.map((_, i) => -i * 0.14);
    document.getElementById('val-a0').textContent      = a0.toFixed(1);
    document.getElementById('val-theta-a').textContent = trajs[0].thetaDeg.toFixed(0) + '\u00b0';
    const thMax = Physics.thetaThomsonMax_deg(a0);
    document.getElementById('val-thom-max').textContent = (thMax * 1000).toFixed(2) + ' \u00d7 10\u207b\u00b3';
    const lbl = document.getElementById('val-Z2-label');
    if (lbl) lbl.textContent = elemLabel(Z2);
  }

  function drawExperimentInset() {
    const IX = 12, IY = 10, IW = 170, IH = 72;
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = 'rgba(5,10,20,0.7)';
    ctx.beginPath(); ctx.roundRect(IX, IY, IW, IH, 5); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.stroke();
    const SX = IX + 18, SY = IY + IH / 2;
    ctx.fillStyle = '#dc2626'; ctx.fillRect(SX - 7, SY - 7, 14, 14);
    ctx.fillStyle = 'rgba(220,38,38,0.3)'; ctx.fillRect(SX - 11, SY - 11, 22, 22);
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '8px Inter,sans-serif';
    ctx.textAlign = 'center'; ctx.fillText('Ra', SX, SY + 20);
    const FX1 = SX + 14, FX2 = IX + 82;
    ctx.strokeStyle = '#f87171'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(FX1, SY); ctx.lineTo(FX2 - 5, SY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(FX2 - 5, SY - 3); ctx.lineTo(FX2, SY); ctx.lineTo(FX2 - 5, SY + 3); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '7px Inter,sans-serif';
    ctx.fillText('\u03b1', (FX1 + FX2) / 2, SY - 5);
    const LX = IX + 84;
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(LX, IY + 12); ctx.lineTo(LX, IY + IH - 12); ctx.stroke();
    ctx.fillStyle = '#fbbf24'; ctx.font = '7px Inter,sans-serif'; ctx.fillText('Au', LX + 3, IY + 11);
    const DY = SY;
    ctx.strokeStyle = 'rgba(74,222,128,0.6)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(LX + 2, DY, 40, -Math.PI * 0.55, Math.PI * 0.55); ctx.stroke();
    ctx.fillStyle = 'rgba(74,222,128,0.5)'; ctx.font = '7px Inter,sans-serif';
    ctx.fillText('ZnS', IX + 150, DY);
    const scatAngles = [-0.38, -0.16, 0, 0.20, 0.44];
    scatAngles.forEach((a, i) => {
      const intensity = i === 2 ? 0.8 : (i === 1 || i === 3 ? 0.55 : 0.3);
      ctx.globalAlpha = 0.55 * intensity;
      ctx.strokeStyle = '#f87171'; ctx.lineWidth = 1;
      const ex = LX + 40 * Math.cos(a), ey = DY + 40 * Math.sin(a);
      ctx.beginPath(); ctx.moveTo(LX + 3, DY); ctx.lineTo(ex, ey); ctx.stroke();
    });
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.font = '8px Inter,sans-serif';
    ctx.textAlign = 'center'; ctx.fillText('Geiger-Marsden, 1911', IX + IW / 2, IY + IH - 4);
    ctx.globalAlpha = 1; ctx.textAlign = 'left';
  }

  function drawAtomicModelInset() {
    const IW = 130, IH = 130;
    const IX = W - IW - 8, IY = H - IH - 8;
    ctx.fillStyle = 'rgba(4,6,14,0.85)';
    ctx.beginPath(); ctx.roundRect(IX - 4, IY - 18, IW + 8, IH + 26, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.font = 'bold 8px Inter,sans-serif';
    ctx.fillStyle = 'rgba(255,200,80,0.80)';
    ctx.textAlign = 'center';
    ctx.fillText('Modelo at\u00f3mico de Rutherford', IX + IW / 2, IY - 5);
    if (imgLoaded && atomImg) {
      ctx.save(); ctx.beginPath(); ctx.roundRect(IX, IY, IW, IH, 5); ctx.clip();
      ctx.drawImage(atomImg, IX, IY, IW, IH); ctx.restore();
    } else {
      ctx.fillStyle = 'rgba(20,20,40,0.8)'; ctx.fillRect(IX, IY, IW, IH);
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '10px Inter,sans-serif';
      ctx.fillText('cargando...', IX + IW/2, IY + IH/2);
    }
    ctx.font = '7.5px Inter,sans-serif'; ctx.fillStyle = 'rgba(248,113,113,0.75)';
    ctx.textAlign = 'center';
    ctx.fillText('\u26a0 e\u207b orbitan: inestables cl\u00e1sicamente', IX + IW / 2, IY + IH + 9);
    ctx.textAlign = 'left';
  }

  function drawRutherford() {
    const bg = ctx.createRadialGradient(NUC_X, NUC_Y, 0, NUC_X, NUC_Y, W * 0.42);
    bg.addColorStop(0, 'rgba(232,168,51,0.05)'); bg.addColorStop(1, 'transparent');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    if (showTraces) { ctx.globalAlpha = 0.50; ctx.drawImage(traceCanvas, 0, 0); ctx.globalAlpha = 1; }

    for (let i = 0; i < trajs.length; i++) {
      const { pts } = trajs[i];
      drawPath(pts, B_COLORS[i], 0.28);
      drawPath(pts.map(([x, y]) => [x, -y]), B_COLORS[i], 0.28);
    }

    for (let i = 0; i < trajs.length; i++) {
      const { pts } = trajs[i];
      const t   = ((phases[i] % 1) + 1) % 1;
      const idx = Math.min(Math.floor(t * pts.length), pts.length - 1);
      const [px, py] = pts[idx];
      const [cx1, cy1] = toCan(px,  py);
      const [cx2, cy2] = toCan(px, -py);
      drawDot(cx1, cy1, B_COLORS[i], 4);
      drawDot(cx2, cy2, B_COLORS[i], 4);
      if (showTraces) {
        traceCtx.globalAlpha = 0.06; traceCtx.fillStyle = B_COLORS[i];
        traceCtx.beginPath(); traceCtx.arc(cx1, cy1, 2.5, 0, Math.PI * 2); traceCtx.fill();
        traceCtx.beginPath(); traceCtx.arc(cx2, cy2, 2.5, 0, Math.PI * 2); traceCtx.fill();
        traceCtx.globalAlpha = 1;
      }
    }

    const [nx, ny] = toCan(0, 0);
    const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, 22);
    ng.addColorStop(0, 'rgba(255,200,80,0.55)'); ng.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(nx, ny, 22, 0, Math.PI * 2); ctx.fillStyle = ng; ctx.fill();
    ctx.beginPath(); ctx.arc(nx, ny, 5.5, 0, Math.PI * 2); ctx.fillStyle = '#fbbf24'; ctx.fill();
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(232,168,51,0.75)';
    ctx.fillText('n\u00facleo ' + elemLabel(Z2), nx + 8, ny - 14);
    ctx.fillStyle = 'rgba(170,200,255,0.55)';
    ctx.fillText('\u2192 haz de part\u00edculas \u03b1', 10, H / 2 - 60);

    const a0  = Physics.calcA0(E_mev, Z2);
    const sc5 = SCALE * 5, sx = 195, sy = H - 14;
    ctx.strokeStyle = 'rgba(255,255,255,0.30)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + sc5, sy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx, sy-4); ctx.lineTo(sx, sy+4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx+sc5, sy-4); ctx.lineTo(sx+sc5, sy+4); ctx.stroke();
    ctx.font = '10px JetBrains Mono, monospace'; ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.textAlign = 'center';
    ctx.fillText('5a\u2080 = ' + (5 * a0).toFixed(0) + ' fm  |  b < 2a\u2080 \u21d2 \u03b8 > 45\u00b0  |  b \u226b a\u2080: sin desvio', sx + sc5 / 2, sy - 6);
    ctx.textAlign = 'left';

    let ly = 14;
    ctx.font = '10px JetBrains Mono, monospace';
    for (let i = 0; i < B_PHYS_FM.length; i++) {
      ctx.fillStyle = B_COLORS[i]; ctx.fillRect(W - 160, ly, 10, 10);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      const bRatio = (B_PHYS_FM[i] / Physics.calcA0(E_mev, Z2)).toFixed(2);
      ctx.fillText('b=' + B_PHYS_FM[i] + ' fm (' + bRatio + 'a\u2080)  \u03b8=' + trajs[i].thetaDeg.toFixed(0) + '\u00b0', W - 186, ly + 9);
      ly += 15;
    }

    drawAtomicModelInset();
    drawExperimentInset();
  }

  function drawThomson() {
    const Rpx = H * 0.41;
    const ax = NUC_X, ay = NUC_Y;
    const bg = ctx.createRadialGradient(ax, ay, 0, ax, ay, W * 0.45);
    bg.addColorStop(0, 'rgba(200,80,10,0.04)'); bg.addColorStop(1, 'transparent');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const ag = ctx.createRadialGradient(ax, ay, 0, ax, ay, Rpx);
    ag.addColorStop(0,'rgba(220,100,15,0.40)'); ag.addColorStop(0.45,'rgba(210,90,12,0.28)');
    ag.addColorStop(0.78,'rgba(190,70,8,0.14)'); ag.addColorStop(1,'rgba(170,55,4,0.03)');
    ctx.beginPath(); ctx.arc(ax, ay, Rpx, 0, Math.PI * 2);
    ctx.fillStyle = ag; ctx.fill();
    ctx.strokeStyle = 'rgba(230,130,30,0.40)'; ctx.lineWidth = 1.5; ctx.stroke();
    thomsonParts.forEach(p => {
      const ex = ax + p.x * Rpx * 0.92, ey = ay + p.y * Rpx * 0.92;
      if (p.type === 'e') {
        const ge = ctx.createRadialGradient(ex, ey, 0, ex, ey, 5);
        ge.addColorStop(0, 'rgba(56,189,248,0.5)'); ge.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fillStyle = ge; ctx.fill();
        ctx.beginPath(); ctx.arc(ex, ey, 2, 0, Math.PI * 2); ctx.fillStyle = '#93c5fd'; ctx.fill();
      } else {
        const gp = ctx.createRadialGradient(ex, ey, 0, ex, ey, 5);
        gp.addColorStop(0, 'rgba(248,113,113,0.5)'); gp.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fillStyle = gp; ctx.fill();
        ctx.beginPath(); ctx.arc(ex, ey, 2, 0, Math.PI * 2); ctx.fillStyle = '#fca5a5'; ctx.fill();
      }
    });
    ctx.textAlign = 'left'; ctx.font = '9px Inter,sans-serif';
    ctx.beginPath(); ctx.arc(ax+Rpx+18, ay-30, 4, 0, Math.PI*2); ctx.fillStyle='#93c5fd'; ctx.fill();
    ctx.fillStyle='rgba(147,197,253,0.75)'; ctx.fillText('electr\u00f3n (e\u207b)', ax+Rpx+26, ay-26);
    ctx.beginPath(); ctx.arc(ax+Rpx+18, ay-12, 4, 0, Math.PI*2); ctx.fillStyle='#fca5a5'; ctx.fill();
    ctx.fillStyle='rgba(252,165,165,0.75)'; ctx.fillText('carga + distribuida', ax+Rpx+26, ay-8);
    ctx.font='11px Inter,sans-serif'; ctx.fillStyle='rgba(230,130,30,0.70)';
    ctx.textAlign='center';
    ctx.fillText('\u00e1tomo ' + elemLabel(Z2) + ' \u2014 radio \u2248 1.45 \u212b', ax, ay-Rpx-10);
    const a0 = Physics.calcA0(E_mev, Z2);
    const R_nm = PHYS.R_AU_FM / a0;
    const bFs = [0.15,0.35,0.55,0.72,0.88,1.20];
    for (let i = 0; i < bFs.length; i++) {
      const bf=bFs[i], b_px=bf*Rpx, color=bf<1?B_COLORS[i]:'#607080';
      const b_norm_v=bf*R_nm, theta_th=Physics.calcThetaThomson(b_norm_v,R_nm);
      const delta_px=W*Math.sin(theta_th);
      for (const sign of [1,-1]) {
        const y0=ay-sign*b_px;
        ctx.beginPath(); ctx.moveTo(0,y0); ctx.lineTo(W,y0-sign*delta_px);
        ctx.globalAlpha=0.55; ctx.strokeStyle=color;
        ctx.lineWidth=bf<1?1.5:1; ctx.stroke(); ctx.globalAlpha=1;
      }
    }
    ctx.beginPath(); ctx.arc(ax,ay,2.5,0,Math.PI*2); ctx.fillStyle='#fbbf24'; ctx.fill();
    ctx.font='10px Inter,sans-serif'; ctx.fillStyle='rgba(232,168,51,0.75)';
    ctx.textAlign='center'; ctx.fillText('n\u00facleo (punto sub-p\u00edxel)', ax, ay+Rpx+16);
    ctx.strokeStyle='rgba(255,255,255,0.25)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(W-10-Rpx,H-20); ctx.lineTo(W-10,H-20); ctx.stroke();
    ctx.font='10px JetBrains Mono,monospace'; ctx.fillStyle='rgba(255,255,255,0.4)';
    ctx.textAlign='right'; ctx.fillText('1.45 \u212b \u2190 radio at\u00f3mico',W-10,H-4);
    const thMaxDeg=Physics.thetaThomsonMax_deg(a0);
    ctx.font='11px Inter,sans-serif'; ctx.fillStyle='rgba(200,200,255,0.50)';
    ctx.textAlign='left';
    ctx.fillText('\u03b8\u2098\u2090\u02e3 Thomson = '+(thMaxDeg*1000).toFixed(2)+' \u00d7 10\u207b\u00b3 \u00b0 \u2014 sub-p\u00edxel a esta escala',14,H-10);
    drawExperimentInset();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (mode === 'rutherford') drawRutherford();
    else                       drawThomson();
  }

  function tick() {
    if (!paused && mode === 'rutherford') {
      for (let i = 0; i < phases.length; i++) phases[i] = (phases[i] + SPEED + 1) % 1;
    }
    draw();
  }

  function clearTraceCanvas() { traceCtx.clearRect(0, 0, W, H); }

  // API publica
  function setMode(m) {
    mode = m;
    document.getElementById('btnRuth').classList.toggle('active', m === 'rutherford');
    document.getElementById('btnThom').classList.toggle('active', m === 'thomson');
    document.getElementById('formulaA').style.display    = m === 'rutherford' ? '' : 'none';
    document.getElementById('formulaThom').style.display = m === 'thomson'    ? '' : 'none';
    const isR = m === 'rutherford';
    document.getElementById('descA-ruth').style.display = isR ? '' : 'none';
    document.getElementById('descA-thom').style.display = isR ? 'none' : '';
    document.getElementById('noteA-ruth').style.display = isR ? '' : 'none';
    document.getElementById('noteA-thom').style.display = isR ? 'none' : '';
    const rowZ    = document.getElementById('rowZ2');
    const rowCtrl = document.getElementById('rowCtrlA');
    if (rowZ)    rowZ.style.display    = isR ? '' : 'none';
    if (rowCtrl) rowCtrl.style.display = isR ? '' : 'none';
    recompute(); clearTraceCanvas();
    if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise();
  }

  function setEnergy(E)    { E_mev = E; recompute(); clearTraceCanvas(); }
  function setZ2(z)        { Z2 = Math.max(1, Math.min(92, Math.round(z))); genThomsonParts(Z2); recompute(); clearTraceCanvas(); }
  function toggleTraces(c) { showTraces = !!c; if (!showTraces) clearTraceCanvas(); }

  function togglePause() {
    paused = !paused;
    const btn = document.getElementById('btnPauseA');
    if (btn) btn.textContent = paused ? '\u25b6 Continuar' : '\u23f8 Pausa';
  }

  function step() {
    for (let i = 0; i < phases.length; i++) phases[i] = (phases[i] + SPEED * 10 + 1) % 1;
    draw();
  }

  function init() {
    genThomsonParts(Z2);
    atomImg = new Image();
    atomImg.onload  = () => { imgLoaded = true; };
    atomImg.onerror = () => { imgLoaded = false; };
    atomImg.src = 'img/rutherford_atom.png';
    recompute();

    document.getElementById('sliderE').addEventListener('input', function () {
      setEnergy(parseFloat(this.value));
      document.getElementById('valE').textContent = parseFloat(this.value).toFixed(1) + ' MeV';
    });

    const sliderZ = document.getElementById('sliderZ2');
    if (sliderZ) sliderZ.addEventListener('input', function () {
      setZ2(parseInt(this.value));
      document.getElementById('valZ2').textContent = 'Z = ' + this.value;
    });

    const checkTr = document.getElementById('checkTracesA');
    if (checkTr) checkTr.addEventListener('change', function () { toggleTraces(this.checked); });

    const btnPause = document.getElementById('btnPauseA');
    if (btnPause) btnPause.addEventListener('click', togglePause);

    const btnStep = document.getElementById('btnStepA');
    if (btnStep) btnStep.addEventListener('click', step);
  }

  return { init, tick, setMode, setEnergy, setZ2, togglePause, step, clearTraces: clearTraceCanvas };

})();