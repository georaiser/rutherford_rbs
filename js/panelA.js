/**
 * panelA.js — Panel A: Dispersión de Rutherford (versión enriquecida)
 *
 * Mejoras visuales inspiradas en la simulación PhET:
 *   - Modo Thomson: esfera naranja visible con electrones y protones embebidos
 *   - Modo Rutherford: electrones orbitando con órbitas punteadas
 *   - Mini-diagrama del setup experimental (fuente → lámina → detector)
 *   - Escala "~10⁻¹⁰ m (escala atómica)" en ambos modos
 *
 * Física: sin cambios. Trayectorias hiperbólicas con RK4. Deflexión Thomson
 * calculada con potencial de esfera uniforme (física real).
 *
 * Depende de: constants.js, physics.js
 */
'use strict';

const panelA = (() => {

  // ── Canvas ──
  const canvas = document.getElementById('canvasA');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width;   // 800
  const H = canvas.height;  // 330

  // ── Estado ──
  let mode  = 'rutherford';
  let E_mev = 7.0;

  // Parámetros de impacto físicos (fm) — fijos. Al variar E, a₀ cambia y
  // b_norm = b_fm/a₀ cambia → distintos ángulos. Física correcta.
  const B_PHYS_FM = [5, 12, 26, 55, 95, 155];
  const B_COLORS  = ['#ef4444','#f97316','#facc15','#4ade80','#38bdf8','#a78bfa'];

  // Núcleo en canvas
  const NUC_X   = W * 0.44;
  const NUC_Y   = H * 0.50;
  const R_START = 32;
  const SCALE   = NUC_X / (R_START + 2); // px/a₀

  // Trayectorias + fases de animación
  let trajs  = [];
  let phases = [];
  const SPEED = 0.006;

  // ── Electrones orbitantes (Rutherford) ──
  const ORB_R_A0   = [7.5, 14, 21];       // radios orbitales en a₀
  const ORB_OMEGA  = ORB_R_A0.map(r => 0.009 / Math.pow(r / 7, 1.5)); // ω ∝ 1/r^1.5
  let   ORB_ANGLE  = [0, Math.PI * 0.7, Math.PI * 1.35]; // fases iniciales

  // ── Partículas del modelo de Thomson (generadas una sola vez) ──
  let thomsonParts = []; // {x, y, type:'e'|'p'}

  function genThomsonParts() {
    thomsonParts = [];
    const N_ELECTRONS = 52, N_PROTONS = 22;
    for (let i = 0; i < N_ELECTRONS + N_PROTONS; i++) {
      let x, y, maxR = i < N_ELECTRONS ? 0.94 : 0.88;
      do { x = (Math.random() - 0.5) * 2; y = (Math.random() - 0.5) * 2; }
      while (x * x + y * y > maxR * maxR);
      thomsonParts.push({ x, y, type: i < N_ELECTRONS ? 'e' : 'p' });
    }
  }

  // ── Coordenadas reducidas → canvas ──
  function toCan(x, y) { return [NUC_X + x * SCALE, NUC_Y - y * SCALE]; }

  // ── Polilínea ──
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

  // ── Punto con halo ──
  function drawDot(x, y, color, r) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.5);
    g.addColorStop(0, color + 'bb'); g.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(x, y, r * 3.5, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
  }

  // ── Recalcula trayectorias ──
  function recompute() {
    const a0     = Physics.calcA0(E_mev);
    const R_norm = PHYS.R_AU_FM / a0;
    const isR    = mode === 'rutherford';
    trajs  = B_PHYS_FM.map(b_fm => Physics.integrateTraj(b_fm / a0, isR, R_norm, R_START));
    phases = B_PHYS_FM.map((_, i) => -i * 0.14);
    document.getElementById('val-a0').textContent      = a0.toFixed(1);
    document.getElementById('val-theta-a').textContent = trajs[0].thetaDeg.toFixed(0) + '°';
    const thMax = Physics.thetaThomsonMax_deg(a0);
    document.getElementById('val-thom-max').textContent = (thMax * 1000).toFixed(2) + ' × 10⁻³';
  }

  // ── Mini-diagrama del experimento (Geiger-Marsden) ──
  // Se dibuja como inset en la esquina superior izquierda, ambos modos.
  function drawExperimentInset() {
    const IX = 12, IY = 10, IW = 170, IH = 72;
    ctx.globalAlpha = 0.55;

    // Fondo
    ctx.fillStyle = 'rgba(5,10,20,0.7)';
    ctx.beginPath(); ctx.roundRect(IX, IY, IW, IH, 5); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
    ctx.stroke();

    // Fuente (cuadrado rojo con halo)
    const SX = IX + 18, SY = IY + IH / 2;
    ctx.fillStyle = '#dc2626'; ctx.fillRect(SX - 7, SY - 7, 14, 14);
    ctx.fillStyle = 'rgba(220,38,38,0.3)'; ctx.fillRect(SX - 11, SY - 11, 22, 22);
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '8px Inter,sans-serif';
    ctx.textAlign = 'center'; ctx.fillText('Ra', SX, SY + 20);

    // Flecha del haz
    const FX1 = SX + 14, FX2 = IX + 82;
    ctx.strokeStyle = '#f87171'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(FX1, SY); ctx.lineTo(FX2 - 5, SY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(FX2 - 5, SY - 3); ctx.lineTo(FX2, SY); ctx.lineTo(FX2 - 5, SY + 3); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '7px Inter,sans-serif';
    ctx.fillText('α', (FX1 + FX2) / 2, SY - 5);

    // Lámina de Au
    const LX = IX + 84;
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(LX, IY + 12); ctx.lineTo(LX, IY + IH - 12); ctx.stroke();
    ctx.fillStyle = '#fbbf24'; ctx.font = '7px Inter,sans-serif';
    ctx.fillText('Au', LX + 3, IY + 11);

    // Pantalla ZnS (arco)
    const DX = IX + 130, DY = SY;
    ctx.strokeStyle = 'rgba(74,222,128,0.6)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(LX + 2, DY, 40, -Math.PI * 0.55, Math.PI * 0.55); ctx.stroke();
    ctx.fillStyle = 'rgba(74,222,128,0.5)'; ctx.font = '7px Inter,sans-serif';
    ctx.fillText('ZnS', DX + 10, DY);

    // Partículas dispersadas: varias flechas
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

    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }

  // ── Dibuja electrones orbitantes (Rutherford) ──
  function drawOrbitingElectrons() {
    // Órbitas punteadas
    ctx.setLineDash([3, 7]);
    ctx.strokeStyle = 'rgba(100,180,255,0.13)';
    ctx.lineWidth = 0.8;
    ORB_R_A0.forEach(r => {
      const rPx = r * SCALE;
      ctx.beginPath(); ctx.arc(NUC_X, NUC_Y, rPx, 0, Math.PI * 2); ctx.stroke();
    });
    ctx.setLineDash([]);

    // Electrones
    ORB_ANGLE.forEach((angle, i) => {
      const rPx = ORB_R_A0[i] * SCALE;
      const ex  = NUC_X + rPx * Math.cos(angle);
      const ey  = NUC_Y + rPx * Math.sin(angle);
      // Halo
      const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, 7);
      g.addColorStop(0, 'rgba(56,189,248,0.45)'); g.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(ex, ey, 7, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      // Punto
      ctx.beginPath(); ctx.arc(ex, ey, 2.8, 0, Math.PI * 2); ctx.fillStyle = '#38bdf8'; ctx.fill();
    });

    // Leyenda de electrones (pequeña)
    ctx.fillStyle = 'rgba(56,189,248,0.55)'; ctx.font = '9px Inter,sans-serif';
    ctx.fillText('e⁻ (órbitas estables — postulado de Bohr)', NUC_X - 112, H - 28);
  }

  // ── Vista Rutherford ──
  function drawRutherford() {
    // Fondo radial
    const bg = ctx.createRadialGradient(NUC_X, NUC_Y, 0, NUC_X, NUC_Y, W * 0.42);
    bg.addColorStop(0, 'rgba(232,168,51,0.05)'); bg.addColorStop(1, 'transparent');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Trayectorias
    for (let i = 0; i < trajs.length; i++) {
      const { pts } = trajs[i];
      drawPath(pts, B_COLORS[i], 0.28);
      drawPath(pts.map(([x, y]) => [x, -y]), B_COLORS[i], 0.28);
    }

    // Partículas animadas
    for (let i = 0; i < trajs.length; i++) {
      const { pts } = trajs[i];
      const t   = ((phases[i] % 1) + 1) % 1;
      const idx = Math.min(Math.floor(t * pts.length), pts.length - 1);
      const [px, py] = pts[idx];
      const [cx1, cy1] = toCan(px,  py);
      const [cx2, cy2] = toCan(px, -py);
      drawDot(cx1, cy1, B_COLORS[i], 4);
      drawDot(cx2, cy2, B_COLORS[i], 4);
    }

    // Núcleo — halo dorado + punto
    const [nx, ny] = toCan(0, 0);
    const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, 22);
    ng.addColorStop(0, 'rgba(255,200,80,0.55)'); ng.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(nx, ny, 22, 0, Math.PI * 2); ctx.fillStyle = ng; ctx.fill();
    ctx.beginPath(); ctx.arc(nx, ny, 5.5, 0, Math.PI * 2); ctx.fillStyle = '#fbbf24'; ctx.fill();

    // Etiquetas
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(232,168,51,0.75)';
    ctx.fillText('núcleo Au  (Z=79)', nx + 8, ny - 14);
    ctx.fillStyle = 'rgba(170,200,255,0.55)';
    ctx.fillText('→ haz de partículas α', 10, H / 2 - 60);

    // Escala (5 a₀)
    const sc5 = SCALE * 5, sx = W - 14 - sc5, sy = H - 18;
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + sc5, sy); ctx.stroke();
    ctx.font = '10px JetBrains Mono, monospace'; ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('5a₀ = ' + (5 * Physics.calcA0(E_mev)).toFixed(0) + ' fm', sx, sy - 4);

    // Escala atómica
    ctx.fillStyle = 'rgba(200,220,240,0.3)'; ctx.font = '9px Inter, sans-serif';
    ctx.fillText('escala: ~10⁻¹⁵ m (nuclear)', W - 178, H - 4);

    // Leyenda impacto → ángulo
    let ly = 100;
    ctx.font = '10px JetBrains Mono, monospace';
    for (let i = 0; i < B_PHYS_FM.length; i++) {
      ctx.fillStyle = B_COLORS[i]; ctx.fillRect(W - 140, ly, 10, 10);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText(`b=${B_PHYS_FM[i]} fm  θ=${trajs[i].thetaDeg.toFixed(0)}°`, W - 126, ly + 9);
      ly += 16;
    }

    // Mini-diagrama setup
    drawExperimentInset();
  }

  // ── Vista Thomson ──
  function drawThomson() {
    const Rpx = H * 0.41; // Radio visible del átomo en px
    const ax = NUC_X, ay = NUC_Y;

    // Fondo
    const bg = ctx.createRadialGradient(ax, ay, 0, ax, ay, W * 0.45);
    bg.addColorStop(0, 'rgba(200,80,10,0.04)'); bg.addColorStop(1, 'transparent');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // ── Esfera naranja (como en PhET) ──
    const ag = ctx.createRadialGradient(ax, ay, 0, ax, ay, Rpx);
    ag.addColorStop(0,    'rgba(220,100,15,0.40)');
    ag.addColorStop(0.45, 'rgba(210,90,12,0.28)');
    ag.addColorStop(0.78, 'rgba(190,70,8,0.14)');
    ag.addColorStop(1,    'rgba(170,55,4,0.03)');
    ctx.beginPath(); ctx.arc(ax, ay, Rpx, 0, Math.PI * 2);
    ctx.fillStyle = ag; ctx.fill();
    // Borde
    ctx.strokeStyle = 'rgba(230,130,30,0.40)'; ctx.lineWidth = 1.5; ctx.stroke();

    // ── Electrones y protones embebidos ──
    thomsonParts.forEach(p => {
      const ex = ax + p.x * Rpx * 0.92;
      const ey = ay + p.y * Rpx * 0.92;
      if (p.type === 'e') {
        // Electrón — punto azul con halo
        const ge = ctx.createRadialGradient(ex, ey, 0, ex, ey, 5);
        ge.addColorStop(0, 'rgba(56,189,248,0.5)'); ge.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fillStyle = ge; ctx.fill();
        ctx.beginPath(); ctx.arc(ex, ey, 2, 0, Math.PI * 2); ctx.fillStyle = '#93c5fd'; ctx.fill();
      } else {
        // Protón — punto rojo con halo
        const gp = ctx.createRadialGradient(ex, ey, 0, ex, ey, 5);
        gp.addColorStop(0, 'rgba(248,113,113,0.5)'); gp.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fillStyle = gp; ctx.fill();
        ctx.beginPath(); ctx.arc(ex, ey, 2, 0, Math.PI * 2); ctx.fillStyle = '#fca5a5'; ctx.fill();
      }
    });

    // ── Leyenda ──
    ctx.textAlign = 'left'; ctx.font = '9px Inter,sans-serif';
    ctx.beginPath(); ctx.arc(ax + Rpx + 18, ay - 30, 4, 0, Math.PI * 2); ctx.fillStyle = '#93c5fd'; ctx.fill();
    ctx.fillStyle = 'rgba(147,197,253,0.75)'; ctx.fillText('electrón (e⁻)', ax + Rpx + 26, ay - 26);
    ctx.beginPath(); ctx.arc(ax + Rpx + 18, ay - 12, 4, 0, Math.PI * 2); ctx.fillStyle = '#fca5a5'; ctx.fill();
    ctx.fillStyle = 'rgba(252,165,165,0.75)'; ctx.fillText('carga + distribuida', ax + Rpx + 26, ay - 8);

    // Etiqueta átomo
    ctx.font = '11px Inter, sans-serif'; ctx.fillStyle = 'rgba(230,130,30,0.70)';
    ctx.textAlign = 'center'; ctx.fillText('átomo Au — radio ≈ 1.45 Å', ax, ay - Rpx - 10);

    // ── Trayectorias Thomson (líneas casi rectas, física real) ──
    const a0   = Physics.calcA0(E_mev);
    const R_nm = PHYS.R_AU_FM / a0;
    const bFs  = [0.15, 0.35, 0.55, 0.72, 0.88, 1.20];

    for (let i = 0; i < bFs.length; i++) {
      const bf    = bFs[i];
      const b_px  = bf * Rpx;
      const color = bf < 1 ? B_COLORS[i] : '#607080';
      const b_norm_v = bf * R_nm;
      const theta_th = Physics.calcThetaThomson(b_norm_v, R_nm);
      const delta_px = W * Math.sin(theta_th);

      for (const sign of [1, -1]) {
        const y0 = ay - sign * b_px;
        ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(W, y0 - sign * delta_px);
        ctx.globalAlpha = 0.55; ctx.strokeStyle = color;
        ctx.lineWidth = bf < 1 ? 1.5 : 1; ctx.stroke(); ctx.globalAlpha = 1;
      }
    }

    // ── Núcleo (sub-píxel a escala atómica — ese ES el mensaje) ──
    ctx.beginPath(); ctx.arc(ax, ay, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24'; ctx.fill();
    ctx.font = '10px Inter, sans-serif'; ctx.fillStyle = 'rgba(232,168,51,0.75)';
    ctx.textAlign = 'center';
    ctx.fillText('núcleo (punto sub-píxel)', ax, ay + Rpx + 16);

    // Escala 1.45 Å
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(W - 10 - Rpx, H - 20); ctx.lineTo(W - 10, H - 20); ctx.stroke();
    ctx.font = '10px JetBrains Mono, monospace'; ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.textAlign = 'right'; ctx.fillText('1.45 Å ← radio atómico', W - 10, H - 4);

    // θ_max Thomson calculado
    const thMaxDeg = Physics.thetaThomsonMax_deg(a0);
    ctx.font = '11px Inter, sans-serif'; ctx.fillStyle = 'rgba(200,200,255,0.50)';
    ctx.textAlign = 'left';
    ctx.fillText(
      'θ_max Thomson = ' + (thMaxDeg * 1000).toFixed(2) + ' × 10⁻³ ° — invisible a esta escala',
      14, H - 10
    );

    // Mini-diagrama setup
    drawExperimentInset();
  }

  // ── Draw frame ──
  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (mode === 'rutherford') drawRutherford();
    else                       drawThomson();
  }

  // ── Tick ──
  function tick() {
    if (mode === 'rutherford') {
      for (let i = 0; i < phases.length; i++) phases[i] = (phases[i] + SPEED + 1) % 1;
    }
    draw();
  }

  // ── API pública ──
  function setMode(m) {
    mode = m;
    document.getElementById('btnRuth').classList.toggle('active', m === 'rutherford');
    document.getElementById('btnThom').classList.toggle('active', m === 'thomson');
    document.getElementById('formulaA').style.display    = m === 'rutherford' ? '' : 'none';
    document.getElementById('formulaThom').style.display = m === 'thomson'    ? '' : 'none';

    const descEl = document.getElementById('descA');
    const noteEl = document.getElementById('noteA');

    if (m === 'rutherford') {
      descEl.innerHTML =
        '<b>Rutherford (1909–1911) — modelo planetario:</b> la lámina de oro contiene núcleos ' +
        'pequeños y densos (carga positiva concentrada). Las partículas alfa son deflectadas por ' +
        'la repulsión de Coulomb entre cargas positivas. Trayectorias hiperbólicas calculadas con ' +
        'integración RK4. Los electrones no participan en la dispersión — son ~7 000× más livianos ' +
        'que las partículas alfa y apenas los afectan. Al aumentar la energía, a₀ decrece y las ' +
        'deflexiones disminuyen — visible en tiempo real.';
      noteEl.innerHTML =
        '<b>El problema que Rutherford dejó abierto:</b> su modelo describe correctamente la ' +
        'dispersión, pero propone que los electrones orbitan el núcleo como planetas. Según la ' +
        'electrodinámica clásica, un electrón en órbita circular <em>irradia energía</em> continuamente ' +
        'y debería colapsar sobre el núcleo en ~10⁻¹¹ s. Rutherford no tenía respuesta para esto. ' +
        'Bohr lo resolvió en 1913 postulando que solo ciertas órbitas están permitidas ($L = n\\hbar$) ' +
        'y que el electrón no irradia en ellas. <em>El experimento de dispersión y el modelo atómico ' +
        'son dos preguntas distintas.</em><br>' +
        '<span class="warn">⚠ Simplificación declarada:</span> la velocidad de animación no representa ' +
        'tiempo real. Los pasos de tiempo son iguales — el punto visual sí se ralentiza cerca del ' +
        'núcleo (la partícula pierde velocidad al subir el potencial de Coulomb): comportamiento correcto.';
    } else {
      descEl.innerHTML =
        '<b>Modelo de Thomson ("pudín de pasas"):</b> carga positiva distribuida uniformemente en todo ' +
        'el volumen atómico (esfera naranja, radio ≈ 1.45 Å para Au). Los electrones (azul) y la carga ' +
        'positiva (rojo) están embebidos en la esfera. La deflexión máxima calculada con el potencial de ' +
        'esfera uniforme es < 0.01°: <b>las trayectorias son literalmente líneas rectas a esta escala</b>. ' +
        'Este resultado fue incompatible con los ángulos grandes observados por Geiger-Marsden.';
      noteEl.innerHTML =
        '<b>Por qué el modelo de Thomson falla:</b> la carga positiva difusa genera un campo muy débil ' +
        'en cada punto — ninguna partícula alfa experimenta una fuerza suficientemente grande para rebotar. ' +
        'Rutherford demostró que para producir deflexiones de 90° o más, la carga positiva debe estar ' +
        'concentrada en un núcleo de radio ~10⁻¹⁵ m, unas 10 000 veces más pequeño que el átomo.';
    }
    recompute();
  }

  function setEnergy(E) { E_mev = E; recompute(); }

  function init() {
    genThomsonParts();
    recompute();
    document.getElementById('sliderE').addEventListener('input', function () {
      setEnergy(parseFloat(this.value));
      document.getElementById('valE').textContent = parseFloat(this.value).toFixed(1) + ' MeV';
    });
  }

  return { init, tick, setMode, setEnergy };

})();
