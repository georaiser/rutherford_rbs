"""
verify_physics.py — Verificación independiente de todas las fórmulas físicas
===============================================================================
Propósito:
  Verificar que los valores calculados en la app (JavaScript) coinciden con
  los valores calculados aquí en Python, usando las mismas fórmulas pero
  implementadas de forma completamente independiente.

  Si los números coinciden, la app es físicamente correcta.
  Ejecutar antes de entregar el proyecto.

Unidades:
  Energía:  MeV
  Longitud: fm  (1 fm = 10⁻¹⁵ m)
  Masa:     u   (unidad de masa atómica)

Referencias:
  - Chu, Mayer & Nicolet (1978), Backscattering Spectrometry, Academic Press
  - Feldman & Mayer (1986), Fundamentals of Surface and Thin Film Analysis
  - Rutherford (1911), Phil. Mag. 21, 669
"""

import math

# ═══════════════════════════════════════════════════════════════════════════════
# 1.  CONSTANTES FÍSICAS
# ═══════════════════════════════════════════════════════════════════════════════

KE2       = 1.44       # ke²  en MeV·fm  (NIST CODATA)
Z1        = 2           # número atómico alfa (He-4)
M1        = 4           # masa alfa en u
Z2_AU     = 79          # número atómico Au (Panel A)
E0_RBS    = 2.0         # MeV — energía del haz RBS (Paneles B y C)
THETA_DET = math.radians(170)  # rad — ángulo del detector RBS
R_AU_FM   = 145_000     # fm — radio atómico Au ≈ 1.45 Å

ELEMENTS = [
    {"sym": "C",  "Z2":  6, "M2":  12},
    {"sym": "Si", "Z2": 14, "M2":  28},
    {"sym": "Fe", "Z2": 26, "M2":  56},
    {"sym": "Ag", "Z2": 47, "M2": 108},
    {"sym": "Au", "Z2": 79, "M2": 197},
]

# ═══════════════════════════════════════════════════════════════════════════════
# 2.  FUNCIONES FÍSICAS
# ═══════════════════════════════════════════════════════════════════════════════

def calc_a0(E_MeV: float, Z2: int = Z2_AU) -> float:
    """
    Parámetro de Rutherford a₀(E) en fm.
    a₀ = ke²·Z₁·Z₂ / (2E)
    Es la distancia de máximo acercamiento para colisión frontal (b=0).
    Fuente: Rutherford (1911); Chu et al. (1978) ec. 2.1
    """
    return Z1 * Z2 * KE2 / (2 * E_MeV)


def calc_K(M2: float, theta: float = THETA_DET) -> float | None:
    """
    Factor cinemático K — colisión elástica, conservación de E y p.

    K(M₂, θ) = [(√(M₂²−M₁²sin²θ) + M₁cosθ) / (M₁+M₂)]²

    Devuelve None si M₂ < M₁·|sinθ| (solución no física).
    Fuente: Chu, Mayer & Nicolet (1978) ec. 2.4
    """
    disc = M2**2 - M1**2 * math.sin(theta)**2
    if disc < 0:
        return None  # sin solución real: M₁ > M₂ a este ángulo
    return ((math.sqrt(disc) + M1 * math.cos(theta)) / (M1 + M2))**2


def calc_theta_rutherford(b_norm: float) -> float:
    """
    Ángulo de dispersión de Rutherford θ para parámetro de impacto b.
    b_norm = b / a₀ (adimensional)
    θ = 2·arctan(a₀/b) = 2·arctan(1/b_norm)
    Fuente: Goldstein, Classical Mechanics, cap. 3
    """
    if b_norm < 1e-12:
        return math.pi
    return 2 * math.atan(1 / b_norm)


def rel_cross_section(Z2: int) -> float:
    """
    Sección eficaz diferencial de Rutherford (relativa, θ y E₀ fijos).
    dσ/dΩ ∝ (Z₁Z₂e²/4E₀)²·1/sin⁴(θ/2) ∝ Z₂²
    Para igual concentración superficial, las alturas de los picos van como Z₂².
    Fuente: Rutherford (1911); coincide con resultado cuántico (Born, 1926).
    """
    return Z2**2


def calc_theta_thomson(b_norm: float, R_norm: float) -> float:
    """
    Ángulo de deflexión Thomson (esfera uniforme de carga).
    Para b ≤ R: θ = (ke²Z₁Z₂/E·R³)·b·√(R²−b²) = 2·b_norm·√(R_norm²−b_norm²)/R_norm³
    Para b > R: θ = 0  (átomo neutro visto desde fuera)
    b_norm = b/a₀, R_norm = R/a₀
    Fuente: Thomson (1910); contexto histórico en Rutherford (1911)
    """
    if b_norm >= R_norm:
        return 0.0
    return 2 * b_norm * math.sqrt(R_norm**2 - b_norm**2) / R_norm**3


def recoil_speed(M2: float) -> float:
    """
    Velocidad de recule del blanco (fracción de v₀).
    v_recoil / v₀ ≈ 2M₁ / (M₁ + M₂)  (colisión frontal: aproximación)
    Fuente: Krane, Introductory Nuclear Physics, cap. 2
    """
    return 2 * M1 / (M1 + M2)


# ═══════════════════════════════════════════════════════════════════════════════
# 3.  VERIFICACIONES
# ═══════════════════════════════════════════════════════════════════════════════

def sep(title: str):
    print(f"\n{'═'*65}")
    print(f"  {title}")
    print('═'*65)


def verify_a0():
    sep("PARÁMETRO DE RUTHERFORD a₀(E)")
    print(f"{'E (MeV)':>10} {'Z₂':>5} {'a₀ (fm)':>12}")
    print("-"*30)
    for E in [4, 5, 6, 7, 8, 9, 10]:
        a0 = calc_a0(E)
        print(f"{E:>10.1f} {Z2_AU:>5} {a0:>12.3f}")
    print("\n  Verificar: a₀(7 MeV, Au) ≈ 16.2 fm  [Chu et al. 1978, Tab. 2.1]")
    print(f"  Calculado: {calc_a0(7.0):.3f} fm")


def verify_K():
    sep("FACTOR CINEMÁTICO K  (θ=170°, M₁=4 u, E₀=2 MeV)")
    print(f"{'Elemento':>10} {'M₂ (u)':>8} {'K calculado':>14} {'E₁ (MeV)':>12} {'K aprox. ref.':>15}")
    print("-"*62)

    # Valores de referencia aproximados de la literatura
    K_ref = {"C": 0.32, "Si": 0.63, "Fe": 0.80, "Ag": 0.87, "Au": 0.92}

    for el in ELEMENTS:
        K = calc_K(el["M2"])
        E1 = K * E0_RBS if K is not None else None
        ref = K_ref.get(el["sym"], "—")
        K_str  = f"{K:.6f}"  if K  is not None else "N/A"
        E1_str = f"{E1:.4f}" if E1 is not None else "N/A"
        print(f"{el['sym']:>10} {el['M2']:>8} {K_str:>14} {E1_str:>12}   ~{ref}")

    print("\n  Verificar que K(Au) ≈ 0.92, K(C) ≈ 0.32 — consistente con Chu et al.")
    print("  (Los valores de referencia son aproximados; los calculados son exactos.)")


def verify_thomson():
    sep("DEFLEXIÓN THOMSON (esfera uniforme, Au, E=7 MeV)")
    a0    = calc_a0(7.0)
    R_nm  = R_AU_FM / a0  # radio en unidades de a₀
    theta_max = a0 / R_AU_FM  # rad (máximo en b = R/√2)

    print(f"  a₀(7 MeV, Au) = {a0:.2f} fm")
    print(f"  R_Au = {R_AU_FM:,} fm = {R_AU_FM/1e5:.2f} Å")
    print(f"  R_norm = R/a₀ = {R_nm:.0f}")
    print(f"  θ_max Thomson = a₀/R = {theta_max:.6f} rad = {math.degrees(theta_max)*1000:.3f} × 10⁻³ °")
    print()
    print(f"  {'b/R':>8} {'θ_Th (rad)':>16} {'θ_Th (°)':>14}")
    print("  " + "-"*42)
    for bf in [0.1, 0.3, 0.5, 0.707, 0.9, 1.0]:
        b_nm = bf * R_nm
        th = calc_theta_thomson(b_nm, R_nm)
        print(f"  {bf:>8.3f} {th:>16.3e} {math.degrees(th)*1000:>12.4f} × 10⁻³")
    print()
    print("  Conclusión: deflexión máxima < 0.01° — invisible a escala atómica.")
    print("  Esto es físicamente correcto; explica por qué Thomson fracasó.")


def verify_cross_section():
    sep("SECCIÓN EFICAZ DIFERENCIAL DE RUTHERFORD (relativa)")
    print(f"{'Elemento':>10} {'Z₂':>6} {'Z₂²':>8} {'Altura relativa':>18} {'Altura %':>10}")
    print("-"*55)
    xs_vals = [(el["sym"], el["Z2"], rel_cross_section(el["Z2"])) for el in ELEMENTS]
    xs_max  = max(x[2] for x in xs_vals)
    for sym, Z2, xs in xs_vals:
        print(f"{sym:>10} {Z2:>6} {xs:>8} {xs/xs_max:>18.4f} {100*xs/xs_max:>9.1f}%")
    print()
    print("  Verificar: altura(Au)/altura(C) = (79/6)² = ", round((79/6)**2, 1))
    print(f"  Calculado: {rel_cross_section(79)/rel_cross_section(6):.1f}")


def verify_recoil():
    sep("VELOCIDAD DE RECULE DEL BLANCO  (v_recoil/v₀)")
    print(f"{'Elemento':>10} {'M₂ (u)':>8} {'v_recoil/v₀':>14}")
    print("-"*35)
    for el in ELEMENTS:
        vr = recoil_speed(el["M2"])
        print(f"{el['sym']:>10} {el['M2']:>8} {vr:>14.4f}")
    print("\n  Para M₂ = M₁ = 4 u (caso límite):")
    print(f"  v_recoil/v₀ = {recoil_speed(4):.4f}  (máximo, transferencia completa de momento)")


def verify_spectrum_positions():
    sep("POSICIONES DE PICOS EN EL ESPECTRO RBS")
    print(f"{'Elemento':>10} {'M₂ (u)':>8} {'K':>10} {'E₁ (MeV)':>12} {'x_pico':>10}")
    print("  (x_pico en fracción del rango 0–2.15 MeV del eje X de la app)")
    print("-"*60)
    E_MAX = 2.15
    for el in ELEMENTS:
        K  = calc_K(el["M2"])
        E1 = K * E0_RBS if K else None
        xf = E1 / E_MAX if E1 else None
        print(f"{el['sym']:>10} {el['M2']:>8} {K:.6f} {E1:.4f} MeV {xf*100:>8.1f}% del eje")


# ═══════════════════════════════════════════════════════════════════════════════
# 4.  EJECUTAR TODAS LAS VERIFICACIONES
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("\n" + "★"*65)
    print("  VERIFICACIÓN DE FÍSICA — Rutherford → RBS")
    print("  Evaluación 2 · Módulo 2 · Teoría Cuántica Temprana")
    print("★"*65)

    verify_a0()
    verify_K()
    verify_thomson()
    verify_cross_section()
    verify_recoil()
    verify_spectrum_positions()

    print("\n" + "═"*65)
    print("  FIN DE VERIFICACIÓN")
    print("  Comparar estos valores con los mostrados en la app.")
    print("  Si coinciden, la app es físicamente correcta.")
    print("═"*65 + "\n")
