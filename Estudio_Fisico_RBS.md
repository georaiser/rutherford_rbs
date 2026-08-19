# Estudio Físico — Experimento de Rutherford, RBS y Hadronterapia
## Proyecto: Evaluación 2, Módulo 2 — Diplomado de Física Moderna

### Índice
0. Contexto histórico y motivación
1. Panel A — Dispersión de Rutherford
2. Panel B — Factor cinemático K
3. Panel C — Espectro RBS
4. Panel D — RBS en acción (simulación dinámica)
5. Panel E — Hadronterapia y Curva de Bragg
6. Hilo cuántico — Sección ∞
7. Tabla maestra de fórmulas verificadas
8. Glosario de términos
9. Referencias

---

### 0. Contexto histórico y motivación

El desarrollo de la física moderna a principios del siglo XX estuvo marcado por la necesidad de comprender la estructura íntima de la materia. El experimento de la lámina de oro, concebido por Ernest Rutherford y ejecutado por Hans Geiger y Ernest Marsden (1909-1911), supuso un punto de inflexión. Al bombardear átomos de oro con partículas alfa, observaron retrodispersiones (backscattering) que contradecían las predicciones de la época. Este proyecto interactivo no solo simula dicho hito histórico, sino que lo conecta con dos aplicaciones modernas de gran relevancia: la Espectrometría de Retrodispersión de Rutherford (RBS), técnica fundamental en el análisis de materiales y películas delgadas, y la hadronterapia, que aprovecha los principios de interacción radiación-materia (Curva de Bragg) para el tratamiento oncológico avanzado. El presente documento académico detalla la base física, matemática y algorítmica de cada uno de los paneles del proyecto.

---

### 1. Panel A — Dispersión de Rutherford

#### 1.1 El experimento de Geiger-Marsden (1909-1911)
El experimento original consistió en dirigir un haz colimado de partículas alfa ($Z_1=2$, núcleos de helio emitidos por decaimiento radiactivo) hacia una finísima lámina de oro ($Z_2=79$). Se esperaba que las partículas atravesaran la lámina con desviaciones minúsculas. Sin embargo, una pequeña pero significativa fracción rebotaba en ángulos mayores a 90°, un resultado que Rutherford comparó con disparar un proyectil naval contra un pañuelo de papel y que este rebotara.

#### 1.2 Modelo de Thomson vs. modelo nuclear
El modelo de J.J. Thomson o "budín de pasas" postulaba una esfera de carga positiva continua en la que los electrones estaban incrustados. Debido a la baja densidad de carga, el campo eléctrico máximo en el interior del átomo era débil. La predicción clásica para este modelo resulta en un ángulo máximo de deflexión extremadamente pequeño. En nuestra simulación, este valor límite está fijado y verificado en $\theta_{\text{max Thomson}} = 6.4 \times 10^{-3 \circ}$.
Por contraste, el modelo nuclear de Rutherford concentra toda la carga positiva y casi toda la masa en un núcleo central de dimensiones del orden de los femtómetros ($1 \text{ fm} = 10^{-15} \text{ m}$). Esto genera un campo eléctrico intenso capaz de retrodispersar proyectiles de varios MeV.

#### 1.3 Fuerza de Coulomb y trayectoria hiperbólica
La interacción fundamental es la repulsión electrostática de Coulomb entre el proyectil alfa y el núcleo blanco. La fuerza central repulsiva viene dada por:
$$ \mathbf{F} = \frac{1}{4\pi\epsilon_0} \frac{Z_1 Z_2 e^2}{r^2} \hat{\mathbf{r}} $$
Bajo una fuerza central que decae con el inverso del cuadrado de la distancia, la mecánica clásica dicta que la trayectoria resultante, para una energía total positiva ($E > 0$), es una **hipérbola**.

#### 1.4 Parámetro de Rutherford $a_0$
Para caracterizar la colisión, definimos el parámetro de Rutherford $a_0$, que representa la mitad de la distancia de máxima aproximación en una colisión frontal ($b=0$):
$$ a_0 = \frac{1}{4\pi\epsilon_0} \frac{Z_1 Z_2 e^2}{2 E_0} $$
Considerando la constante $k e^2 = 1.44 \text{ MeV}\cdot\text{fm}$, para partículas alfa ($Z_1=2$) incidiendo sobre oro ($Z_2=79$) con una energía de $E_0 = 7.0 \text{ MeV}$:
$$ a_0(\text{Au}, 7\text{ MeV}) = \frac{2 \times 79 \times 1.44 \text{ MeV}\cdot\text{fm}}{2 \times 7 \text{ MeV}} = 16.25 \text{ fm} $$
Este es el valor exacto implementado y verificado en la simulación.

#### 1.5 Ángulo de dispersión $\theta(b)$
El ángulo de deflexión $\theta$ depende del parámetro de impacto $b$, la distancia perpendicular inicial entre la trayectoria del proyectil y el centro del núcleo. La relación analítica es:
$$ b = a_0 \cot\left(\frac{\theta}{2}\right) \implies \theta = 2 \arctan\left(\frac{a_0}{b}\right) $$
A menor parámetro de impacto, mayor es la repulsión experimentada y, por tanto, mayor el ángulo de dispersión.

#### 1.6 Integración RK4 de las ecuaciones de movimiento
Para renderizar las trayectorias hiperbólicas en tiempo real, el motor físico no utiliza la solución analítica directamente, sino que resuelve las ecuaciones diferenciales de movimiento usando el método numérico de Runge-Kutta de cuarto orden (RK4). A partir de la aceleración $\mathbf{a} = \mathbf{F}/m_1$, se actualizan las posiciones y velocidades en cada paso de tiempo discreto $dt$, garantizando la estabilidad de la trayectoria incluso en la zona de máxima curvatura cerca del periápside.

#### 1.7 Modelo de Thomson: esfera de carga uniforme
Cuando se activa el "toggle" del modelo de Thomson en el panel, el simulador cambia la ley de fuerza. Para $r < R_{\text{átomo}}$, la fuerza deja de ser inversamente proporcional a $r^2$ y se vuelve directamente proporcional a $r$ (comportamiento de oscilador armónico espacial), resultando en las trayectorias casi rectas que se observan en la app.

#### 1.8 ¿Por qué $Z_2$ (protones) y no N (neutrones)?
En la simulación del Panel A, la variable de entrada del usuario es el número atómico $Z_2$. La interacción dominante es puramente electromagnética; la fuerza nuclear fuerte actúa a rangos tan cortos ($\approx 1\text{-}2 \text{ fm}$) que no es relevante mientras el proyectil no venza la barrera de Coulomb. Por ello, los neutrones $N$ del blanco no juegan ningún papel en la trayectoria hiperbólica; solo aportan inercia al retroceso (Panel B).

#### 1.9 Simplificaciones declaradas
- **Física clásica:** Se ignora la mecánica cuántica (la sección eficaz clásica y cuántica para un potencial de Coulomb coinciden accidentalmente, teorema de Rutherford).
- **Masa infinita:** En el panel A, se asume que el núcleo blanco es infinitamente masivo y permanece estacionario (sin retroceso). El retroceso se aborda en el Panel B.
- **Apantallamiento electrónico ignorado:** No se considera la reducción del campo eléctrico causada por la nube de electrones a grandes distancias.

---

### 2. Panel B — Factor cinemático K

#### 2.1 Colisión elástica: conservación de $E$ y $p$
En un experimento de RBS, el núcleo blanco experimenta un retroceso macroscópico. Para modelarlo, tratamos el evento como una colisión elástica clásica en dos dimensiones. Se aplican los principios de conservación de la energía cinética y del momento lineal (cantidad de movimiento).

#### 2.2 Fórmula de $K(M_2, \theta)$
El factor cinemático $K$ es la fracción de la energía inicial $E_0$ que retiene el proyectil ($E_1$) tras rebotar en un ángulo $\theta$ contra un blanco de masa $M_2$. Despejando las ecuaciones de conservación, obtenemos:
$$ K = \frac{E_1}{E_0} = \left[ \frac{\sqrt{M_2^2 - M_1^2 \sin^2\theta} + M_1 \cos\theta}{M_1 + M_2} \right]^2 $$
Esta ecuación es la piedra angular del análisis RBS, pues demuestra que la energía detectada $E_1$ es una firma única de la masa $M_2$ del átomo blanco.

#### 2.3 Límites físicos: $M_2 \gg M_1$ y $M_2 = M_1$
- **Si $M_2 \gg M_1$**: El núcleo blanco es tan masivo que apenas retrocede. $K \approx 1$.
- **Si $M_2 = M_1$**: La fórmula se reduce a $K = \cos^2\theta$ para $\theta \le 90^\circ$. A $180^\circ$ (colisión frontal), $K=0$; el proyectil transfiere toda su energía al blanco.

#### 2.4 Valores verificados
En el contexto del proyecto, considerando $M_1=4\text{ u}$ (alfa), un ángulo de retrodispersión de $\theta = 170^\circ$, y las masas del carbono ($12\text{ u}$) y el oro ($197\text{ u}$):
- Para el Carbono: $K(C, 170^\circ) = 0.2525$
- Para el Oro: $K(Au, 170^\circ) = 0.9226$
Esto significa que una partícula alfa retrodispersada por oro conserva el 92.2% de su energía, mientras que una rebotada por carbono retiene apenas el 25.2%.

#### 2.5 Simplificaciones declaradas
- **Ausencia de efectos relativistas:** A las energías estándar del RBS ($2 \text{ MeV}$), las correcciones relativistas para partículas alfa son de un orden de magnitud muy por debajo de la resolución experimental.
- **Energía de enlace atómico:** Se considera la colisión entre núcleos libres, despreciando la energía de enlace molecular o de la red cristalina (del orden de los eV frente a los MeV del proyectil).

---

### 3. Panel C — Espectro RBS

#### 3.1 ¿Qué mide el espectro RBS?
El espectro es un histograma de frecuencias: en el eje X se representa la energía de las partículas retrodispersadas detectadas ($E_1$), y en el eje Y el número de cuentas (rendimiento o *Yield*). 

#### 3.2 Posición de los picos: energía $E_1 = K\cdot E_0$
Cada elemento químico presente en la muestra superficial genera una señal (pico) a una energía específica, determinada unívocamente por su factor cinemático $K$. Elementos pesados (Au) aparecen a la derecha del espectro (alta energía), y los ligeros (C, O) a la izquierda (baja energía).

#### 3.3 Altura de los picos: sección eficaz diferencial $\sigma$
La altura o área bajo el pico indica la cantidad de ese elemento. La probabilidad espacial de que ocurra la retrodispersión se define como la sección eficaz diferencial, la cual, según la ley de Rutherford, es proporcional al cuadrado del número atómico del blanco ($Z_2$):
$$ \frac{d\sigma}{d\Omega} = \left( \frac{Z_1 Z_2 e^2}{16 \pi \epsilon_0 E_0} \right)^2 \frac{1}{\sin^4(\theta/2)} \propto Z_2^2 $$
**Valor verificado:** La relación de intensidades entre el oro y el carbono a igual concentración estequiométrica es:
$$ \frac{(d\sigma/d\Omega)_{\text{Au}}}{(d\sigma/d\Omega)_{\text{C}}} = \left(\frac{79}{6}\right)^2 = \frac{6241}{36} = 173.36 \approx 173.4 $$
Esta tremenda diferencia en la sección eficaz hace que el RBS sea extremadamente sensible a trazas de elementos pesados sobre sustratos ligeros, pero poco sensible a elementos ligeros sobre sustratos pesados.

#### 3.4 Anchura de los picos: resolución energética del detector
Los picos simulados no son líneas de Dirac infinitamente estrechas. Se ensanchan según una distribución Gaussiana impulsada por la resolución instrumental intrínseca del detector de barrera de superficie de silicio (normalmente unos $15\text{-}20\text{ keV}$).

#### 3.5 El espectro completo: suma de gaussianas
Matemáticamente, el perfil transversal en el Panel C se modela como una superposición de funciones Gaussianas:
$$ Y(E) = \sum_{i} A_i \exp\left( - \frac{(E - K_i E_0)^2}{2\sigma_{\text{det}}^2} \right) $$
Donde la amplitud $A_i$ está escalada con $Z_i^2$ de cada elemento de la muestra.

#### 3.6 Simplificaciones declaradas
- **Solo dispersión en superficie:** El panel C es estático y no muestra las colas de dispersión producidas por la pérdida de energía en profundidad.
- **Rutherford ideal:** Se ignoran posibles resonancias nucleares no-Rutherford que suelen ocurrir en elementos ligeros a ciertas energías específicas.

---

### 4. Panel D — RBS en acción (simulación dinámica)

#### 4.1 Del espectro estático a la acumulación dinámica
El Panel D integra la cinemática de una forma continua, simulando un experimento RBS vivo. Las partículas "llueven" aleatoriamente sobre una muestra con 5 capas o elementos predefinidos, y el espectrómetro se dibuja evento a evento.

#### 4.2 Corriente del haz y tasa de eventos
En un experimento real, el haz entrega una corriente $I$ (típicamente $10\text{-}50\text{ nA}$). En la simulación visual, el bucle genera partículas computacionales para poblar los contenedores (*bins*) del histograma en tiempo real. 

#### 4.3 Selección estocástica de la capa (pickup layer)
Para que el proceso sea realista, la probabilidad de que una partícula simulada se disperse en la capa $i$ está ponderada matemáticamente por la sección eficaz de dicho elemento:
$$ P(\text{capa } i) = \frac{Z_{2,i}^2}{\sum Z_{2,j}^2} $$
Por consiguiente, el algoritmo estocástico selecciona la interacción con el Oro con mucha más frecuencia que con el Oxígeno, haciendo crecer su pico gaussiano más rápidamente ante los ojos del usuario.

#### 4.4 Energía dispersada y pérdida de energía en profundidad
Aunque es una simulación visual, introduce el concepto avanzado del RBS: un proyectil que interacciona más profundo en la lámina perderá energía adicional tanto en su trayecto de entrada como en el de salida debido a interacciones inelásticas con los electrones (poder de frenado). En las técnicas modernas, esta pérdida de energía continua $\Delta E$ permite determinar el grosor de las películas delgadas.

#### 4.5 Aplicaciones reales del RBS
Como se evidencia en la acumulación de datos en este panel, el RBS se ha convertido en una técnica invaluable en la industria de los semiconductores y nanomateriales. Permite realizar perfiles de profundidad sin destruir la muestra (no-destructivo), identificar contaminantes metálicos, analizar la estequiometría de películas delgadas (como óxidos en puertas de transistores), y estudiar la difusión térmica entre multicapas.

#### 4.6 Simplificaciones declaradas
- **Frenado electrónico constante:** No se resuelve formalmente la dependencia energética del frenado electrónico $\frac{dE}{dx}(E)$ para calcular la geometría de los perfiles de profundidad con rigor absoluto; se utiliza una abstracción geométrica y de probabilidad para fines didácticos.

---

### 5. Panel E — Hadronterapia y Curva de Bragg

#### 5.1 Problema clínico: dosis en profundidad
La radioterapia convencional con fotones (rayos X) deposita su máxima energía cerca de la superficie de la piel y sigue dañando el tejido sano mientras decae exponencialmente hacia la zona profunda donde se aloja el tumor. La hadronterapia aborda esta limitación clínica aprovechando la física de partículas pesadas cargadas.

#### 5.2 Fórmula de Bethe-Bloch relativista
A diferencia de la dispersión nuclear elástica del RBS, el viaje de un protón por el tejido es dominado por millones de dispersiones inelásticas suaves con los electrones del medio. La pérdida de energía por unidad de distancia (poder de frenado) está gobernada por la ecuación de Bethe-Bloch:
$$ -\frac{dE}{dx} = K_{\text{BB}} \rho \frac{Z_1^2}{v^2} \left[ \ln\left(\frac{2 m_e v^2}{I}\right) - \frac{v^2}{c^2} \right] $$
Donde el coeficiente $K_{\text{BB}} = 0.307075 \text{ MeV}\cdot\text{cm}^2/\text{g}$, y el potencial de excitación medio del agua (tejido) es verificado como $I_{\text{agua}} = 79.7 \text{ eV}$.

#### 5.3 La Curva de Bragg: física del pico
La dependencia de $dE/dx \propto 1/v^2$ revela un fenómeno crítico: a medida que el ión penetra, se frena ($v$ disminuye), lo que a su vez *aumenta* drásticamente el frenado. Esto desencadena un depósito masivo de energía justo en los últimos milímetros de la trayectoria, creando el pronunciado **Pico de Bragg**. Al final del rango físico, la dosis cae abruptamente a cero, protegiendo totalmente el tejido sano situado detrás del tumor.

#### 5.4 Protones vs. iones carbono-12
El panel compara distintas modalidades:
- **Protones ($Z_1=1$, masa $1\text{ u}$):** Presentan un pico de Bragg muy afilado y bien localizado.
- **Carbono-12 ($Z_1=6$, masa $12\text{ u}$):** Tienen una tasa de frenado base mayor (por el factor $Z_1^2=36$). Resultan en una trayectoria más recta (menor dispersión lateral) y un mayor efecto radiobiológico relativo (RBE), ideal para tumores radiorresistentes. Sin embargo, su pico presenta una pequeña "cola de fragmentación" nuclear más allá del rango máximo.

#### 5.5 Straggling (dispersión de rango)
Debido a la naturaleza estadística de las colisiones independientes con los electrones, no todas las partículas iniciales idénticas se detienen exactamente en la misma profundidad. Esta variación estocástica produce un ensanchamiento gaussiano del pico ideal de Bragg conocido como *straggling* o dispersión de rango.

#### 5.6 Fotones (rayos X 6 MV): comparación
Se incluyen perfiles típicos de rayos X de 6 MV. Interaccionan mediante el efecto fotoeléctrico, dispersión Compton y producción de pares, y están gobernados por la ley de atenuación exponencial $I(x) = I_0 e^{-\mu x}$, lo que subraya la superioridad conformacional de los hadrones.

#### 5.7 Conexión con RBS: mismo $a_0$, distinta escala
La física del frenado electrónico (Bethe-Bloch) que define la hadronterapia es exactamente la misma física que frena a los iones alfa cuando entran y salen de la muestra en un experimento de RBS. Mientras que en RBS usamos el modelo de retroceso de Coulomb para obtener información a nivel de superficie (~nanómetros/micrómetros), en hadronterapia usamos el modelo de Bethe-Bloch integral para administrar energía a nivel macroscópico (~centímetros).

#### 5.8 Simplificaciones declaradas
- **CSDA (Continuous Slowing Down Approximation):** Se asume que el proyectil pierde energía continuamente, enmascarando las fluctuaciones de transferencia de energía evento-a-evento para el trazado de la curva teórica central.
- **Tejido homogéneo:** Se asume que el cuerpo del paciente es equivalente al agua líquida pura ($I = 79.7 \text{ eV}$) para los cálculos termodinámicos, omitiendo densidades óseas locales o huecos de aire.

---

### 6. Hilo cuántico — Sección ∞

#### 6.1 Crisis de la física clásica (1900-1911)
A finales del siglo XIX, las leyes de Newton y el electromagnetismo de Maxwell dominaban la física. No obstante, anomalías térmicas y espectrales comenzaron a agrietar este paradigma monolítico, induciendo el cambio de modelo más profundo de la historia científica.

#### 6.2 Planck (1900): cuantización de la energía
Max Planck resolvió la catástrofe ultravioleta del cuerpo negro introduciendo la hipótesis de que la radiación térmica es emitida y absorbida en paquetes discretos o "cuantos", con energía $E = h\nu$.

#### 6.3 Einstein (1905): efecto fotoeléctrico
Einstein amplió la idea de Planck y teorizó que la propia luz no es solo una onda, sino que está compuesta de corpúsculos de energía (fotones), explicando por qué la energía de los electrones extraídos depende de la frecuencia de la luz y no de su intensidad.

#### 6.4 Rutherford (1911): el núcleo
Como se trata en el Panel A, Rutherford probó que el átomo es en su mayor parte espacio vacío con un núcleo denso y puntual. Curiosamente, él utilizó leyes de Newton puramente clásicas para demostrarlo, derivando su sección eficaz sin tener que recurrir a la nueva física cuántica.

#### 6.5 Bohr (1913): órbitas cuantizadas
El modelo planetario de Rutherford presentaba un problema: según Maxwell, un electrón girando debería radiar energía y colapsar en espiral hacia el núcleo. Bohr solucionó esto postulando, a partir de Planck, que el momento angular estaba cuantizado ($L = n\hbar$), imponiendo órbitas estacionarias.

#### 6.6 De Broglie (1924): dualidad onda-partícula
En una propuesta simétrica, Louis de Broglie sugirió que si la luz podía actuar como partícula, la materia (los electrones) podía actuar como onda, con una longitud $\lambda = h / p$.

#### 6.7 Heisenberg y Schrödinger (1925-26)
La maduración formal llegó con la mecánica matricial de Werner Heisenberg (que derivó en su Principio de Incertidumbre $\Delta x \Delta p \ge \hbar/2$) y la ecuación diferencial de onda de Erwin Schrödinger ($\hat{H}\Psi = E\Psi$).

#### 6.8 Gamow (1928): efecto túnel y la conexión con RBS
George Gamow resolvió el enigma del decaimiento alfa. Aplicando la ecuación de Schrödinger, demostró que la partícula alfa del interior del núcleo puede "tunelar" matemáticamente la barrera electrostática de Coulomb (la misma que simulamos repeliendo en la app) y escapar, a pesar de que clásicamente carece de energía para sobrepasarla por arriba.

#### 6.9 Dirac (1928) y Bethe (1930): electrodinámica y frenado
Paul Dirac unió la mecánica cuántica con la relatividad especial, prediciendo la antimateria. Posteriormente, Hans Bethe aplicó las herramientas de la electrodinámica cuántica al problema del frenado de partículas cargadas en la materia, derivando la rigurosa ecuación de Bethe-Bloch moderna discutida en el Panel E.

---

### 7. Tabla maestra de fórmulas verificadas

| Concepto Físico | Ecuación / Expresión Matemática | Valor Característico / Resultado del Proyecto |
| :--- | :--- | :--- |
| Constante de Coulomb | $k e^2 = \frac{1}{4\pi\epsilon_0} e^2$ | $1.44 \text{ MeV}\cdot\text{fm}$ |
| Parámetro $a_0$ | $a_0 = \frac{1}{4\pi\epsilon_0} \frac{Z_1 Z_2 e^2}{2E_0}$ | $a_0(\text{Au}, 7\text{ MeV}) = 16.25 \text{ fm}$ |
| Ángulo de Thomson máx | - | $\theta_{\text{max Thomson}} = 6.4 \times 10^{-3 \circ}$ |
| Factor cinemático K | $K = \left[\frac{\sqrt{M_2^2 - M_1^2 \sin^2\theta} + M_1 \cos\theta}{M_1 + M_2}\right]^2$ | $K(\text{C}, 170^\circ) = 0.2525$<br>$K(\text{Au}, 170^\circ) = 0.9226$ |
| Relación Sección Eficaz | $\frac{d\sigma(\text{Au})}{d\sigma(\text{C})} \propto \left(\frac{Z_{\text{Au}}}{Z_{\text{C}}}\right)^2$ | $(79 / 6)^2 = 173.4$ |
| Constante Bethe-Bloch | $K_{\text{BB}}$ | $0.307075 \text{ MeV}\cdot\text{cm}^2/\text{g}$ |
| Potencial excitación ($I$) | Agua líquida estándar | $79.7 \text{ eV}$ |

---

### 8. Glosario de términos

- **Colimador:** Dispositivo que estrecha y direcciona un haz de partículas u ondas.
- **Sección eficaz diferencial ($d\sigma / d\Omega$):** Probabilidad geométrica por unidad de ángulo sólido de que un proyectil sea dispersado en una dirección determinada.
- **RBS (Rutherford Backscattering Spectrometry):** Técnica analítica nuclear usada para deducir la composición atómica superficial bombardeando muestras con iones.
- **Factor Cinemático ($K$):** Relación de energía retenida por el proyectil tras el impacto. Define el eje de las X en un espectro RBS.
- **Periápside:** El punto de mayor aproximación física en una órbita (en este caso, en la trayectoria hiperbólica).
- **Hadronterapia:** Tratamiento oncológico que emplea partículas pesadas (hadrones) como protones o carbono-12 para destruir de forma muy localizada el ADN del tumor.
- **Pico de Bragg:** El punto de máximo depósito de dosis que experimentan las radiaciones ionizantes hadrónicas justo al final de su rango físico de penetración en la materia.
- **CSDA (Aproximación de Frenado Continuo):** Método para calcular el rango de partículas cargadas mediante la asunción de una pérdida de energía suavizada y continua en lugar de estocástica.
- **Straggling:** Fluctuación estadística y esparcimiento temporal, angular o longitudinal en las trayectorias e interacciones de partículas.

---

### 9. Referencias

1. Tutorial extenso sobre la Espectrometría de Retrodispersión de Rutherford (RBS) y sus aplicaciones de perfilometría. EAG Laboratories. Recuperado de: [https://www.eag.com/app-note/rutherford-backscattering-spectrometry-rbs-tutorial/](https://www.eag.com/app-note/rutherford-backscattering-spectrometry-rbs-tutorial/)
2. Instalaciones e Instrumentación IBA: Técnica RBS. Centro de Microanálisis de Materiales (CMAM), UAM. Recuperado de: [https://www.cmam.uam.es/facilities/iba-techniques/rbs/](https://www.cmam.uam.es/facilities/iba-techniques/rbs/)
3. "Retrodispersión de Rutherford de películas delgadas". LibreTexts Español, Química Analítica. Recuperado de: [https://espanol.libretexts.org/...](https://espanol.libretexts.org/Bookshelves/Quimica/Qu%C3%ADmica_Anal%C3%ADtica/M%C3%A9todos_F%C3%ADsicos_en_Qu%C3%ADmica_y_Nano_Ciencia_(Barron)/01%3A_An%C3%A1lisis_Elemental/1.15%3A_Retrodispersi%C3%B3n_de_Rutherford_de_pel%C3%ADculas_delgadas)
4. Artículo divulgativo: "Un evento tipo Rutherford: Luchando contra la estadística". Day in Lab. Recuperado de: [https://dayinlab.com/2017/10/29/un-evento-tipo-rutherford-luchando-contra-la-estadistica/](https://dayinlab.com/2017/10/29/un-evento-tipo-rutherford-luchando-contra-la-estadistica/)
5. Khan Academy. "¿Qué son las colisiones elásticas e inelásticas?". Recuperado de: [https://es.khanacademy.org/science/physics/linear-momentum/elastic-and-inelastic-collisions/a/what-are-elastic-and-inelastic-collisions](https://es.khanacademy.org/science/physics/linear-momentum/elastic-and-inelastic-collisions/a/what-are-elastic-and-inelastic-collisions)
6. "Estudio analítico estructural de películas mediante técnica RBS". Revista Tecnia. Recuperado de: [https://revistas.uni.edu.pe/index.php/tecnia/article/view/53/43](https://revistas.uni.edu.pe/index.php/tecnia/article/view/53/43)
7. Chu, W. K., Mayer, J. W., & Nicolet, M. A. (1978). *Backscattering Spectrometry*. Academic Press.
8. Goldstein, H., Poole, C. P., & Safko, J. L. (2001). *Classical Mechanics* (3rd ed.). Addison-Wesley.
9. Krane, K. S. (2012). *Modern Physics* (3rd ed.). John Wiley & Sons.
