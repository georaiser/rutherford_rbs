/**
 * panelA.js — Panel A: Dispersión de Rutherford
 *
 * Anima trayectorias hiperbólicas calculadas en vivo con RK4.
 * En modo Thomson muestra la escala atómica y la deflexión real (< 0.01°).
 *
 * Depende de: constants.js, physics.js
 */
'use strict';

const panelA = (() => {

  // ── Canvas ──
  const canvas = document.getElementById('canvasA');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width;   // 800 px (interno)
  const H = canvas.height;  // 330 px (interno)

  // ── Estado ──
  let mode  = 'rutherford';
  let E_mev = 7.0;

  // Parámetros de impacto físicos fijos en fm (NO dependen de E).
  // Al variar E, a₀ cambia y b_norm = b_fm/a₀ cambia → distintos ángulos.
  // Esto muestra correctamente que mayor E → menor deflexión.
  const B_PHYS_FM = [5, 12, 26, 55, 95, 155];
  const B_COLORS  = ['#ef4444','#f97316','#facc15','#4ade80','#38bdf8','#a78bfa'];

  // Posición del núcleo en el canvas
  const NUC_X    = W * 0.44;
  const NUC_Y    = H * 0.50;
  const R_START  = 32;  // distancia de inicio en unidades de a₀
  const SCALE    = NUC_X / (R_START + 2); // px/a₀

  // Trayectorias precalculadas y fases de animación
  let trajs       = [];
  let phases      = [];
  const SPEED     = 0.006; // fracción de trayectoria por frame

  // ── Conversión de coordenadas reducidas → canvas ──
  function toCan(x, y) {
    return [NUC_X + x * SCALE, NUC_Y - y * SCALE];
  }

  // ── Dibuja una trayectoria como polilínea ──
  function drawPath(pts, color, alpha) {
    if (pts.length < 2) return;
    ctx.beginPath();
    const [x0, y0] = toCan(pts[0][0], pts[0][1]);
    ctx.moveTo(x0, y0);
    for (let i = 1; i < pts.length; i++) {
      const [cx, cy] = toCan(pts[i][0], pts[i][1]);
      ctx.lineTo(cx, cy);
    }
    ctx.globalAlpha  = alpha;
    ctx.strokeStyle  = color;
    ctx.lineWidth    = 1.3;
    ctx.stroke();
    ctx.globalAlpha  = 1;
  }

  // ── Dibuja un punto con halo luminoso ──
  function drawDot(x, y, color, r) {
    // Halo
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.5);
    g.addColorStop(0, color + 'bb');
    g.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(x, y, r * 3.5, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();
    // Núcleo del punto
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();
  }

  // ── Recalcula todas las trayectorias ──
  function recompute() {
    const a0     = Physics.calcA0(E_mev);
    const R_norm = PHYS.R_AU_FM / a0;
    const isR    = mode === 'rutherford';

    trajs  = B_PHYS_FM.map(b_fm =>
      Physics.integrateTraj(b_fm / a0, isR, R_norm, R_START)
    );
    phases = B_PHYS_FM.map((_, i) => -i * 0.14);

    // Actualizar DOM
    document.getElementById('val-a0').textContent     = a0.toFixed(1);
    document.getElementById('val-theta-a').textContent = trajs[0].thetaDeg.toFixed(0) + '°';

    const thMax = Physics.thetaThomsonMax_deg(a0);
    document.getElementById('val-thom-max').textContent =
      (thMax * 1000).toFixed(2) + ' × 10⁻³';
  }

  // ── Vista Rutherford ──
  function drawRutherford() {
    // Fondo radial desde el núcleo
    const bg = ctx.createRadialGradient(NUC_X, NUC_Y, 0, NUC_X, NUC_Y, W * 0.42);
    bg.addColorStop(0, 'rgba(232,168,51,0.05)');
    bg.addColorStop(1, 'transparent');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Trayectorias (arriba y abajo — simetría del haz)
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
    ng.addColorStop(0, 'rgba(255,200,80,0.55)');
    ng.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(nx, ny, 22, 0, Math.PI * 2);
    ctx.fillStyle = ng; ctx.fill();
    ctx.beginPath(); ctx.arc(nx, ny, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24'; ctx.fill();

    // Etiquetas
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(232,168,51,0.75)';
    ctx.fillText('núcleo Au', nx + 8, ny - 14);
    ctx.fillStyle = 'rgba(170,200,255,0.55)';
    ctx.fillText('→ haz de partículas α', 10, H / 2 - 60);

    // Escala (5 a₀)
    const sc5 = SCALE * 5;
    const sx  = W - 14 - sc5, sy = H - 18;
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + sc5, sy); ctx.stroke();
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('5a₀ = ' + (5 * Physics.calcA0(E_mev)).toFixed(0) + ' fm', sx, sy - 4);

    // Leyenda: impacto → ángulo
    let ly = 16;
    ctx.font = '10px JetBrains Mono, monospace';
    for (let i = 0; i < B_PHYS_FM.length; i++) {
      ctx.fillStyle = B_COLORS[i];
      ctx.fillRect(W - 140, ly, 10, 10);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText(`b=${B_PHYS_FM[i]} fm  θ=${trajs[i].thetaDeg.toFixed(0)}°`, W - 126, ly + 9);
      ly += 16;
    }
  }

  // ── Vista Thomson ──
  function drawThomson() {
    // Radio del átomo en píxeles (llena ~38% del alto)
    const Rpx = H * 0.38;
    const ax = NUC_X, ay = NUC_Y;

    // Fondo radial
    const bg = ctx.createRadialGradient(ax, ay, 0, ax, ay, W * 0.45);
    bg.addColorStop(0, 'rgba(50,80,160,0.04)');
    bg.addColorStop(1, 'transparent');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Átomo — esfera difusa
    const ag = ctx.createRadialGradient(ax, ay, 0, ax, ay, Rpx);
    ag.addColorStop(0,    'rgba(100,150,255,0.12)');
    ag.addColorStop(0.65, 'rgba(100,150,255,0.07)');
    ag.addColorStop(1,    'rgba(100,150,255,0.01)');
    ctx.beginPath(); ctx.arc(ax, ay, Rpx, 0, Math.PI * 2);
    ctx.fillStyle = ag; ctx.fill();
    ctx.strokeStyle = 'rgba(100,150,255,0.3)'; ctx.lineWidth = 1; ctx.stroke();

    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(100,150,255,0.75)';
    ctx.fillText('átomo Au — radio ≈ 1.45 Å', ax - Rpx * 0.28, ay - Rpx - 8);

    // Trayectorias de Thomson — calculadas con la fórmula real
    // La deflexión real < 0.01° es sub-píxel: se dibujan como líneas rectas.
    // Esto ES la física: el modelo de Thomson predice trayectorias esencialmente rectas.
    const a0    = Physics.calcA0(E_mev);
    const R_nm  = PHYS.R_AU_FM / a0;
    const bFs   = [0.15, 0.35, 0.55, 0.72, 0.88, 1.20];

    for (let i = 0; i < bFs.length; i++) {
      const bf    = bFs[i];
      const b_px  = bf * Rpx;
      const color = bf < 1 ? B_COLORS[i] : '#607080';

      // Deflexión Thomson real (fórmula de la esfera uniforme)
      const b_norm_v = bf * R_nm;
      const theta_th = Physics.calcThetaThomson(b_norm_v, R_nm); // rad

      // Desplazamiento lateral real en px: para W px de recorrido, Δy = W·sin(θ) << 1 px
      const delta_px = W * Math.sin(theta_th);

      for (const sign of [1, -1]) {
        const y0 = ay - sign * b_px;
        ctx.beginPath();
        ctx.moveTo(0, y0);
        ctx.lineTo(W, y0 - sign * delta_px);
        ctx.globalAlpha  = 0.5;
        ctx.strokeStyle  = color;
        ctx.lineWidth    = bf < 1 ? 1.5 : 1;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    // Núcleo (punto sub-píxel a escala atómica — eso ES el mensaje)
    ctx.beginPath(); ctx.arc(ax, ay, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24'; ctx.fill();
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = 'rgba(232,168,51,0.8)';
    ctx.fillText('núcleo', ax + 5, ay + 14);

    // Escala: 1.45 Å (= Rpx píxeles)
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(W - 10 - Rpx, H - 20); ctx.lineTo(W - 10, H - 20); ctx.stroke();
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('1.45 Å', W - 10 - Rpx, H - 4);

    // Ángulo Thomson máximo calculado
    const thMaxDeg = Physics.thetaThomsonMax_deg(a0);
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(200,200,255,0.55)';
    ctx.fillText(
      'θ_max Thomson (fórmula real) = ' +
      (thMaxDeg * 1000).toFixed(2) + ' × 10⁻³ ° — sub-píxel a esta escala',
      14, H - 12
    );
  }

  // ── Dibuja el frame actual ──
  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (mode === 'rutherford') drawRutherford();
    else                       drawThomson();
  }

  // ── Avanza la animación un frame ──
  function tick() {
    if (mode === 'rutherford') {
      for (let i = 0; i < phases.length; i++) {
        phases[i] = (phases[i] + SPEED + 1) % 1;
      }
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
        '<b>Rutherford (1909-1911):</b> partículas alfa sobre lámina de oro. Trayectorias calculadas ' +
        'con la ecuación de movimiento en el potencial de Coulomb (integración RK4). Los parámetros de ' +
        'impacto son fijos en fm; al aumentar la energía, a₀ decrece y la deflexión disminuye — ' +
        'el efecto es visible en tiempo real.';
      noteEl.innerHTML =
        '<span class="warn">⚠ Simplificación declarada:</span> la velocidad de animación no representa ' +
        'tiempo real. Sin embargo, los puntos están separados en pasos de <em>tiempo iguales</em> — el punto ' +
        'visual sí se ralentiza cerca del núcleo, lo cual es físicamente correcto (la partícula pierde ' +
        'velocidad al subir el potencial de Coulomb).';
    } else {
      descEl.innerHTML =
        '<b>Modelo de Thomson ("pudín de pasas"):</b> carga positiva distribuida uniformemente en todo ' +
        'el volumen atómico (radio ≈ 1.45 Å para Au). Vista a escala atómica. La deflexión máxima ' +
        'calculada con la fórmula real del potencial de esfera uniforme es < 0.01°: ' +
        '<b>las trayectorias son literalmente líneas rectas a esta escala</b>. El núcleo es un punto ' +
        'invisible. Este resultado fue incompatible con los ángulos grandes observados por Geiger-Marsden.';
      noteEl.innerHTML =
        '<b>Nota de escala:</b> el radio atómico (1.45 Å) es ~9000 veces mayor que el parámetro ' +
        'de Rutherford a₀ ≈ 16 fm a 7 MeV. Las dos vistas no pueden mostrarse a la misma escala — ' +
        'esta diferencia de 4 órdenes de magnitud <em>es</em> el resultado del experimento.';
    }
    recompute();
  }

  function setEnergy(E) {
    E_mev = E;
    recompute();
  }

  function init() {
    recompute();
    // Slider de energía
    document.getElementById('sliderE').addEventListener('input', function () {
      setEnergy(parseFloat(this.value));
      document.getElementById('valE').textContent = parseFloat(this.value).toFixed(1) + ' MeV';
    });
  }

  return { init, tick, setMode, setEnergy };

})();
