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
- Los valores numéricos en el guion son **exactos**, verificados con Python 3.13.

---

## ESTUDIANTE 1 — Contexto histórico + Panel A (0:00 – 1:40)

| Tiempo | Acción en pantalla | Texto hablado |
|:---:|:---|:---|
| 0:00–0:20 | Cámara al estudiante. App cerrada o en espera. | "¿Cómo sabemos de qué está hecho un material sin abrirlo ni verlo? A principios del siglo XX, Ernest Rutherford se hizo una pregunta parecida sobre el átomo. Y el resultado fue, según sus propias palabras, tan increíble como si hubieras disparado una bala naval contra un pañuelo de papel y hubiera rebotado hacia ti." |
| 0:20–0:50 | **Panel A → modo Thomson.** Señalar la esfera naranja. Trayectorias casi rectas. | "En 1904 existía el modelo de Thomson: la carga positiva distribuida en todo el volumen del átomo. Si ese modelo fuera correcto, las partículas alfa pasarían casi sin desviarse — la deflexión máxima calculada es de seis milésimas de grado. Literalmente líneas rectas a esta escala." |
| 0:50–1:05 | **Clic en toggle → modo Rutherford.** Trayectorias curvas aparecen. Inset del modelo atómico visible. | "Pero Geiger y Marsden observaron rebotes a más de 90 grados. Eso solo ocurre si la carga positiva está concentrada en un núcleo diminuto y denso. El núcleo que aparece en la simulación — el mismo que obligará a Bohr a cuantizar la energía del electrón dos años después." |
| 1:05–1:35 | **Mover slider de energía de 4 a 10 MeV.** La barra de escala y los ángulos cambian. | "Cada trayectoria es una hipérbola real: la ecuación de movimiento en el potencial de Coulomb, integrada numéricamente. A 7 Megaelectronvoltios, la partícula más cercana al núcleo de oro pasa a solo 16 femtómetros — cien mil veces más pequeño que el átomo. Al subir la energía, las trayectorias penetran más cerca del núcleo. Ese efecto se ve en tiempo real." |
| 1:35–1:40 | Cámara al estudiante. | "Ese mismo haz de partículas es hoy la base de una técnica que analiza materiales. Les cuento cómo." |

> **Traspaso a Estudiante 2** (frase fija):
> *"Les cuento cómo."*

---

## ESTUDIANTE 2 — Factor cinemático K + Panel B (1:40 – 3:20)

| Tiempo | Acción en pantalla | Texto hablado |
|:---:|:---|:---|
| 1:40–2:00 | Cámara al estudiante. Panel B visible al fondo. | "Cuando una partícula alfa choca elásticamente contra un núcleo, parte de su energía pasa al blanco. ¿Cuánta? Depende de la masa del blanco. Como en el billar: si chocas contra una bola pesada, retienes casi toda la energía. Si chocas contra una liviana, casi te detienes. La energía de rebote revela la masa del blanco — ese es el principio de RBS." |
| 2:00–2:40 | **Panel B.** Mover slider M₂ de 12 (C) a 197 (Au). K y E₁ se actualizan. | "Esta es la fórmula del factor cinemático K: conservación de energía y momento en una colisión elástica. Con partículas alfa de 2 Megaelectronvoltios y detector a 170 grados — estándar porque maximiza la separación entre elementos — obtenemos: contra Carbono, K vale 0.2525 y la partícula sale con 0.505 Megaelectronvoltios. Contra Oro, K vale 0.9226 y sale con 1.845. Midiendo esa energía de salida, identificamos el elemento." |
| 2:40–3:10 | **Panel B.** Dejar corriendo la animación con Au. | "Aclaración explícita de nuestro proyecto: la animación no calcula el instante del choque — eso ocurre en femtosegundos. Lo que sí es real es la comparación entre energía de entrada y salida. La velocidad de salida es proporcional a raíz de K — metáfora visual de energía conservada. La fórmula de K es exacta, verificada numéricamente." |
| 3:10–3:20 | Cámara al estudiante. | "Con esa energía medida, sabemos qué elemento encontró la partícula. Pero una muestra real tiene muchos elementos a la vez." |

> **Traspaso a Estudiante 3** (frase fija):
> *"Pero una muestra real tiene muchos elementos a la vez."*

---

## ESTUDIANTE 3 — Espectro + Panel D + Cierre (3:20 – 5:00)

| Tiempo | Acción en pantalla | Texto hablado |
|:---:|:---|:---|
| 3:20–3:50 | **Panel C.** Espectro completo. Mover marcador azul de C a Au. | "Cuando el equipo RBS analiza un material, millones de partículas bombardean la muestra. Cada pico resume miles de choques contra el mismo elemento. La posición identifica el elemento — con la fórmula de K. La altura mide la cantidad — proporcional al cuadrado del número atómico. A igual concentración, el pico del oro es 173 veces más alto que el del carbono: 79 al cuadrado sobre 6 al cuadrado, exactamente 173." |
| 3:50–4:25 | **Panel D.** Simulación corriendo con muestra C/Au/Si. Subir slider de corriente de 20 a 60 nA. | "Aquí todo junto en una muestra concreta: silicio como substrato, película fina de oro encima, trazas de carbono en la superficie. El espectro derecho se acumula con cada detección — igual que un equipo real. El slider de corriente del haz controla cuántas partículas impactan por segundo: a mayor corriente, el espectro se acumula más rápido. Esta técnica se usa en semiconductores, materiales avanzados y autenticación de obras de arte — sin destruir la muestra." |
| 4:25–5:00 | Cámara al estudiante. Panel A visible al fondo. | "El núcleo que descubrió Rutherford creó dos problemas que la física clásica no podía resolver: la estabilidad del electrón en órbita y los espectros discretos del hidrógeno. Bohr los resolvió en 1913 postulando que la energía del electrón está cuantizada. Sin el núcleo de Rutherford no existe esa crisis; sin esa crisis no existe la mecánica cuántica temprana. Y ese mismo núcleo es hoy el blanco que da a cada elemento su firma única en el espectro RBS." |

---

## Notas de producción

### Traspasos
Frases fijas al final de cada bloque. **Ensayar por separado** — no improvisar.

### Secuencia de ensayo de la app
1. Abrir `index.html` en el navegador
2. **Panel A:** toggle Thomson → observar rectas → toggle Rutherford → mover slider E de 4 a 10 MeV
3. **Panel B:** mover slider M₂ de 12 (C) a 197 (Au) → observar K y E₁
4. **Panel C:** el marcador azul se sincroniza automáticamente con M₂
5. **Panel D:** subir slider de corriente de 20 a 60 nA

### Control de tiempo

| Bloque | Objetivo | Margen |
|---|---|---|
| Estudiante 1 | 1:35 | ±5 s |
| Estudiante 2 | 1:35 | ±5 s |
| Estudiante 3 | 1:35 | ±5 s |
| Total | 4:45 – 5:00 | — |

Si algún bloque se extiende, recortar las aplicaciones (4:00–4:25).

### Valores numéricos verificados

| Magnitud | Valor |
|---|---|
| K(C, θ=170°) | 0.2525 |
| E₁(C, E₀=2 MeV) | 0.505 MeV |
| K(Si, θ=170°) | 0.5649 |
| E₁(Si, E₀=2 MeV) | 1.130 MeV |
| K(Fe, θ=170°) | 0.7527 |
| K(Ag, θ=170°) | 0.8632 |
| K(Au, θ=170°) | 0.9226 |
| E₁(Au, E₀=2 MeV) | 1.845 MeV |
| a₀(Au, 7 MeV) | 16.25 fm |
| θ_max Thomson (Au, 7 MeV) | 6.4 × 10⁻³ ° |
| Au/C misma concentración | 173.4 = (79/6)² |
| Corriente default Panel D | 20 nA → Δt = 460 ms entre partículas |

---

*Guion actualizado 18-ago-2026. Refleja versión final: 5 elementos en Paneles C y D, slider de corriente de haz, imagen 3D del modelo atómico en Panel A. Verificado con Python 3.13 + mamba. Referencia: Chu, Mayer & Nicolet (1978).*