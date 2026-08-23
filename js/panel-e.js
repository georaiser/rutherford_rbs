/**
 * panel-e.js — Panel E: Espectrometría PIXE y Ley de Moseley
 *
 * Física cuántica pedagógica:
 *   - Múltiples transiciones posibles:
 *       • Kα : Salto L → K (n=2 → n=1)  [Más intensa y frecuente]
 *       • Kβ : Salto M → K (n=3 → n=1)  [Mayor energía que Kα: ΔE mayor]
 *       • Lα : Salto M → L (n=3 → n=2)  [Menor energía: excitada en elementos pesados]
 *   - Cada salto emite un fotón de Rayos X discreto: ΔE = hν = hc/λ
 *   - Ley de Moseley (1913): E(Kα) ≈ (3/4) * 13.6 eV * (Z - 1)²
 */
'use strict';

const panelE = (() => {

  const cv = document.getElementById('canvasE');
  if (!cv) return { init: () => {}, setPreset: () => {}, setElement: () => {}, setTransition: () => {} };
  const cx = cv.getContext('2d');
  const W = cv.width;
  const H = cv.height;

  // Base de datos de elementos con líneas exactas de Rayos X (keV)
  const ELEMENTS = {
    Ti: { name: 'Titanio', Z: 22, color: '#38bdf8', Ka: 4.51, Kb: 4.93, La: null, role: 'Blanco de titanio (óleo moderno)' },
    Fe: { name: 'Hierro', Z: 26, color: '#f59e0b', Ka: 6.40, Kb: 7.06, La: 0.70, role: 'Ocre rojo / amarillo (tierra natural)' },
    Cu: { name: 'Cobre', Z: 29, color: '#06b6d4', Ka: 8.04, Kb: 8.91, La: 0.93, role: 'Azul azurita / verde malaquita' },
    Ag: { name: 'Plata', Z: 47, color: '#94a3b8', Ka: 22.16, Kb: 24.94, La: 2.98, role: 'Aleación de plata / moneda' },
    Au: { name: 'Oro', Z: 79, color: '#fbbf24', Ka: 68.8, Kb: 77.9, La: 9.71, Lb: 11.44, role: 'Pan de oro / orfebrería pura' },
    Hg: { name: 'Mercurio', Z: 80, color: '#f43f5e', Ka: 70.8, Kb: 80.2, La: 9.99, Lb: 11.82, role: 'Rojo bermellón (cinabrio histórico)' },
    Pb: { name: 'Plomo', Z: 82, color: '#a78bfa', Ka: 74.9, Kb: 84.9, La: 10.55, Lb: 12.61, role: 'Blanco de plomo (albayalde en óleos)' }
  };

  const PRESETS = {
    louvre: {
      name: 'Pintura al Óleo (Louvre)',
      elements: ['Pb', 'Hg', 'Cu', 'Fe'],
      activeEl: 'Hg',
      trans: 'La',
      desc: 'Pigmentos en óleo: Albayalde (Pb), Bermellón (Hg), Azurita (Cu) y Ocre (Fe).'
    },
    gold: {
      name: 'Joya de Oro Antigua',
      elements: ['Au', 'Ag', 'Cu'],
      activeEl: 'Au',
      trans: 'La',
      desc: 'Orfebrería arqueológica: contenido de Oro puro, Plata y Cobre.'
    },
    meteorite: {
      name: 'Meteorito / Nanomaterial',
      elements: ['Fe', 'Ti', 'Cu'],
      activeEl: 'Fe',
      trans: 'Ka',
      desc: 'Cosmoquímica: matriz de Hierro nativo y trazas de Titanio.'
    },
    all: {
      name: 'Multielemento',
      elements: ['Ti', 'Fe', 'Cu', 'Ag', 'Au'],
      activeEl: 'Cu',
      trans: 'Ka',
      desc: 'Visión general de líneas K y L según la Ley de Moseley.'
    }
  };

  let currentPreset = 'louvre';
  let activeElementKey = 'Hg';
  let activeTrans = 'La'; // 'Ka', 'Kb', 'La'
  let stepPhase = 0; // 0: haz llegando, 1: vacancia, 2: salto cuántico, 3: emisión de rayo X
  let phaseTimer = 0;
  let photonRadius = 0;

  function setPreset(key) {
    if (!PRESETS[key]) return;
    currentPreset = key;
    activeElementKey = PRESETS[key].activeEl;
    activeTrans = PRESETS[key].trans;
    resetCycle();
    updateUI();
    updateButtons();
  }

  function setElement(elKey) {
    if (!ELEMENTS[elKey]) return;
    activeElementKey = elKey;
    const el = ELEMENTS[elKey];
    if (el.Z >= 79 && !el.Ka) activeTrans = 'La';
    else if (!activeTrans || (activeTrans === 'La' && el.Z < 47)) activeTrans = 'Ka';
    resetCycle();
    updateUI();
    updateButtons();
  }

  function setTransition(trKey) {
    activeTrans = trKey;
    resetCycle();
    updateUI();
    updateButtons();
  }

  function resetCycle() {
    stepPhase = 0;
    phaseTimer = 0;
    photonRadius = 0;
  }

  function updateElementButtons() {
    const container = document.getElementById('pixeElementList');
    if (!container) return;
    const preset = PRESETS[currentPreset];
    const elKeys = preset ? preset.elements : Object.keys(ELEMENTS);

    container.innerHTML = '';
    elKeys.forEach(k => {
      const el = ELEMENTS[k];
      if (!el) return;
      const btn = document.createElement('button');
      btn.className = 'mode-btn' + (k === activeElementKey ? ' active' : '');
      btn.innerHTML = `<b>${k}</b> (${el.Z})`;
      btn.title = `${el.name}: ${el.role}`;
      btn.onclick = () => setElement(k);
      container.appendChild(btn);
    });
  }

  function updateButtons() {
    ['louvre', 'gold', 'meteorite', 'all'].forEach(k => {
      const b = document.getElementById('btnPixe_' + k);
      if (b) b.classList.toggle('active', k === currentPreset);
    });
    ['Ka', 'Kb', 'La', 'Lb'].forEach(t => {
      const b = document.getElementById('btnTrans_' + t);
      if (b) b.classList.toggle('active', t === activeTrans);
    });
    updateElementButtons();
  }

  function getActiveEnergyAndTrans() {
    const el = ELEMENTS[activeElementKey];
    if (!el) return { e: 8.04, label: 'Kα', desc: 'L → K (n=2 → 1)', fromShell: 'L', toShell: 'K', fromN: 2, toN: 1 };

    if (activeTrans === 'Kb' && el.Kb) {
      const eVal = el.Kb;
      return { e: eVal, label: `${activeElementKey} Kβ`, desc: 'M → K (n=3 → 1)', fromShell: 'M', toShell: 'K', fromN: 3, toN: 1, outOfRange: eVal > 25.0 };
    } else if (activeTrans === 'La' && el.La) {
      return { e: el.La, label: `${activeElementKey} Lα`, desc: 'M → L (n=3 → 2)', fromShell: 'M', toShell: 'L', fromN: 3, toN: 2, outOfRange: false };
    } else if (activeTrans === 'Lb' && el.Lb) {
      return { e: el.Lb, label: `${activeElementKey} Lβ`, desc: 'N → L (n=4 → 2)', fromShell: 'N', toShell: 'L', fromN: 4, toN: 2, outOfRange: false };
    } else if (activeTrans === 'Ka' && el.Ka) {
      const eVal = el.Ka;
      return { e: eVal, label: `${activeElementKey} Kα`, desc: 'L → K (n=2 → 1)', fromShell: 'L', toShell: 'K', fromN: 2, toN: 1, outOfRange: eVal > 25.0 };
    } else {
      const eVal = el.La || el.Ka || 8.04;
      const isL = (eVal === el.La);
      return {
        e: eVal,
        label: `${activeElementKey} ${isL ? 'Lα' : 'Kα'}`,
        desc: isL ? 'M → L (n=3 → 2)' : 'L → K (n=2 → 1)',
        fromShell: isL ? 'M' : 'L',
        toShell: isL ? 'L' : 'K',
        fromN: isL ? 3 : 2,
        toN: isL ? 2 : 1,
        outOfRange: eVal > 25.0
      };
    }
  }

  function updateUI() {
    const el = ELEMENTS[activeElementKey];
    if (!el) return;
    const tr = getActiveEnergyAndTrans();

    const valEl = document.getElementById('val-pixe-el');
    const valTrans = document.getElementById('val-pixe-trans');
    const valEnergy = document.getElementById('val-pixe-energy');
    const valWave = document.getElementById('val-pixe-lambda');

    // λ = hc / E = 12.3984 / E(keV) en Å
    const lambda = (12.3984 / tr.e).toFixed(3);

    if (valEl) valEl.innerHTML = `${el.name} (Z=${el.Z}) <br><span style="font-size:0.75rem;color:var(--muted)">${el.role}</span>`;
    if (valTrans) valTrans.textContent = `${tr.label} : ${tr.desc}`;
    if (valEnergy) {
      if (tr.outOfRange) {
        valEnergy.innerHTML = `${tr.e.toFixed(1)} <span class="metric-unit">keV (Rayo X duro)</span>`;
      } else {
        valEnergy.innerHTML = `${tr.e.toFixed(2)} <span class="metric-unit">keV</span>`;
      }
    }
    if (valWave) valWave.innerHTML = `${lambda} <span class="metric-unit">Å (${(lambda * 100).toFixed(0)} pm)</span>`;
  }

  // Vista 1: Átomo interactivo con órbitas K, L, M (X: 14 a 340)
  function drawAtomView() {
    const el = ELEMENTS[activeElementKey];
    if (!el) return;
    const tr = getActiveEnergyAndTrans();
    const acx = 175, acy = 150;

    // Fondo tarjeta átomo
    cx.fillStyle = 'rgba(255,255,255,0.015)';
    cx.strokeStyle = 'rgba(255,255,255,0.08)';
    cx.lineWidth = 1;
    cx.beginPath();
    cx.roundRect(14, 14, 322, H - 28, 8);
    cx.fill();
    cx.stroke();

    // Banner superior
    cx.fillStyle = 'rgba(220,230,245,0.9)';
    cx.font = '600 11px Inter, sans-serif';
    cx.textAlign = 'center';
    cx.fillText(`Átomo de ${el.name} (Z=${el.Z}) — Salto ${tr.desc}`, acx, 34);

    // Órbitas K, L, M, N (Etiquetas colocadas arriba a la izquierda para NO colisionar con electrones)
    const rK = 36, rL = 64, rM = 92, rN = 120;
    const shells = {
      K: { r: rK, label: 'K (n=1)', color: 'rgba(239,68,68,0.4)' },
      L: { r: rL, label: 'L (n=2)', color: 'rgba(56,189,248,0.4)' },
      M: { r: rM, label: 'M (n=3)', color: 'rgba(168,85,247,0.4)' },
      N: { r: rN, label: 'N (n=4)', color: 'rgba(52,211,153,0.4)' }
    };

    Object.keys(shells).forEach(sKey => {
      const sh = shells[sKey];
      cx.beginPath();
      cx.arc(acx, acy, sh.r, 0, Math.PI * 2);
      cx.strokeStyle = sh.color;
      cx.lineWidth = 1.2;
      cx.setLineDash([3, 3]);
      cx.stroke();
      cx.setLineDash([]);

      // Etiqueta en el cuadrante superior-izquierdo (135°)
      const ang = (3 * Math.PI) / 4;
      const lx = acx + sh.r * Math.cos(ang);
      const ly = acy - sh.r * Math.sin(ang);
      cx.fillStyle = 'rgba(180,195,220,0.6)';
      cx.font = '8.5px JetBrains Mono, monospace';
      cx.textAlign = 'right';
      cx.fillText(sh.label, lx - 4, ly);
    });

    // Núcleo central
    cx.beginPath();
    cx.arc(acx, acy, 16, 0, Math.PI * 2);
    cx.fillStyle = el.color;
    cx.fill();
    cx.strokeStyle = '#ffffff';
    cx.lineWidth = 1.2;
    cx.stroke();

    cx.fillStyle = '#000000';
    cx.font = 'bold 10px JetBrains Mono, monospace';
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(`+${el.Z}`, acx, acy);
    cx.textBaseline = 'alphabetic';

    // Estado de la animación (Ciclo de 4 fases)
    phaseTimer++;
    if (phaseTimer > 180) {
      phaseTimer = 0;
      stepPhase = (stepPhase + 1) % 4;
      if (stepPhase === 3) photonRadius = 14;
    }

    // Posiciones de origen y destino del salto (en el radio derecho)
    const toRadius = shells[tr.toShell].r;
    const fromRadius = shells[tr.fromShell].r;
    const destX = acx + toRadius, destY = acy;
    const origX = acx + fromRadius, origY = acy;

    let stepInfoText = '';
    let stepInfoColor = '#94a3b8';

    // FASE 0: Haz alfa aproximándose
    if (stepPhase === 0) {
      const alphaProg = phaseTimer / 180;
      const ax = 30 + alphaProg * (destX - 30);
      const ay = 65 + alphaProg * (destY - 65);

      cx.beginPath();
      cx.arc(ax, ay, 5, 0, Math.PI * 2);
      cx.fillStyle = '#f59e0b';
      cx.fill();
      cx.strokeStyle = '#fbbf24';
      cx.stroke();

      // Electrones en posición
      cx.beginPath(); cx.arc(destX, destY, 3.5, 0, Math.PI * 2); cx.fillStyle = '#67e8f9'; cx.fill();
      cx.beginPath(); cx.arc(origX, origY, 3.5, 0, Math.PI * 2); cx.fillStyle = '#67e8f9'; cx.fill();

      stepInfoText = `① Proyectil α (2 MeV) ingresa hacia capa ${tr.toShell}`;
      stepInfoColor = '#f59e0b';
    }

    // FASE 1: Impacto y expulsión del electrón
    else if (stepPhase === 1) {
      const ejectProg = phaseTimer / 180;
      const ejX = destX + ejectProg * 75;
      const ejY = destY + ejectProg * 45;

      // Fotoelectrón expulsado
      cx.beginPath();
      cx.arc(ejX, ejY, 3, 0, Math.PI * 2);
      cx.fillStyle = '#ef4444';
      cx.fill();

      // Vacancia en destino (círculo rojo parpadeante)
      cx.beginPath();
      cx.arc(destX, destY, 5, 0, Math.PI * 2);
      cx.strokeStyle = '#ef4444';
      cx.lineWidth = 1.5;
      cx.setLineDash([2, 2]);
      cx.stroke();
      cx.setLineDash([]);

      // Electrón en origen listo para caer
      cx.beginPath(); cx.arc(origX, origY, 4, 0, Math.PI * 2); cx.fillStyle = '#67e8f9'; cx.fill();

      stepInfoText = `② Ionización: e⁻ expulsado de capa ${tr.toShell} (crea vacancia)`;
      stepInfoColor = '#ef4444';
    }

    // FASE 2: Salto cuántico
    else if (stepPhase === 2) {
      const jumpProg = phaseTimer / 180;
      const curEx = origX - jumpProg * (origX - destX);
      const curEy = origY;

      // Electrón cayendo
      cx.beginPath();
      cx.arc(curEx, curEy, 4.5, 0, Math.PI * 2);
      cx.fillStyle = '#a78bfa';
      cx.fill();

      // Flecha de transición
      cx.beginPath();
      cx.moveTo(origX, origY);
      cx.lineTo(curEx, curEy);
      cx.strokeStyle = '#a78bfa';
      cx.lineWidth = 2.2;
      cx.stroke();

      stepInfoText = `③ Salto cuántico espontáneo: ${tr.desc}`;
      stepInfoColor = '#a78bfa';
    }

    // FASE 3: Emisión del fotón de Rayos X
    else if (stepPhase === 3) {
      cx.beginPath(); cx.arc(destX, destY, 3.5, 0, Math.PI * 2); cx.fillStyle = '#67e8f9'; cx.fill();

      photonRadius += 0.85;
      const opac = Math.max(0, 1 - photonRadius / 110);

      cx.save();
      cx.beginPath();
      cx.arc(destX, destY, photonRadius, 0, Math.PI * 2);
      cx.strokeStyle = `rgba(167, 139, 250, ${opac})`;
      cx.lineWidth = 2.4;
      cx.stroke();
      cx.restore();

      stepInfoText = `④ Fotón Rayo X emitido: ${tr.label} (${tr.e.toFixed(2)} keV)`;
      stepInfoColor = '#38bdf8';
    }

    // Banner inferior con el paso activo despejado
    cx.fillStyle = 'rgba(0,0,0,0.55)';
    cx.beginPath();
    cx.roundRect(24, H - 40, 302, 22, 5);
    cx.fill();
    cx.strokeStyle = 'rgba(255,255,255,0.1)';
    cx.stroke();

    cx.fillStyle = stepInfoColor;
    cx.font = 'bold 9.5px Inter, sans-serif';
    cx.textAlign = 'center';
    cx.fillText(stepInfoText, acx, H - 25);
  }

  // Vista 2: Espectro de Rayos X multicanal (X: 345 a 785)
  function drawSpectrumView() {
    const spX = 345, spY = 14, spW = W - spX - 14, spH = H - 28;
    const PAD_L = 44, PAD_B = 34, PAD_T = 24, PAD_R = 16;
    const plotW = spW - PAD_L - PAD_R;
    const plotH = spH - PAD_T - PAD_B;
    const E_MAX = 25.0; // keV
    const trActive = getActiveEnergyAndTrans();
    const activeEl = ELEMENTS[activeElementKey];

    // Fondo espectro
    cx.fillStyle = 'rgba(0,0,0,0.35)';
    cx.strokeStyle = 'rgba(255,255,255,0.08)';
    cx.lineWidth = 1;
    cx.beginPath();
    cx.roundRect(spX, spY, spW, spH, 8);
    cx.fill();
    cx.stroke();

    // Título
    cx.fillStyle = 'rgba(220,230,245,0.9)';
    cx.font = '600 11px Inter, sans-serif';
    cx.textAlign = 'left';
    cx.fillText(`Espectro PIXE — Líneas de Rayos X de ${activeEl ? activeEl.name : ''} (keV)`, spX + PAD_L, spY + 16);

    const toX = e => spX + PAD_L + (Math.min(Math.max(e, 0), E_MAX) / E_MAX) * plotW;
    const toY = cnt => spY + PAD_T + plotH * (1 - Math.min(cnt, 1.05));

    // Grilla
    for (let e = 0; e <= E_MAX; e += 5) {
      const gx = toX(e);
      cx.strokeStyle = 'rgba(255,255,255,0.04)';
      cx.beginPath(); cx.moveTo(gx, spY + PAD_T); cx.lineTo(gx, spY + PAD_T + plotH); cx.stroke();
      cx.fillStyle = 'rgba(160,175,200,0.5)';
      cx.font = '9px JetBrains Mono, monospace';
      cx.textAlign = 'center';
      cx.fillText(e, gx, spY + PAD_T + plotH + 14);
    }
    cx.fillStyle = 'rgba(160,175,200,0.7)';
    cx.fillText('Energía del Rayo X E (keV) — E ∝ (Z-1)²', spX + PAD_L + plotW / 2, spY + PAD_T + plotH + 28);

    // Fondo continuo Bremsstrahlung
    cx.beginPath();
    cx.strokeStyle = 'rgba(255,255,255,0.08)';
    cx.lineWidth = 1.0;
    for (let ex = 0.5; ex <= E_MAX; ex += 0.2) {
      const bg = 0.03 * Math.exp(-ex / 4.0) + 0.008;
      const px = toX(ex), py = toY(bg);
      ex === 0.5 ? cx.moveTo(px, py) : cx.lineTo(px, py);
    }
    cx.stroke();

    // Dibujar EXCLUSIVAMENTE los picos del elemento seleccionado para máxima limpieza visual
    if (activeEl) {
      const peaks = [];
      if (activeEl.Ka && activeEl.Ka <= E_MAX) {
        peaks.push({ e: activeEl.Ka, tKey: 'Ka', h: (activeTrans === 'Ka') ? 0.92 : 0.65, label: `${activeElementKey} Kα (${activeEl.Ka} keV)` });
      }
      if (activeEl.Kb && activeEl.Kb <= E_MAX) {
        peaks.push({ e: activeEl.Kb, tKey: 'Kb', h: (activeTrans === 'Kb') ? 0.48 : 0.28, label: `${activeElementKey} Kβ (${activeEl.Kb} keV)` });
      }
      if (activeEl.La && activeEl.La <= E_MAX) {
        peaks.push({ e: activeEl.La, tKey: 'La', h: (activeTrans === 'La') ? 0.88 : 0.60, label: `${activeElementKey} Lα (${activeEl.La} keV)` });
      }
      if (activeEl.Lb && activeEl.Lb <= E_MAX) {
        peaks.push({ e: activeEl.Lb, tKey: 'Lb', h: (activeTrans === 'Lb') ? 0.50 : 0.30, label: `${activeElementKey} Lβ (${activeEl.Lb} keV)` });
      }

      peaks.forEach(pk => {
        const px = toX(pk.e);
        const py = toY(pk.h);
        const isHighlight = (pk.tKey === activeTrans);
        const sigmaX = isHighlight ? 4.0 : 3.0;

        // Campana gaussiana
        cx.beginPath();
        cx.strokeStyle = activeEl.color;
        cx.lineWidth = isHighlight ? 2.6 : 1.2;
        cx.fillStyle = activeEl.color + (isHighlight ? '44' : '15');

        for (let xOff = -18; xOff <= 18; xOff += 1) {
          const g = Math.exp(-(xOff * xOff) / (2 * sigmaX * sigmaX));
          const gx = px + xOff;
          const gy = toY(pk.h * g + 0.015);
          xOff === -18 ? cx.moveTo(gx, toY(0)) : cx.lineTo(gx, gy);
        }
        cx.lineTo(px + 18, toY(0));
        cx.closePath();
        cx.fill();
        cx.stroke();

        // Si es la transición activa: cursor vertical, destello y marcador de energía
        if (isHighlight) {
          // Línea dropline vertical punteada
          cx.beginPath();
          cx.setLineDash([3, 3]);
          cx.strokeStyle = activeEl.color;
          cx.lineWidth = 1.2;
          cx.moveTo(px, py);
          cx.lineTo(px, spY + PAD_T + plotH);
          cx.stroke();
          cx.setLineDash([]);

          // Punto cúspide iluminado
          cx.beginPath();
          cx.arc(px, py, 4, 0, Math.PI * 2);
          cx.fillStyle = '#ffffff';
          cx.fill();
          cx.strokeStyle = activeEl.color;
          cx.stroke();

          // Destello durante emisión
          if (stepPhase === 3) {
            cx.beginPath();
            cx.arc(px, py, 8, 0, Math.PI * 2);
            cx.strokeStyle = 'rgba(255,255,255,0.85)';
            cx.lineWidth = 1.5;
            cx.stroke();
          }

          // Etiqueta destacada
          cx.fillStyle = '#ffffff';
          cx.font = 'bold 10px JetBrains Mono, monospace';
          cx.textAlign = 'center';
          cx.fillText(pk.label, px, py - 9);
        } else {
          cx.fillStyle = 'rgba(200,215,235,0.7)';
          cx.font = '8.5px JetBrains Mono, monospace';
          cx.textAlign = 'center';
          cx.fillText(pk.label, px, py - 6);
        }
      });
    }

    // Ejes
    cx.strokeStyle = 'rgba(255,255,255,0.25)';
    cx.lineWidth = 1.2;
    cx.beginPath();
    cx.moveTo(spX + PAD_L, spY + PAD_T);
    cx.lineTo(spX + PAD_L, spY + PAD_T + plotH);
    cx.lineTo(spX + PAD_L + plotW, spY + PAD_T + plotH);
    cx.stroke();
  }

  function render() {
    cx.clearRect(0, 0, W, H);
    cx.fillStyle = '#04080f';
    cx.fillRect(0, 0, W, H);

    drawAtomView();
    drawSpectrumView();

    requestAnimationFrame(render);
  }

  function init() {
    updateUI();
    updateButtons();
    resetCycle();
    requestAnimationFrame(render);
  }

  return {
    init,
    setPreset,
    setElement,
    setTransition
  };

})();

document.addEventListener('DOMContentLoaded', () => {
  if (typeof panelE !== 'undefined') panelE.init();
});