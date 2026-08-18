/**
 * panel-e.js — Panel E: Curva de Bragg · Hadronterapia
 *
 * Fisica real:
 *   - Poder de frenado: formula de Bethe-Bloch relativista (PDG 2022)
 *     -dE/dx = K z^2 (Z/A) / beta^2 x [0.5 ln(2me*c2*b2g2*Wmax/I^2) - beta^2]
 *   - Integracion numerica dx=0.05 cm desde E0 hasta el reposo
 *   - Straggling de energia: ensanchamiento gaussiano (aprox. Bohr)
 *   - Fotones: perfil empirico 6 MV (build-up + atenuacion exponencial)
 *
 * Particulas:
 *   - Protones  (z=1, M=938 MeV): slider 70-230 MeV   -> pico 4-33 cm
 *   - Iones C12 (z=6, M=11178 MeV): slider 100-430 MeV/u -> pico 3-32 cm
 *
 * Simplificaciones declaradas:
 *   - Factor de correccion 0.56 para aproximar correcciones de capa y densidad
 *     (Bethe-Bloch simple sobreestima ~1.8x respecto a NIST PSTAR)
 *   - Tejido homogeneo (rho=1 g/cm3, I=79.7 eV - agua liquida ICRU)
 *   - Sin fragmentacion nuclear (relevante para C6+ a profundidad)
 *   - Straggling: Gaussiana con sigma=1.2% del rango
 *
 * Depende de: constants.js (no directamente), physics.js (no directamente)
 */
'use strict';

const panelE = (() => {

  const cv = document.getElementById('canvasE');
  if (!cv) return { init: () => {} };
  const cx = cv.getContext('2d');
  const W = cv.width;
  const H = cv.height;
  const PAD = { T: 36, R: 30, B: 52, L: 62 };
  const PW  = W - PAD.L - PAD.R;
  const PH  = H - PAD.T - PAD.B;
  const X_MAX = 36; // cm en eje X

  // Constantes fisicas
  const K_BB     = 0.307075;  // MeV*cm2/mol
  const me_c2    = 0.51100;   // MeV
  const ZA_WATER = 0.5551;    // mol/g (agua: Z/A)
  const I_WATER  = 79.7e-6;   // MeV (potencial de ionizacion medio, ICRU 37)
  const RHO      = 1.0;       // g/cm3
  const CORR     = 0.56;      // correc. empirica (shell + density corrections)

  const PARTICLES = {
    proton: {
      z: 1, Mc2: 938.272, color: '#f59e0b', label: 'Protones  p\u207a',
      Emin: 70, Emax: 230, Edef: 150, step: 5, unitLabel: 'MeV', unitFactor: 1
    },
    carbon: {
      z: 6, Mc2: 12 * 931.494, color: '#a78bfa', label: 'Iones  \u00b9\u00b2C\u2076\u207a',
      Emin: 100, Emax: 430, Edef: 290, step: 10, unitLabel: 'MeV/u', unitFactor: 12
    }
  };

  let pKey    = 'proton';
  let E0_disp = 150;

  // ---- Fisica: Bethe-Bloch ----
  function stoppingPower(T, p) {
    if (T <= 0.1) return Infinity;
    const gamma  = 1 + T / p.Mc2;
    const g2     = gamma * gamma;
    const beta2  = 1 - 1 / g2;
    if (beta2 <= 0) return Infinity;
    const b2g2  = g2 - 1;
    const Wmax  = 2 * me_c2 * b2g2;
    const arg   = 2 * me_c2 * b2g2 * Wmax / (I_WATER * I_WATER);
    if (arg <= 1) return Infinity;
    const lTerm = 0.5 * Math.log(arg) - beta2;
    if (lTerm <= 0) return Infinity;
    return K_BB * p.z * p.z * ZA_WATER / beta2 * lTerm * RHO * CORR;
  }

  function calcBraggCurve(E0total, p) {
    const dx   = 0.05;
    const Tmin = 0.3;
    const depths = [], doses = [];
    let T = E0total, x = 0;

    while (T > Tmin && x <= X_MAX + 2) {
      const S  = stoppingPower(T, p);
      const dE = Math.min(S * dx, T - Tmin);
      doses.push(dE / dx);
      depths.push(x);
      T -= dE;
      x += dx;
    }
    if (!depths.length) return { depths: [0], doses: [0], range: 0 };

    const range  = x;
    const sigma  = Math.max(0.012 * range, 0.15);
    const smooth = gaussSmear(doses, sigma, dx);
    return { depths, doses: smooth, range };
  }

  function gaussSmear(data, sigma, dx) {
    const hw = Math.ceil(3.5 * sigma / dx);
    const out = new Array(data.length).fill(0);
    for (let i = 0; i < data.length; i++) {
      let s = 0, w = 0;
      for (let j = Math.max(0, i - hw); j <= Math.min(data.length - 1, i + hw); j++) {
        const d = (j - i) * dx;
        const g = Math.exp(-d * d / (2 * sigma * sigma));
        s += data[j] * g; w += g;
      }
      out[i] = w > 0 ? s / w : 0;
    }
    return out;
  }

  // Perfil de fotones 6 MV en tejido
  function photonDose(x) {
    const dBuild = 1.5, mu = 0.048;
    if (x <= 0) return 0;
    if (x < dBuild) return Math.pow(x / dBuild, 0.65);
    return Math.exp(-mu * (x - dBuild));
  }

  // ---- Dibujo ----
  function draw() {
    cx.clearRect(0, 0, W, H);
    cx.fillStyle = '#04080f';
    cx.fillRect(0, 0, W, H);

    const p       = PARTICLES[pKey];
    const E0tot   = E0_disp * p.unitFactor;
    const { depths, doses, range } = calcBraggCurve(E0tot, p);
    const maxD    = Math.max(...doses);
    const norm    = maxD > 0 ? 1 / maxD : 1;

    const toX = x => PAD.L + (x / X_MAX) * PW;
    const toY = d => PAD.T + PH * (1 - Math.min(d, 1.3) / 1.3);

    // Grid
    cx.lineWidth = 1;
    for (let g = 0; g <= X_MAX; g += 5) {
      cx.strokeStyle = 'rgba(255,255,255,0.04)';
      cx.beginPath(); cx.moveTo(toX(g), PAD.T); cx.lineTo(toX(g), PAD.T + PH); cx.stroke();
    }
    for (let d = 0; d <= 1.0; d += 0.25) {
      cx.strokeStyle = 'rgba(255,255,255,0.05)';
      cx.beginPath(); cx.moveTo(PAD.L, toY(d)); cx.lineTo(PAD.L + PW, toY(d)); cx.stroke();
    }

    // Zona tumor
    const pkIdx = doses.indexOf(maxD);
    const pkDep = depths[pkIdx] || range;
    const hw    = Math.max(range * 0.055, 0.8);
    const tx1   = toX(Math.max(0, pkDep - hw));
    const tx2   = toX(Math.min(X_MAX, pkDep + hw * 0.6));
    cx.fillStyle = 'rgba(251,146,60,0.08)';
    cx.fillRect(tx1, PAD.T, tx2 - tx1, PH);
    cx.font = '9px Inter, sans-serif';
    cx.fillStyle = 'rgba(251,146,60,0.6)';
    cx.textAlign = 'center';
    cx.fillText('tumor', (tx1 + tx2) / 2, PAD.T + 13);

    // Fotones
    cx.beginPath(); cx.strokeStyle = 'rgba(80,140,255,0.5)';
    cx.lineWidth = 1.6; cx.setLineDash([7, 4]);
    let first = true;
    for (let xi = 0; xi <= X_MAX; xi += 0.15) {
      const px = toX(xi), py = toY(photonDose(xi));
      first ? cx.moveTo(px, py) : cx.lineTo(px, py); first = false;
    }
    cx.stroke(); cx.setLineDash([]);
    cx.fillStyle = 'rgba(100,160,255,0.7)';
    cx.font = '9px Inter, sans-serif'; cx.textAlign = 'left';
    cx.fillText('Fotones X  6 MV', toX(3), toY(photonDose(3)) - 9);

    // Curva de Bragg
    cx.beginPath(); cx.strokeStyle = p.color; cx.lineWidth = 2.4;
    first = true;
    for (let i = 0; i < depths.length; i++) {
      if (depths[i] > X_MAX) break;
      const px = toX(depths[i]), py = toY(doses[i] * norm);
      first ? cx.moveTo(px, py) : cx.lineTo(px, py); first = false;
    }
    cx.stroke();

    // Linea vertical en pico
    const peakXc = toX(pkDep);
    cx.strokeStyle = p.color + '55'; cx.lineWidth = 1; cx.setLineDash([4, 4]);
    cx.beginPath(); cx.moveTo(peakXc, PAD.T); cx.lineTo(peakXc, PAD.T + PH); cx.stroke();
    cx.setLineDash([]);

    // Ejes
    cx.strokeStyle = 'rgba(255,255,255,0.22)'; cx.lineWidth = 1.2;
    cx.beginPath(); cx.moveTo(PAD.L, PAD.T + PH); cx.lineTo(PAD.L + PW, PAD.T + PH); cx.stroke();
    cx.beginPath(); cx.moveTo(PAD.L, PAD.T); cx.lineTo(PAD.L, PAD.T + PH); cx.stroke();

    // Etiquetas X
    cx.font = '9.5px JetBrains Mono, monospace';
    cx.fillStyle = 'rgba(180,200,220,0.65)'; cx.textAlign = 'center';
    for (let x = 0; x <= X_MAX; x += 5) {
      const px = toX(x);
      cx.fillText(x, px, PAD.T + PH + 16);
      cx.strokeStyle = 'rgba(255,255,255,0.18)'; cx.lineWidth = 1;
      cx.beginPath(); cx.moveTo(px, PAD.T + PH); cx.lineTo(px, PAD.T + PH + 5); cx.stroke();
    }
    cx.fillStyle = 'rgba(180,200,220,0.65)';
    cx.fillText('Profundidad en tejido  (cm)', PAD.L + PW / 2, PAD.T + PH + 36);

    // Etiquetas Y
    cx.textAlign = 'right';
    for (let d = 0; d <= 1.0; d += 0.25) {
      cx.fillText(d.toFixed(2), PAD.L - 8, toY(d) + 3);
    }
    cx.save(); cx.translate(13, PAD.T + PH / 2); cx.rotate(-Math.PI / 2);
    cx.textAlign = 'center';
    cx.fillText('Dosis relativa  (u.a.)', 0, 0);
    cx.restore();

    // Leyenda
    cx.font = 'bold 10px Inter, sans-serif'; cx.fillStyle = p.color; cx.textAlign = 'left';
    cx.fillText(p.label + '    E\u2080 = ' + E0_disp + ' ' + p.unitLabel, PAD.L + 8, PAD.T + 16);
    cx.font = '9px JetBrains Mono, monospace'; cx.fillStyle = p.color + 'aa'; cx.textAlign = 'center';
    cx.fillText('pico: ' + pkDep.toFixed(1) + ' cm', peakXc, PAD.T + PH - 8);

    // Metricas externas
    const mPeak = document.getElementById('val-bragg-peak');
    const mZ    = document.getElementById('val-bragg-z');
    const mPar  = document.getElementById('val-bragg-par');
    if (mPeak) mPeak.textContent = pkDep.toFixed(1) + ' cm';
    if (mZ)    mZ.textContent    = 'z=' + p.z + '  z\u00b2=' + (p.z * p.z);
    if (mPar)  mPar.textContent  = p.label;
  }

  // ---- API publica ----
  function setEnergy(val) {
    E0_disp = parseFloat(val);
    const lbl = document.getElementById('valE_bragg');
    if (lbl) lbl.textContent = E0_disp + ' ' + PARTICLES[pKey].unitLabel;
    draw();
  }

  function setParticle(key) {
    pKey = key;
    const p = PARTICLES[pKey];
    const slider = document.getElementById('sliderE_bragg');
    if (slider) {
      slider.min = p.Emin; slider.max = p.Emax; slider.step = p.step;
      if (E0_disp < p.Emin || E0_disp > p.Emax) { E0_disp = p.Edef; slider.value = E0_disp; }
    }
    const lbl = document.getElementById('valE_bragg');
    if (lbl) lbl.textContent = E0_disp + ' ' + p.unitLabel;
    ['proton', 'carbon'].forEach(k => {
      const b = document.getElementById('braggBtn_' + k);
      if (b) b.classList.toggle('active', k === key);
    });
    draw();
  }

  function init() { draw(); }

  return { init, setEnergy, setParticle };
})();