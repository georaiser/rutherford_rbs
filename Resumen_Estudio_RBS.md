# Resumen de Estudio — Experimento de Rutherford, RBS y Hadronterapia
## Guía rápida y accesible | Módulo 2: Teoría Cuántica Temprana — Diplomado de Física Moderna

> Este documento es un **resumen estructurado y accesible** de [`Estudio_Fisico_RBS.md`](Estudio_Fisico_RBS.md).
> Para deducciones analíticas completas y tablas de referencia avanzadas, consultar el documento principal.

---

### Índice
0. Contexto Histórico y Epistemológico (Panel 0)
1. Panel A — Dispersión de Rutherford y Modelo Clásico
2. Panel B — Factor Cinemático $K$ y Choque Elástico
3. Panel C — Espectro RBS y Cuantificación de Superficie
4. Panel D — Adquisición Estocástica y Perfilado en Profundidad ($[S]$)
5. Panel E — Hadronterapia, Pico de Bragg y Medicina Nuclear
6. El Hilo Cuántico: De la Crisis de Larmor a la Cuantización de Bohr
7. Técnicas IBA y su Vínculo Cuántico (RBS, ERDA, NRA, PIXE)
8. Tabla de Fórmulas y Valores Esenciales Verificados
9. Glosario Técnico Rápido

---

## 0. Contexto Histórico y Epistemológico (Panel 0)

A inicios del siglo XX, la física clásica enfrentaba dos misterios fundamentales:
1. **La cuantización de la radiación (1900–1905):** Max Planck postuló los cuantos de energía ($E = nh\nu$) para resolver la **catástrofe ultravioleta** del cuerpo negro (donde la física clásica de Rayleigh-Jeans predecía erróneamente energía infinita a altas frecuencias), extendida por Einstein al efecto fotoeléctrico (1905).
2. **La estructura de la materia (1909–1911):** El modelo atómico de Thomson (1904, "pudín de pasas") concebía la carga positiva repartida de forma homogénea en una esfera de radio $R \approx 1.45\,\text{Å}$.

Entre 1909 y 1911, **Hans Geiger y Ernest Marsden** (bajo la dirección de **Ernest Rutherford**) en la Universidad de Manchester bombardearon láminas delgadas de oro con partículas alfa. El hallazgo de que $\sim 1/10^4$ partículas rebotaban a ángulos $\theta > 90^\circ$ demostró que la masa y la carga positiva están concentradas en un **núcleo central denso y diminuto** ($\sim 10^{-14}\,\text{m}$).

---

## 1. Panel A — Dispersión de Rutherford y Modelo Clásico

### La interacción electrostática
La partícula alfa ($^4_2\text{He}^{2+}$, $Z_1=2$, $M_1=4\,\text{u}$) experimenta una fuerza de Coulomb repulsiva con el núcleo blanco ($Z_2$):
$$F(r) = \frac{Z_1 Z_2 ke^2}{r^2}, \qquad V(r) = \frac{Z_1 Z_2 ke^2}{r}$$
donde $ke^2 \approx 1.44\,\text{MeV·fm}$.

### Parámetro característico de aproximación ($a_0$)
Si el proyectil incide en colisión frontal directa ($b=0$), toda su energía cinética $E_0$ se convierte en energía potencial electrostática al detenerse en la **distancia de máximo acercamiento** ($d_{\min} = 2a_0$):
$$a_0 = \frac{Z_1 Z_2 ke^2}{2E_0}$$
*Ejemplo:* Para Au ($Z_2=79$) a $E_0 = 7\,\text{MeV}$, $a_0 \approx 16.25\,\text{fm}$ ($d_{\min} \approx 32.5\,\text{fm}$).

### Relación entre parámetro de impacto $b$ y ángulo $\theta$
La trayectoria es una hipérbola gobernada por la relación exacta de Rutherford:
$$b(\theta) = a_0 \cot\!\left(\frac{\theta}{2}\right) \iff \theta = 2\operatorname{arccot}\!\left(\frac{b}{a_0}\right)$$
- $b \ll a_0$ (impacto central) $\to$ fuerte repulsión y retrodispersión ($\theta > 90^\circ$).
- $b \gg a_0$ (impacto lejano) $\to$ fuerza despreciable y trayectoria casi rectilínea ($\theta \to 0^\circ$).

### Montaje experimental clásico
- **Fuente radiactiva:** $^{226}\text{Ra}$ emitiendo partículas $\alpha$ de $5\text{--}8\,\text{MeV}$.
- **Colimador:** Bloque de plomo con apertura estrecha para definir un haz paralelo.
- **Blanco:** Lámina de oro delgada ($\sim 0.4\,\mu\text{m} \approx 2000$ capas atómicas, régimen de dispersión simple).
- **Detector:** Pantalla centelladora de sulfuro de zinc ($\text{ZnS}$) acoplada a un microscopio móvil.

### Fallo cuantitativo del modelo de Thomson
Por Ley de Gauss, el campo interno de una esfera uniforme es $\vec{E} \propto \vec{r}$. La deflexión máxima posible es:
$$\theta_{\max}^{\text{Thomson}} \approx \frac{a_0}{R} \approx \frac{16.2\,\text{fm}}{145{,}000\,\text{fm}} \approx 0.0064^\circ$$
El modelo de Thomson es físicamente incapaz de producir rebotes a $>90^\circ$.

---

## 2. Panel B — Factor Cinemático $K$, Balance de Energía y Retroceso

### Principio de conservación en 2D
En una colisión elástica bidimensional entre la partícula alfa ($M_1=4\,\text{u}$) y un núcleo blanco estacionario ($M_2$), la conservación simultánea de momento lineal ($\vec{p}$) y energía cinética ($E$) determina tanto la energía de rebote $E_1$ como la energía absorbida por el núcleo $E_{\text{rec}}$:
$$E_1 = K(M_2, \theta) \cdot E_0, \qquad E_{\text{rec}} = E_0 - E_1 = (1 - K) \cdot E_0$$

### Fórmula canónica del Factor $K$
$$K(M_2, \theta) = \left[\frac{\sqrt{M_2^2 - M_1^2 \sin^2\theta} + M_1 \cos\theta}{M_1 + M_2}\right]^2$$

### Distinción fundamental de velocidades tras el choque
- **Partícula alfa que rebota hacia el detector ($v_1$):** $v_1 = \sqrt{K} \cdot v_0$ ($0.502\,v_0$ en Carbono vs. $0.960\,v_0$ en Oro).
- **Núcleo blanco empujado hacia adelante ($v_{\text{rec}}$):** $v_{\text{rec}} = \frac{2M_1}{M_1+M_2} \cdot v_0$ ($0.500\,v_0$ en Carbono vs. $0.040\,v_0$ en Oro).
*(donde $v_0 = \sqrt{2E_0/m_\alpha} \approx 9\,820\,\text{km/s}$ a $E_0 = 2.0\,\text{MeV}$)*.

### Protocolo de medición física y deducción analítica (Las 5 Tarjetas)
El detector semiconductor a $\theta = 170^\circ$ **mide físicamente una sola magnitud: la energía dispersada $E_1$**. A partir de esa única lectura:
1. $K = E_1 / E_0$ (Razón cinemática / huella de masa).
2. $M_2$ y Elemento: se despeja $M_2$ en la fórmula de $K$ ($\implies$ diagnóstico del material).
3. $E_{\text{rec}} = (1-K)E_0$ (energía absorbida por el blanco).
4. $v_{\text{rec}} = \frac{2M_1}{M_1+M_2}v_0$ (cinemática de retroceso).

### Valores verificados ($\theta = 170^\circ$, $E_0 = 2.0\,\text{MeV}$)
| Blanco | Masa $M_2$ | Factor $K$ | Energía rebote $E_1$ | Energía absorbida $E_{\text{rec}}$ | Retroceso $v_{\text{rec}}$ | Diagnóstico |
|---|:---:|:---:|:---:|:---:|:---:|---|
| **Carbono ($^{12}\text{C}$)** | $12\,\text{u}$ | $0.2525$ | $0.505\,\text{MeV}$ ($25.3\%$) | **$1.495\,\text{MeV}$ ($74.7\%$)** | $0.500\,v_0$ | Blanco ligero: absorbe gran parte del impacto. |
| **Silicio ($^{28}\text{Si}$)** | $28\,\text{u}$ | $0.5649$ | $1.130\,\text{MeV}$ ($56.5\%$) | **$0.870\,\text{MeV}$ ($43.5\%$)** | $0.250\,v_0$ | Pérdida moderada de energía. |
| **Hierro ($^{56}\text{Fe}$)** | $56\,\text{u}$ | $0.7527$ | $1.505\,\text{MeV}$ ($75.3\%$) | **$0.495\,\text{MeV}$ ($24.7\%$)** | $0.133\,v_0$ | Blanco metálico medio. |
| **Plata ($^{108}\text{Ag}$)** | $108\,\text{u}$ | $0.8632$ | $1.726\,\text{MeV}$ ($86.3\%$) | **$0.274\,\text{MeV}$ ($13.7\%$)** | $0.071\,v_0$ | Retiene la mayor parte de la energía. |
| **Oro ($^{197}\text{Au}$)** | $197\,\text{u}$ | $0.9226$ | $1.845\,\text{MeV}$ ($92.3\%$) | **$0.155\,\text{MeV}$ ($7.7\%$)** | $0.040\,v_0$ | Blanco muy pesado: la alfa rebota casi intacta. |

### Límite cinemático y técnica ERDA
Para blancos más ligeros que el proyectil ($M_2 < M_1 = 4\,\text{u}$, como $^1\text{H}$ o $^2\text{H}$), la raíz $\sqrt{M_2^2 - M_1^2 \sin^2\theta}$ no tiene solución real para ángulos hacia atrás ($\theta > 90^\circ$). RBS convencional no detecta hidrógeno; para ello se emplea **ERDA** (*Elastic Recoil Detection Analysis*), detectando los núcleos de retroceso proyectados hacia adelante ($\theta < 90^\circ$).

---

## 3. Panel C — Espectro RBS y Cuantificación de Superficie

### Desacoplamiento de identidad y cantidad
1. **Posición del pico ($E_1 = K \cdot E_0$):** Identifica unívocamente la masa nuclear $M_2$ (invariante ante la concentración).
2. **Área o Rendimiento del pico ($A_i \propto N_i Z_2^2$):** Determina la concentración atómica superficial $N_i$ (átomos/$\text{cm}^2$).

### Sección eficaz diferencial de Coulomb
$$\frac{d\sigma}{d\Omega} = \left(\frac{Z_1 Z_2 ke^2}{4E_0}\right)^2 \frac{1}{\sin^4(\theta/2)} \;\propto\; Z_2^2$$
*Sensibilidad relativa:* A igual densidad atómica, la señal del oro frente al carbono es:
$$\frac{\sigma_{\text{Au}}}{\sigma_{\text{C}}} = \left(\frac{79}{6}\right)^2 \approx \mathbf{173.4\times}$$

### Cuantificación estequiométrica no destructiva (*Standardless*)
Dado que $\sigma \propto Z_2^2$ surge de primeros principios de Coulomb, RBS deduce la fórmula química exacta **sin destruir la muestra ni requerir patrones de calibración**:
$$\frac{N_A}{N_B} = \frac{A_A / Z_A^2}{A_B / Z_B^2}$$
*Materiales reales integrados:* $\text{Fe}_3\text{C}$ (Cementita / Acero), $\text{Au}_2\text{Si}$ (Siliciuro de oro), $\text{SiC}$ (Carburo de silicio), $\text{Ag}_3\text{Au}$ (Electrum).

---

## 4. Panel D — Adquisición Estocástica y Perfilado en Profundidad ($[S]$)

### Parámetros físicos del haz
- **Energía $E_0$ (Alcance y profundidad):** A mayor $E_0$, las partículas $\alpha$ tienen mayor energía para vencer el frenado inelástico de los electrones ($R \propto \int \frac{dE}{dE/dx}$, alcanzando desde $\sim 1.5\,\mu\text{m}$ a $1\,\text{MeV}$ hasta $>8\,\mu\text{m}$ a $3\,\text{MeV}$). Se mantiene $E_0 \le 3.0\,\text{MeV}$ para no superar la barrera de Coulomb nuclear y asegurar repulsión $100\%$ pura.
- **Corriente $I$ (Flujo y convergencia de Poisson):** Rige el flujo de proyectiles ($\dot{N}_{\text{haz}} = \frac{I}{Z_1 e} \approx 6.24 \times 10^{10} \text{ alfas/s}$ a $20\,\text{nA}$). La incertidumbre de Poisson $\frac{\sigma_N}{N} = \frac{1}{\sqrt{N}}$ decrece al acumular cuentas, convergiendo el espectro suavemente.

### Factor de Parada $[S]$ y espesor nanométrico ($x$)
El frenado inelástico continuo ($dE/dx$) ensancha cada pico en una meseta de energía:
$$\Delta E = [S] \cdot x, \qquad [S] = \left[\frac{K}{\cos\theta_{\text{in}}}\left(\frac{dE}{dx}\right)_{\text{in}} + \frac{1}{\cos\theta_{\text{out}}}\left(\frac{dE}{dx}\right)_{\text{out}}\right]$$
El Factor de Parada $[S]$ (en $\text{eV/\AA}$) transforma directamente la anchura $\Delta E$ en el espesor físico $x$ ($40\,\text{nm}$ por estrato en la muestra de $0\text{--}200\,\text{nm}$).

### Triple desacoplamiento no destructivo
En una sola medición no destructiva, RBS determina simultáneamente:
1. **Identidad química ($M_2$):** Borde superior en energía ($E_{\text{borde}} = K E_0$).
2. **Estequiometría ($N_i$):** Área bajo la curva ($A_i \propto N_i Z_2^2$).
3. **Espesor ($x$):** Anchura del peak ($\Delta E = [S] \cdot x$).

---

## 5. Panel E — Hadronterapia, Pico de Bragg y Medicina Nuclear

### Principio de pérdida de energía (Bethe-Bloch simplificado)
La tasa de frenado electrónico de un ion pesado en tejido biológico sigue la proporcionalidad fundamental:
$$-\frac{dE}{dx} \;\propto\; \frac{z^2}{v^2}$$
Al penetrar en el tejido, la partícula pierde velocidad ($v$ disminuye), lo que provoca que la pérdida de energía $-\frac{dE}{dx}$ aumente bruscamente justo antes de detenerse, formando el **Pico de Bragg**.

### Ventaja clínica frente a los Rayos X
- **Rayos X convencionales ($6\,\text{MV}$):** Decaimiento exponencial continuo ($I = I_0 e^{-\mu x}$). Depositan la dosis máxima en la piel y tejidos sanos de entrada, y continúan irradiando detrás del tumor.
- **Hadronterapia (Protones e Iones $^{12}\mathrm{C}^{6+}$):** Dosis baja en la entrada, máxima concentración en el tumor (pico milimétrico) y **dosis cero detrás del tumor**.
- **Iones de Carbono ($z=6 \implies z^2=36$):** Generan una alta densidad de ionización terminal (LET), provocando roturas dobles irreversibles en el ADN de tumores radiorresistentes.

### Spread-Out Bragg Peak (SOBP)
Un pico monoenergético mide apenas $2\text{--}5\,\text{mm}$. Para cubrir tumores voluminosos, se modula y superpone una familia de haces a diferentes energías, generando una meseta de dosis homogénea conocida como **SOBP**.

### Vínculo histórico con Rutherford
En 1912, **Georg de Hevesy** concibió el principio de los radiotrazadores en el laboratorio de Rutherford en Manchester. Este concepto sentó las bases de la medicina nuclear diagnóstica moderna: **PET** ($^{18}\text{F}$, fotones de aniquilación de $511\,\text{keV}$) y **SPECT** ($^{99m}\text{Tc}$, rayos $\gamma$ de $140.5\,\text{keV}$).

---

## 6. El Hilo Cuántico: De la Crisis de Larmor a la Cuantización de Bohr

### La paradoja del átomo clásico
El experimento de Rutherford (1911) demostró el núcleo atómico usando mecánica clásica newtoniana. Sin embargo, este modelo planetario generó una **crisis teórica insalvable**:
1. **Aceleración centrípeta:** El electrón orbital tiene aceleración continua $a = v^2/r$.
2. **Radiación de Larmor:** Por electromagnetismo clásico de Maxwell y Larmor, toda carga acelerada emite potencia radiada:
   $$P = \frac{e^2 a^2}{6\pi \varepsilon_0 c^3}$$
3. **Colapso instantáneo:** Al perder energía mecánica sin cesar, el electrón caería en espiral hasta colapsar contra el núcleo en:
   $$\tau \approx 1.6 \times 10^{-11}\,\text{segundos}$$
4. **La resolución de Bohr (1913):** Para explicar por qué la materia es estable y emite espectros de líneas discretas, Niels Bohr fusionó el núcleo de Rutherford con la constante $h$ de Planck, postulando órbitas estacionarias cuantizadas con momento angular $L = n\hbar$ y niveles $E_n = -\frac{13.6}{n^2}\,\text{eV}$.

### Coincidencia cuántica de Gordon (1928)
Walter Gordon demostró mediante la ecuación de Schrödinger que, para un potencial coulombiano puro $V(r) \propto 1/r$, la sección eficaz diferencial cuántica en primera aproximación de Born coincide exactamente con la fórmula clásica de Rutherford. Esto valida matemáticamente el uso de la física clásica en el análisis cuantitativo de RBS.

---

## 7. Técnicas IBA y su Vínculo Cuántico

| Técnica | Fenómeno Físico Base | ¿Requiere Mecánica Cuántica? | Aplicación Principal |
|---|---|:---:|---|
| **RBS** (*Rutherford Backscattering*) | Dispersión elástica de Coulomb ($1/r$) | **No** (resultado clásico coincide con QM por Gordon) | Estequiometría y perfilado de elementos medianos y pesados. |
| **ERDA** (*Elastic Recoil Detection*) | Retroceso cinemático hacia adelante ($\theta < 90^\circ$) | **No** (cinemática elástica clásica) | Detección y perfilado de Hidrógeno ($^1\text{H}$, $^2\text{H}$) y elementos ligeros. |
| **NRA / RNRA** (*Nuclear Reaction Analysis*) | Reacciones nucleares y resonancias de Breit-Wigner | **Sí** (efecto túnel de Gamow y niveles nucleares cuantizados) | Perfilado isotópico de $^{12}\text{C}$, $^{16}\text{O}$, $^{15}\text{N}$ con resolución nanométrica. |
| **PIXE** (*Particle-Induced X-ray Emission*) | Ionización de capas internas y emisión de rayos X | **Sí** (niveles electrónicos atómicos discretos) | Análisis multielemental de trazas a nivel de ppm (partes por millón). |

---

## 8. Tabla de Fórmulas y Valores Esenciales Verificados

| Magnitud / Fórmula | Expresión Matemática | Valor de Referencia |
|---|:---:|:---:|
| Constante de Coulomb atómica | $ke^2 = \frac{e^2}{4\pi\varepsilon_0}$ | $1.439965\,\text{MeV·fm} \approx 1.44\,\text{MeV·fm}$ |
| Parámetro característico | $a_0 = \frac{Z_1 Z_2 ke^2}{2E_0}$ | $16.25\,\text{fm}$ (Au, $7\,\text{MeV}$) |
| Parámetro de impacto | $b(\theta) = a_0 \cot(\theta/2)$ | $b(143^\circ) \approx 5.0\,\text{fm}$ |
| Deflexión máxima Thomson | $\theta_{\max} \approx a_0 / R$ | $6.4 \times 10^{-3}{^\circ}$ |
| Factor cinemático | $K = \left[\frac{\sqrt{M_2^2 - M_1^2 \sin^2\theta} + M_1 \cos\theta}{M_1 + M_2}\right]^2$ | $K(\text{Au}, 170^\circ) = 0.9226$ |
| Rendimiento canónico de Chu | $A_i = Q N_i \left(\frac{d\sigma}{d\Omega}\right)_i \Delta\Omega$ | $\sigma_{\text{Au}}/\sigma_{\text{C}} \approx 173.4$ |
| Perfil de profundidad | $\Delta E = [S] \cdot x$ | Relaciona anchura de pico con nanómetros |
| Pérdida de energía de Bethe | $-\frac{dE}{dx} \propto \frac{z^2}{v^2}$ | Origen del Pico de Bragg |
| Tiempo de colapso de Larmor | $\tau = \frac{m_e^2 c^3 r_0^3}{4 k^2 e^4}$ | $\approx 1.6 \times 10^{-11}\,\text{s}$ |

---

## 9. Glosario Técnico Rápido

- **Partícula Alfa ($\alpha$):** Núcleo de Helio-4 ($^4_2\text{He}^{2+}$, $Z_1=2$, $M_1 \approx 4.0015\,\text{u}$).
- **Parámetro de Impacto ($b$):** Distancia perpendicular inicial entre la trayectoria del proyectil y el centro del núcleo blanco.
- **Factor Cinemático ($K$):** Razón entre la energía cinética del proyectil tras el rebote y su energía incidente ($E_1/E_0$).
- **Sección Eficaz Diferencial ($\frac{d\sigma}{d\Omega}$):** Medida de la probabilidad geométrica de que una partícula sea dispersada en un ángulo sólido $d\Omega$.
- **Pico de Bragg:** Máximo estrecho de ionización y deposición de energía que ocurre al final del trayecto de una partícula cargada pesada.
- **Factor de Parada ($[S]$):** Parámetro cinemático-energético que cuantifica la pérdida de energía por unidad de longitud en una muestra.
- **Efecto Túnel Cuántico:** Fenómeno no clásico donde una partícula atraviesa una barrera de potencial mayor que su energía cinética ($T \approx e^{-2G}$).
- **Cuantización de Bohr:** Postulado según el cual el momento angular orbital solo adopta valores discretos $L = n\hbar$, evitando la radiación continua del electrón.

---

*Documento complementario de estudio para la Evaluación 2 (Módulo 2: Teoría Cuántica Temprana). Sincronizado y verificado con `index.html`.*

