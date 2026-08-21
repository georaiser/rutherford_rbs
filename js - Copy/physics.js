/**
 * physics.js — Funciones físicas centrales
 *
 * Todas las fórmulas son exactas (sin tablas precalculadas).
 * La fuente de cada fórmula está indicada en los comentarios.
 *
 * Unidades: MeV, fm, u  (ver constants.js)
 */
'use strict';

const Physics = (() => {

  // ─────────────────────────────────────────────────────────────────────────
  // 1. PARÁMETRO DE RUTHERFORD  a₀(E)
  //    a₀ = ke²·Z₁·Z₂ / (2E)
  //    Es la distancia de máximo acercamiento para colisión frontal (b=0).
  //    Fuente: Rutherford (1911); Chu et al. (1978) ec. 2.1
  // ─────────────────────────────────────────────────────────────────────────
  function calcA0(E_MeV, Z2 = PHYS.Z2_AU) {
    return PHYS.Z1 * Z2 * PHYS.KE2 / (2 * E_MeV); // fm
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. ÁNGULO DE DISPERSIÓN DE RUTHERFORD  θ(b)
  //    De b = a₀·cot(θ/2)  →  θ = 2·arctan(a₀/b)
  //    Válido para b > 0; b = 0 → θ = π (frontal).
  //    Fuente: Goldstein, Classical Mechanics, cap. 3
  // ─────────────────────────────────────────────────────────────────────────
  function calcTheta(b_norm) {
    // b_norm: parámetro de impacto en unidades de a₀
    if (b_norm < 1e-10) return Math.PI;
    return 2 * Math.atan(1 / b_norm);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. FACTOR CINEMÁTICO K  (colisión elástica, conservación de E y p)
  //    K(M₂,θ) = [(√(M₂²−M₁²sin²θ) + M₁cosθ) / (M₁+M₂)]²
  //    Devuelve null si M₂ < M₁·|sinθ| (solución no física)
  //    Fuente: Chu, Mayer & Nicolet (1978) ec. 2.4
  // ─────────────────────────────────────────────────────────────────────────
  function calcK(M2, theta) {
    const s = Math.sin(theta);
    const c = Math.cos(theta);
    const disc = M2 * M2 - PHYS.M1 * PHYS.M1 * s * s;
    if (disc < 0) return null; // M₁ > M₂ a este ángulo: sin solución real
    return Math.pow((Math.sqrt(disc) + PHYS.M1 * c) / (PHYS.M1 + M2), 2);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. SECCIÓN EFICAZ DIFERENCIAL DE RUTHERFORD (relativa)
  //    dσ/dΩ ∝ (Z₁Z₂e²/4E₀)²·1/sin⁴(θ/2) ∝ Z₂²  (θ y E₀ fijos en RBS)
  //    Físicamente correcta para igual concentración superficial N_i.
  //    Fuente: Rutherford (1911); Mott & Massey, Theory of Atomic Collisions
  //    Nota: el cálculo cuántico (Born, 1926) da exactamente el mismo resultado.
  // ─────────────────────────────────────────────────────────────────────────
  function relCrossSection(Z2) {
    // Con θ y E₀ constantes, la proporción relativa reduce a Z₂²
    return Z2 * Z2;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5. DEFLEXIÓN EN EL MODELO DE THOMSON (esfera uniforme de carga)
  //    θ_Th(b) = (ke²·Z₁Z₂ / E·R³) · b·√(R²−b²)  para b ≤ R
  //    θ_Th = 0  para b > R  (átomo neutro visto desde fuera)
  //    Fuente: Thomson (1910); Rutherford (1911) — contexto histórico
  //
  //    En unidades reducidas (a₀=1, R_norm = R/a₀):
  //    θ_Th = 2·b_norm·√(R_norm²−b_norm²) / R_norm³
  //
  //    Resultado típico: θ_max = a₀/R_atom ≈ 0.007° para Au a 7 MeV.
  //    NOTA: estas son fórmulas reales, NO esquemáticas.
  // ─────────────────────────────────────────────────────────────────────────
  function calcThetaThomson(b_norm, R_norm) {
    if (b_norm >= R_norm) return 0; // fuera del átomo: sin deflexión
    const under = R_norm * R_norm - b_norm * b_norm;
    return 2 * b_norm * Math.sqrt(under) / Math.pow(R_norm, 3); // radianes
  }

  // Deflexión máxima de Thomson: θ_max = a₀/R (en rad), ocurre en b = R/√2
  function thetaThomsonMax_deg(a0_fm) {
    return (a0_fm / PHYS.R_AU_FM) * (180 / Math.PI);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 6. VELOCIDAD DE RECULE DEL BLANCO (colisión elástica, aproximación lineal)
  //    v_recoil / v₀ = 2M₁ / (M₁ + M₂)   [colisión frontal: ángulo=0]
  //    Para 170°, la expresión exacta depende del ángulo de recule, pero
  //    este estimado es suficiente para la animación.
  //    Fuente: Krane, Introductory Nuclear Physics, cap. 2
  // ─────────────────────────────────────────────────────────────────────────
  function recoilSpeed(M2) {
    return 2 * PHYS.M1 / (PHYS.M1 + M2); // fracción de v₀
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 7. INTEGRACIÓN RK4 DE LA TRAYECTORIA (movimiento en potencial de Coulomb)
  //
  //    Ecuación de movimiento en unidades reducidas (a₀=1, v₀=1, m=1):
  //      F_Coulomb = 1/r²  (en unidades donde ke²Z₁Z₂ = 2E·a₀ = 1)
  //    La aceleración es radialmente repulsiva.
  //
  //    Para Thomson: dentro del átomo (r < R_norm), F ∝ r (esfera uniforme)
  //                  fuera (r > R_norm), F = 0 (átomo neutro)
  //
  //    Fuente: Goldstein (1980); ecuación de órbita hiperbólica en potencial 1/r
  // ─────────────────────────────────────────────────────────────────────────

  function _accel(x, y, isRutherford, R_norm) {
    const r = Math.hypot(x, y);
    if (r < 0.04) return [0, 0]; // evitar singularidad numérica
    let F;
    if (isRutherford) {
      F = 1 / (r * r);  // Coulomb puntual: F = 1/r² (u.r.)
    } else {
      // Thomson: esfera de carga uniforme
      F = r < R_norm ? r / Math.pow(R_norm, 3) : 0;
    }
    return [F * x / r, F * y / r];
  }

  function _rk4Step(state, dt, isRutherford, R_norm) {
    // state = [x, y, vx, vy]
    const d = ([x, y, vx, vy]) => {
      const [ax, ay] = _accel(x, y, isRutherford, R_norm);
      return [vx, vy, ax, ay];
    };
    const k1 = d(state);
    const k2 = d(state.map((s, i) => s + dt / 2 * k1[i]));
    const k3 = d(state.map((s, i) => s + dt / 2 * k2[i]));
    const k4 = d(state.map((s, i) => s + dt * k3[i]));
    return state.map((s, i) => s + (dt / 6) * (k1[i] + 2*k2[i] + 2*k3[i] + k4[i]));
  }

  /**
   * Integra la trayectoria completa de una partícula.
   * @param {number} b_norm  Parámetro de impacto en unidades de a₀
   * @param {boolean} isRutherford  true = potencial Coulomb; false = esfera Thomson
   * @param {number} R_norm  Radio del átomo en unidades de a₀ (solo Thomson)
   * @param {number} R_start  Distancia de inicio en unidades de a₀ (default 32)
   * @returns {{ pts: Array<[number,number]>, thetaDeg: number }}
   */
  function integrateTraj(b_norm, isRutherford, R_norm, R_start = 32) {
    const dt   = isRutherford ? 0.07 : 0.4;
    const max  = isRutherford ? 2800 : 1500;
    const lim  = R_start + 6;

    let state = [-R_start, b_norm, 1.0, 0.0];
    const pts = [[state[0], state[1]]];

    for (let i = 0; i < max; i++) {
      state = _rk4Step(state, dt, isRutherford, R_norm);
      pts.push([state[0], state[1]]);
      if (state[0] > lim || state[0] < -(lim + 4)) break;
      if (Math.hypot(state[0], state[1]) < 0.03)    break; // singularidad
    }

    // Ángulo de dispersión real (de los últimos puntos)
    const n    = pts.length;
    const tail = Math.max(0, n - 14);
    const dx   = pts[n-1][0] - pts[tail][0];
    const dy   = pts[n-1][1] - pts[tail][1];
    const sp   = Math.hypot(dx, dy);
    const thetaDeg = sp > 1e-9
      ? Math.acos(Math.max(-1, Math.min(1, dx / sp))) * 180 / Math.PI
      : 0;

    return { pts, thetaDeg };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 8. UTILIDAD — elemento más cercano a M₂ dado
  // ─────────────────────────────────────────────────────────────────────────
  function closestElement(M2_val) {
    return ELEMENTS.reduce((best, el) =>
      Math.abs(el.M2 - M2_val) < Math.abs(best.M2 - M2_val) ? el : best
    );
  }

  // API pública
  return {
    calcA0,
    calcTheta,
    calcK,
    relCrossSection,
    calcThetaThomson,
    thetaThomsonMax_deg,
    recoilSpeed,
    integrateTraj,
    closestElement,
  };

})();
