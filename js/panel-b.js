/**
 * panel-b.js — Panel B: Factor cinemático K y animación interactiva de colisión RBS
 *
 * Mejoras físicas y visuales:
 * - Retroceso físico visible del núcleo blanco (escala con v_rec = 2M₁/(M₁+M₂)).
 * - Vector de retroceso v_rec animado en verde esmeralda con flecha direccional.
 * - Destello reactivo en el detector semiconductor al recibir la partícula alfa.
 * - Etiquetas flotantes de velocidad (v₀ vs v₁ = √K v₀) y energía en tiempo real.
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
  let state         = 'incoming';
  let tState        = 0;     // tiempo acumulado en el estado actual (ms)
  let lastTs        = null;  // timestamp del frame anterior
  let atomRecoilX   = 0;     // desplazamiento dinámico en X del núcleo blanco
  let detectorFlash = 0;     // 0..1 intensidad de flash en el detector

  // Duración base de cada fase
  const DUR_IN    = 1500; // ms
  const DUR_FLASH = 160;  // ms
  const DUR_PAUSE = 400;  // ms

  // Valores actuales (actualizados por el slider)
  let M2_val = 197;
  let K_val  = Physics.calcK(M2_val, PHYS.THETA_DET);

  // Geometría del canvas
  const ATOM_X  = W * 0.52;   // centro del átomo blanco
  const ATOM_Y  = H * 0.52;
  const SRC_X   = 40;          // fuente del haz (izquierda)
  const DET_X   = 72;          // detector (izquierda arriba, 170°)
  const DET_Y   = 36;

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

  // ── Dibuja el átomo blanco con escala visual M₂^(1/3) y retroceso dinámico ──
  function drawAtom() {
    const el    = Physics.closestElement(M2_val);
    const rBase = 26;
    const r     = rBase * Math.pow(M2_val / 197, 1 / 3); // escala proporcional al radio
    const curX  = ATOM_X + atomRecoilX;
    const curY  = ATOM_Y;

    // Halo
    const ag = ctx.createRadialGradient(curX, curY, 0, curX, curY, r * 2.5);
    ag.addColorStop(0, el.color + '44');
    ag.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(curX, curY, r * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = ag; ctx.fill();

    // Cuerpo del núcleo
    ctx.beginPath(); ctx.arc(curX, curY, r, 0, Math.PI * 2);
    ctx.fillStyle   = el.color + '55'; ctx.fill();
    ctx.strokeStyle = el.color; ctx.lineWidth = 1.6; ctx.stroke();

    // Etiquetas del núcleo
    ctx.font = 'bold 12.5px Inter, sans-serif';
    ctx.fillStyle  = el.color;
    ctx.textAlign  = 'center';
    ctx.fillText(el.sym, curX, curY + 4);
    ctx.font = '9.5px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(180,200,220,0.75)';
    ctx.fillText(M2_val.toFixed(0) + ' u', curX, curY + 17);

    // Vector de retroceso v_rec animado (flecha verde hacia la derecha)
    if (state === 'outgoing' && atomRecoilX > 1.2) {
      const vRec = Physics.recoilSpeed(M2_val);
      const arrLen = Math.min(50, atomRecoilX + 18);
      ctx.beginPath();
      ctx.moveTo(curX + r + 3, curY);
      ctx.lineTo(curX + r + 3 + arrLen, curY);
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Punta flecha
      ctx.beginPath();
      ctx.moveTo(curX + r + 3 + arrLen, curY);
      ctx.lineTo(curX + r + arrLen - 3, curY - 3.5);
      ctx.lineTo(curX + r + arrLen - 3, curY + 3.5);
      ctx.closePath();
      ctx.fillStyle = '#4ade80';
      ctx.fill();

      // Texto v_rec flotante
      ctx.font = '9.5px JetBrains Mono, monospace';
      ctx.fillStyle = '#4ade80';
      ctx.fillText(`v_rec = ${vRec.toFixed(3)} v₀`, curX + r + 8, curY - 7);
    }

    ctx.textAlign = 'left';
  }

  // ── Dibuja el detector con pulso luminoso reactivo ──
  function drawDetector() {
    ctx.save();
    // Halo reactivo al detectar la partícula alfa
    if (detectorFlash > 0.02) {
      const gDet = ctx.createRadialGradient(DET_X, DET_Y + 10, 0, DET_X, DET_Y + 10, 38);
      gDet.addColorStop(0, `rgba(56, 189, 248, ${detectorFlash * 0.65})`);
      gDet.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(DET_X, DET_Y + 10, 38, 0, Math.PI * 2);
      ctx.fillStyle = gDet; ctx.fill();
    }

    ctx.beginPath();
    ctx.moveTo(DET_X - 15, DET_Y);
    ctx.lineTo(DET_X + 15, DET_Y);
    ctx.lineTo(DET_X, DET_Y + 22);
    ctx.closePath();
    ctx.fillStyle   = detectorFlash > 0.05
      ? `rgba(100, 220, 255, ${0.30 + detectorFlash * 0.45})`
      : 'rgba(100, 200, 255, 0.28)';
    ctx.fill();
    ctx.strokeStyle = detectorFlash > 0.05 ? '#ffffff' : 'rgba(100, 200, 255, 0.75)';
    ctx.lineWidth   = detectorFlash > 0.05 ? 1.8 : 1.3;
    ctx.stroke();

    ctx.font = 'bold 9.5px Inter, sans-serif';
    ctx.fillStyle = detectorFlash > 0.05 ? '#38bdf8' : 'rgba(100, 200, 255, 0.85)';
    ctx.fillText('Detector 170°', DET_X - 16, DET_Y - 6);
    ctx.restore();
  }

  // ── Dibuja elementos estáticos (haz, E₀, E₁) ──
  function drawStatic() {
    // Línea de haz incidente
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = 'rgba(100,160,255,0.18)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(SRC_X, ATOM_Y);
    ctx.lineTo(W - 20, ATOM_Y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Etiqueta E₀ en la fuente
    ctx.font = '10.5px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(100,160,255,0.7)';
    ctx.fillText('E₀ = ' + PHYS.E0_RBS.toFixed(1) + ' MeV →', SRC_X, ATOM_Y - 10);

    // Etiqueta E₁ junto al detector
    if (K_val !== null) {
      ctx.fillStyle = detectorFlash > 0.1 ? '#fbbf24' : 'rgba(232,168,51,0.85)';
      ctx.font = 'bold 10.5px JetBrains Mono, monospace';
      ctx.fillText(
        'E₁ = ' + (K_val * PHYS.E0_RBS).toFixed(4) + ' MeV',
        DET_X + 26, DET_Y + 14
      );
    }
  }

  // ── Máquina de estados de animación ──
  function stepState(ts) {
    if (lastTs === null) lastTs = ts;
    const dt = Math.min(ts - lastTs, 64); // limitar saltos si pierde foco
    tState += dt;
    lastTs  = ts;

    const K       = K_val ?? 0.5;
    const vAlpha  = Math.sqrt(K);          // velocidad normalizada de salida v₁/v₀
    const DUR_OUT = Math.min(3200, DUR_IN / Math.max(0.35, vAlpha)); // duración proporcional a 1/v₁

    // Atenuación natural del flash del detector
    if (detectorFlash > 0) {
      detectorFlash = Math.max(0, detectorFlash - dt * 0.0035);
    }

    switch (state) {

      case 'incoming': {
        atomRecoilX = 0;
        const frac  = Math.min(tState / DUR_IN, 1);
        const px    = SRC_X + frac * (ATOM_X - SRC_X);

        // Rastro de entrada azul
        ctx.beginPath();
        ctx.moveTo(SRC_X, ATOM_Y);
        ctx.lineTo(px, ATOM_Y);
        ctx.strokeStyle = 'rgba(100,160,255,0.4)'; ctx.lineWidth = 2.2; ctx.stroke();

        drawDot(px, ATOM_Y, '#60a5fa', 5);

        // Etiqueta flotante de velocidad sobre la partícula
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(147,197,253,0.8)';
        ctx.textAlign = 'center';
        ctx.fillText('v₀', px, ATOM_Y - 9);
        ctx.textAlign = 'left';

        if (tState >= DUR_IN) { state = 'flash'; tState = 0; }
        break;
      }

      case 'flash': {
        const prog = tState / DUR_FLASH;
        const r    = 14 + prog * 30;
        const alfa = Math.max(0, 1 - prog);
        const fg   = ctx.createRadialGradient(ATOM_X, ATOM_Y, 0, ATOM_X, ATOM_Y, r);
        fg.addColorStop(0, `rgba(255,255,255,${alfa * 0.9})`);
        fg.addColorStop(0.5, `rgba(251,191,36,${alfa * 0.5})`);
        fg.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(ATOM_X, ATOM_Y, r, 0, Math.PI * 2);
        ctx.fillStyle = fg; ctx.fill();
        if (tState >= DUR_FLASH) { state = 'outgoing'; tState = 0; }
        break;
      }

      case 'outgoing': {
        const frac = Math.min(tState / DUR_OUT, 1);
        const totalDist = Math.hypot(DET_X - ATOM_X, DET_Y - ATOM_Y);
        const dist = frac * totalDist;

        // Vector unitario de retorno a 170°
        const cos170 = Math.cos(170 * Math.PI / 180);
        const sin170 = Math.sin(170 * Math.PI / 180);
        const px = ATOM_X + dist * cos170;
        const py = ATOM_Y - dist * Math.abs(sin170);

        // Rastro de salida (color ámbar / oro)
        ctx.beginPath();
        ctx.moveTo(ATOM_X, ATOM_Y);
        ctx.lineTo(px, py);
        ctx.strokeStyle = 'rgba(232,168,51,0.45)'; ctx.lineWidth = 2.2; ctx.stroke();

        drawDot(px, py, '#e8a833', 5);

        // Etiqueta flotante de velocidad de rebote v₁
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(251,191,36,0.9)';
        ctx.textAlign = 'center';
        ctx.fillText(`v₁ = ${vAlpha.toFixed(2)}v₀`, px, py - 9);
        ctx.textAlign = 'left';

        // Retroceso dinámico del átomo blanco hacia la derecha
        const vRec = Physics.recoilSpeed(M2_val);
        const maxRecoilPx = 36 * vRec; // px máximos de desplazamiento según v_rec
        atomRecoilX = (1 - Math.exp(-frac * 3.2)) * maxRecoilPx;

        // Pulso al detector cuando la partícula arriba
        if (frac >= 0.96 && detectorFlash < 0.3) {
          detectorFlash = 1.0;
        }

        if (tState >= DUR_OUT) { state = 'pause'; tState = 0; }
        break;
      }

      case 'pause': {
        // Retorno suave del átomo a su posición de reposo
        const pFrac = Math.min(tState / DUR_PAUSE, 1);
        const vRec  = Physics.recoilSpeed(M2_val);
        const maxRecoilPx = 36 * vRec;
        atomRecoilX = maxRecoilPx * (1 - pFrac);

        if (tState >= DUR_PAUSE) { state = 'incoming'; tState = 0; }
        break;
      }
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
    const K    = Physics.calcK(M2_val, PHYS.THETA_DET);
    const E1   = K !== null ? K * PHYS.E0_RBS : null;
    const Erec = K !== null ? (1 - K) * PHYS.E0_RBS : null;
    K_val      = K;

    document.getElementById('val-K').textContent =
      K  !== null ? K.toFixed(4)  : 'N/A';
    document.getElementById('val-E1').textContent =
      E1 !== null ? E1.toFixed(4) : 'N/A';
    const eRecEl = document.getElementById('val-Erec');
    if (eRecEl) {
      eRecEl.textContent = Erec !== null ? Erec.toFixed(4) : 'N/A';
    }
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
    const s = document.getElementById('sliderM2');
    if (s && parseFloat(s.value) !== M2) s.value = M2;
    state  = 'incoming'; tState = 0; // reiniciar ciclo
    updateDOM();
    if (typeof panelC !== 'undefined' && panelC.setM2Marker) {
      panelC.setM2Marker(M2);
    }
  }

  function init() {
    updateDOM();
    document.getElementById('sliderM2').addEventListener('input', function () {
      setM2(parseFloat(this.value));
    });
  }

  return { init, draw, setM2 };

})();
