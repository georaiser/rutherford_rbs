# Estudio Físico — Experimento de Rutherford, RBS y Hadronterapia
## Proyecto: Evaluación 2, Módulo 2: Teoría Cuántica Temprana — Diplomado de Física Moderna

### Índice
0. Contexto histórico y motivación epistemológica (Panel 0)
0.5. Rutherford y la mecánica cuántica: el puente necesario
1. Panel A — Dispersión de Rutherford y Modelo Clásico
2. Panel B — Factor Cinemático $K$ y Choque Elástico
3. Panel C — Espectro RBS y Cuantificación de Superficie
4. Panel D — RBS en acción (adquisición estocástica y perfilado $[S]$)
5. Panel E — Hadronterapia, Curva de Bragg y Medicina Nuclear
6. Hilo cuántico — De Planck a la Mecánica Cuántica (Sección ∞)
7. Tabla maestra de fórmulas y valores verificados
8. Glosario de términos
9. Referencias
10. Física avanzada — Fondo teórico complementario
    (10.6 Extensiones cuánticas de las técnicas IBA)

---

### 0. Contexto histórico y motivación epistemológica (Panel 0)

A inicios del siglo XX, la física clásica se enfrentaba a dos revoluciones paralelas e íntimamente conectadas:
1. **La cuantización de la radiación (1900–1905):** Max Planck postuló los cuantos discretos de energía ($E = nh\nu$) para resolver la **catástrofe ultravioleta** de la radiación de cuerpo negro (donde la física clásica de Rayleigh-Jeans predecía energía infinita a altas frecuencias), extendida por Albert Einstein al efecto fotoeléctrico (1905).
2. **La estructura íntima de la materia (1909–1911):** El modelo atómico de Thomson (1904, "pudín de pasas") concebía la carga positiva repartida de forma continua en una esfera atómica de radio $R \approx 1.45\,\text{Å}$.

Entre 1909 y 1911, **Hans Geiger y Ernest Marsden** (bajo la dirección de **Ernest Rutherford**) en la Universidad de Manchester bombardearon láminas delgadas de oro con partículas alfa procedentes de una fuente radiactiva de $^{226}\text{Ra}$. Al descubrir que $\sim 1/10^4$ partículas rebotaban a ángulos $\theta > 90^\circ$, Rutherford demostró en 1911 que toda la masa y la carga positiva están concentradas en un **núcleo central denso y diminuto** ($\sim 10^{-14}\,\text{m}$).

Este proyecto interactivo no solo simula dicho hito histórico fundacional, sino que lo conecta directamente con sus aplicaciones de frontera: la **Espectrometría de Retrodispersión de Rutherford (RBS)** para metrología nanometrológica de materiales y la **Hadronterapia oncológica** (Curva de Bragg y medicina nuclear diagnóstica PET/SPECT).

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

#### 1.1b Montaje experimental de Geiger-Marsden
El experimento usó cuatro componentes clave:
1. **Fuente de Radio (Ra):** emisor natural de partículas alfa por decaimiento radiactivo. Las alfas emergen con energía típica de 5–8 MeV.
2. **Colimador:** ranura estrecha que selecciona solo las alfas que viajan en línea recta — define el "haz" experimental.
3. **Lámina de oro (Au):** espesor $\sim 0.4\,\mu\text{m}$ ($\sim 2000$ átomos de grosor). Lo suficientemente delgada para que la mayoría de partículas pasen con una sola dispersión (*single scattering*).
4. **Pantalla de sulfuro de zinc (ZnS):** cada partícula alfa que la golpea produce un destello de luz visible. Geiger y Marsden los contaban en la oscuridad con un microscopio de ocular.

El resultado cuantitativo clave: **1 de cada $10^4$ partículas** rebotaba a más de 90°. Imposible con la carga difusa de Thomson. Solo explicable con un núcleo puntual.

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

**Criterio práctico:** si $b < 2a_0$ entonces $\theta > 45°$. La gran mayoría de partículas del haz tienen $b \gg a_0$, lo que explica por qué la lámina es casi transparente: solo $\sim 1/10^4$ alfas tiene puntería suficientemente centrada para rebotar notoriamente.

#### 1.6 Integración RK4 de las ecuaciones de movimiento
En coordenadas cartesianas reducidas (normalizadas por $a_0$), las ecuaciones de movimiento en el campo de Coulomb son:
$$\ddot{x} = \frac{x}{(x^2+y^2)^{3/2}}, \quad \ddot{y} = \frac{y}{(x^2+y^2)^{3/2}}$$
Para el modelo de Thomson (esfera uniforme, $r < R_\text{átomo}$), la fuerza cambia a $F \propto r$.

El motor físico implementa el método de **Runge-Kutta de cuarto orden (RK4)** para integrar estas ecuaciones en cada paso de tiempo $dt$:
$$\mathbf{y}_{n+1} = \mathbf{y}_n + \frac{dt}{6}(k_1 + 2k_2 + 2k_3 + k_4)$$
con $k_i$ evaluados en los subestados intermedios estándar del RK4. El error local es $O(dt^5)$, suficiente para conservar la energía con paso $dt = 0.05\,a_0/v_0$. La trayectoria se calcula una sola vez al cambiar parámetros y luego se recorre en la animación.

#### 1.6b Parámetros de impacto en la simulación
La simulación elige los parámetros de impacto como múltiplos de $a_0$:
$$b_i = \{0.30,\; 0.72,\; 1.60,\; 3.38,\; 5.86,\; 9.55\} \times a_0$$
Esto garantiza que la distribución de trayectorias sea visualmente informativa para cualquier combinación de $Z_2$ y $E_0$: siempre cubre desde dispersión casi frontal ($b < a_0$, ángulos grandes) hasta dispersión lejana ($b \gg a_0$, ángulos pequeños).

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

#### 2.2b Balance de Energía, Energía Absorbida y Retroceso ($E_{\text{rec}}$)
Por la primera ley de la termodinámica y conservación de la energía mecánica en choques elásticos:
$$E_0 = E_1 + E_{\text{rec}} \implies E_{\text{rec}} = E_0 - E_1 = (1 - K) \cdot E_0$$
Donde **$E_{\text{rec}}$ es la energía cinética absorbida por el núcleo blanco** al recibir el impacto.

#### 2.2c Distinción fundamental de velocidades tras el choque
Tras la colisión se originan dos movimientos divergentes con velocidades bien diferenciadas:
1. **Velocidad de rebote de la partícula alfa hacia el detector ($v_1$):**
   $$v_1 = \sqrt{K} \cdot v_0 \quad (0.502\,v_0 \text{ en Carbono vs. } 0.960\,v_0 \text{ en Oro})$$
2. **Velocidad de retroceso del átomo blanco empujado hacia adelante ($v_{\text{rec}}$):**
   $$v_{\text{rec}} = \frac{2M_1}{M_1 + M_2} \cdot v_0 \quad (0.500\,v_0 \text{ en Carbono vs. } 0.040\,v_0 \text{ en Oro})$$
donde $v_0 = \sqrt{2E_0/m_\alpha} \approx 9\,820\,\text{km/s}$ a $E_0 = 2.0\,\text{MeV}$.

#### 2.2d Protocolo de deducción analítica (Las 5 Tarjetas Métricas)
En el laboratorio real, el detector semiconductor a $170^\circ$ **mide físicamente una sola magnitud: $E_1$**. A partir de esa única señal eléctrica:
1. **Factor $K$:** se calcula como $K = E_1 / E_0$.
2. **Identificación de masa $M_2$:** la computadora despeja la masa $M_2$ en la fórmula de $K$ y consulta la tabla periódica ($\implies$ ¡identifica el elemento!).
3. **Energía de retroceso:** $E_{\text{rec}} = (1 - K)E_0$ (energía transferida a la red cristalina).
4. **Velocidad de retroceso:** $v_{\text{rec}} = \frac{2M_1}{M_1+M_2}v_0$.

#### 2.3 Límites físicos
- **$M_2 \gg M_1$:** Apenas hay retroceso; $K \to 1$. Ejemplo: Au ($197\,\text{u}$), $K=0.9226$, $E_{\text{rec}} = 0.155\,\text{MeV}$ ($7.7\%$), $v_{\text{rec}} = 0.040\,v_0$.
- **$M_2 = M_1$:** $K = \cos^2\theta$. En choque frontal ($180°$): $K=0$, transferencia del 100% de la energía.
- **$M_2 < M_1$ (límite cinemático):** El término $M_2^2 - M_1^2\sin^2\theta < 0$ para $\theta > \arcsin(M_2/M_1)$. Una alfa no puede rebotar hacia atrás contra un núcleo más ligero (e.g., H con $M_2=1\,\text{u}$). RBS no detecta Hidrógeno directamente; se requiere **ERDA** (*Elastic Recoil Detection Analysis*, ver §10.3).

#### 2.4 ¿Por qué $\theta = 170°$?
A $180°$ la sensibilidad de masa $dK/dM_2$ es máxima pero bloquearía el haz incidente. La **geometría a $170°$** conserva $\sim 99.8\%$ de la resolución teórica y es el estándar internacional en laboratorios de iones (CMAM-UAM, EAG).

#### 2.5 Valores verificados ($E_0 = 2.0\,\text{MeV}$, $\theta = 170^\circ$)
- **Carbono ($^{12}\text{C}$):** $K = 0.2525 \implies E_1 = 0.5051\,\text{MeV}$, $E_{\text{rec}} = 1.4949\,\text{MeV}$ (absorbe el $74.7\%$), $v_{\text{rec}} = 0.500\,v_0$.
- **Silicio ($^{28}\text{Si}$):** $K = 0.5649 \implies E_1 = 1.1298\,\text{MeV}$, $E_{\text{rec}} = 0.8702\,\text{MeV}$ (absorbe el $43.5\%$), $v_{\text{rec}} = 0.250\,v_0$.
- **Hierro ($^{56}\text{Fe}$):** $K = 0.7527 \implies E_1 = 1.5054\,\text{MeV}$, $E_{\text{rec}} = 0.4946\,\text{MeV}$ (absorbe el $24.7\%$), $v_{\text{rec}} = 0.133\,v_0$.
- **Plata ($^{108}\text{Ag}$):** $K = 0.8632 \implies E_1 = 1.7264\,\text{MeV}$, $E_{\text{rec}} = 0.2736\,\text{MeV}$ (absorbe el $13.7\%$), $v_{\text{rec}} = 0.071\,v_0$.
- **Oro ($^{197}\text{Au}$):** $K = 0.9226 \implies E_1 = 1.8451\,\text{MeV}$, $E_{\text{rec}} = 0.1549\,\text{MeV}$ (absorbe el $7.7\%$), $v_{\text{rec}} = 0.040\,v_0$.

#### 2.6 Simplificaciones declaradas
- **Ausencia de efectos relativistas:** A las energías estándar del RBS ($2 \text{ MeV}$), las correcciones relativistas para partículas alfa son de un orden de magnitud muy por debajo de la resolución experimental.
- **Energía de enlace atómico:** Se considera la colisión entre núcleos libres, despreciando la energía de enlace molecular o de la red cristalina (del orden de los eV frente a los MeV del proyectil).

---

### 3. Panel C — Espectro RBS y Cuantificación de Superficie

#### 3.1 ¿Qué mide el espectro RBS?
El espectro es un histograma continuo de energía: en el eje X se representa la energía de las partículas alfa retrodispersadas detectadas ($E_1$), y en el eje Y el número de cuentas (rendimiento o *Yield*).

#### 3.2 Posición de los peaks: energía $E_1 = K\cdot E_0$
Cada elemento químico presente en la muestra genera un peak centrado en una energía específica, determinada unívocamente por su factor cinemático $K(M_2,\theta)$. Los elementos pesados ($\text{Au}$) aparecen a la derecha del espectro (alta energía residual), y los ligeros ($\text{C}$) a la izquierda (baja energía). Esta posición es **estrictamente invariante** ante cambios de concentración.

#### 3.3 Altura y rendimiento de los peaks: sección eficaz de Coulomb ($\sigma \propto Z_2^2$)
El área bajo cada peak ($A_i$) es el producto de dos factores desacoplados:
$$ A_i \;\propto\; \underbrace{N_i}_{\text{Densidad atómica}} \;\times\; \underbrace{Z_2^2}_{\text{Sección eficaz de Coulomb}} $$

**Fórmula canónica de rendimiento (Chu, Mayer & Nicolet, 1978):**
El área integrada $A_i$ (número total de cuentas) del peak correspondiente al elemento $i$ en una película delgada se expresa analíticamente como:
$$A_i = Q \cdot N_i \cdot \left(\frac{d\sigma}{d\Omega}\right)_i \cdot \Delta\Omega$$
donde $Q$ es la carga total integrada del haz incidente, $N_i$ es la densidad atómica superficial ($\text{átomos/cm}^2$), $(d\sigma/d\Omega)_i$ es la sección eficaz diferencial y $\Delta\Omega$ es el ángulo sólido subtendido por el detector.

**Cuantificación absoluta sin patrones (*standardless*):**
Dado que la sección eficaz $\sigma \propto Z_2^2$ se deriva analíticamente a partir de la ley de Coulomb pura sin contacto físico, RBS permite determinar la **fórmula estequiométrica exacta directamente in situ sin destruir la muestra ni requerir patrones de calibración externos**:
$$\frac{N_A}{N_B} = \frac{A_A / Z_A^2}{A_B / Z_B^2}$$

**Fases y materiales reales integrados:**
- $\text{Fe}_3\text{C}$ (Cementita / Acero templado): $N_{\text{Fe}} : N_{\text{C}} = 3 : 1$ ($75\%$ Fe, $25\%$ C atómico).
- $\text{Au}_2\text{Si}$ (Siliciuro de oro): $N_{\text{Au}} : N_{\text{Si}} = 2 : 1$ ($67\%$ Au, $33\%$ Si atómico).
- $\text{SiC}$ (Carburo de silicio semiconductor): $N_{\text{Si}} : N_{\text{C}} = 1 : 1$ ($50\%$ Si, $50\%$ C atómico).
- $\text{Ag}_3\text{Au}$ (Electrum / Aleación noble): $N_{\text{Ag}} : N_{\text{Au}} = 3 : 1$ ($75\%$ Ag, $25\%$ Au atómico).

**Valor verificado de sensibilidad:**
$$\frac{(d\sigma/d\Omega)_{\text{Au}}}{(d\sigma/d\Omega)_{\text{C}}} = \left(\frac{79}{6}\right)^2 = \frac{6241}{36} = 173.36 \approx \mathbf{173.4}$$
A igual concentración, el Oro genera $173.4\times$ más cuentas que el Carbono.

#### 3.4 Anchura y resolución del detector
Los peaks se modelan como funciones gaussianas convolucionadas con la resolución instrumental del detector semiconductor de silicio (PIPS, $\sigma_{\text{det}} \approx 28\text{--}30\,\text{keV}$, $\text{FWHM} \approx 65\text{--}70\,\text{keV}$):
$$ Y(E) = \sum_{i} A_i \exp\left( - \frac{(E - K_i E_0)^2}{2\sigma_{\text{det}}^2} \right) $$

---

### 4. Panel D — RBS en acción (Adquisición estocástica y perfilado en profundidad)

#### 4.1 De la monocapa al perfilado en profundidad
Mientras el Panel C describe átomos en superficie ideal ($x=0$), el Panel D simula la interacción con una **heteroestructura multicapa real** (sustrato de $\text{Si}$ con capas de $\text{Fe}$, $\text{Au}$, $\text{Ag}$ y superficie de $\text{C}$, con espesor uniforme de $40\,\text{nm}$ por estrato, cubriendo de $0\text{ a }200\,\text{nm}$).

#### 4.2 Física de los parámetros del haz ($E_0$ e $I$)

1. **Energía del haz $E_0$ (Alcance y profundidad):**
   Al ingresar al sólido, los iones pierden energía por interacción inelástica continua con la nube electrónica (fórmula de Bethe-Bloch). El alcance máximo $R(E_0)$ es:
   $$R(E_0) = \int_0^{E_0} \frac{dE}{dE/dx}$$
   - A $1.0\,\text{MeV}$, penetra $\sim 1.5\,\mu\text{m}$ en $\text{Si}$.
   - A $2.0\,\text{MeV}$, penetra $\sim 4.5\,\mu\text{m}$.
   - A $3.0\,\text{MeV}$, penetra $>8.0\,\mu\text{m}$.
   - **Límite de la barrera de Coulomb:** Se mantiene $E_0 \le 3.0\,\text{MeV}$ para asegurar que la partícula $\alpha$ nunca supere la barrera electrostática nuclear ($E_{\text{barrera}} \approx 5.5\,\text{MeV}$ para C), garantizando una dispersión $100\%$ elástica de Coulomb pura.

2. **Corriente del haz $I$ (Flujo y convergencia de Poisson):**
   El flujo incidente de partículas por segundo es:
   $$\dot{N}_\text{haz} = \frac{I}{Z_1 e} \approx \mathbf{6.24 \times 10^{10} \;\text{alfas/s}} \quad (\text{a } 20\,\text{nA})$$
   El registro estocástico de pulsos sigue la **distribución de Poisson**, con incertidumbre relativa:
   $$\frac{\sigma_N}{N} = \frac{1}{\sqrt{N}}$$
   A mayor corriente o tiempo de integración, el ruido estadístico disminuye y el histograma converge suavemente a la curva teórica del Panel C.

#### 4.3 Factor de Parada $[S]$ y espesor físico ($x$)
Un proyectil que retrodispersa a profundidad $x$ sufre frenado al entrar y al salir:
$$\Delta E = [S] \cdot x, \qquad [S] = \left[\frac{K}{\cos\theta_{\text{in}}}\left(\frac{dE}{dx}\right)_{\text{in}} + \frac{1}{\cos\theta_{\text{out}}}\left(\frac{dE}{dx}\right)_{\text{out}}\right]$$
El Factor de Parada $[S]$ (en $\text{eV/\AA}$) transforma directamente la anchura en energía $\Delta E$ en el **espesor físico nanométrico $x$** de la película.

#### 4.4 El Triple Desacoplamiento No Destructivo
En una sola medición no destructiva, RBS desacopla simultáneamente:
1. **Identidad química ($M_2$):** Borde de energía $E_{\text{borde}} = K(M_2,\theta)\cdot E_0$.
2. **Estequiometría ($N_i$):** Rendimiento integrado $A_i \propto N_i \cdot Z_2^2$.
3. **Espesor nanométrico ($x$):** Anchura espectral $\Delta E = [S] \cdot x$.

---

### 5. Panel E — Espectrometría PIXE y la Ley de Moseley

#### 5.1 ¿Qué es la técnica PIXE?
La **Espectrometría de Emisión de Rayos X Inducida por Partículas** (*Particle-Induced X-Ray Emission*, PIXE) es la técnica analítica complementaria del RBS en los aceleradores de iones modernos (como el acelerador AGLAE del Museo del Louvre en París). Mientras que el RBS identifica núcleos mediante dispersión elástica nuclear y mide espesores en profundidad ($[S]\cdot x$), PIXE excita la nube electrónica atómica para cuantificar elementos traza en concentraciones de partes por millón (PPM) de forma **completamente no destructiva**.

#### 5.2 Mecanismo cuántico de emisión
1. **Ionización por impacto:** Un ión del haz incidente ($\alpha$ de $\sim 2\text{--}3\,\text{MeV}$) colisiona inelásticamente con un electrón de una capa interna fuertemente ligada (capa $K$ con $n=1$ o capa $L$ con $n=2$), expulsándolo fuera del átomo y dejando una vacancia electrónica.
2. **Desexcitación cuántica:** En un tiempo de $\sim 10^{-16}\,\text{s}$, un electrón de una capa superior cae espontáneamente para llenar la vacancia.
3. **Emisión del fotón de Rayos X:** La energía liberada en la transición electrónica se emite como un fotón cuántico característico:
   $$\Delta E = h\nu = \frac{hc}{\lambda} = E_{\text{inicial}} - E_{\text{final}}$$

#### 5.3 La Ley de Moseley (1913) y el Modelo de Bohr
Trabajando en el laboratorio de Ernest Rutherford en la Universidad de Manchester en 1913, **Henry Moseley** midió sistemáticamente las frecuencias de los rayos X característicos de decenas de elementos. Descubrió la relación lineal fundamental:
$$\sqrt{\nu} = C \cdot (Z - \sigma)$$
donde $Z$ es el número atómico y $\sigma$ es la constante de apantallamiento electrónico.

Conectada con la constante de Rydberg ($R_y = 13.6\,\text{eV}$):
- **Línea $K_\alpha$ (Transición $L \to K$, $n=2 \to 1$, $\sigma = 1$):**
  $$E_{K\alpha} = R_y \cdot (Z - 1)^2 \left(\frac{1}{1^2} - \frac{1}{2^2}\right) = \frac{3}{4} R_y \, (Z - 1)^2$$
- **Línea $K_\beta$ (Transición $M \to K$, $n=3 \to 1$, $\sigma = 1$):**
  $$E_{K\beta} = R_y \cdot (Z - 1)^2 \left(\frac{1}{1^2} - \frac{1}{3^2}\right) = \frac{8}{9} R_y \, (Z - 1)^2$$
- **Línea $L_\alpha$ (Transición $M \to L$, $n=3 \to 2$, $\sigma \approx 7.4$):**
  $$E_{L\alpha} \approx R_y \cdot (Z - 7.4)^2 \left(\frac{1}{2^2} - \frac{1}{3^2}\right) = \frac{5}{36} R_y \, (Z - 7.4)^2$$

#### 5.4 Importancia histórica y física
El hallazgo de Moseley constituyó la **primera confirmación experimental directa de que el número atómico $Z$ es la carga nuclear real** postulada por Rutherford en 1911. Ordenó definitivamente la Tabla Periódica en función de $Z$ y no del peso atómico (resolviendo anomalías como Cobalto/Níquel y Argón/Potasio).

#### 5.5 Valores experimentales verificados en la simulación
| Elemento | Carga $Z$ | Línea $K_\alpha$ | Línea $K_\beta$ | Línea $L_\alpha$ | Línea $L_\beta$ | Longitud de onda $\lambda$ | Aplicación en Patrimonio / Louvre |
|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **Titanio ($\text{Ti}$)** | $22$ | $4.51\,\text{keV}$ | $4.93\,\text{keV}$ | — | — | $2.749\,\text{\AA}$ | Blanco de titanio (pigmento moderno) |
| **Hierro ($\text{Fe}$)** | $26$ | $6.40\,\text{keV}$ | $7.06\,\text{keV}$ | $0.70\,\text{keV}$ | — | $1.937\,\text{\AA}$ | Ocre rojo / meteoritos y aleaciones |
| **Cobre ($\text{Cu}$)** | $29$ | $8.04\,\text{keV}$ | $8.91\,\text{keV}$ | $0.93\,\text{keV}$ | — | $1.542\,\text{\AA}$ | Azul azurita y verde malaquita |
| **Plata ($\text{Ag}$)** | $47$ | $22.16\,\text{keV}$ | $24.94\,\text{keV}$ | $2.98\,\text{keV}$ | — | $0.559\,\text{\AA}$ | Orfebrería y monedas históricas |
| **Oro ($\text{Au}$)** | $79$ | $68.8\,\text{keV}$ | $77.9\,\text{keV}$ | $9.71\,\text{keV}$ | $11.44\,\text{keV}$ | $1.277\,\text{\AA}$ | Joyas reales y pan de oro |
| **Mercurio ($\text{Hg}$)** | $80$ | $70.8\,\text{keV}$ | $80.2\,\text{keV}$ | $9.99\,\text{keV}$ | $11.82\,\text{keV}$ | $1.241\,\text{\AA}$ | Rojo bermellón histórico (cinabrio) |
| **Plomo ($\text{Pb}$)** | $82$ | $74.9\,\text{keV}$ | $84.9\,\text{keV}$ | $10.55\,\text{keV}$ | $12.61\,\text{keV}$ | $1.175\,\text{\AA}$ | Blanco de plomo (albayalde en óleos) |

#### 5.6 El tándem sinérgico: RBS + PIXE
En un laboratorio de análisis por haces de iones (IBA):
- **RBS:** Resuelve masas pesadas, perfiles de concentración en profundidad y espesores nanométricos mediante colisión elástica.
- **PIXE:** Identifica inequívocamente elementos adyacentes de masa similar y detecta impurezas ultra-diluidas (PPM) mediante fotones característicos cuantizados. Ambas técnicas se adquieren simultáneamente con el mismo haz de partículas $\alpha$.

#### 5.7 ¿De qué depende el tipo de salto cuántico ($K_\alpha, K_\beta, L_\alpha, L_\beta$)?
El tipo de transición radiativa que se observa experimentalmente depende de cuatro factores físicos fundamentales:

1. **Ubicación de la vacancia inicial (Sección eficaz de ionización por capa $\sigma_K, \sigma_L$):**
   Para que ocurra una serie $K$, el proyectil $\alpha$ debe ionizar un electrón de la capa $K$ ($n=1$).
   - En elementos de $Z$ bajo/medio ($\text{Ti, Fe, Cu}$ con $E_K \sim 4\text{--}9\,\text{keV}$), un haz de $2\text{--}3\,\text{MeV}$ ioniza eficientemente la capa $K$, dominando las transiciones $K_\alpha$ y $K_\beta$.
   - En elementos pesados ($\text{Au, Hg, Pb}$ con $E_K \sim 70\text{--}88\,\text{keV}$), la probabilidad de ionizar la capa $K$ a $2\,\text{MeV}$ es insignificante; en cambio, ioniza fuertemente la capa $L$ ($E_L \sim 10\text{--}15\,\text{keV}$), dominando las series $L_\alpha$ y $L_\beta$.

2. **Probabilidades cuánticas de desexcitación (Coeficientes de Einstein $A_{i\to f}$):**
   - **Transición $K_\alpha$ ($L \to K$, $\Delta n = 1$):** El electrón de la capa contigua ($L$) tiene máxima superposición espacial con la vacancia en $K$. Ocurre en el **$\sim 80\text{--}85\%$** de los casos (peak principal más intenso).
   - **Transición $K_\beta$ ($M \to K$, $\Delta n = 2$):** Es menos probable ($\sim 15\text{--}20\%$), pero al caer desde un nivel más externo libera mayor energía ($\Delta E$), situando el peak a la derecha de $K_\alpha$.
   - De forma análoga, en la capa $L$: $L_\alpha$ ($M \to L$, $\Delta n = 1$) es la más probable y $L_\beta$ ($N \to L$, $\Delta n = 2$) es la más energética.

3. **Reglas de selección dipolar cuántica ($\Delta \ell = \pm 1$):**
   La desexcitación radiativa exige un cambio en el momento angular orbital de $\pm 1$. Dado que la capa $K$ ($n=1$) posee orbital $1s$ ($\ell = 0$), el electrón entrante debe provenir necesariamente de subniveles $p$ ($\ell = 1$: $2p$ para $K_\alpha$, $3p$ para $K_\beta$).

4. **Rendimiento de fluorescencia ($\omega_Z$):**
   Mide la fracción de vacancias que decaen emitiendo un fotón de Rayos X en lugar de un electrón Auger no radiativo. $\omega_Z$ crece monótonamente con $Z$ ($\omega_K \propto Z^4$), garantizando que para metales y elementos pesados la señal de Rayos X sea óptima.

---

### 6. Panel F — El Hilo Cuántico (De Planck a la Física Contemporánea)

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
    (10.6 Extensiones cuánticas de las técnicas IBA)

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


#### 10.6 ¿Dónde entra la mecánica cuántica en las técnicas relacionadas a RBS?

El RBS clásico es mecánicamente clásico (ver §0.5). Pero las técnicas complementarias de la familia IBA sí requieren mecánica cuántica de forma esencial. Hay tres fenómenos cuánticos centrales:

---

**A. Efecto túnel — la conexión más directa con este proyecto**

La barrera de Coulomb que en el Panel A *repele* una partícula alfa hacia afuera es **la misma barrera** que en el decaimiento radiactivo la partícula alfa debe *atravesar desde adentro* para escapar del núcleo. Clásicamente esto es imposible: la partícula no tiene energía suficiente para subir la barrera. Pero cuánticamente, la función de onda $\Psi$ penetra la barrera con una amplitud no nula — el **efecto túnel de Gamow (1928)**:

$$T \approx e^{-2G}, \quad G = \int_{r_1}^{r_2} \sqrt{\frac{2m}{\hbar^2}\left[V(r)-E\right]}\,dr$$

donde $V(r) = kZ_1Z_2e^2/r$ es exactamente el potencial coulombiano del Panel A. En palabras simples:

> *Las partículas alfa que usa el experimento de Rutherford llegaron hasta ahí gracias al efecto túnel cuántico — escaparon del núcleo del Radio atravesando la barrera de Coulomb por la que la simulación las muestra rebotando.*

La técnica **NRA** (*Nuclear Reaction Analysis*) aprovecha esto: a energías específicas, el proyectil también puede penetrar el núcleo blanco por túnel y desencadenar una reacción nuclear. Esto permite detectar elementos ligeros ($^{12}$C, $^{16}$O, $^{14}$N) con resolución de profundidad de $\sim$2 nm — imposible con RBS clásica.

---

**B. Resonancias cuánticas — estados del núcleo compuesto (NRA/RNRA)**

Cuando la energía del proyectil coincide exactamente con un estado cuántico (nivel de energía) del núcleo compuesto formado durante la colisión, la sección eficaz sube órdenes de magnitud. Este fenómeno se describe con la fórmula de **Breit-Wigner**:

$$\sigma(E) = \sigma_0 \frac{(\Gamma/2)^2}{(E-E_r)^2 + (\Gamma/2)^2}$$

donde $E_r$ es la energía de la resonancia y $\Gamma$ su anchura. Es el análogo nuclear de las líneas espectrales de Bohr: los niveles $E_r$ son estados cuánticos discretos del núcleo, no energías continuas. **Sin mecánica cuántica no existen estas resonancias**.

---

**C. Transiciones electrónicas cuánticas — PIXE**

La técnica **PIXE** (*Particle-Induced X-ray Emission*) detecta los rayos X característicos emitidos cuando el haz de iones expulsa un electrón de una capa interna del átomo blanco y otro electrón cae a ocupar el hueco. La energía del fotón emitido es:

$$E_{K\alpha} = E_{K} - E_{L} \quad \text{(transición L} \to \text{K)}$$

Estas energías son fijas y únicas para cada elemento (huella digital cuántica del átomo), determinadas por la estructura de capas cuánticas. Las **reglas de selección** ($\Delta l = \pm 1$, $\Delta j = 0, \pm 1$) son puramente cuánticas. Sin la cuantización de Bohr y su extensión a la estructura electrónica, PIXE no funcionaría.

---

**Resumen visual: clásico vs. cuántico en IBA**

| Técnica | ¿Usa QM? | Fenómeno cuántico | Para qué sirve |
|---|:---:|---|---|
| **RBS** | No (clásica exacta) | — (coincidencia Gordon) | Masas y concentraciones |
| **ERDA** | No | — | Hidrógeno y elementos ligeros |
| **NRA / RNRA** | **Sí** | Efecto túnel + resonancias Breit-Wigner | Perfiles de $^{16}$O, $^{12}$C con nm de resolución |
| **PIXE** | **Sí** | Transiciones electrónicas cuánticas | Elementos con masas similares ($Z$ cercano) |
| **Channeling** | Parcial | Potencial de steering (límite cuántico a baja E) | Daño por implantación, dopantes |

**Conclusión:** RBS es el punto de partida clásico. Las técnicas que extienden su alcance hacia elementos ligeros, resolución isotópica o mayor sensibilidad requieren mecánica cuántica. El proyecto cubre el caso clásico exacto; el ecosistema completo de IBA es un ejemplo de cómo la física cuántica amplía —sin reemplazar— las capacidades de la física clásica.

---

### 7. Tabla maestra de fórmulas y valores verificados

| Panel | Concepto físico | Fórmula matemática | Valor verificado en el proyecto |
| :---: | :--- | :--- | :--- |
| A | Constante de Coulomb atómica | $ke^2 = e^2/4\pi\varepsilon_0$ | $1.439965 \approx 1.44\text{ MeV}\cdot\text{fm}$ (CODATA) |
| A | Parámetro característico | $a_0 = Z_1 Z_2 ke^2 / 2E_0$ | $a_0(\text{Au},7\text{ MeV}) = 16.25\text{ fm}$ ($d_{\min} = 32.5\text{ fm}$) |
| A | Parámetro de impacto | $b(\theta) = a_0 \cot(\theta/2)$ | $b(143^\circ) \approx 5.0\text{ fm}$ (Au, $7\text{ MeV}$) |
| A | Deflexión máx. Thomson | $\theta_\text{Th,max} \approx a_0 / R_\text{átomo}$ | $6.4\times10^{-3}{^\circ}$ (sub-píxel a escala atómica) |
| B | Factor cinemático | $K=\!\left[\frac{\sqrt{M_2^2-M_1^2\sin^2\theta}+M_1\cos\theta}{M_1+M_2}\right]^2$ | $K(\text{C},170^\circ)=0.2525$; $K(\text{Au},170^\circ)=0.9226$ |
| B | Energía retrodispersada | $E_1 = K\cdot E_0$ | $E_1(\text{C})=0.505\text{ MeV}$; $E_1(\text{Au})=1.845\text{ MeV}$ ($E_0=2\text{ MeV}$) |
| B | Velocidad de recule frontal | $v_{\text{rec}}/v_0 = 2M_1/(M_1+M_2)$ | $0.50\,v_0$ ($^{12}\text{C}$); $0.040\,v_0$ ($^{197}\text{Au}$) |
| C | Sección eficaz diferencial | $d\sigma/d\Omega = (Z_1Z_2ke^2/4E_0)^2\sin^{-4}(\theta/2)$ | $\sigma(\text{Au})/\sigma(\text{C})=(79/6)^2=173.36 \approx 173.4$ |
| C | Rendimiento canónico (Chu) | $A_i = Q \cdot N_i \cdot (d\sigma/d\Omega)_i \cdot \Delta\Omega$ | Cuantificación absoluta *standardless* |
| C | Espectro (gaussianas) | $Y(E)=\sum_i A_i\exp[-(E-K_iE_0)^2/2\sigma_\det^2]$ | $\text{FWHM} \approx 66\text{ keV}$ ($\sigma_\det=0.028\text{ MeV}$) |
| D | Flujo del haz a $20\text{ nA}$ | $\dot{N}_{\text{haz}} = I / (Z_1 e)$ | $6.24 \times 10^{10}\text{ alfas/s}$ |
| D | Intervalo de spawn | $\Delta t = 9200/I[\text{nA}]$ ms | $20\text{ nA}\Rightarrow 460\text{ ms/partícula}$ |
| D | Incertidumbre de Poisson | $\sigma_N / N = 1/\sqrt{N}$ | Convergencia estadística del histograma |
| D | Perfilado en profundidad | $\Delta E = [S] \cdot x$ | Relaciona anchura de pico con espesor nanométrico |
| E | Pérdida de energía Bethe | $-dE/dx \propto z^2/v^2$ | Concentración de dosis en el Pico de Bragg |
| E | Rango protón 150 MeV | $R=\int_0^{E_0}(dE/dx)^{-1}dE$ | $\approx 15.8\text{ cm}$ en agua (NIST PSTAR) |
| E | Iones $^{12}\mathrm{C}^{6+}$ | Carga $z=6 \implies z^2 = 36$ | LET alto y $\text{RBE} \approx 2\text{--}3$ para tumores radiorresistentes |
| ∞ | Colapso clásico de Larmor | $\tau = \frac{m_e^2 c^3 r_0^3}{4 k^2 e^4}$ | $\approx 1.6 \times 10^{-11}\text{ s}$ (resuelto por Bohr $L=n\hbar$) |

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
