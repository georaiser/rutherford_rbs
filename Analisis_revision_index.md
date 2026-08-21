# Análisis de revisión — `index.html`

Guardado el 20 de agosto de 2026 a partir del análisis externo aportado por el usuario y de la revisión local.

## Evaluación general

La aplicación tiene una propuesta pedagógica muy sólida: Rutherford → núcleo → interacción Coulombiana → colisión elástica → energía de retroceso → RBS → aplicaciones modernas. Sus puntos fuertes son la comparación cuantitativa Rutherford/Thomson, la transición mediante el factor cinemático `E_1 = K(M_2,\theta)E_0` y la lectura del espectro: posición del pico → identidad; altura → cantidad.

Para una exposición breve, el núcleo recomendado es A → B → C → D. El Panel E y la línea temporal deben presentarse como extensiones explorables.

## Criterio editorial acordado

Mantener conceptos físicos fundamentales, ecuaciones útiles para los controles, definiciones de variables, relaciones cuantitativas y la conexión entre paneles. Reducir repeticiones, detalles históricos que no sostienen el argumento, afirmaciones absolutas y frases con demasiadas ideas a la vez.

Estructura objetivo por panel:

1. Qué ocurre físicamente (2–4 frases).
2. Ecuación fundamental.
3. Significado breve de la ecuación.
4. Resultado que conecte con el panel siguiente.

## Correcciones conceptuales prioritarias

- Reparar el MathJax roto en la línea temporal: `$E=hf$`, `$L=n\hbar$`, `$E_n=-13.6/n^2\,\text{eV}$` y `$e^+$`.
- Escribir el ion de carbono como `$^{12}\mathrm{C}^{6+}$` (o “iones de carbono-12”), no `C¹²⁶⁺`.
- Cambiar “la única técnica” por una formulación prudente: RBS permite cuantificación absoluta con poca o ninguna calibración específica cuando aplica el régimen de Rutherford.
- Matizar “RBS no detecta hidrógeno”: la retrodispersión convencional con partículas alfa está cinemáticamente limitada para H; ERDA es una alternativa.
- Presentar “una de cada 10⁴” como orden de magnitud dependiente de energía, material, espesor, ángulo y geometría.
- Evitar una causalidad histórica lineal Rutherford → mecánica cuántica. La cadena correcta incluye Planck y Einstein antes de Rutherford; Bohr fue un modelo semiclásico y la mecánica cuántica completa llegó después.
- Reemplazar “RBS es cuánticamente exacto” por: la teoría cuántica de la dispersión Coulombiana reproduce la sección eficaz de Rutherford para el problema ideal.
- Precisar: “En 1919 Rutherford identificó el protón como producto de una reacción nuclear inducida al bombardear nitrógeno con partículas alfa.”
- Corregir en el Panel B el ejemplo de recule del carbono: con `$v_{\rm rec}/v_0=2M_1/(M_1+M_2)$`, C-12 da `0.50 v₀`, no `0.57 v₀`.

## Propuesta editorial para el Panel A

### Apertura Rutherford

Usar un párrafo compacto que establezca experimento, observación y conclusión:

> El desarrollo de la Física Moderna a comienzos del siglo XX estuvo marcado por la necesidad de comprender la estructura de la materia. Entre los experimentos decisivos se encuentra el realizado por Hans Geiger y Ernest Marsden entre 1909 y 1911, bajo la dirección de Ernest Rutherford. Al bombardear una delgada lámina de oro con partículas alfa, observaron que la mayoría atravesaba la lámina con pequeñas desviaciones, mientras que una pequeña fracción se dispersaba a grandes ángulos, incluso hacia atrás. Estas observaciones no eran compatibles con el modelo de Thomson y llevaron a Rutherford a proponer, en 1911, un átomo con un núcleo muy pequeño, denso y cargado positivamente.

### Interpretación de la ecuación

Conservar la ecuación de Rutherford y una sola explicación:

> El parámetro de impacto `$b$` determina el ángulo de dispersión: `$$b(\theta)=a_0\cot\!\left(\frac{\theta}{2}\right),\qquad a_0=\frac{Z_1Z_2ke^2}{2E}.$$` Para menor `$b$`, la partícula se aproxima más al núcleo y su deflexión aumenta.

### Transición histórica y cuántica

Sustituir la formulación determinista por:

> El modelo nuclear de Rutherford intensificó un problema ya abierto por Planck y Einstein: la física clásica no explicaba la estabilidad atómica ni los espectros discretos. En 1913, Bohr propuso un modelo semiclásico con condiciones de cuantización; la teoría cuántica completa se desarrollaría posteriormente.

### Cierre hacia RBS

> La dispersión a grandes ángulos revela la concentración de carga en el núcleo. La misma interacción Coulombiana permite hoy identificar núcleos a partir de la energía de las partículas retrodispersadas: el principio de RBS.

## Estado

Este documento conserva las decisiones de revisión. No se han aplicado todavía los cambios editoriales al `index.html`; el usuario proporcionará los textos definitivos por párrafo en HTML y MathJax.
