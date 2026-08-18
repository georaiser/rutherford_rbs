# Guion de Video — Evaluación 2, Módulo 2
## Diplomado de Física Moderna

| Campo | Detalle |
|---|---|
| **Tema** | Experimento de Rutherford, RBS y Medicina Nuclear (Hadronterapia) |
| **Duración** | 5:00 min (máximo) |
| **Integrantes** | Estudiante 1 · Estudiante 2 · Estudiante 3 |
| **App de apoyo** | `rutherford_rbs/index.html` — abrir en el navegador antes de grabar |
| **Fecha** | _________________ |

---

## Instrucciones generales

- Cada estudiante habla ~1:40 min. Ritmo natural, sin pausas largas.
- Ensayar las acciones de la app por separado antes de grabar.
- Los traspasos son frases fijas — no improvisar.
- Los valores numéricos son exactos, verificados con Python 3.13.
- **Estudiante 3** tiene la carga más densa: Paneles C, D y E condensados + cierre.
  Practicar ese bloque hasta dominar el tiempo.

---

## ESTUDIANTE 1 — Contexto histórico + Panel A (0:00 – 1:40)

| Tiempo | Acción en pantalla | Texto hablado |
|:---:|:---|:---|
| 0:00–0:20 | Cámara al estudiante. App en espera. | "¿Cómo sabemos de qué está hecho un material sin abrirlo? A principios del siglo XX, Rutherford se hizo una pregunta parecida sobre el átomo. El resultado fue, según sus propias palabras, tan increíble como si hubieras disparado una bala naval contra un pañuelo de papel y hubiera rebotado hacia ti." |
| 0:20–0:50 | **Panel A → modo Thomson.** Señalar la esfera naranja. Trayectorias casi rectas. | "En 1904 existía el modelo de Thomson: carga positiva distribuida en todo el volumen del átomo. Si ese modelo fuera correcto, las partículas alfa pasarían casi sin desviarse — la deflexión máxima calculada es de seis milésimas de grado. Líneas rectas a esta escala." |
| 0:50–1:05 | **Clic en toggle → modo Rutherford.** Trayectorias curvas. Inset del modelo atómico. | "Pero Geiger y Marsden observaron rebotes a más de 90 grados. Eso solo ocurre si toda la carga positiva está concentrada en un núcleo pequeño y denso. Ese núcleo obliga a Bohr a cuantizar el átomo dos años después — es el origen de la mecánica cuántica temprana." |
| 1:05–1:35 | **Mover slider de energía de 4 a 10 MeV.** La barra de escala y ángulos cambian en tiempo real. | "Cada trayectoria es una hipérbola real — la ecuación de movimiento en el potencial de Coulomb, integrada numéricamente. A 7 Megaelectronvoltios, la partícula más cercana al núcleo de oro pasa a solo 16 femtómetros — cien mil veces más pequeño que el átomo. Al subir la energía, las trayectorias penetran más cerca del núcleo." |
| 1:35–1:40 | Cámara al estudiante. | "Ese mismo núcleo que Rutherford descubrió es la base de la técnica que mi compañero presenta ahora." |

> **Traspaso a Estudiante 2** (frase fija):
> *"Ese mismo núcleo es la base de la técnica que mi compañero presenta ahora."*

---

## ESTUDIANTE 2 — Factor cinemático K + Panel B (1:40 – 3:20)

| Tiempo | Acción en pantalla | Texto hablado |
|:---:|:---|:---|
| 1:40–2:00 | Cámara al estudiante. Panel B al fondo. | "Cuando una partícula alfa choca elásticamente contra un núcleo, parte de su energía pasa al blanco. ¿Cuánta? Depende de la masa del blanco. Como en el billar: chocas contra una bola pesada, retienes casi toda la energía; contra una liviana, casi te detienes. La energía de rebote revela la masa del blanco — ese es el principio de RBS." |
| 2:00–2:40 | **Panel B.** Mover slider M₂ despacio de 12 (C) a 197 (Au). K y E₁ se actualizan. | "Esta es la fórmula del factor cinemático K: conservación de energía y momento en colisión elástica. Con partículas alfa de 2 Megaelectronvoltios y detector a 170 grados — estándar porque maximiza la separación entre elementos — obtenemos: contra Carbono, K vale 0.2525, la partícula sale con 0.505 Megaelectronvoltios. Contra Oro, K vale 0.9226 y sale con 1.845. Midiendo esa energía, identificamos el elemento." |
| 2:40–3:10 | **Panel B.** Dejar corriendo la animación con Au. | "Aclaración explícita de nuestro proyecto: la animación no calcula el instante del choque — ocurre en femtosegundos. Lo que sí es real es la comparación entre energía de entrada y salida. La velocidad de rebote en la animación es proporcional a raíz de K — metáfora visual de energía conservada. La fórmula de K es exacta, verificada con Python." |
| 3:10–3:20 | Cámara al estudiante. | "Con esa energía medida, identificamos el elemento. Pero en una muestra real hay muchos elementos a la vez — y esa misma física tiene otra aplicación que va mucho más allá del laboratorio." |

> **Traspaso a Estudiante 3** (frase fija):
> *"Esa misma física tiene otra aplicación que va mucho más allá del laboratorio."*

---

## ESTUDIANTE 3 — Espectro RBS + Panel D + Hadronterapia + Cierre (3:20 – 5:00)

| Tiempo | Acción en pantalla | Texto hablado |
|:---:|:---|:---|
| 3:20–3:45 | **Panel C.** Espectro completo. Mover marcador de C a Au. | "Cuando el equipo RBS analiza un material, cada pico del espectro resume miles de choques contra el mismo elemento. La posición identifica el elemento con la fórmula de K. La altura mide la cantidad — proporcional al cuadrado del número atómico. A igual concentración, el pico del oro es 173 veces más alto que el del carbono: 79 al cuadrado sobre 6 al cuadrado." |
| 3:45–4:05 | **Panel D.** Simulación C/Au/Si corriendo. Subir corriente de 20 a 60 nA. | "Aquí todo junto en una muestra concreta: silicio como substrato, película de oro encima, trazas de carbono en la superficie. El espectro se acumula con cada detección. El slider de corriente controla cuántas partículas impactan por segundo — igual que en un equipo real. Esta técnica analiza chips, catalizadores y obras de arte sin destruir la muestra." |
| 4:05–4:35 | **Panel E.** Mostrar la curva de Bragg con protones a 150 MeV. Mover slider de 100 a 200 MeV. Luego toggle a iones C¹². | "La misma interacción de Coulomb que dispersa partículas en RBS también frena los proyectiles dentro del tejido. Esta es la curva de Bragg: un haz de protones deposita muy poca dosis en la entrada y casi toda su energía en el pico — exactamente donde está el tumor. Comparen con los fotones en azul punteado: los rayos X depositan la dosis máxima en la entrada y decaen sin control. Al cambiar la energía del haz, el pico se mueve — eso permite apuntar al tumor. Los iones de carbono producen un pico aún más estrecho e intenso." |
| 4:35–5:00 | Cámara al estudiante. | "El núcleo que Rutherford descubrió en 1911 creó la crisis que Bohr resolvió cuantizando el átomo. Ese mismo núcleo es el blanco que hoy analiza materiales capa a capa en RBS, y el que permite tratar tumores con precisión milimétrica en hadronterapia. Y en 1912, Georg de Hevesy, trabajando en el laboratorio de Rutherford, inventó el principio del radiotrazador al no poder separar isótopos — ese 'fracaso' dio origen a todos los estudios PET y SPECT del mundo. Todo parte del mismo experimento." |

---

## Notas de producción

### Traspasos
Frases fijas al final de cada bloque. **Ensayarlas como frases cerradas** — no improvisar.

### Secuencia de ensayo de la app
1. Abrir `index.html` en el navegador
2. **Panel A:** toggle Thomson → rectas → toggle Rutherford → slider E de 4 a 10 MeV
3. **Panel B:** slider M₂ de 12 a 197 → leer K y E₁ en las tarjetas
4. **Panel C:** marcador azul sincronizado con M₂
5. **Panel D:** subir corriente de 20 a 60 nA → espectro se acumula más rápido
6. **Panel E:** slider de energía de 100 a 200 MeV → pico se mueve → toggle a C¹²

### Control de tiempo

| Bloque | Objetivo | Margen |
|---|---|---|
| Estudiante 1 | 1:35 | ±5 s |
| Estudiante 2 | 1:35 | ±5 s |
| Estudiante 3 | 1:35 | ±5 s |
| Total | 4:45 – 5:00 | — |

**Estudiante 3 — si el tiempo se extiende**, recortar en este orden:
1. Reducir el bloque Panel D (3:45–4:05) a 10 s — solo mostrar la simulación corriendo
2. Comprimir las aplicaciones de RBS (segunda mitad de 3:45–4:05)
3. NO recortar Panel E ni el cierre — son el diferenciador del trabajo

### Valores numéricos verificados

| Magnitud | Valor |
|---|---|
| K(C, θ=170°) | 0.2525 |
| E₁(C, E₀=2 MeV) | 0.505 MeV |
| K(Si, θ=170°) | 0.5649 |
| K(Fe, θ=170°) | 0.7527 |
| K(Ag, θ=170°) | 0.8632 |
| K(Au, θ=170°) | 0.9226 |
| E₁(Au, E₀=2 MeV) | 1.845 MeV |
| Au/C misma concentración | 173.4 = (79/6)² |
| a₀(Au, 7 MeV) | 16.25 fm |
| θ_max Thomson (Au, 7 MeV) | 6.4 × 10⁻³ ° |
| Corriente default Panel D | 20 nA → Δt = 460 ms entre partículas |
| Factor Bethe-Bloch correccion | 0.56 (shell + densidad, declarado) |
| Pico Bragg protones 150 MeV | ~15 cm en tejido (agua) |
| Pico Bragg protones 70 MeV | ~4 cm en tejido (agua) |
| Pico Bragg protones 230 MeV | ~33 cm en tejido (agua) |
| z² protones vs. C¹²⁶⁺ | 1 vs. 36 (pico 36× más intenso) |

### Relación entre las tres técnicas (para referencia del equipo)

| Técnica | Usa de Coulomb | Mide/controla |
|---|---|---|
| RBS | Dispersión elástica α-núcleo | Energía de retroceso → identifica elementos |
| Hadronterapia | Frenado del proyectil (Bethe-Bloch) | Profundidad del pico → dosis en tumor |
| PET/SPECT | Radiación de núcleos inestables | Distribución del radiotrazador → imagen funcional |

---

*Guion actualizado 18-ago-2026. Versión final: 5 paneles (A–E). Panel E incluye hadronterapia (Bragg curve, Bethe-Bloch) y conexión con diagnóstico nuclear. Verificado con Python 3.13 + mamba. Referencias: Chu, Mayer & Nicolet (1978); Bethe (1930); PDG (2022); Wilson (1946).*