# Estudio Físico — Experimento de Rutherford, RBS y Hadronterapia
## Proyecto: Evaluación 2, Módulo 2 — Diplomado de Física Moderna

### Índice
0. Contexto histórico y motivación
0.5. Rutherford y la mecánica cuántica: el puente necesario
1. Panel A — Dispersión de Rutherford
2. Panel B — Factor cinemático K
3. Panel C — Espectro RBS
4. Panel D — RBS en acción (simulación dinámica)
5. Panel E — Hadronterapia y Curva de Bragg
6. Hilo cuántico — Sección ∞
7. Tabla maestra de fórmulas verificadas
8. Glosario de términos
9. Referencias
10. Física avanzada — Fondo teórico complementario

---

### 0. Contexto histórico y motivación

El desarrollo de la física moderna a principios del siglo XX estuvo marcado por la necesidad de comprender la estructura íntima de la materia. El experimento de la lámina de oro, concebido por Ernest Rutherford y ejecutado por Hans Geiger y Ernest Marsden (1909-1911), supuso un punto de inflexión. Al bombardear átomos de oro con partículas alfa, observaron retrodispersiones (backscattering) que contradecían las predicciones de la época. Este proyecto interactivo no solo simula dicho hito histórico, sino que lo conecta con dos aplicaciones modernas de gran relevancia: la Espectrometría de Retrodispersión de Rutherford (RBS), técnica fundamental en el análisis de materiales y películas delgadas, y la hadronterapia, que aprovecha los principios de interacción radiación-materia (Curva de Bragg) para el tratamiento oncológico avanzado. El presente documento académico detalla la base física, matemática y algorítmica de cada uno de los paneles del proyecto.

---

### 0.5 Rutherford y la mecánica cuántica: el puente necesario

Este proyecto forma parte del módulo de *Teoría Cuántica Temprana*. Sin embargo, el experimento de Rutherford —tomado en sus propios términos— es **física clásica pura**. Entender esta tensión es fundamental para comprender el rol histórico y conceptual del experimento.

#### 0.5.1 Rutherford no usa mecánica cuántica: lo que hace el experimento

El experimento de Geiger-Marsden (1909–1911) y su interpretación por Rutherford (1911) se resuelven completamente con dos ingredientes clásicos:

1. **Fuerza de Coulomb:** $F = kZ_1Z_2e^2/r^2$ — mecánica newtoniana pura.
2. **Conservación de energía y momento lineal** — leyes clásicas del siglo XVII–XVIII.

No aparece ningún $\hbar$, ninguna función de onda $\Psi$, ningún postulado de cuantización. La trayectoria hiperbólica, el parámetro $a_0$, la fórmula $\theta(b)$ y la sección eficaz diferencial son todos resultados de la mecánica de Newton aplicada a un potencial $1/r$. En ese sentido, **Rutherford es el último gran triunfo de la física clásica aplicada a escala nuclear**, no el primero de la física cuántica.

#### 0.5.2 La crisis que Rutherford crea: el átomo que colapsa

Al descubrir el núcleo, Rutherford resuelve un problema (por qué las partículas rebotan) pero crea uno más grave: si la carga positiva está concentrada en un núcleo central, el electrón debe orbitar alrededor de él. Pero según las ecuaciones de Maxwell, **toda carga eléctrica acelerada irradia energía electromagnética**. Un electrón en órbita circular está continuamente acelerado (aceleración centrípeta), por lo tanto:

$$P_\text{radiada} = \frac{e^2 a^2}{6\pi\varepsilon_0 c^3} \neq 0$$

El tiempo estimado de colapso espiral del electrón hacia el núcleo es $\tau \sim 10^{-11}\,\text{s}$. En $\sim 10$ picosegundos, **la materia no debería existir** según la física clásica post-Rutherford.

Este es el problema que la mecánica cuántica nace para resolver. Sin el núcleo de Rutherford, no hay crisis. Sin la crisis, no hay urgencia para inventar la cuantización.

#### 0.5.3 Por qué Rutherford está en el módulo de mecánica cuántica temprana

Rutherford cumple un **rol narrativo e histórico preciso** en la historia de la física cuántica, que se puede trazar como una cadena lógica causal:

```
Modelo de Thomson (1904)
    → carga difusa → campo débil → θ_max ≈ 0.006° (clásico)
        ↓
Experimento de Geiger-Marsden (1909-1911)
    → retrodispersión a 150° → imposible con Thomson
        ↓
Núcleo de Rutherford (1911)
    → campo coulombiano concentrado → θ grande (¡clásico!)
        ↓
CRISIS: Maxwell predice colapso en 10⁻¹¹ s
        ↓
Postulados de Bohr (1913): L = nℏ  ← PRIMER ACTO CUÁNTICO
    → órbitas estacionarias → espectros atómicos explicados
        ↓
De Broglie (1924) → Heisenberg / Schrödinger (1925-26)
    → mecánica cuántica completa
```

**Rutherford es la premisa que hace necesaria la mecánica cuántica, no un ejemplo de ella.** Su experimento está en este módulo porque sin él, Bohr no tiene problema que resolver.

#### 0.5.4 La coincidencia de Gordon: el puente matemático

En 1928, Walter Gordon resolvió formalmente la ecuación de Schrödinger para el potencial coulombiano $V(r) = kZ_1Z_2e^2/r$ y obtuvo un resultado sorprendente: la sección eficaz diferencial cuántica exacta es **idéntica** a la fórmula clásica de Rutherford:

$$\left(\frac{d\sigma}{d\Omega}\right)_\text{cuántica} = \left(\frac{d\sigma}{d\Omega}\right)_\text{clásica} = \left(\frac{Z_1 Z_2 ke^2}{4E_0}\right)^2 \frac{1}{\sin^4(\theta/2)}$$

Esta coincidencia **no es accidental**: es una propiedad matemática exclusiva del potencial $1/r$ (potencial coulombiano). Para cualquier otro potencial —como el de la fuerza nuclear fuerte— la mecánica cuántica y la clásica darían resultados distintos. El corolario práctico es poderoso:

> *La técnica RBS, desarrollada en pleno siglo XX en un mundo donde la mecánica cuántica ya era conocida, puede calcularse y verificarse correctamente usando solo mecánica clásica. El resultado es cuánticamente exacto.*

Esto hace de Rutherford un caso pedagógico excepcional: ilustra que la validez de un modelo no depende de su época, sino de su régimen de aplicabilidad.

#### 0.5.5 Síntesis: tres roles de Rutherford en este proyecto

| Rol | Descripción | Marco físico |
|---|---|---|
| **Histórico** | Descubre el núcleo atómico; crea la crisis que origina la QM | Clásico |
| **Técnico (RBS)** | Base de la técnica analítica más precisa de películas delgadas | Clásico (con exactitud cuántica por §10.2) |
| **Conceptual** | Puente entre la física newtoniana y la mecánica cuántica temprana | Clásico → Cuántico |

El experimento de Rutherford es, en palabras del físico Freeman Dyson, *"el último gran experimento clásico y el primero en revelar que el mundo necesita una física nueva"*.

---

### 1. Panel A — Dispersión de Rutherford

#### 1.1 El experimento de Geiger-Marsden (1909-1911)
El experimento original consistió en dirigir un haz colimado de partículas alfa ($Z_1=2$, núcleos de helio emitidos por decaimiento radiactivo) hacia una finísima lámina de oro ($Z_2=79$). Se esperaba que las partículas atravesaran la lámina con desviaciones minúsculas. Sin embargo, una pequeña pero significativa fracción rebotaba en ángulos mayores a 90°, un resultado que Rutherford comparó con disparar un proyectil naval contra un pañuelo de papel y que este rebotara.

#### 1.2 Modelo de Thomson vs. modelo nuclear
El modelo de J.J. Thomson (1904) postulaba una esfera de carga positiva $+Z_2 e$ distribuida homogéneamente en el volumen atómico ($R \approx 1.45\,\text{Å} = 145{,}000\,\text{fm}$). Por la Ley de Gauss, el campo eléctrico interior crece linealmente:
$$\vec{E}(r) = \frac{k Z_2 e}{R^3}\,\vec{r} \quad (r < R)$$
Una partícula alfa con parámetro de impacto $b$ siente fuerza transversal $F_\perp = kZ_1Z_2e^2 b/R^3$ durante $\Delta t = 2\sqrt{R^2-b^2}/v_0$. El impulso resulta en:
$$\theta(b) = \frac{k Z_1 Z_2 e^2}{E_0 R^3}\,b\sqrt{R^2-b^2}$$
cuyo máximo en $b = R/\sqrt{2}$ vale:
$$\theta_{\text{max,Thomson}} = \frac{a_0}{R} = \frac{16.25\,\text{fm}}{145{,}000\,\text{fm}} \approx 0.0064°$$
**Thomson no puede producir rebotes hacia atrás.** Solo un núcleo puntual explica los ángulos de hasta 150° de Geiger-Marsden.

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
En coordenadas cartesianas reducidas (normalizadas por $a_0$), las ecuaciones de movimiento en el campo de Coulomb son:
$$\ddot{x} = \frac{x}{(x^2+y^2)^{3/2}}, \quad \ddot{y} = \frac{y}{(x^2+y^2)^{3/2}}$$
Para el modelo de Thomson (esfera uniforme, $r < R_\text{átomo}$), la fuerza cambia a $F \propto r$.

El motor físico implementa el método de **Runge-Kutta de cuarto orden (RK4)** para integrar estas ecuaciones en cada paso de tiempo $dt$:
$$\mathbf{y}_{n+1} = \mathbf{y}_n + \frac{dt}{6}(k_1 + 2k_2 + 2k_3 + k_4)$$
con $k_i$ evaluados en los subestados intermedios estándar del RK4. El error local es $O(dt^5)$, suficiente para conservar la energía con paso $dt = 0.05\,a_0/v_0$. La trayectoria se calcula una sola vez al cambiar parámetros y luego se recorre en la animación.

#### 1.7 Modelo de Thomson: esfera de carga uniforme
Cuando se activa el "toggle" del modelo de Thomson en el panel, el simulador cambia la ley de fuerza. Para $r < R_{\text{átomo}}$, la fuerza deja de ser inversamente proporcional a $r^2$ y se vuelve directamente proporcional a $r$ (comportamiento de oscilador armónico espacial), resultando en las trayectorias casi rectas que se observan en la app.

#### 1.8 ¿Por qué $Z_2$ (protones) y no N (neutrones)?
En la simulación del Panel A, la variable de entrada del usuario es el número atómico $Z_2$. La interacción dominante es puramente electromagnética; la fuerza nuclear fuerte actúa a rangos tan cortos ($\approx 1\text{-}2 \text{ fm}$) que no es relevante mientras el proyectil no venza la barrera de Coulomb. Por ello, los neutrones $N$ del blanco no juegan ningún papel en la trayectoria hiperbólica; solo aportan inercia al retroceso (Panel B).

#### 1.9 Simplificaciones declaradas
- **Física clásica:** La sección eficaz clásica y cuántica para el potencial de Coulomb coinciden exactamente (Gordon, 1928) — ver §10.2.
- **Masa infinita:** El núcleo blanco se asume estacionario. El retroceso se trata en el Panel B.
- **Apantallamiento ignorado:** La corrección de Andersen/L'Ecuyer es $<2\%$ a $E_0=2\,\text{MeV}$ sobre Au — despreciable pedagógicamente.
- **Sin barrera de Coulomb:** A $E_0 = 2\,\text{MeV}$, la barrera es $E_C \approx 20\,\text{MeV}$ para Au; la colisión es 100% electromagnética. Ver §10.1.

---

### 2. Panel B — Factor cinemático K

#### 2.1 Colisión elástica: conservación de $E$ y $p$
En un experimento de RBS, el núcleo blanco experimenta un retroceso macroscópico. Para modelarlo, tratamos el evento como una colisión elástica clásica en dos dimensiones. Se aplican los principios de conservación de la energía cinética y del momento lineal (cantidad de movimiento).

#### 2.2 Fórmula de $K(M_2, \theta)$
El factor cinemático $K$ es la fracción de la energía inicial $E_0$ que retiene el proyectil ($E_1$) tras rebotar en un ángulo $\theta$ contra un blanco de masa $M_2$. Despejando las ecuaciones de conservación, obtenemos:
$$ K = \frac{E_1}{E_0} = \left[ \frac{\sqrt{M_2^2 - M_1^2 \sin^2\theta} + M_1 \cos\theta}{M_1 + M_2} \right]^2 $$
Esta ecuación es la piedra angular del análisis RBS, pues demuestra que la energía detectada $E_1$ es una firma única de la masa $M_2$ del átomo blanco.

#### 2.3 Límites físicos
- **$M_2 \gg M_1$:** Apenas hay retroceso; $K \to 1$. Ejemplo: Au, $K=0.9226$.
- **$M_2 = M_1$:** $K = \cos^2\theta$. En choque frontal ($180°$): $K=0$, toda la energía se transfiere.
- **$M_2 < M_1$ (límite cinemático):** El término $M_2^2 - M_1^2\sin^2\theta < 0$ para $\theta > \arcsin(M_2/M_1)$. Una alfa no puede rebotar hacia atrás contra un núcleo más ligero (e.g., H con $M_2=1\,\text{u}$). RBS no detecta Hidrógeno directamente; se requiere **ERDA** (*Elastic Recoil Detection Analysis*, ver §10.3).

#### 2.4 ¿Por qué $\theta = 170°$?
A $180°$ la sensibilidad de masa $dK/dM_2$ es máxima pero bloquearía el haz. La **geometría IBM a $170°$** conserva $\sim 99.8\%$ de la resolución teórica y es el estándar internacional (CMAM-UAM, EAG).

#### 2.5 Valores verificados
En el contexto del proyecto, considerando $M_1=4\text{ u}$ (alfa), un ángulo de retrodispersión de $\theta = 170^\circ$, y las masas del carbono ($12\text{ u}$) y el oro ($197\text{ u}$):
- Para el Carbono: $K(C, 170^\circ) = 0.2525$
- Para el Oro: $K(Au, 170^\circ) = 0.9226$
Esto significa que una partícula alfa retrodispersada por oro conserva el 92.2% de su energía, mientras que una rebotada por carbono retiene apenas el 25.2%.

#### 2.6 Simplificaciones declaradas
- **Ausencia de efectos relativistas:** A las energías estándar del RBS ($2 \text{ MeV}$), las correcciones relativistas para partículas alfa son de un orden de magnitud muy por debajo de la resolución experimental.
- **Energía de enlace atómico:** Se considera la colisión entre núcleos libres, despreciando la energía de enlace molecular o de la red cristalina (del orden de los eV frente a los MeV del proyectil).

---

### 3. Panel C — Espectro RBS

#### 3.1 ¿Qué mide el espectro RBS?
El espectro es un histograma de frecuencias: en el eje X se representa la energía de las partículas retrodispersadas detectadas ($E_1$), y en el eje Y el número de cuentas (rendimiento o *Yield*). 

#### 3.2 Posición de los peaks: energía $E_1 = K\cdot E_0$
Cada elemento químico presente en la muestra superficial genera una señal (peak) a una energía específica, determinada unívocamente por su factor cinemático $K$. Elementos pesados (Au) aparecen a la derecha del espectro (alta energía), y los ligeros (C, O) a la izquierda (baja energía).

#### 3.3 Altura de los peaks: sección eficaz diferencial $\sigma$
La altura o área bajo el peak indica la cantidad de ese elemento. La probabilidad espacial de que ocurra la retrodispersión se define como la sección eficaz diferencial, la cual, según la ley de Rutherford, es proporcional al cuadrado del número atómico del blanco ($Z_2$):
$$ \frac{d\sigma}{d\Omega} = \left( \frac{Z_1 Z_2 e^2}{16 \pi \epsilon_0 E_0} \right)^2 \frac{1}{\sin^4(\theta/2)} \propto Z_2^2 $$
**Valor verificado:** La relación de intensidades entre el oro y el carbono a igual concentración estequiométrica es:
$$ \frac{(d\sigma/d\Omega)_{\text{Au}}}{(d\sigma/d\Omega)_{\text{C}}} = \left(\frac{79}{6}\right)^2 = \frac{6241}{36} = 173.36 \approx 173.4 $$
Esta tremenda diferencia en la sección eficaz hace que el RBS sea extremadamente sensible a trazas de elementos pesados sobre sustratos ligeros, pero poco sensible a elementos ligeros sobre sustratos pesados.

#### 3.4 Anchura de los peaks: resolución energética del detector
Los peaks simulados no son líneas de Dirac infinitamente estrechas. Se ensanchan según una distribución Gaussiana impulsada por la resolución instrumental intrínseca del detector de barrera de superficie de silicio (normalmente unos $15\text{-}20\text{ keV}$).

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
En un experimento de RBS real, la tasa de partículas del haz es:
$$\dot{N}_\text{haz} = \frac{I}{Z_1 e}$$
Para alfa ($Z_1=2$) con $I=20\text{ nA}$: $\dot{N} \approx 6.25\times10^{10}$ partículas/s.

La simulación reproduce este efecto con la relación:
$$\Delta t_\text{spawn} = \frac{9200}{I[\text{nA}]} \text{ ms}$$
A mayor corriente, menor intervalo entre eventos computacionales y mayor velocidad de acumulación del espectro. El factor 9200 está calibrado para que la dinámica visual sea comparable a la de un experimento real de caracterización rápida. Rango del slider: $I = 5$–$100\text{ nA}$.

#### 4.3 Selección estocástica de la capa (pickup layer)
Para que el proceso sea realista, la probabilidad de que una partícula simulada se disperse en la capa $i$ está ponderada matemáticamente por la sección eficaz de dicho elemento:
$$ P(\text{capa } i) = \frac{Z_{2,i}^2}{\sum Z_{2,j}^2} $$
Por consiguiente, el algoritmo estocástico selecciona la interacción con el Oro con mucha más frecuencia que con el Oxígeno, haciendo crecer su peak gaussiano más rápidamente ante los ojos del usuario.

#### 4.4 Pérdida de energía en profundidad: el Factor de Parada $[S]$
Un proyectil que interacciona a profundidad $x$ pierde energía en tres etapas:
1. **Entrada:** llega con energía reducida $E(x) = E_0 - x(dE/dx)_{\text{in}}$
2. **Colisión elástica:** rebota con $E' = K \cdot E(x)$
3. **Salida:** emerge con $E_1(x) = E' - \frac{x}{\cos\theta}(dE/dx)_{\text{out}}$

La diferencia de energía respecto a un choque en superficie es lineal en $x$:
$$\Delta E = [S] \cdot x, \quad [S] = \left[\frac{K}{\cos\theta_{\text{in}}}\left(\frac{dE}{dx}\right)_{\text{in}} + \frac{1}{\cos\theta_{\text{out}}}\left(\frac{dE}{dx}\right)_{\text{out}}\right]$$
El Factor de Parada $[S]$ (en eV/Å) convierte el desplazamiento espectral en espesor de película. Una capa de Au de 50 nm produce un peak con ancho $\Delta E = [S] \cdot 50\,\text{nm}$ medible en el detector. Esta relación es la base del análisis de profundidad no destructivo del RBS.

#### 4.5 Aplicaciones reales del RBS
Como se evidencia en la acumulación de datos en este panel, el RBS se ha convertido en una técnica invaluable en la industria de los semiconductores y nanomateriales. Permite realizar perfiles de profundidad sin destruir la muestra (no-destructivo), identificar contaminantes metálicos, analizar la estequiometría de películas delgadas (como óxidos en puertas de transistores), y estudiar la difusión térmica entre multicapas.

#### 4.6 Simplificaciones declaradas
- **Frenado electrónico constante:** No se resuelve formalmente la dependencia energética del frenado electrónico $\frac{dE}{dx}(E)$ para calcular la geometría de los perfiles de profundidad con rigor absoluto; se utiliza una abstracción geométrica y de probabilidad para fines didácticos.

---

### 5. Panel E — Hadronterapia y Curva de Bragg

#### 5.1 Problema clínico: dosis en profundidad
La radioterapia convencional con fotones (rayos X) deposita su máxima energía cerca de la superficie de la piel y sigue dañando el tejido sano mientras decae exponencialmente hacia la zona profunda donde se aloja el tumor. La hadronterapia aborda esta limitación clínica aprovechando la física de partículas pesadas cargadas.

#### 5.2 Fórmula de Bethe-Bloch relativista
A diferencia de la dispersión nuclear elástica del RBS, el viaje de un protón por el tejido está dominado por millones de interacciones inelásticas con los electrones del medio. La pérdida de energía por unidad de longitud (poder de frenado electrónico) se describe con la ecuación de Bethe-Bloch (PDG 2022):
$$-\frac{dE}{dx} = K_\text{BB}\,\rho\,\frac{Z_1^2}{\beta^2}\left[\ln\!\left(\frac{2m_e c^2\beta^2\gamma^2}{I}\right) - \beta^2\right]$$
donde $\beta=v/c$, $\gamma=(1-\beta^2)^{-1/2}$, y para agua (tejido blando):
- $K_\text{BB} = 0.307075\text{ MeV}\cdot\text{cm}^2/\text{g}$ (constante universal)
- $Z/A = 0.5551$ (agua), $\rho = 1.0\text{ g/cm}^3$
- $I_{\text{H}_2\text{O}} = 79.7\text{ eV}$ (ICRU 37)

**Factor de corrección $C_\text{corr} = 0.56$:** La fórmula de Bethe-Bloch simple (sin correcciones de densidad ni de capa) sobreestima el poder de frenado real en $\sim 1.8\times$ respecto a los datos NIST PSTAR. La simulación aplica:
$$\left(-\frac{dE}{dx}\right)_\text{sim} = 0.56 \times \left(-\frac{dE}{dx}\right)_\text{B-B simple}$$
Este factor reproduce rangos NIST PSTAR con error $<5\%$ en $70$–$430\text{ MeV}$. Se declara explícitamente como simplificación.

#### 5.3 La Curva de Bragg: física del peak
La dependencia de $dE/dx \propto 1/v^2$ revela un fenómeno crítico: a medida que el ión penetra, se frena ($v$ disminuye), lo que a su vez *aumenta* drásticamente el frenado. Esto desencadena un depósito masivo de energía justo en los últimos milímetros de la trayectoria, creando el pronunciado **Pico de Bragg**. Al final del rango físico, la dosis cae abruptamente a cero, protegiendo totalmente el tejido sano situado detrás del tumor.

#### 5.4 Protones vs. iones carbono-12
El panel compara dos modalidades clínicas con rangos de energía y profundidad bien definidos:

| Partícula | $Z_1$ | Masa | Energía (slider) | Rango en agua | Uso clínico principal |
|---|---|---|---|---|---|
| Protón | 1 | 1 u | 70–230 MeV | ~4–32 cm | Tumores pediátricos, oculares, cabeza/cuello |
| $^{12}$C$^{6+}$ | 6 | 12 u | 100–430 MeV/u | ~3–26 cm | Tumores radioresistentes, cordomas |

Valores de referencia (NIST PSTAR / ICRU 73):
- Protón **150 MeV** → rango $\approx 15.8\text{ cm}$ (tumores a profundidad media)
- Protón **230 MeV** → rango $\approx 32\text{ cm}$ (máximo clínico, tumores abdominales)
- $^{12}$C **290 MeV/u** (energía típica de HIMAC, Chiba) → rango $\approx 14.7\text{ cm}$

Los iones de carbono presentan: (i) frenado $Z_1^2 = 36\times$ mayor al inicio, (ii) dispersión lateral $\sim 3\times$ menor que protones (trayectorias más rígidas), y (iii) RBE $\approx 2$–$3$ frente a $\approx 1.1$ de los protones. La "cola de fragmentación" más allá del pico de Bragg es una limitación dosimétrica que requiere planificación específica.

#### 5.5 Straggling (dispersión de rango)
Debido a la naturaleza estadística de las colisiones independientes con los electrones, no todas las partículas iniciales idénticas se detienen exactamente en la misma profundidad. Esta variación estocástica produce un ensanchamiento gaussiano del peak ideal de Bragg conocido como *straggling* o dispersión de rango.

#### 5.6 Fotones (rayos X 6 MV): comparación
Los rayos X de 6 MV interactúan mediante efecto fotoeléctrico, dispersión Compton y producción de pares, siguiendo $I(x) = I_0 e^{-\mu x}$: el máximo de dosis aparece en los primeros $\sim 1.5\,\text{cm}$, dañando tejido sano antes y después del tumor. El contraste con el peak de Bragg es la motivación clínica central de la hadronterapia.

#### 5.6b SOBP: peak de Bragg extendido para uso clínico
Un peak de Bragg monoenergético tiene un ancho de solo $\sim 2$–5 mm, insuficiente para tumores reales de 2–5 cm. En la clínica se superponen múltiples peaks a distintas profundidades ponderados en intensidad, generando una meseta de dosis uniforme: el **SOBP** (*Spread-Out Bragg Peak*). La modulación de energía se logra con ruedas de rango giratorias o variando la energía del acelerador en tiempo real.

#### 5.7 Conexión con RBS: mismo $a_0$, distinta escala
La física del frenado electrónico (Bethe-Bloch) que define la hadronterapia es exactamente la misma física que frena a los iones alfa cuando entran y salen de la muestra en un experimento de RBS. Mientras que en RBS usamos el modelo de retroceso de Coulomb para obtener información a nivel de superficie (~nanómetros/micrómetros), en hadronterapia usamos el modelo de Bethe-Bloch integral para administrar energía a nivel macroscópico (~centímetros).

#### 5.8 Hilo conductor: Rutherford → de Hevesy → PET/SPECT
El experimento de Rutherford fue catalizador directo de la medicina nuclear diagnóstica. **Georg de Hevesy** (1912), postdoc en el laboratorio de Rutherford en Manchester, intentó separar Radio-D (isótopo de Pb) del plomo ordinario. Al comprobar que era químicamente imposible, formuló el **principio de los radiotrazadores**: los isótopos son bioquímicamente indistinguibles (Premio Nobel de Química, 1943).

Dos tecnologías actuales emergen de este principio:
- **PET** (*Positron Emission Tomography*): La ecuación de Dirac (1928) predijo el positrón. Radiofarmacos como $^{18}$F-FDG emiten $\beta^+$ que se aniquilan con electrones del tejido produciendo dos fotones gamma colineales de 511 keV, detectados por coincidencia para mapear el metabolismo tumoral.
- **SPECT**: Emplea núcleos metaestables ($^{99m}$Tc, $t_{1/2} = 6$ h) que emiten un fotón gamma puro de 140.5 keV, ideal para imagen de perfusión cardíaca y ósea.

#### 5.9 Simplificaciones declaradas
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
Rutherford probó que el átomo es en su mayor parte espacio vacío con un núcleo denso y puntual, usando exclusivamente mecánica clásica (Newton + Coulomb), sin recurrir a ningún principio cuántico. Como se desarrolla en §0.5, el experimento en sí no es cuántico — pero la existencia del núcleo crea la crisis que obliga a Bohr a cuantizar las órbitas atómicas en 1913.

#### 6.5 Bohr (1913): órbitas cuantizadas — el primer acto cuántico
El modelo nuclear de Rutherford generó una crisis inmediata: según Maxwell, un electrón en órbita emite radiación continuamente y colapsa en $\tau \sim 10^{-11}\,\text{s}$ (ver §0.5.2). Bohr resolvió esto con un postulado cuántico explícito — el primero en la historia aplicado a un átomo:
$$L = n\hbar, \quad n = 1, 2, 3, \ldots$$
Este postulado no se puede derivar de la física clásica; es una ruptura deliberada con ella. Impone órbitas estacionarias que no irradian, explica los espectros de líneas del hidrógeno y establece el programa de la física cuántica temprana.

#### 6.6 De Broglie (1924): dualidad onda-partícula
En una propuesta simétrica, Louis de Broglie sugirió que si la luz podía actuar como partícula, la materia (los electrones) podía actuar como onda, con una longitud $\lambda = h / p$.

#### 6.7 Heisenberg y Schrödinger (1925-26)
La maduración formal llegó con la mecánica matricial de Werner Heisenberg (que derivó en su Principio de Incertidumbre $\Delta x \Delta p \ge \hbar/2$) y la ecuación diferencial de onda de Erwin Schrödinger ($\hat{H}\Psi = E\Psi$).

#### 6.8 Gamow (1928): efecto túnel y la conexión con RBS
George Gamow resolvió el enigma del decaimiento alfa. Aplicando la ecuación de Schrödinger, demostró que la partícula alfa del interior del núcleo puede "tunelar" matemáticamente la barrera electrostática de Coulomb (la misma que simulamos repeliendo en la app) y escapar, a pesar de que clásicamente carece de energía para sobrepasarla por arriba.

#### 6.9 Dirac (1928) y Bethe (1930): electrodinámica y frenado
Paul Dirac unió la mecánica cuántica con la relatividad especial, prediciendo la antimateria. Posteriormente, Hans Bethe aplicó las herramientas de la electrodinámica cuántica al problema del frenado de partículas cargadas en la materia, derivando la rigurosa ecuación de Bethe-Bloch moderna discutida en el Panel E.

---

### 10. Física avanzada — Fondo teórico complementario

#### 10.1 Barrera de Coulomb
Los núcleos reales tienen radio $R_\text{núcleo} \approx r_0 A^{1/3}$ ($r_0 = 1.25\,\text{fm}$). Para dispersión puramente electromagnética se requiere $a_0 > R_1 + R_2$. La energía máxima permitida es la **barrera de Coulomb**:
$$E_C = \frac{Z_1 Z_2 k e^2}{R_1 + R_2}$$
Para $\alpha$ sobre C: $E_C \approx 4.5\,\text{MeV}$; sobre Au: $E_C \approx 20\,\text{MeV}$. A $E_0 = 2.0\,\text{MeV}$, todas las colisiones con $Z \ge 6$ son 100% coulombianas.

#### 10.2 La coincidencia cuántica de Gordon (1928)
Walter Gordon resolvió la ecuación de Schrödinger para $V(r) = kZ_1Z_2e^2/r$ y obtuvo:
$$\left(\frac{d\sigma}{d\Omega}\right)_\text{cuántica} = \left(\frac{Z_1Z_2ke^2}{4E}\right)^2\frac{1}{\sin^4(\theta/2)} = \left(\frac{d\sigma}{d\Omega}\right)_\text{Rutherford clásica}$$
Esta coincidencia exacta es exclusiva del potencial $1/r$ y justifica que el análisis RBS sea riguroso usando física puramente clásica.

#### 10.3 Familia de técnicas IBA

| Técnica | Proyectil | Qué detecta | Ventaja |
|---|---|---|---|
| **RBS** | $^4$He (2 MeV) | Iones $\alpha$ retrodispersados | Cuantificación absoluta sin patrones |
| **ERDA** | $^{35}$Cl o $^4$He rasante | Núcleos expulsados hacia adelante | Detecta H y elementos con $M < M_\text{proyectil}$ |
| **PIXE** | Protones (2–3 MeV) | Rayos X característicos | Separa elementos de masa similar |
| **NRA** | Deuterones | Productos de reacciones resonantes | Sensibilidad isotópica selectiva |

#### 10.4 Instrumentación: Tandem y detectores PIPS
**Acelerador Tandem:** Iones $\text{He}^-$ acelerados a $+V_\text{term}$, convertidos en $\text{He}^{2+}$ por celda *stripper*, repelidos a tierra. Energía: $E_0 = (1+q)V_\text{term}$, estabilidad $\pm 0.05\%$.

**Detectores PIPS:** Cada partícula crea pares e-h ($w = 3.62\,\text{eV}$/par). Para $E_1 = 1.845\,\text{MeV}$ (Au): $N \approx 509{,}668$ electrones. Un preamplificador sensible a carga genera un pulso proporcional a $E_1$, clasificado por ADC en el histograma.

#### 10.5 Estadística de Poisson en la acumulación espectral
La detección es un proceso de Poisson. Incertidumbre relativa por canal:
$$\frac{\sigma_N}{N} = \frac{1}{\sqrt{N}}$$
A baja corriente ($5\,\text{nA}$): espectro con fluctuaciones visibles. A alta corriente ($100\,\text{nA}$): estadística converge. El Panel D ilustra esta evolución en tiempo real.

---

### 7. Tabla maestra de fórmulas verificadas

| Panel | Concepto físico | Fórmula | Valor verificado en el proyecto |
| :---: | :--- | :--- | :--- |
| A | Constante $ke^2$ | $ke^2 = e^2/4\pi\epsilon_0$ | $1.44\text{ MeV}\cdot\text{fm}$ (NIST CODATA) |
| A | Parámetro de Rutherford | $a_0 = Z_1 Z_2 ke^2 / 2E_0$ | $a_0(\text{Au},7\text{ MeV}) = 16.25\text{ fm}$ |
| A | Ángulo de dispersión | $\theta = 2\arctan(a_0/b)$ | $b=5\text{ fm} \Rightarrow \theta=143°$ (Au, 7 MeV) |
| A | Deflexión max. Thomson | $\theta_\text{Th,max} \approx a_0 / R_\text{átomo}$ | $6.4\times10^{-3°}$ (sub-píxel) |
| B | Factor cinemático | $K=\!\left[\frac{\sqrt{M_2^2-M_1^2\sin^2\theta}+M_1\cos\theta}{M_1+M_2}\right]^2$ | $K(\text{C},170°)=0.2525$; $K(\text{Au},170°)=0.9226$ |
| B | Energía retrodispersada | $E_1 = K\cdot E_0$ | $E_1(\text{C})=0.505\text{ MeV}$; $E_1(\text{Au})=1.845\text{ MeV}$ |
| C | Sección eficaz Rutherford | $d\sigma/d\Omega = (Z_1Z_2ke^2/4E_0)^2\sin^{-4}(\theta/2)$ | $\sigma(\text{Au})/\sigma(\text{C})=(79/6)^2=173.4$ |
| C | Espectro (gaussianas) | $Y(E)=\sum_i A_i\exp[-(E-K_iE_0)^2/2\sigma_\det^2]$ | $\sigma_\det=0.028\text{ MeV}$ |
| D | Probabilidad de capa | $P_i = Z_{2,i}^2 / \sum_j Z_{2,j}^2$ | Au domina: $\sim79\%$ vs C: $\sim0.5\%$ |
| D | Intervalo de spawn | $\Delta t = 9200/I[\text{nA}]$ ms | $20\text{ nA}\Rightarrow 460\text{ ms/partícula}$ |
| E | Bethe-Bloch (con corrección) | $-dE/dx = 0.56\cdot K_\text{BB}\rho Z_1^2\beta^{-2}[\cdots]$ | $K_\text{BB}=0.307075$; $I_\text{agua}=79.7\text{ eV}$ |
| E | Rango protón 150 MeV | $R=\int_0^{E_0}(dE/dx)^{-1}dE$ | $\approx15.8\text{ cm}$ en agua (NIST PSTAR) |
| E | Rango C-12, 290 MeV/u | Ídem, $Z_1=6$, $M=12\text{ u}$ | $\approx14.7\text{ cm}$ (HIMAC / ICRU 73) |

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
10. Feldman, L. C., & Mayer, J. W. (1986). *Fundamentals of Surface and Thin Film Analysis*. North-Holland.
11. Gordon, W. (1928). Über den Stoß zweier Punktladungen nach der Wellenmechanik. *Z. Physik*, 48(3), 180–191.
12. Mott, N. F. (1930). The Scattering of Fast Electrons by Atomic Nuclei. *Proc. Roy. Soc. A*, 126, 259–267.
13. Wilson, R. R. (1946). Radiological Use of Fast Protons. *Radiology*, 47(5), 487–491.
14. ICRU Report 37 (1984). *Stopping Powers for Electrons and Positrons*. ICRU, Bethesda.
