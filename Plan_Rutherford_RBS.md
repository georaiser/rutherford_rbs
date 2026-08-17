# Rutherford → RBS: Plan maestro del proyecto
## Evaluación 2 — Teoría Cuántica Temprana

---

## 0. Contexto y propósito

**Tema elegido:** Experimento de Rutherford → Aplicación en Rutherford Backscattering Spectrometry (RBS)

**Pregunta guía del video:** ¿Cómo podemos obtener información sobre la estructura y composición de un material sin observar directamente sus átomos?

**Propósito de la app:** Es material de apoyo visual para el video de 5 minutos, entregable junto con el material audiovisual. Debe ser **físicamente correcta, sin errores conceptuales y defendible ante cualquier consulta sobre el origen de los valores numéricos**.

**Principio de diseño no negociable:** ningún valor mostrado en pantalla es arbitrario o inventado. Todo resultado proviene de una fórmula física real evaluada en tiempo de ejecución. Las simplificaciones obedecen a prácticas estándar de la disciplina y se declaran explícitamente.

**Requisitos de UX:** interfaz didáctica, limpia y accesible, con parámetros ajustables en tiempo real mediante controles deslizantes (sliders) que recalculan la física en vivo (sin tablas fijas precalculadas ni aproximaciones no fundamentadas).

**Stack tecnológico implementado:** HTML5 semántico, CSS3 modular (diseño responsivo con variables nativas), JavaScript modular (ES6+, sin dependencias externas pesadas para cálculo), MathJax 3 (renderizado dinámico de LaTeX) y script de verificación independiente en Python 3.13.

---

### 0.1 Cómo renderizar las fórmulas correctamente (MathJax)

Todas las expresiones matemáticas están formuladas en sintaxis estándar LaTeX. Para asegurar su correcta visualización en el navegador web sin degradar el rendimiento, se utiliza MathJax 3:

```html
<script>
  MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']]
    },
    options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea'] }
  };
</script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" async></script>
```

**Criterio de implementación:** Las expresiones algebraicas simbólicas se renderizan de forma estática con MathJax para máxima nitidez tipográfica, mientras que los valores numéricos dinámicos se actualizan directamente en elementos HTML (`<span>`, `<output>`) en cada evento de entrada.

---

### 0.2 Mockup visual de referencia (wireframe)

Disposición vertical de los tres paneles en tarjetas independientes con retroalimentación visual directa:

```
┌─────────────────────────────────────────────────────────┐
│ PANEL A · Dispersión de Rutherford (o Thomson)           │
│                                                         │
│   ─── haz incidente ───►  (núcleo Au / átomo Thomson)   │
│   (trayectorias hiperbólicas continuas vs. deflexión)   │
│                                                         │
│   Energía E₀  [────●──────────]  7.0 MeV                │
│   Modo: [ Rutherford ]  [ Thomson ]                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PANEL B · Factor cinemático K (Colisión elástica)       │
│                                                         │
│   ● (He⁺) ──────────► (M₂) ┄┄┄► [Detector 170°]         │
│   Entrada              Choque    Salida con E₁ = K·E₀   │
│                                                         │
│   Masa M₂  [──────────────────●──]  197 u (Au)           │
│                                                         │
│   ┌─────────────┐   ┌─────────────┐                     │
│   │ K           │   │ E₁          │                     │
│   │ 0.9226      │   │ 1.8451 MeV  │                     │
│   └─────────────┘   └─────────────┘                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PANEL C · Espectro RBS resultante                       │
│                                                         │
│   Cuentas (∝ Z₂²)                                       │
│   │                  Au (Z=79, altura 173.4×)           │
│   │                  █                                  │
│   │             Ag   █    ┊ Marcador dinámico           │
│   │         Fe  █    █    ┊ vinculado al slider de B    │
│   │     Si  █   █    █    ┊                             │
│   │  C  █   █   █    █    ▼                             │
│   └──█──┴───┴───┴────┴────┴────► Energía E₁             │
│     0.5    1.1 1.5  1.7  1.85 MeV                       │
└─────────────────────────────────────────────────────────┘
```

---

## 1. Fundamento físico completo

### 1.1 El problema histórico que resuelve Rutherford (1909-1911)

El modelo atómico de J.J. Thomson (1898, modelo del "pudín de pasas") postulaba que la carga positiva total $+Ze$ se hallaba distribuida de manera homogénea en una esfera de radio atómico $R \approx 1\text{ \AA} = 10^{-10}\text{ m}$, con los electrones incrustados en su interior. Según este modelo, el campo eléctrico interno es débil, por lo que una partícula alfa incidente de alta energía solo experimentaría deflexiones microscópicas ($\theta \ll 1^\circ$).

El experimento de Geiger y Marsden (1909), interpretado por Ernest Rutherford en 1911, evidenció que mientras la inmensa mayoría de las partículas alfa atravesaban la lámina metálica casi sin desviación, aproximadamente 1 de cada 8000 partículas rebotaba con ángulos superiores a $90^\circ$. Este comportamiento solo es físicamente posible si toda la carga positiva y prácticamente la totalidad de la masa del átomo están concentradas en un volumen minúsculo denominado **núcleo** ($r_\text{núcleo} \approx 10^{-14}\text{ m}$).

---

### 1.2 Fórmula de dispersión de Rutherford

Para una partícula alfa con carga $q_1 = Z_1 e$ ($Z_1 = 2$) y masa $M_1$, dispersada por un potencial de Coulomb repulsivo de un núcleo estacionario con carga $q_2 = Z_2 e$, la relación analítica exacta entre el parámetro de impacto $b$ y el ángulo de dispersión $\theta$ en el sistema del centro de masa (o laboratorio para $M_2 \gg M_1$) es:

$$b(\theta) = \frac{Z_1 Z_2 e^2}{4\pi\varepsilon_0 \cdot 2E_0} \cot\left(\frac{\theta}{2}\right)$$

Donde:
- $Z_1 = 2$ (partícula alfa, núcleo de $^{4}\text{He}$)
- $Z_2$ = número atómico del núcleo blanco (ej. Au: $Z_2 = 79$)
- $e = 1.602176634\times 10^{-19}\text{ C}$
- $\frac{1}{4\pi\varepsilon_0} = 8.9875517923\times 10^9\text{ N}\cdot\text{m}^2/\text{C}^2$
- $E_0$ = energía cinética inicial de la partícula incidente (típicamente 1 a 10 MeV)
- $b$ = parámetro de impacto (distancia de aproximación perpendicular asintótica)
- $\theta$ = ángulo de deflexión asintótico

**Geometría de la trayectoria:** La partícula describe una rama de hipérbola continua con el núcleo situado en el foco exterior. En coordenadas polares centradas en el núcleo repulsivo:

$$r(\varphi) = \frac{p}{\varepsilon_\text{exc}\cos\varphi - 1}, \quad \varepsilon_\text{exc} = \frac{1}{\sin(\theta/2)} > 1$$

---

### 1.3 Factor cinemático $K$ (Principio de RBS)

En la espectroscopía de retrodispersión de Rutherford (RBS), un haz monoenergético de iones livianos ($M_1$, típicamente $\text{He}^+$ con $M_1 \approx 4\text{ u}$) impacta sobre una muestra que contiene núcleos de masa desconocida $M_2$. 

A partir de la conservación estricta de la energía y del momento lineal para una colisión elástica en dos dimensiones:

$$K(M_2, \theta) = \left(\frac{\sqrt{M_2^2 - M_1^2 \sin^2\theta} + M_1 \cos\theta}{M_1 + M_2}\right)^2$$

La energía del proyectil dispersado hacia el detector colocado a un ángulo $\theta$ es:

$$E_1 = K \cdot E_0$$

Propiedades clave:
1. **Identificación elemental:** Para $\theta$ fijo y $M_1$ conocido, $K$ es una función monótona creciente y biunívoca de $M_2$ (para todo $M_2 \geq M_1$). Midiendo $E_1$, se determina unívocamente $M_2$.
2. **Selección del ángulo:** Los equipos comerciales y de investigación fijan $\theta = 170^\circ$ (geometría de retrodispersión casi directa). En este ángulo, la derivada $\left|\frac{\partial K}{\partial M_2}\right|$ y la separación energética entre elementos contiguos se maximizan.
3. **Condición de validez:** Se requiere $M_2 \geq M_1$ para asegurar que la raíz cuadrada sea siempre real. Para átomos más livianos que el proyectil, la retrodispersión a $\theta > 90^\circ$ está cinemáticamente prohibida.

---

### 1.4 Conexión con el módulo de Teoría Cuántica Temprana

El análisis de la dispersión de Rutherford no es un ejercicio puramente clásico; constituye el puente fundamental hacia la física cuántica:

1. **Génesis de la crisis del átomo clásico y postulado de Bohr (1913):**
   Al demostrar que la carga positiva reside en un punto central y los electrones orbitan a su alrededor, la electrodinámica clásica de Maxwell predijo un colapso radiativo catastrófico: un electrón acelerado debe emitir ondas electromagnéticas continuas y caer en espiral al núcleo en $\sim 10^{-11}\text{ s}$. Para resolver esta imposibilidad física, Niels Bohr introdujo la cuantización del momento angular orbital:
   $$L = m_e v r = n\hbar, \quad n \in \{1, 2, 3, \dots\}$$
   Sin el núcleo de Rutherford, no existiría la paradoja de estabilidad que forzó el nacimiento de la teoría cuántica temprana.

2. **Coincidencia clásica-cuántica y límite de validez:**
   La sección eficaz diferencial de Rutherford calculada con mecánica clásica coincide idénticamente con la solución cuántica exacta obtenida mediante la ecuación de Schrödinger en la aproximación de Born para un potencial coulombiano puro $V(r) = \frac{Z_1 Z_2 e^2}{4\pi\varepsilon_0 r}$. A energías moderadas ($E_0 \leq 2-10\text{ MeV}$), la distancia de máximo acercamiento $d_\text{min} = \frac{Z_1 Z_2 e^2}{4\pi\varepsilon_0 E_0}$ es mucho mayor que el radio nuclear ($R_\text{núcleo} \approx 1.2 A^{1/3}\text{ fm}$), manteniéndose estrictamente en el régimen electrostático sin penetración de barrera nuclear ni efectos de fuerza fuerte.

---

### 1.5 Tabla de valores de referencia exactos (Verificación Python 3.13)

Parámetros de referencia del sistema RBS: $E_0 = 2.0000\text{ MeV}$, proyectil $^4\text{He}$ ($M_1 = 4.0026\text{ u} \approx 4\text{ u}$), detector en $\theta = 170.0^\circ$:

| Elemento | Símbolo | $Z_2$ | $M_2$ (u) | Factor $K$ exacto ($\theta=170^\circ$) | Energía $E_1$ exacta ($E_0=2.0\text{ MeV}$) |
|---|---|:---:|:---:|:---:|:---:|
| Carbono | C | 6 | 12 | **0.2525** | **0.5051 MeV** |
| Silicio | Si | 14 | 28 | **0.5649** | **1.1299 MeV** |
| Hierro | Fe | 26 | 56 | **0.7527** | **1.5055 MeV** |
| Plata | Ag | 47 | 108 | **0.8632** | **1.7264 MeV** |
| Oro | Au | 79 | 197 | **0.9226** | **1.8451 MeV** |

> *Nota al pie: Verificación Python ejecutada el 17-ago-2026 con mamba + Python 3.13. Todos los valores coinciden con la fórmula cinemática cerrada.*

---

## 2. Qué se calcula en vivo vs. qué se simplifica (transparencia total)

### 2.1 Física real calculada en tiempo de ejecución (sin aproximaciones ficticias)

1. **Factor cinemático $K(M_2, \theta)$:** Evaluado analíticamente en cada interacción con el slider de masa o elemento.
2. **Energía de retrodispersión $E_1 = K \cdot E_0$:** Calculada dinámicamente según la energía seleccionada.
3. **Trayectorias de Rutherford:** Parámetros hiperbólicos integrados y renderizados en tiempo real según $b(\theta)$ y $E_0$.
4. **Modelo de Thomson cuantitativo:** Implementación rigurosa de la deflexión por esfera de carga uniforme (no esquemático ni cualitativo).
5. **Alturas e intensidades espectrales en RBS:** Calculadas proporcionalmente a la sección eficaz diferencial $d\sigma/d\Omega \propto Z_2^2$.

---

### 2.2 Modelo de Thomson cuantitativo (Esfera uniforme de carga)

En el modelo de Thomson, la carga positiva $+Z_2 e$ se distribuye uniformemente en una esfera de radio atómico $R \approx 1\text{ \AA} = 100{,}000\text{ fm}$. Para una partícula alfa con parámetro de impacto $b \leq R$, el campo electrostático radial interno viene dado por la ley de Gauss:

$$E_r(r) = \frac{Z_2 e}{4\pi\varepsilon_0 R^3} r, \quad r \leq R$$

Integrando el impulso transversal transferido a lo largo de la trayectoria rectilínea (aproximación de impulso válida dado que $\theta \ll 1$):

$$\Delta p_\perp = \int_{-\infty}^{\infty} F_\perp \, dt = \int_{-z_0}^{z_0} \frac{Z_1 Z_2 e^2}{4\pi\varepsilon_0 R^3} b \cdot \frac{dz}{v_0}, \quad z_0 = \sqrt{R^2 - b^2}$$

El ángulo de deflexión para un solo paso atómico resulta:

$$\theta_\text{Thomson}(b) = \frac{Z_1 Z_2 e^2}{4\pi\varepsilon_0 \cdot E_0 \cdot R} \cdot \left(\frac{b}{R}\right) \sqrt{1 - \left(\frac{b}{R}\right)^2}$$

En variables normalizadas ($b_\text{norm} = b/R$, $R_\text{norm} = 1$):

$$\theta_\text{Thomson}(b) = \frac{2 \cdot b_\text{norm} \cdot \sqrt{R_\text{norm}^2 - b_\text{norm}^2}}{R_\text{norm}^3} \cdot \theta_0$$

Para oro ($Z_2 = 79$), $R = 1.4\text{ \AA}$, $E_0 = 7.0\text{ MeV}$:
$$\theta_\text{max, Thomson} = 6.42\times 10^{-3 \circ} \approx 0.0064^\circ$$

Esta deflexión máxima es del orden de milésimas de grado. Demuestra cuantitativamente por qué el modelo de Thomson es incapaz de justificar retrodispersiones a ángulos grandes.

---

### 2.3 Alturas de picos basadas en la sección eficaz de Rutherford ($Z_2^2$)

En un análisis RBS real, el número de cuentas registrado en el detector para una especie atómica $i$ viene determinado por la sección eficaz diferencial de Rutherford:

$$\frac{d\sigma}{d\Omega} = \left(\frac{Z_1 Z_2 e^2}{4 E_0}\right)^2 \frac{1}{\sin^4(\theta/2)}$$

Dado que el ángulo de detección $\theta = 170^\circ$, la energía del haz $E_0$ y la carga del proyectil $Z_1 = 2$ son constantes, la probabilidad de dispersión por átomo escala estrictamente con el cuadrado del número atómico:

$$\text{Altura del pico } A_i \propto Z_{2,i}^2$$

Comparación cuantitativa calculada e implementada en el Panel C:
- Carbono ($Z_2 = 6$): $6^2 = 36$ (normalizado a $1.0\times$)
- Silicio ($Z_2 = 14$): $14^2 = 196$ ($5.44\times$)
- Hierro ($Z_2 = 26$): $26^2 = 676$ ($18.78\times$)
- Plata ($Z_2 = 47$): $47^2 = 2209$ ($61.36\times$)
- Oro ($Z_2 = 79$): $79^2 = 6241$ ($173.36\times$)

La relación de intensidades entre el pico de Oro y el de Carbono es exactamente $\left(\frac{79}{6}\right)^2 = 173.4$.

---

### 2.4 Simplificaciones declaradas explícitamente

1. **Geometría superficial (sin pérdida de energía por profundidad):** Se asume colisión en la primera monocapa atómica. En muestras reales gruesas, la pérdida continua de energía por ionización electrónica (*stopping power*, $dE/dx$) ensancha los picos hacia energías menores formando mesetas.
2. **Interpolación visual del evento de colisión:** La app modela rigurosamente el estado inicial ($E_0, \vec{p}_0$) y el estado final ($E_1, \vec{p}_1$) a partir de las leyes de conservación. La animación de choque en el Panel B es una representación cinemática para facilitar la comprensión visual.
3. **Escala espacial macroscópica:** Los radios atómicos y nucleares se representan con fines pedagógicos y no a escala geométrica real ($10^{-15}\text{ m}$ vs. $10^{-10}\text{ m}$).

---

## 3. Estructura de la aplicación (3 paneles)

### Panel A — Dispersión de Rutherford y Thomson
- **Controles:** Slider de energía cinética $E_0$ (4.0 a 10.0 MeV) y selector de modelo (Rutherford vs. Thomson).
- **Cálculo:** Cálculo de trayectorias hiperbólicas para 9 parámetros de impacto distribuidos. En modo Thomson, cálculo de la desviación por esfera uniforme de carga positiva.
- **Visualización:** Núcleo de Oro central ($Z_2 = 79$), haz incidente de partículas alfa, cálculo en vivo de $b(\theta)$ y ángulo de deflexión para la trayectoria más cercana.

### Panel B — Factor Cinemático $K$ en Colisión Elástica
- **Controles:** Slider continuo de masa atómica $M_2$ (4 a 200 u) con botones rápidos para C, Si, Fe, Ag, Au.
- **Cálculo:** Evaluación de $K(M_2, 170^\circ)$ y $E_1 = K \cdot E_0$ para $E_0 = 2.0\text{ MeV}$.
- **Animación:** Partícula incidente a velocidad normalizada, colisión puntual y retrodispersión a $170^\circ$ con velocidad proporcional a $\sqrt{K}$. El diámetro del átomo blanco escala con $\sqrt[3]{M_2}$.

### Panel C — Espectro de Retrodispersión RBS
- **Visualización:** Gráfico cartesiano de cuentas vs. energía dispersada $E_1$.
- **Picos espectrales:** Posiciones energéticas exactas ($E_1 = K \cdot E_0$) y alturas gaussianas ponderadas rigurosamente por $Z_2^2$.
- **Sincronización:** Cursor dinámico vinculado al valor de masa $M_2$ seleccionado en el Panel B, mostrando en tiempo real la coincidencia energética.

---

## 4. Guion del video (5 minutos, 3 estudiantes)

> *Nota: El libreto extendido palabra por palabra se encuentra disponible en el archivo [`Guion_Video_Evaluacion_2.md`](file:///D:/00_FisicaModerna/02_TeoriaCuanticaTemprana/rutherford_rbs/Guion_Video_Evaluacion_2.md).*

### Estudiante 1 — Contexto histórico y dispersión de Rutherford (0:00 – 1:40)
- **Apertura:** Pregunta conductora sobre caracterización no destructiva de materiales.
- **El experimento de 1909:** Contraste cuantitativo entre el modelo de Thomson (deflexiones $< 0.01^\circ$) y las observaciones de Geiger-Marsden.
- **Demostración Panel A:** Simulación de hipérbolas de Coulomb y verificación del núcleo puntual.
- **Enlace a mecánica cuántica:** Explicación de la inestabilidad del átomo clásico y origen del postulado de Bohr (1913).

### Estudiante 2 — Principio físico de RBS y factor $K$ (1:40 – 3:20)
- **Fundamento cinemático:** Conservación de energía y momento en colisión elástica $2\text{D}$.
- **Fórmula de $K$:** Justificación del ángulo estándar de $170^\circ$ para maximizar la resolución en masa.
- **Demostración Panel B:** Interacción con elementos ligeros vs. pesados ($K_\text{C} = 0.2525$ vs. $K_\text{Au} = 0.9226$).
- **Transparencia científica:** Declaración de estados antes/después y validez de la aproximación elástica.

### Estudiante 3 — Espectroscopía RBS, aplicaciones y cierre (3:20 – 5:00)
- **Demostración Panel C:** Interpretación del espectro multielemental. Posición del pico = masa atómica ($M_2$); Intensidad = concentración $\times Z_2^2$.
- **Aplicaciones reales:** Control de calidad en microelectrónica (capas nanométricas en semiconductores), análisis no destructivo de pigmentos en obras de arte arqueológicas y ciencia de materiales nucleares.
- **Conclusión:** Cómo un experimento fundacional de la física moderna se convirtió en una herramienta analítica indispensable.

---

## 5. Plan de desarrollo técnico (Estado: COMPLETADO — 17-ago-2026)

1. **[x] Verificación analítica y numérica en Python 3.13:** Script `python/verify_physics.py` ejecutado exitosamente con validación de $b(\theta)$, $K(M_2, 170^\circ)$, $\theta_\text{Thomson}$ y sección eficaz $Z_2^2$.
2. **[x] Arquitectura modular de la aplicación web:** Separación en HTML semántico, CSS responsivo y módulos JavaScript especializados.
3. **[x] Implementación de Panel A:** Motor de trayectorias analíticas para Rutherford y modelo de esfera uniforme para Thomson.
4. **[x] Implementación de Panel B:** Cinemática relativista/clásica con animación fluida en Canvas y renderizado dinámico de magnitudes.
5. **[x] Implementación de Panel C:** Espectro continuo con convolución gaussiana de picos ponderados por $Z_2^2$ y trazador interactivo bidireccional.
6. **[x] Validación cruzada de rigor físico:** Comprobación de consistencia numérica total entre la interfaz de usuario y la literatura estándar (Chu, Mayer & Nicolet, 1978).

---

## 6. Checklist final de entrega y calidad

- [x] Todas las fórmulas implementadas coinciden con el marco teórico formal (Sección 1).
- [x] Los valores numéricos mostrados en la app corresponden a los valores exactos verificados en Python (Tabla 1.5).
- [x] Casos de borde matemáticos debidamente acotados ($M_2 \geq 4\text{ u}$, $\theta = 170^\circ$, sin discontinuidades ni divisiones por cero).
- [x] Modelo de Thomson implementado cuantitativamente con la fórmula de esfera homogénea de carga.
- [x] Alturas de los picos en el espectro escaladas físicamente con $Z_2^2$.
- [x] Simplificaciones físicas y metodológicas declaradas explícitamente.
- [x] Interfaz gráfica depurada, sin saturación visual, con diseño técnico oscuro optimizado para presentaciones.
- [x] Rendimiento validado a 60 FPS en animaciones Canvas sin fuga de memoria ni sobrecarga de re-renderizado.
- [x] Guion estructurado rigurosamente para 3 expositores dentro del límite estricto de 5 minutos.
- [x] Conexión epistemológica explícita con el temario de Teoría Cuántica Temprana.

---

## 7. Aplicaciones modernas de RBS (Respaldo para exposición)

1. **Industria de semiconductores y microelectrónica:**
   - Medición no destructiva del espesor de películas delgadas nanométricas (ej. compuertas de $\text{HfO}_2$ o $\text{SiO}_2$ sobre obleas de $\text{Si}$).
   - Determinación estequiométrica y perfil de impurezas/dopantes pesados (ej. implantación iónica de $\text{As}$ o $\text{P}$).

2. **Patrimonio cultural y arqueometría:**
   - Análisis no invasivo de la composición de aleaciones en monedas antiguas y joyería precolombina.
   - Identificación de pigmentos minerales en pinturas históricas sin extracción de muestras.

3. **Ingeniería de superficies y recubrimientos protectores:**
   - Evaluación de capas de nitruro de titanio ($\text{TiN}$) resistentes al desgaste en herramientas de corte.
   - Análisis de barreras térmicas y corrosión en aleaciones para turbinas aeroespaciales.

---

## 8. Estructura de archivos del proyecto

```
rutherford_rbs/
├── index.html              ← Estructura HTML semántica y contenedores Canvas
├── css/
│   └── styles.css          ← Sistema de diseño visual, variables y maquetación responsiva
├── js/
│   ├── constants.js        ← Constantes físicas fundamentales y parámetros de simulación
│   ├── physics.js          ← Fórmulas analíticas (Rutherford, K, Thomson, sección eficaz Z₂²)
│   ├── panelA.js           ← Lógica de animación de dispersión y selector Rutherford/Thomson
│   ├── panelB.js           ← Cinemática de colisión elástica a 170° y cálculo en vivo
│   ├── panelC.js           ← Renderizado del espectro RBS con picos proporcionales a Z₂²
│   └── main.js             ← Inicialización de la aplicación, vinculación de eventos y bucle principal
├── python/
│   └── verify_physics.py   ← Verificación analítica independiente con Python 3.13
├── Plan_Rutherford_RBS.md  ← Plan maestro de diseño, física y especificaciones técnicas
└── Guion_Video_Evaluacion_2.md ← Libreto detallado para la presentación grupal de 5 minutos
```

---

*Documento técnico de referencia para la Evaluación 2 — Módulo 2 (Teoría Cuántica Temprana). Todos los fundamentos físicos, algoritmos de cálculo y especificaciones de software han sido verificados y documentados para su defensa académica.*
