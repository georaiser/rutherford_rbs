# Rutherford → RBS & PIXE · Simulador Interactivo de Física Cuántica Temprana

[![HTML5 / Canvas API](https://img.shields.io/badge/Frontend-HTML5%20%2F%20Canvas%20API-E34F26?style=flat-square&logo=html5&logoColor=white)](index.html)
[![JavaScript Vanilla](https://img.shields.io/badge/Engine-Vanilla%20ES6%2B%20(No%20Frameworks)-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](js/)
[![MathJax 3](https://img.shields.io/badge/Math-MathJax%203%20(KaTeX%20TeX)-257A3E?style=flat-square)](https://www.mathjax.org/)
[![Physics Engine](https://img.shields.io/badge/Physics-RK4%20%2B%20Analytical%20Kinematics-007acc?style=flat-square)](js/physics.js)
[![Tests Python](https://img.shields.io/badge/Verification-Python%203%20Physics%20Suite-3776AB?style=flat-square&logo=python&logoColor=white)](python/verify_physics.py)
[![Licencia](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

> **Módulo 2: Teoría Cuántica Temprana — Diplomado de Física Moderna (Evaluación 2)**  
> *Una plataforma interactiva e interactiva que recorre el puente epistemológico y experimental entre el descubrimiento del núcleo atómico por Ernest Rutherford (1911) y las técnicas contemporáneas de Análisis por Haces de Iones: **RBS** (Espectrometría de Retrodispersión de Rutherford) y **PIXE** (Emisión de Rayos X Inducida por Partículas).*

---

## 🌌 Tabla de Contenidos
1. [Descripción General](#-descripción-general)
2. [Estructura de la Aplicación y Paneles Interactivos](#-estructura-de-la-aplicación-y-paneles-interactivos)
3. [Fundamentos Físicos y Formulario Central](#-fundamentos-físicos-y-formulario-central)
4. [Cuadro Comparativo de Técnicas IBA](#-cuadro-comparativo-de-técnicas-iba-ion-beam-analysis)
5. [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
6. [Motor de Física y Precisión Analítica](#-motor-de-física-y-precisión-analítica)
7. [Instalación y Uso](#-instalación-y-uso)
8. [Documentación y Recursos Complementarios](#-documentación-y-recursos-complementarios)
9. [Referencias Académicas](#-referencias-académicas)

---

## 📖 Descripción General

A inicios del siglo XX, la física clásica colapsaba ante dos enigmas fundamentales: la **cuantización de la radiación** (Planck, 1900; Einstein, 1905) y la **estructura interna del átomo**. El experimento de Hans Geiger y Ernest Marsden (1909–1911), supervisado por Ernest Rutherford, demostró mediante el bombardeo de partículas alfa ($^4\text{He}^{2+}$) que más del $99.9\%$ de la masa y toda la carga positiva del átomo se concentran en un **núcleo denso y diminuto** ($\sim 10^{-14}\,\text{m}$).

Este proyecto simula paso a paso la física de este descubrimiento y demuestra cómo el mismo principio de dispersión electrostática de Coulomb y cinemática relativista/clásica se utiliza hoy en día en laboratorios de ciencia de materiales y nanotecnología (técnica **RBS**) y en el análisis del patrimonio cultural en museos como el Louvre (técnica **PIXE**).

```
 ┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
 │   RUTHERFORD (1911)     │ ───► │       RBS (1960s+)      │ ───► │      PIXE / LOUVRE      │
 │ Dispersión de Coulomb   │      │ Factor K · Espesor [S]  │      │ Salto Cuántico · Moseley│
 │ Núcleo vs. Thomson      │      │ Estequiometría atómica  │      │ Trazas en PPM (Rayos X) │
 └─────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
```

---

## 🕹️ Estructura de la Aplicación y Paneles Interactivos

La aplicación web interactiva (`index.html`) está organizada en 6 paneles sincronizados en tiempo real:

### 🏛️ Panel 0 — Contexto Histórico y Epistemológico
* **La crisis del modelo clásico:** El modelo de Thomson (1904, "pudín de pasas") vs. la evidencia de rebotes a ángulos $>90^\circ$.
* **El dilema de la estabilidad:** La aceleración centrípeta del electrón clásico conducía a la catástrofe de radiación de Larmor (colapso en $\sim 1.6 \times 10^{-11}\,\text{s}$), resuelta por la cuantización orbital de Niels Bohr (1913).

### 🎯 Panel A — Dispersión de Rutherford y Modelo de Thomson
* **Simulación gráfica en Canvas:** Integra numéricamente (RK4) las trayectorias de 6 haces de partículas alfa con parámetros de impacto reales ($b = 4.9\text{ a }155.2\,\text{fm}$).
* **Selector interactivo:** Permite alternar en tiempo real entre el campo puntual de Coulomb de **Rutherford** y la esfera difusa homogénea de **Thomson** ($\theta_{\max}^{\text{Thomson}} \approx 0.0064^\circ$).
* **Variables modificables:** Número atómico del blanco ($Z_2$: Oro, Cobre, etc.) y energía incidente ($E_0 = 1\text{--}10\,\text{MeV}$).

### ⚙️ Panel B — Cinemática de Choque Elástico y Factor Cinemático $K$
* **Conservación 2D:** Modela la colisión elástica ($\vec{p}$ y $E_c$) entre la partícula alfa ($M_1 = 4\,\text{u}$) y núcleos estacionarios ($M_2$).
* **Vector de retroceso:** Visualiza la velocidad de dispersión hacia el detector ($v_1 = \sqrt{K} v_0$) y la velocidad transferida al núcleo blanco ($v_{\text{rec}} = \frac{2M_1}{M_1+M_2}v_0$).
* **Diagnóstico de 5 Elementos:** Selector de blancos ($^{12}\text{C}$, $^{28}\text{Si}$, $^{56}\text{Fe}$, $^{108}\text{Ag}$, $^{197}\text{Au}$) con cálculo en vivo de la energía retenida ($E_1$), la energía de retroceso ($E_{\text{rec}} = (1-K)E_0$) y el Factor Cinemático $K$.

### 📊 Panel C — Espectro RBS y Estequiometría de Superficie
* **Espectro Multicanal Sintético:** Generación en tiempo real del espectro de retrodispersión con ruido estocástico de Poisson y ensanchamiento instrumental gaussiano ($\sigma = 28\,\text{keV}$).
* **Sensibilidad Cuadrática $\propto Z_2^2$:** Visualiza por qué el Oro genera $173.4\times$ más señal que el Carbono para la misma concentración atómica superficial ($N_i$).
* **Cuantificación *Standardless*:** Deducción en vivo de la estequiometría atómica ($\% \text{ at.}$) y fases cristalinas conocidas ($\text{Fe}_3\text{C}$, $\text{Au}_2\text{Si}$, $\text{SiC}$, $\text{Ag}_3\text{Au}$) sin necesidad de patrones externos de calibración.

### 🔬 Panel D — Perfilado en Profundidad y Factor de Parada $[S]$
* **Heteroestructuras Multicapa ($0\text{--}200\,\text{nm}$):** Simulación del paso de partículas alfa a través de estratos sucesivos con dispersión elástica en los núcleos y frenado inelástico continuo ($dE/dx$) con los electrones.
* **Factor de Parada $[S]$ (en $\text{eV/\AA}$ o $\text{keV/nm}$):** Convierte el ancho energético de la meseta ($\Delta E$) directamente en el espesor físico ($x$) de la película delgada ($\Delta E = [S] \cdot x$).
* **Acumulador Estocástico:** Visualización de cómo la incertidumbre de Poisson ($\frac{\sigma_N}{N} = \frac{1}{\sqrt{N}}$) decrece a medida que el flujo de corriente del acelerador acumula cuentas, revelando mesetas nítidas.

### ⚛️ Panel E — Evolución Cuántica: Espectrometría PIXE y Ley de Moseley
* **Fluorescencia de Rayos X:** Simulación de la expulsión de electrones internos por impacto del haz alfa (vacancia electrónica) y desexcitación mediante **salto cuántico** ($\Delta E = h\nu$).
* **Transiciones Atómicas:** Visualización de las líneas espectrales $K_\alpha$, $K_\beta$, $L_\alpha$ y $L_\beta$.
* **Ley de Moseley ($E_{K\alpha} \propto (Z-1)^2$):** Resuelve las limitaciones de resolución de masa de RBS, permitiendo separar con total nitidez elementos pesados vecinos ($\text{Au}$, $\text{Hg}$, $\text{Pb}$) y detectar trazas en partes por millón ($\text{PPM}$).
* **Presets Históricos:** Análisis no destructivo de pigmentos en obras de arte del Museo del Louvre (ej. bermellón $\text{HgS}$, azurita de cobre, blanco de plomo).

### 🧵 Panel F — El Hilo Cuántico: De la Crisis de Larmor a la Física Contemporánea
* **Línea de tiempo conceptual (1900–1930):** Planck $\to$ Einstein $\to$ Rutherford $\to$ Crisis de Larmor $\to$ Bohr $\to$ Moseley $\to$ de Broglie $\to$ Schrödinger/Heisenberg $\to$ Gordon & Gamow $\to$ Dirac $\to$ Bethe & Bloch.
* **Coincidencia Cuántica de Gordon (1928):** Justificación de por qué la mecánica cuántica (aproximación de Born para potencial $1/r$) reproduce de forma exacta la sección eficaz clásica de Rutherford.

---

## 📐 Fundamentos Físicos y Formulario Central

| Fenómeno / Parámetro | Expresión Analítica Exacta | Significado Físico / Aplicación |
|---|:---:|---|
| **Potencial de Coulomb** | $V(r) = \frac{Z_1 Z_2 ke^2}{r}$ | Repulsión electrostática pura ($ke^2 \approx 1.44\,\text{MeV·fm}$). |
| **Distancia mínima ($b=0$)** | $a_0 = \frac{Z_1 Z_2 ke^2}{2E_0}$ | Máximo acercamiento frontal (conversión de $E_c \to E_p$). |
| **Ángulo de Dispersión** | $\theta(b) = 2\operatorname{arccot}\left(\frac{b}{a_0}\right)$ | Relación geométrica exacta del parámetro de impacto $b$. |
| **Factor Cinemático RBS** | $K(M_2,\theta) = \left[\frac{\sqrt{M_2^2 - M_1^2 \sin^2\theta} + M_1 \cos\theta}{M_1 + M_2}\right]^2$ | Razón $E_1/E_0$; huella dactilar de la masa nuclear $M_2$. |
| **Energía de Retroceso** | $E_{\text{rec}} = (1 - K) \cdot E_0$ | Energía cinética transferida al núcleo blanco. |
| **Sección Eficaz Diferencial** | $\frac{d\sigma}{d\Omega} = \left(\frac{Z_1 Z_2 ke^2}{4E_0}\right)^2 \frac{1}{\sin^4(\theta/2)} \propto Z_2^2$ | Probabilidad de colisión nuclear (Sensibilidad $\propto Z_2^2$). |
| **Estequiometría Relativa** | $\frac{N_A}{N_B} = \frac{A_A / Z_A^2}{A_B / Z_B^2}$ | Cuantificación atómica absoluta sin patrones (*standardless*). |
| **Factor de Parada y Espesor** | $\Delta E = [S] \cdot x$ | Pérdida inelástica $dE/dx \implies$ espesor nanométrico $x$. |
| **Ley de Moseley (PIXE)** | $E_{K\alpha} \approx \frac{3}{4} R_y \, (Z - 1)^2$ | Energía de Rayos X emitida tras salto cuántico ($R_y = 13.6\,\text{eV}$). |
| **Radiación de Larmor** | $P = \frac{e^2 a^2}{6\pi \varepsilon_0 c^3} \implies \tau \approx 1.6 \times 10^{-11}\,\text{s}$ | Potencia radiada clásica $\implies$ paradoja del átomo planetario. |

---

## 🔬 Cuadro Comparativo de Técnicas IBA (Ion Beam Analysis)

| Técnica | Fenómeno Físico Base | ¿Requiere Mecánica Cuántica? | Aplicación Principal |
|---|---|:---:|---|
| **RBS** (*Rutherford Backscattering*) | Dispersión elástica de Coulomb ($1/r$) | **No** (resultado clásico coincide con QM por Gordon, 1928) | Estequiometría y perfilado en profundidad de elementos medianos y pesados ($0\text{--}2\,\mu\text{m}$). |
| **ERDA** (*Elastic Recoil Detection*) | Retroceso cinemático hacia adelante ($\theta < 90^\circ$) | **No** (cinemática elástica clásica) | Detección y perfilado de Hidrógeno ($^1\text{H}$, $^2\text{H}$) y elementos livianos. |
| **NRA / RNRA** (*Nuclear Reaction Analysis*) | Reacciones nucleares y resonancias de Breit-Wigner | **Sí** (efecto túnel de Gamow y niveles nucleares cuantizados) | Perfilado isotópico de $^{12}\text{C}$, $^{16}\text{O}$, $^{15}\text{N}$ con resolución subnanométrica. |
| **PIXE** (*Particle-Induced X-ray Emission*) | Ionización de capas internas y emisión de Rayos X | **Sí** (niveles electrónicos atómicos discretos) | Análisis multielemental de trazas a nivel de partes por millón ($\text{PPM}$) en patrimonio y biofísica. |

---

## 📂 Arquitectura del Proyecto

```
rutherford_rbs/
├── index.html                     # Aplicación web interactiva principal (SPA modular)
├── README.md                      # Documentación general para GitHub
├── Estudio_Fisico_RBS.md          # Tratado físico completo y deducciones analíticas formales
├── Estudio_Fisico_RBS.pdf         # Versión imprimible/publicable del tratado físico
├── Resumen_Estudio_RBS.md         # Resumen estructurado y guía rápida de estudio
├── Resumen_Estudio_RBS.pdf        # Versión PDF del resumen de estudio
│
├── css/
│   └── main.css                   # Estilos modernos, responsivos, tema oscuro y layout CSS Grid/Flexbox
│
├── js/                            # Lógica física y renderizado modular (ES6 puro, sin dependencias)
│   ├── constants.js               # Constantes físicas fundamentales (NIST CODATA) y tabla de elementos
│   ├── physics.js                 # Motor de física: integrador RK4, Factor K, secciones eficaces y Bethe
│   ├── panel-a.js                 # Canvas interactivo: trayectorias de Rutherford vs. Thomson
│   ├── panel-b.js                 # Cinemática de choque 2D, retroceso y tarjetas de balance energético
│   ├── panel-c.js                 # Espectro multicanal RBS, estequiometría standardless y presets
│   ├── panel-d.js                 # Perfilado multicapa, Factor [S] y acumulación estocástica de Poisson
│   ├── panel-e.js                 # Modelo orbital de Bohr, emisión PIXE, Ley de Moseley y presets del Louvre
│   └── app.js                     # Inicialización global, control de temas y renderizado MathJax
│
├── python/
│   └── verify_physics.py          # Suite de verificación física y validación de fórmulas numéricas
│
└── guion/                         # Guiones audiovisuales cronometrados para presentaciones orales
    ├── Guion_2_Minutos_Paneles_A_B_C_D.md  # Guion express de 2 minutos (Paneles A-D)
    ├── Guion_3_Minutos_Paneles_A_E_v1.md   # Guion técnico detallado de 3 minutos
    ├── Guion_3_Minutos_Paneles_A_E_v2.md   # Guion de prosa continua
    └── Guion_3_Minutos_Paneles_A_E_v4.md   # Guion definitivo balanceado con mnemotecnia (~3:00 min)
```

---

## ⚡ Motor de Física y Precisión Analítica

A diferencia de simulaciones esquemáticas o aproximadas, este simulador ejecuta **cálculos analíticos exactos y cinemática en tiempo real**:
* **Integración de Órbitas:** En el Panel A, la trayectoria de cada haz se calcula mediante integración numérica **Runge-Kutta de 4º orden (RK4)** sobre el campo electrostático $\vec{F} = \frac{ke^2 Z_1 Z_2}{r^2} \hat{r}$.
* **Factor Cinemático Exacto:** En los Paneles B, C y D, el factor $K$ se evalúa mediante la fórmula cerrada derivada de la conservación de momento y energía en el laboratorio a $\theta = 170^\circ$.
* **Sección Eficaz Relativa:** Las alturas e intensidades de los picos en los Paneles C y D siguen rigurosamente la dependencia cuadrática $\sigma \propto Z_2^2$.
* **Emisión Cuántica de Rayos X:** En el Panel E, las energías de transición ($K_\alpha, K_\beta, L_\alpha, L_\beta$) se calculan con el apantallamiento electrónico y la constante de Rydberg ($R_y = 13.6\,\text{eV}$).

---

## 🚀 Instalación y Uso

La aplicación está construida con tecnologías web estándar (**Zero Dependencies** / Sin necesidad de Node.js, Webpack ni compiladores).

### Opción 1: Ejecución Directa en el Navegador
1. Clona o descarga el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/rutherford-rbs.git
   cd rutherford-rbs
   ```
2. Abre el archivo `index.html` en cualquier navegador web moderno (Chrome, Firefox, Safari, Edge):
   * En Windows: doble clic sobre `index.html` o presiona `Enter`.
   * En Linux/Mac: `xdg-open index.html` o `open index.html`.

### Opción 2: Servidor Local de Desarrollo
Para una carga óptima de fuentes y scripts en red local:
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (npx)
npx serve .
```
Luego ingresa a `http://localhost:8000` en tu navegador.

### Opción 3: Ejecución de la Suite de Pruebas Físicas (Python)
Para verificar la consistencia matemática de los factores cinemáticos, pérdidas de energía y cálculos de sección eficaz:
```bash
python python/verify_physics.py
```

---

## 📚 Documentación y Recursos Complementarios

* 📄 **[`Estudio_Fisico_RBS.md`](Estudio_Fisico_RBS.md) / [PDF](Estudio_Fisico_RBS.pdf):** Documento formal con el desarrollo matemático completo, deducción de la aceleración centrípeta de Larmor, fórmulas de Bethe-Bloch y tablas de constantes atómicas.
* 📋 **[`Resumen_Estudio_RBS.md`](Resumen_Estudio_RBS.md) / [PDF](Resumen_Estudio_RBS.pdf):** Síntesis rápida con las 5 tarjetas de evaluación, glosario técnico y fórmulas clave.
* 🎙️ **[`guion/Guion_3_Minutos_Paneles_A_E_v4.md`](guion/Guion_3_Minutos_Paneles_A_E_v4.md):** Guion de locución y presentación de 3 minutos con marcas de sincronización en pantalla y regla mnemotécnica (*Quién / Cuánto / Dónde*).

---

## 📖 Referencias Académicas

1. **Rutherford, E. (1911).** *The Scattering of $\alpha$ and $\beta$ Particles by Matter and the Structure of the Atom.* Philosophical Magazine, 21(125), 669–688.
2. **Geiger, H., & Marsden, E. (1909).** *On a Diffuse Reflection of the $\alpha$-Particles.* Proceedings of the Royal Society of London. Series A, 82(557), 495–500.
3. **Chu, W.-K., Mayer, J. W., & Nicolet, M.-A. (1978).** *Backscattering Spectrometry.* Academic Press, New York.
4. **Feldman, L. C., & Mayer, J. W. (1986).** *Fundamentals of Surface and Thin Film Analysis.* North-Holland, Elsevier.
5. **Moseley, H. G. J. (1913).** *The High-Frequency Spectra of the Elements.* Philosophical Magazine, 26(156), 1024–1034.
6. **Bohr, N. (1913).** *On the Constitution of Atoms and Molecules.* Philosophical Magazine, 26(151), 1–25.
7. **Gordon, W. (1928).** *Über den Stoß zweier Punktladungen nach der Wellenmechanik.* Zeitschrift für Physik, 48(3–4), 180–191.
8. **Calligaro, T., et al. (2004).** *AGLAE: A Facility for Non-Destructive Ion Beam Analysis of Cultural Heritage Objects.* Nuclear Instruments and Methods in Physics Research Section B, 219–220, 35–42.

---

<div align="center">
  <sub>Desarrollado para el Diplomado en Física Moderna · Módulo 2: Teoría Cuántica Temprana.</sub>
</div>
