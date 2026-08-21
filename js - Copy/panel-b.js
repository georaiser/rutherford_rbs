/**
 * panel-b.js — Panel B: Factor cinemático K y animación de colisión RBS
 *
 * La fórmula K(M₂,θ) se evalúa en vivo con cada movimiento del slider.
 * La animación muestra el ciclo: entrada → colisión → salida a 170°.
 * La velocidad de salida es proporcional a √K (energía → velocidad).
 *
 * Depende de: constants.js, physics.js
 */
'use strict';

const panelB = (() => {

  // ── Canvas ──
  const canvas = document.getElementById('canvasB');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width;   // 800
  const H = canvas.height;  // 210

  // ── Estado de la animación ──
  // Estados: 'incoming' → 'flash' → 'outgoing' → 'pause' → 'incoming'...
  let state      = 'incoming';
  let tState     = 0;     // tiempo acumulado en el estado actual (ms)
  let lastTs     = null;  // timestamp del frame anterior

  // Duración base de cada fase
  const DUR_IN    = 1600; // ms
  const DUR_FLASH = 180;  // ms
  const DUR_PAUSE = 360;  // ms

  // Valores actuales (actualizados por el slider)
  let M2_val = 197;
  let K_val  = Physics.calcK(M2_val, PHYS.THETA_DET);

  // Geometría del canvas
  const ATOM_X  = W * 0.50;   // centro del átomo blanco
  const ATOM_Y  = H * 0.50;
  const SRC_X   = 42;          // fuente del haz (izquierda)
  const DET_X   = 68;          // detector (izquierda arriba, 170°)
  const DET_Y   = 38;

  // ── Dibuja el punto de partícula con halo ──
  function drawDot(x, y, color, r) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.5);
    g.addColorStop(0, color + 'bb');
    g.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(x, y, r * 3.5, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();
  }

  // ── Dibuja el átomo blanco con escala visual M₂^(1/3) ──
  function drawAtom() {
    const el    = Physics.closestElement(M2_val);
    const rBase = 28;
    const r     = rBase * Math.pow(M2_val / 197, 1 / 3); // escala proporcional al radio

    // Halo
    const ag = ctx.createRadialGradient(ATOM_X, ATOM_Y, 0, ATOM_X, ATOM_Y, r * 2.5);
    ag.addColorStop(0, el.color + '44');
    ag.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(ATOM_X, ATOM_Y, r * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = ag; ctx.fill();

    // Cuerpo
    ctx.beginPath(); ctx.arc(ATOM_X, ATOM_Y, r, 0, Math.PI * 2);
    ctx.fillStyle   = el.color + '55'; ctx.fill();
    ctx.strokeStyle = el.color; ctx.lineWidth = 1.5; ctx.stroke();

    // Etiquetas
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillStyle  = el.color;
    ctx.textAlign  = 'center';
    ctx.fillText(el.sym, ATOM_X, ATOM_Y + 4);
    ctx.font = '10px JetBrains Mono';
    ctx.fillStyle = 'rgba(180,200,220,0.6)';
    ctx.fillText(M2_val.toFixed(0) + ' u', ATOM_X, ATOM_Y + 18);
    ctx.textAlign = 'left';
  }

  // ── Dibuja el detector (triángulo en posición 170°) ──
  function drawDetector() {
    ctx.beginPath();
    ctx.moveTo(DET_X - 14, DET_Y);
    ctx.lineTo(DET_X + 14, DET_Y);
    ctx.lineTo(DET_X, DET_Y + 20);
    ctx.closePath();
    ctx.fillStyle   = 'rgba(100,200,255,0.3)'; ctx.fill();
    ctx.strokeStyle = 'rgba(100,200,255,0.7)'; ctx.lineWidth = 1.2; ctx.stroke();

    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = 'rgba(100,200,255,0.75)';
    ctx.fillText('Detector 170°', DET_X - 12, DET_Y - 6);
  }

  // ── Dibuja elementos estáticos (haz, E₀, E₁) ──
  function drawStatic() {
    // Línea de haz
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = 'rgba(100,160,255,0.18)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(SRC_X, ATOM_Y);
    ctx.lineTo(W - 20, ATOM_Y);
    ctx.stroke();
    ctx.setLineDash([]);

    // E₀
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(100,160,255,0.65)';
    ctx.fillText('E₀ = ' + PHYS.E0_RBS.toFixed(1) + ' MeV  →', SRC_X, ATOM_Y - 10);

    // E₁ (junto al detector)
    if (K_val !== null) {
      ctx.fillStyle = 'rgba(232,168,51,0.75)';
      ctx.fillText(
        'E₁ = ' + (K_val * PHYS.E0_RBS).toFixed(4) + ' MeV',
        DET_X + 28, DET_Y + 14
      );
    }
  }

  // ── Máquina de estados de animación ──
  function stepState(ts) {
    if (lastTs === null) lastTs = ts;
    tState += ts - lastTs;
    lastTs  = ts;

    const K       = K_val ?? 0.5;
    const DUR_OUT = DUR_IN / Math.sqrt(K); // salida más lenta si K pequeño

    switch (state) {

      case 'incoming': {
        // Partícula se acerca desde la izquierda
        const frac = Math.min(tState / DUR_IN, 1);
        const px   = SRC_X + frac * (ATOM_X - SRC_X);

        // Rastro
        ctx.beginPath();
        ctx.moveTo(SRC_X, ATOM_Y);
        ctx.lineTo(px, ATOM_Y);
        ctx.strokeStyle = 'rgba(100,160,255,0.35)'; ctx.lineWidth = 2; ctx.stroke();

        drawDot(px, ATOM_Y, '#60a5fa', 5);
        if (tState >= DUR_IN) { state = 'flash'; tState = 0; }
        break;
      }

      case 'flash': {
        // Flash de colisión
        const prog = tState / DUR_FLASH;
        const r    = 16 + prog * 28;
        const alfa = Math.max(0, 1 - prog);
        const fg   = ctx.createRadialGradient(ATOM_X, ATOM_Y, 0, ATOM_X, ATOM_Y, r);
        fg.addColorStop(0, `rgba(255,255,255,${alfa})`);
        fg.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(ATOM_X, ATOM_Y, r, 0, Math.PI * 2);
        ctx.fillStyle = fg; ctx.fill();
        if (tState >= DUR_FLASH) { state = 'outgoing'; tState = 0; }
        break;
      }

      case 'outgoing': {
        // Proyectil sale a 170° (casi hacia atrás, ligeramente hacia arriba)
        // cos(170°) ≈ -0.985,  sin(170°) ≈ +0.174
        // En canvas (y hacia abajo): -sin → sube
        const frac = Math.min(tState / DUR_OUT, 1);
        const dist = frac *
          Math.hypot(DET_X - ATOM_X, DET_Y - ATOM_Y) * 1.1;
        const cos170 = Math.cos(170 * Math.PI / 180);
        const sin170 = Math.sin(170 * Math.PI / 180);
        const px = ATOM_X + dist * cos170;
        const py = ATOM_Y - dist * Math.abs(sin170); // sube en canvas

        // Rastro de salida (color ámbar = energía conservada)
        ctx.beginPath();
        ctx.moveTo(ATOM_X, ATOM_Y);
        ctx.lineTo(px, py);
        ctx.strokeStyle = 'rgba(232,168,51,0.4)'; ctx.lineWidth = 2; ctx.stroke();

        drawDot(px, py, '#e8a833', 5);

        // Recule del blanco: se mueve suavemente hacia la derecha
        const vRec  = Physics.recoilSpeed(M2_val);
        const dRec  = frac * 35 * vRec;
        if (dRec > 1) {
          ctx.beginPath();
          ctx.moveTo(ATOM_X + 28, ATOM_Y);
          ctx.lineTo(ATOM_X + 28 + dRec, ATOM_Y);
          ctx.strokeStyle = 'rgba(150,255,150,0.25)'; ctx.lineWidth = 1; ctx.stroke();
        }

        if (tState >= DUR_OUT) { state = 'pause'; tState = 0; }
        break;
      }

      case 'pause':
        if (tState >= DUR_PAUSE) { state = 'incoming'; tState = 0; }
        break;
    }
  }

  // ── Frame principal de Panel B ──
  function draw(ts) {
    ctx.clearRect(0, 0, W, H);
    drawDetector();
    drawStatic();
    stepState(ts);
    drawAtom();
  }

  // ── Actualiza métricas en el DOM ──
  function updateDOM() {
    const K  = Physics.calcK(M2_val, PHYS.THETA_DET);
    const E1 = K !== null ? K * PHYS.E0_RBS : null;
    K_val    = K;

    document.getElementById('val-K').textContent =
      K  !== null ? K.toFixed(4)  : 'N/A';
    document.getElementById('val-E1').textContent =
      E1 !== null ? E1.toFixed(4) : 'N/A';
    document.getElementById('valM2').textContent =
      M2_val.toFixed(1) + ' u';

    const el = Physics.closestElement(M2_val);
    const elEl = document.getElementById('val-el');
    elEl.textContent = el.sym;
    elEl.style.color = el.color;

    document.getElementById('val-recoil').textContent =
      Physics.recoilSpeed(M2_val).toFixed(3);
  }

  // ── API pública ──
  function setM2(M2) {
    M2_val = M2;
    state  = 'incoming'; tState = 0; // reiniciar ciclo
    updateDOM();
  }

  function init() {
    updateDOM();
    document.getElementById('sliderM2').addEventListener('input', function () {
      setM2(parseFloat(this.value));
    });
  }

  return { init, draw, setM2 };

})();
