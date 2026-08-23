# Guion de Video — Evaluación 2, Módulo 2
## Diplomado de Física Moderna · Teoría Cuántica Temprana

| Campo | Detalle |
|---|---|
| **Tema** | Del Experimento de Rutherford a la Espectroscopía RBS y Hadronterapia |
| **Duración** | 5:00 min (máximo) |
| **Integrantes** | Estudiante 1 · Estudiante 2 · Estudiante 3 |
| **App de apoyo** | `rutherford_rbs/index.html` — abrir en el navegador antes de grabar |
| **Fecha** | _________________ |

---

## Instrucciones generales

- Cada estudiante habla exactamente ~1:40 min con ritmo fluido, natural y académico.
- Ensayar las acciones de la app por separado antes de grabar para sincronizar palabra y cursor.
- Los traspasos son frases fijas para asegurar transiciones limpias sin tiempos muertos.
- Todos los valores numéricos y fórmulas corresponden con exactitud a la simulación interactiva.
- **Estudiante 3** domina el bloque de aplicaciones (Paneles C, D y E + cierre cuántico).

---

## ESTUDIANTE 1 — Contexto histórico, Panel 0 y Panel A (0:00 – 1:40)

| Tiempo | Acción en pantalla | Texto hablado |
|:---:|:---|:---|
| 0:00–0:25 | Cámara al estudiante. App en **Panel 0** (Contexto histórico). | "A inicios del siglo XX, la Física Moderna avanzaba en dos revoluciones: Max Planck introducía los cuantos de radiación en 1900 para resolver la catástrofe ultravioleta de la luz, mientras que la estructura interna de la materia seguía siendo un misterio. En 1911, Ernest Rutherford transformó nuestra comprensión del átomo con un experimento cuyo resultado describió como disparar una bala naval contra un pañuelo de papel y verla rebotar." |
| 0:25–0:55 | **Panel A → modo Thomson.** Señalar la esfera difusa y trayectorias casi rectas. | "El modelo vigente de Thomson de 1904 planteaba una carga positiva difusa en todo el átomo. Como muestra la app, el montaje experimental real empleaba una fuente de Radio 226 emitiendo alfas de 5 a 8 MeV, un colimador de plomo, una lámina de oro de 0.4 micrómetros y una pantalla centelladora de sulfuro de zinc. Si Thomson estuviera en lo correcto, la ley de Gauss predice un campo interior débil y una deflexión máxima de apenas seis milésimas de grado: trayectorias indistinguibles de líneas rectas." |
| 0:55–1:15 | **Clic en toggle → modo Rutherford.** Ver hipérbolas y rebotes a gran ángulo. | "Sin embargo, Geiger y Marsden observaron que una de cada diez mil partículas rebotaba a más de 90 grados. Rutherford dedujo que toda la masa y carga positiva están concentradas en un núcleo diminuto de escala femtométrica. Ambos modelos usan física clásica pura; la diferencia fundamental es la concentración espacial de la carga." |
| 1:15–1:35 | **Mover slider $E_0$ (4 a 10 MeV) y elemento $Z_2$ (Au, Ag, Fe).** Activar *Trazas acumuladas*. | "Nuestra simulación resuelve la repulsión de Coulomb por integración numérica RK4. El parámetro $a_0$, que mide la escala de acercamiento, disminuye al subir la energía y aumenta con la carga $Z_2$. Al ser el núcleo 10.000 veces menor que el átomo, la gran mayoría de partículas pasa lejos ($b \gg a_0$) sin desviarse; solo los impactos centrales directos sufren grandes retrodispersiones." |
| 1:35–1:40 | Cámara al estudiante. | "Este mismo choque elástico contra el núcleo descubierto por Rutherford es el principio físico que permite identificar la composición de materiales, como explicará mi compañero." |

> **Traspaso a Estudiante 2** (frase fija):
> *"Este mismo choque elástico contra el núcleo descubierto por Rutherford es el principio físico que permite identificar la composición de materiales, como explicará mi compañero."*

---

## ESTUDIANTE 2 — Factor Cinemático $K$ y Panel B (1:40 – 3:20)

| Tiempo | Acción en pantalla | Texto hablado |
|:---:|:---|:---|
| 1:40–2:05 | Cámara al estudiante. Scroll a **Panel B** (Factor cinemático). | "En la técnica analítica RBS (Espectrometría de Retrodispersión de Rutherford), aprovechamos que la colisión entre la partícula alfa y el núcleo es un choque elástico bidimensional. Por conservación simultánea de momento lineal y energía cinética, la energía de la partícula dispersada $E_1$ y la energía de retroceso $E_{\text{rec}}$ dependen estrictamente de la masa del núcleo blanco $M_2$." |
| 2:05–2:40 | **Panel B.** Mover slider $M_2$ de 12 (C) a 197 (Au). Señalar las tarjetas métricas en orden. | "Observen las cinco tarjetas métricas que guían el análisis: Primero, el Factor Cinemático $K$, la huella digital del choque a 170 grados. Segundo, la Energía Dispersada $E_1$ que registra el detector. Con un haz de 2 MeV: frente a Carbono, $K$ vale 0.2525 y la alfa retiene solo 0.505 MeV; frente a Oro, $K$ vale 0.9226 y retiene 1.845 MeV. Tercero y cuarto, el retroceso del núcleo: el carbono absorbe 1.495 MeV (el 74.7% de la energía) saliendo impulsado a mitad de la velocidad del proyectil ($0.50\,v_0$), mientras que el oro apenas absorbe 0.155 MeV con un retroceso de solo $0.04\,v_0$. Finalmente, la quinta tarjeta diagnostica y clasifica el elemento químico identificado." |
| 2:40–3:10 | **Panel B.** Mostrar la animación de retroceso y destacar el límite cinemático. | "La animación en pantalla modela la velocidad de rebote de la alfa proporcional a la raíz de $K$ y el retroceso visible del núcleo. Noten un límite físico fundamental: para blancos con masa menor que la partícula alfa —como el Hidrógeno— no existe solución física para rebotes hacia atrás. El Hidrógeno es invisible en RBS convencional; para analizarlo se emplea la técnica ERDA, detectando los núcleos expulsados hacia adelante." |
| 3:10–3:20 | Cámara al estudiante. | "Identificada la masa con el factor $K$ y el balance de retroceso, el siguiente paso es cuantificar concentraciones y analizar muestras reales multicapa, como mostrará mi compañero." |

> **Traspaso a Estudiante 3** (frase fija):
> *"Identificada la masa con el factor $K$, el siguiente paso es cuantificar concentraciones y analizar muestras reales multicapa, como mostrará mi compañero."*

---

## ESTUDIANTE 3 — Espectros RBS, Perfilado, Hadronterapia y Cierre Cuántico (3:20 – 5:00)

| Tiempo | Acción en pantalla | Texto hablado |
|:---:|:---|:---|
| 3:20–3:45 | **Panel C.** Explorar espectro interactivo y mover sliders de concentración. | "Al acumular las detecciones obtenemos el espectro RBS. La posición del pico en el eje de energía revela la masa $M_2$ mediante el factor $K$. Su área o rendimiento es proporcional a la concentración atómica y al cuadrado del número atómico ($Z_2^2$). A igual abundancia, el oro produce una señal 173 veces más intensa que el carbono. Gracias a la fórmula canónica de Chu de 1978, RBS permite cuantificación absoluta directa sin necesidad de patrones previos de calibración." |
| 3:45–4:10 | **Panel D.** Simulación C/Au/Si en vivo. Variar corriente $I$ de 20 a 60 nA y pausar. | "En el Panel D vemos el análisis de una multicapa real: silicio, oro y carbono. La corriente del haz regula el flujo de partículas —más de sesenta mil millones por segundo a 20 nA—. Al acumular cuentas, las fluctuaciones de Poisson disminuyen según uno sobre raíz de $N$, convergiendo el espectro. Además, el Factor de Parada $[S]$ transforma la pérdida continua de energía inelástica en el espesor físico nanométrico de cada estrato." |
| 4:10–4:35 | **Panel E.** Curva de Bragg con protones a 150 MeV. Variar slider y alternar a $^{12}\mathrm{C}^{6+}$. | "La misma interacción de Coulomb gobierna la frontera médica moderna: la Hadronterapia. Según el principio de Bethe-Bloch, el frenado $-\frac{dE}{dx}$ es proporcional a $z^2/v^2$. Al desacelerar en el tejido, la partícula deposita casi toda su energía en una zona terminal estrecha: el Pico de Bragg, con dosis cero detrás del tumor. A diferencia de los rayos X convencionales que dañan tejido sano a la entrada, los protones y los iones de carbono 12 ($z^2=36$) destruyen tumores profundos y radiorresistentes con precisión milimétrica." |
| 4:35–5:00 | **Scroll a Línea de Tiempo (Panel ∞) y cámara al estudiante.** | "En conclusión: el núcleo de Rutherford en 1911 creó la crisis clásica del colapso del electrón por radiación de Larmor, obligando a Niels Bohr en 1913 a postular las órbitas cuánticas de la materia. Irónicamente, las alfas usadas por Rutherford solo escapan del radio por efecto túnel cuántico. Así, el experimento que inauguró la Teoría Cuántica Temprana fundamenta hoy la metrología de materiales por RBS y los tratamientos oncológicos más avanzados." |

---

## Resumen de Parámetros y Valores Verificados

| Parámetro / Magnitud | Valor Exacto | Relevancia en la Presentación |
|---|:---:|---|
| $a_0$ (Au, $E_0=7\,\text{MeV}$) | $16.25\,\text{fm}$ | Escala característica de dispersión ($d_{\min}=2a_0$). |
| $\theta_{\max}$ Thomson ($E_0=7\,\text{MeV}$) | $6.4 \times 10^{-3}{^\circ}$ | Demuestra la imposibilidad clásica del modelo difuso. |
| Factor $K$ (Carbono $^{12}\text{C}$, $170^\circ$) | $0.2525$ | $E_1 = 0.505\,\text{MeV}$ (pierde 74.7% de energía). |
| Factor $K$ (Silicio $^{28}\text{Si}$, $170^\circ$) | $0.5649$ | $E_1 = 1.130\,\text{MeV}$. |
| Factor $K$ (Hierro $^{56}\text{Fe}$, $170^\circ$) | $0.7527$ | $E_1 = 1.505\,\text{MeV}$. |
| Factor $K$ (Plata $^{108}\text{Ag}$, $170^\circ$) | $0.8632$ | $E_1 = 1.726\,\text{MeV}$. |
| Factor $K$ (Oro $^{197}\text{Au}$, $170^\circ$) | $0.9226$ | $E_1 = 1.845\,\text{MeV}$ (retiene 92.3% de energía). |
| Relación de secciones eficaces $\sigma_{\text{Au}}/\sigma_{\text{C}}$ | $173.4 = (79/6)^2$ | Modulación $Z_2^2$ en el rendimiento espectral. |
| Flujo del haz $I = 20\,\text{nA}$ | $6.24 \times 10^{10}\,\alpha/\text{s}$ | Tasa de spawn estocástico y convergencia de Poisson. |
| Poder de frenado (Bethe-Bloch) | $-\frac{dE}{dx} \propto \frac{z^2}{v^2}$ | Origen físico del Pico de Bragg terminal. |
| Carga de iones $^{12}\mathrm{C}^{6+}$ | $z^2 = 36$ | RBE elevado para tumores radiorresistentes. |
| Tiempo de colapso clásico de Larmor | $\tau \approx 1.6 \times 10^{-11}\,\text{s}$ | Paradoja clásica resuelta por la cuantización de Bohr ($L=n\hbar$). |

---

*Guion técnico sincronizado y verificado con `index.html`. Diseñado para la Evaluación 2 del Módulo 2 (Teoría Cuántica Temprana).*