/**
 * constants.js — Constantes físicas y parámetros del experimento
 *
 * Todas las constantes están en unidades SI derivadas convenientes:
 *   Energía:  MeV
 *   Longitud: fm  (1 fm = 10⁻¹⁵ m)
 *   Masa:     u   (unidades de masa atómica)
 *
 * Referencias:
 *   - Chu, Mayer & Nicolet (1978), Backscattering Spectrometry, Academic Press
 *   - Feldman & Mayer (1986), Fundamentals of Surface and Thin Film Analysis
 *   - ke² = 1.4399 MeV·fm  (NIST CODATA)
 */
'use strict';

const PHYS = Object.freeze({
  // Constante de Coulomb × e²
  KE2: 1.44,         // MeV·fm

  // Proyectil: partícula alfa (He-4)
  Z1:  2,            // número atómico
  M1:  4,            // masa en u

  // Blanco histórico Panel A: lámina de Au (Geiger-Marsden, 1909)
  Z2_AU: 79,

  // Parámetros RBS estándar (Paneles B y C)
  E0_RBS:    2.0,          // MeV — energía típica del haz en equipo RBS
  THETA_DET: 170 * Math.PI / 180,  // rad — ángulo del detector (maximiza separación de masas)

  // Radio atómico del oro en modelo de Thomson (≈ 1.45 Å)
  R_AU_FM: 145_000,  // fm

  // Resolución energética del detector (gaussiana, FWHM ≈ 2.35σ)
  SIGMA_SPEC: 0.028, // MeV
});

/**
 * Elementos de referencia para Paneles B y C.
 * Z2: número atómico (determina la sección eficaz ∝ Z2²)
 * M2: masa atómica en u (determina la posición del pico vía K)
 */
const ELEMENTS = Object.freeze([
  { sym: 'C',  name: 'Carbono', Z2:  6, M2:  12,  color: '#38bdf8' },
  { sym: 'Si', name: 'Silicio', Z2: 14, M2:  28,  color: '#4ade80' },
  { sym: 'Fe', name: 'Hierro',  Z2: 26, M2:  56,  color: '#facc15' },
  { sym: 'Ag', name: 'Plata',   Z2: 47, M2: 108,  color: '#fb923c' },
  { sym: 'Au', name: 'Oro',     Z2: 79, M2: 197,  color: '#f59e0b' },
]);
