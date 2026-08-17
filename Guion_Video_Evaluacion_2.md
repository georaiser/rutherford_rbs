# Guion de Video — Evaluación 2, Módulo 2
## Diplomado de Física Moderna

| Campo | Detalle |
|---|---|
| **Tema** | Experimento de Rutherford → Rutherford Backscattering Spectrometry (RBS) |
| **Duración** | 5:00 min (máximo) |
| **Integrantes** | Estudiante 1 · Estudiante 2 · Estudiante 3 |
| **App de apoyo** | `rutherford_rbs/index.html` — abrir en el navegador antes de grabar |
| **Fecha** | _________________ |

---

## Instrucciones generales

- Cada estudiante habla ~1:40 min. Hablar a ritmo natural, sin pausas largas.
- Las acciones de la app deben ensayarse por separado antes de grabar.
- Los traspasos entre estudiantes son frases cortas y fijas — no improvisar.
- Los valores numéricos en el guion son **exactos**, verificados con Python.

---

## ESTUDIANTE 1 — Contexto histórico + Panel A (0:00 – 1:40)

| Tiempo | Acción en pantalla | Texto hablado |
|:---:|:---|:---|
| 0:00–0:20 | Cámara al estudiante. App cerrada o en espera. | "¿Cómo sabemos de qué está hecho un material sin abrirlo ni verlo? A principios del siglo XX, Ernest Rutherford se hizo una pregunta parecida sobre el átomo. Y el resultado de su experimento fue, según sus propias palabras, tan increíble como si hubieras disparado una bala naval contra un pañuelo de papel y hubiera rebotado hacia ti." |
| 0:20–0:50 | **Panel A → modo Thomson.** Mostrar el átomo como esfera difusa, trayectorias casi rectas. | "En 1910 existía el modelo de Thomson: la carga positiva distribuida en todo el volumen del átomo. Si ese modelo fuera correcto, las partículas alfa pasarían casi sin desviarse — la deflexión máxima calculada con la fórmula de este modelo es de seis milésimas de grado. Prácticamente imposible de detectar." |
| 0:50–1:05 | **Panel A → modo Rutherford.** Trayectorias curvas aparecen. Pausa en la imagen. | "Pero Geiger y Marsden observaron que algunas partículas rebotaban en ángulos mayores a 90 grados. Una de cada ocho mil volvía casi hacia atrás. Eso no podía ocurrir con una carga difusa." |
| 1:05–1:35 | **Panel A → Rutherford.** Mover el slider de energía de 4 a 10 MeV lentamente. La leyenda de b y θ cambia en tiempo real. | "La única explicación es que toda la carga positiva está concentrada en un núcleo diminuto y denso. En esta simulación vemos las trayectorias reales: hipérbolas calculadas con la ecuación de movimiento en el potencial de Coulomb. A 7 Megaelectronvoltios, la partícula más cercana al núcleo de oro pasa a solo 16 femtómetros — eso es cien mil veces más pequeño que el átomo. Al subir la energía, la deflexión disminuye — ese efecto se ve en tiempo real." |
| 1:35–1:40 | Cámara al estudiante. | "Ese núcleo que descubrió Rutherford es la base de una técnica que hoy usamos para analizar materiales. Les cuento cómo." |

> **Traspaso a Estudiante 2** (última frase, fija, no improvisar):
> *"Les cuento cómo."*

---

## ESTUDIANTE 2 — Factor cinemático K + Panel B (1:40 – 3:20)

| Tiempo | Acción en pantalla | Texto hablado |
|:---:|:---|:---|
| 1:40–2:00 | Cámara al estudiante. Panel B visible al fondo. | "Cuando una partícula alfa choca elásticamente contra un átomo, parte de su energía pasa al blanco. ¿Cuánta? Depende de la masa del blanco. Es la misma física del billar: si la bola blanca choca contra una bola de boliche, rebota casi a la misma velocidad. Si choca contra otra bola del mismo tamaño, casi se detiene. La velocidad de salida delata la masa del blanco — ese es exactamente el principio de RBS." |
| 2:00–2:40 | **Panel B.** Mover slider M₂ de 12 a 197 lentamente. Detenerse en C y en Au. Las tarjetas K y E₁ se actualizan. | "Esta es la fórmula del factor cinemático K: colisión elástica, conservación de energía y momento. Si disparamos partículas alfa de 2 Megaelectronvoltios y el detector está a 170 grados —que es el estándar en equipos reales porque maximiza la separación entre masas— obtenemos: contra Carbono, K vale 0.2525, la partícula sale con 0.505 Megaelectronvoltios. Contra Oro, K vale 0.9226 y sale con 1.845 Megaelectronvoltios. Midiendo esa energía de salida, sabemos contra qué masa chocó la partícula." |
| 2:40–3:10 | **Panel B.** Dejar corriendo la animación de colisión con Au. | "Aquí una aclaración importante, que declara explícitamente nuestro proyecto: esta animación no calcula el instante exacto del choque — eso ocurre en femtosegundos y ningún detector real lo observa tampoco. Lo que sí es físicamente real es la comparación entre la energía de entrada y la de salida. La velocidad de salida en la animación es proporcional a raíz de K — una metáfora visual de la energía conservada, no una medición de tiempo. La fórmula de K, en cambio, es exacta y está verificada." |
| 3:10–3:20 | Cámara al estudiante. | "Con esa energía medida, ya sabemos qué elemento encontró la partícula. Pero en un material real hay muchos elementos a la vez." |

> **Traspaso a Estudiante 3** (última frase, fija):
> *"Pero en un material real hay muchos elementos a la vez."*

---

## ESTUDIANTE 3 — Espectro RBS + Aplicaciones + Cierre (3:20 – 5:00)

| Tiempo | Acción en pantalla | Texto hablado |
|:---:|:---|:---|
| 3:20–3:50 | **Panel C.** Mostrar el espectro completo. Mover el marcador azul a Au, luego a C. | "Cuando el equipo RBS analiza un material, millones de partículas bombardean la muestra. Cada pico de este espectro resume miles de choques contra el mismo elemento. La posición del pico nos dice qué elemento es — calculada con la misma fórmula de K que vimos. La altura del pico nos dice cuánto hay — es proporcional al cuadrado del número atómico, la sección eficaz de Rutherford. A igual concentración, el pico del oro es 173 veces más alto que el del carbono, porque 79 al cuadrado dividido 6 al cuadrado da exactamente 173." |
| 3:50–4:25 | Cámara al estudiante. | "Esta técnica se usa hoy en tres áreas clave. En semiconductores: para verificar la composición de las capas delgadas de un chip, sin destruir la muestra. En ciencia de materiales: para medir perfiles de dopaje en materiales avanzados. Y en arte y arqueología: para identificar los pigmentos de una pintura o la aleación de una pieza metálica, sin tocarla. Todo usando el mismo principio que Rutherford demostró en 1911." |
| 4:25–5:00 | Cámara al estudiante. Panel A visible al fondo. | "El núcleo que descubrió Rutherford creó un problema que la física clásica no podía resolver: si el electrón orbita el núcleo, debería irradiar energía y colapsar en menos de un nanosegundo. Dos años después, en 1913, Bohr resolvió esto postulando que la energía del electrón está cuantizada. Sin el núcleo de Rutherford, no hay crisis; sin esa crisis, no hay mecánica cuántica temprana. Rutherford no es contexto del módulo — es su punto de partida." |

---

## Notas de producción

### Traspasos
Los traspasos entre estudiantes son las frases subrayadas al final de cada bloque.
**Ensayarlos por separado** como frases fijas — no improvisar — para no consumir segundos extra.

### Ensayo de la app
Antes de grabar, practicar esta secuencia exacta:
1. Abrir `index.html` en el navegador en pantalla completa
2. Panel A: toggle Thomson → Rutherford → mover slider E de 4 a 10
3. Panel B: mover slider M₂ de izquierda a derecha, parar en 12 (C) y 197 (Au)
4. Panel C: observar el marcador sincronizarse con M₂

### Control de tiempo
| Bloque | Objetivo | Margen |
|---|---|---|
| Estudiante 1 | 1:35 | ±5 s |
| Estudiante 2 | 1:35 | ±5 s |
| Estudiante 3 | 1:35 | ±5 s |
| Total | 4:45 – 5:00 | — |

Si algún bloque se extiende, recortar las frases de aplicaciones (minuto 3:50–4:25) — son las más fáciles de comprimir sin perder el mensaje central.

### Valores numéricos verificados (usar estos, no redondear de más)
| Magnitud | Valor exacto |
|---|---|
| K(C, 170°, M₁=4) | 0.2525 |
| E₁(C) | 0.505 MeV |
| K(Au, 170°, M₁=4) | 0.9226 |
| E₁(Au) | 1.845 MeV |
| a₀(Au, 7 MeV) | 16.25 fm |
| θ_max Thomson (Au, 7 MeV) | 6.4 × 10⁻³ ° |
| Altura Au / Altura C (igual concentración) | 173.4 |

---

*Guion generado el 17-ago-2026. Valores verificados con Python 3.13 + mamba. Referencia: Chu, Mayer & Nicolet (1978).*
