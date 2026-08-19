# Compendio Maestro: Fundamentos Físicos, Deducciones Matemáticas y Metrología Nuclear del Proyecto Rutherford → RBS

**Memoria de Estudio, Referencia Académica y Metodología Teórica**  
*Módulo 2: Teoría Cuántica Temprana — Diplomado en Física Moderna*  
*Proyecto: De la Dispersión de Rutherford a la Espectrometría RBS y Hadronterapia*

---

## 1. Nomenclatura, Parámetros y Unidades Físicas

En el análisis de haces de iones (IBA, *Ion Beam Analysis*) y física nuclear temprana se utilizan sistemas de unidades adaptados a las escalas atómica y subatómica para evitar órdenes de magnitud extremos ($10^{-34}\text{ J}\cdot\text{s}$, $10^{-19}\text{ C}$, $10^{-27}\text{ kg}$).

### Tabla 1.1: Glosario de Parámetros, Símbolos y Unidades

| Símbolo | Nombre del Parámetro | Significado Físico | Unidad SI | Unidad Nuclear / IBA | Valor o Equivalencia Típica |
|---|---|---|---|---|---|
| $Z_1$ | Número atómico del proyectil | Número de protones del ion incidente | Adimensional | Adimensional | $Z_1 = 2$ ($^4\text{He}^{2+}$, partícula $\alpha$), $Z_1 = 1$ ($^1\text{H}^+$, protón) |
| $Z_2$ | Número atómico del blanco | Carga nuclear del átomo receptor en la muestra | Adimensional | Adimensional | C ($6$), Si ($14$), Fe ($26$), Ag ($47$), Au ($79$) |
| $M_1$ | Masa del proyectil | Masa del ion incidente | $\text{kg}$ | $\text{u}$ (uma) | $M_1 \approx 4.0015\text{ u}$ ($\alpha$), $1.0073\text{ u}$ (protón) |
| $M_2$ | Masa del núcleo blanco | Masa del átomo colisionado en la muestra | $\text{kg}$ | $\text{u}$ (uma) | C ($12.011$), Si ($28.085$), Au ($196.967\text{ u}$) |
| $E_0$ | Energía incidente del haz | Energía cinética inicial del ion antes del impacto | $\text{J}$ | $\text{MeV}$ o $\text{keV}$ | $2.000\text{ MeV}$ (RBS), $7.0\text{ MeV}$ (Geiger-Marsden) |
| $E_1$ | Energía retrodispersada | Energía cinética del proyectil tras la colisión | $\text{J}$ | $\text{MeV}$ o $\text{keV}$ | $E_1 = K \cdot E_0 < E_0$ |
| $K$ | Factor cinemático | Fracción de energía cinética retenida por el proyectil | Adimensional | Adimensional | $0 < K \le 1$ ($K_{\text{Au}} = 0.9226$, $K_{\text{C}} = 0.2525$) |
| $\theta$ | Ángulo de dispersión | Ángulo polar de deflexión en el sistema del laboratorio | $\text{rad}$ | Grados ($^\circ$) | $\theta_{\text{det}} = 170^\circ$ (Geometría estándar RBS) |
| $b$ | Parámetro de impacto | Distancia perpendicular desde el núcleo a la línea de vuelo inicial | $\text{m}$ | $\text{fm}$ o $\text{\AA}$ | $1\text{ fm} = 10^{-15}\text{ m}$, $1\text{ \AA} = 10^{-10}\text{ m} = 10^5\text{ fm}$ |
| $a_0$ | Parámetro de Rutherford | Distancia de máximo acercamiento en choque frontal ($b=0$) | $\text{m}$ | $\text{fm}$ | $a_0 = \frac{Z_1 Z_2 k e^2}{2 E_0}$ ($\approx 16.25\text{ fm}$ para Au a $7\text{ MeV}$) |
| $k e^2$ | Constante de Coulomb $\times e^2$ | Fuerza del acoplamiento electrostático | $\text{J}\cdot\text{m}$ | $\text{MeV}\cdot\text{fm}$ | $k e^2 = \frac{e^2}{4\pi\varepsilon_0} \approx 1.439965\text{ MeV}\cdot\text{fm}$ |
| $\sigma(\theta)$ | Sección eficaz diferencial | Probabilidad por unidad de ángulo sólido de dispersión a $\theta$ | $\text{m}^2/\text{sr}$ | $\text{barn}/\text{sr}$ | $1\text{ barn} = 10^{-28}\text{ m}^2 = 100\text{ fm}^2$ |
| $dE/dx$ | Poder de frenado (*Stopping Power*) | Pérdida media de energía por unidad de longitud recorrida | $\text{J}/\text{m}$ | $\text{eV}/\text{\AA}$ o $\text{keV}/\text{nm}$ | Típico: $20 - 80\text{ eV}/\text{\AA}$ en sólidos para $\alpha$ de $2\text{ MeV}$ |
| $[S]$ | Factor cinemático de frenado | Relación entre diferencia de energía $\Delta E$ y profundidad $x$ | $\text{J}/\text{m}$ | $\text{eV}/\text{\AA}$ o $\text{keV}/\text{nm}$ | $[S] = \frac{K}{\cos\theta_1}(dE/dx)_{\text{in}} + \frac{1}{\cos\theta_2}(dE/dx)_{\text{out}}$ |
| $[\varepsilon]$ | Sección eficaz de parada | Pérdida de energía por densidad atómica de área | $\text{J}\cdot\text{m}^2$ | $\text{eV}\cdot\text{cm}^2/10^{15}\text{ átomos}$ | $[\varepsilon] \equiv \frac{1}{N_{\text{vol}}} [S]$ |
| $Q$ | Carga total integrada | Número total de partículas incidentes acumuladas en el análisis | $\text{C}$ (Coulomb) | $\mu\text{C}$ o $\text{nA}\cdot\text{s}$ | $Q = \int I \, dt$ ($1\text{ \mu C} \approx 3.12 \times 10^{12}$ partículas $\alpha$) |
| $I$ | Corriente del haz | Tasa de partículas cargadas por segundo | $\text{A}$ | $\text{nA}$ ($10^{-9}\text{ A}$) | $10\text{ nA}$ de $\text{He}^{2+} \implies \frac{10\times 10^{-9}}{2(1.602\times 10^{-19})} \approx 3.12\times 10^{10}\text{ part/s}$ |
| $\Omega$ | Ángulo sólido del detector | Cobertura angular geométrica del detector de silicio | $\text{sr}$ (estereorradián) | $\text{msr}$ ($10^{-3}\text{ sr}$) | Típico en RBS: $1 - 10\text{ msr}$ |
| $I_{\text{ion}}$ | Potencial medio de excitación | Energía media de transición electrónica del medio absorbente | $\text{J}$ | $\text{eV}$ | Agua: $79.7\text{ eV}$, Silicio: $173\text{ eV}$, Oro: $790\text{ eV}$ |
| $\beta, \gamma$ | Parámetros relativistas | $\beta = v/c$ (fracción velocidad luz), $\gamma = 1/\sqrt{1-\beta^2}$ | Adimensional | Adimensional | Protones $150\text{ MeV} \implies \beta \approx 0.506$, $\gamma \approx 1.16$ |

---

## 2. Deducciones Matemáticas Formales Paso a Paso

---

### Deducción 2.1: Deflexión Angular Máxima en el Modelo Atómico de Thomson (1904)

**Objetivo:** Demostrar por qué el modelo de Thomson es matemáticamente incapaz de explicar rebotes en ángulos grandes.

**Hipótesis de Thomson:** El átomo es una esfera de radio $R \approx 1.45\text{ \AA} = 1.45 \times 10^{-10}\text{ m}$ con densidad de carga homogénea $\rho = \frac{+Z_2 e}{\frac{4}{3}\pi R^3}$.

1. **Campo eléctrico interior mediante Ley de Gauss:**  
   Para una superficie gaussiana esférica concéntrica de radio $r \le R$:
   $$\oint \vec{E} \cdot d\vec{A} = E(r) \cdot 4\pi r^2 = \frac{Q_{\text{enc}}}{\varepsilon_0} = \frac{\rho \cdot \frac{4}{3}\pi r^3}{\varepsilon_0} = \frac{Z_2 e}{\varepsilon_0} \frac{r^3}{R^3}$$
   $$\implies \vec{E}(r) = \frac{Z_2 e}{4\pi\varepsilon_0 R^3} \vec{r} = \frac{k Z_2 e}{R^3}\vec{r}$$

2. **Fuerza transversal sobre la partícula $\alpha$ ($q = Z_1 e$):**  
   Si la partícula se mueve a lo largo de una línea casi recta paralela al eje $x$ con parámetro de impacto $b$ ($r^2 = x^2 + b^2$):
   $$F_\perp(x) = Z_1 e \cdot E_\perp = Z_1 e \left(\frac{k Z_2 e}{R^3} b\right) = \frac{k Z_1 Z_2 e^2 b}{R^3}$$
   *Nota fundamental:* Dentro de la esfera, la fuerza transversal $F_\perp$ es **constante** para un $b$ dado, independientemente de la coordenada longitudinal $x$.

3. **Tiempo de tránsito $T$ dentro del átomo:**  
   La partícula ingresa en $x = -\sqrt{R^2 - b^2}$ y sale en $x = +\sqrt{R^2 - b^2}$. A velocidad $v_0 = \sqrt{2E_0 / M_1}$:
   $$L = 2\sqrt{R^2 - b^2} \implies \Delta t = \frac{2\sqrt{R^2 - b^2}}{v_0}$$

4. **Momento transversal transferido ($\Delta p_\perp$):**
   $$\Delta p_\perp = F_\perp \cdot \Delta t = \left( \frac{k Z_1 Z_2 e^2 b}{R^3} \right) \left( \frac{2\sqrt{R^2 - b^2}}{v_0} \right) = \frac{2 k Z_1 Z_2 e^2}{R^3 v_0} b \sqrt{R^2 - b^2}$$

5. **Ángulo de deflexión $\theta_{\text{Thomson}}$ (aproximación de ángulo pequeño $\theta \approx \Delta p_\perp / p_\parallel$):**  
   Recordando que $p_\parallel = M_1 v_0$ y $E_0 = \frac{1}{2} M_1 v_0^2 \implies p_\parallel v_0 = 2 E_0$:
   $$\theta(b) \approx \frac{\Delta p_\perp}{M_1 v_0} = \frac{2 k Z_1 Z_2 e^2}{M_1 v_0^2 R^3} b \sqrt{R^2 - b^2} = \frac{k Z_1 Z_2 e^2}{E_0 R^3} b \sqrt{R^2 - b^2}$$

6. **Maximización del ángulo respecto a $b$:**
   $$\frac{d}{db}\left(b\sqrt{R^2 - b^2}\right) = \sqrt{R^2 - b^2} - \frac{b^2}{\sqrt{R^2 - b^2}} = \frac{R^2 - 2b^2}{\sqrt{R^2 - b^2}} = 0 \implies b_{\text{max}} = \frac{R}{\sqrt{2}}$$
   Evaluando en $b_{\text{max}}$:
   $$\left[ b\sqrt{R^2 - b^2} \right]_{b = R/\sqrt{2}} = \frac{R}{\sqrt{2}} \frac{R}{\sqrt{2}} = \frac{R^2}{2}$$
   $$\implies \theta_{\text{max, Thomson}} = \frac{k Z_1 Z_2 e^2}{E_0 R^3} \left(\frac{R^2}{2}\right) = \frac{k Z_1 Z_2 e^2}{2 E_0 R} = \frac{a_0}{R}$$

7. **Cálculo numérico para Oro ($Z_2=79$, $E_0=7\text{ MeV}$, $R=1.45\text{ \AA}$):**
   $$a_0 = \frac{(2)(79)(1.439965\text{ MeV}\cdot\text{fm})}{2(7.0\text{ MeV})} = 16.251\text{ fm}$$
   $$\theta_{\text{max, Thomson}} = \frac{16.251\text{ fm}}{145{,}000\text{ fm}} = 1.1207 \times 10^{-4}\text{ rad} = 0.006421^\circ \quad \blacksquare$$

---

### Deducción 2.2: Dispersión de Coulomb y Parámetro de Impacto $b(\theta)$

**Objetivo:** Obtener analíticamente la trayectoria hiperbólica y la relación $b(\theta) = a_0 \cot(\theta/2)$ en el potencial repulsivo $V(r) = \frac{k Z_1 Z_2 e^2}{r}$.

1. **Conservación del momento angular y de la energía:**
   $$L = M_1 r^2 \dot{\phi} = M_1 v_0 b \implies \dot{\phi} = \frac{v_0 b}{r^2}$$
   $$E = \frac{1}{2} M_1 \left( \dot{r}^2 + r^2 \dot{\phi}^2 \right) + \frac{k Z_1 Z_2 e^2}{r} = \frac{1}{2} M_1 v_0^2$$

2. **Cambio de variable a la ecuación de Binet ($u(\phi) = 1/r(\phi)$):**
   $$\dot{r} = \frac{dr}{d\phi}\dot{\phi} = -\frac{1}{u^2}\frac{du}{d\phi} (v_0 b u^2) = -v_0 b \frac{du}{d\phi}$$
   Sustituyendo en la ecuación de energía:
   $$\frac{1}{2} M_1 \left[ \left(-v_0 b \frac{du}{d\phi}\right)^2 + \left(\frac{1}{u}\right)^2 (v_0 b u^2)^2 \right] + k Z_1 Z_2 e^2 u = \frac{1}{2} M_1 v_0^2$$
   Dividiendo por $\frac{1}{2} M_1 v_0^2 b^2$:
   $$\left(\frac{du}{d\phi}\right)^2 + u^2 + \frac{2 k Z_1 Z_2 e^2}{M_1 v_0^2 b^2} u = \frac{1}{b^2}$$
   Definiendo la distancia de máximo acercamiento $a_0 = \frac{k Z_1 Z_2 e^2}{2 E_0} = \frac{k Z_1 Z_2 e^2}{M_1 v_0^2}$:
   $$\left(\frac{du}{d\phi}\right)^2 + u^2 + \frac{2 a_0}{b^2} u = \frac{1}{b^2}$$
   Completando cuadrados:
   $$\left(\frac{du}{d\phi}\right)^2 + \left(u + \frac{a_0}{b^2}\right)^2 = \frac{1}{b^2} + \frac{a_0^2}{b^4} = \frac{b^2 + a_0^2}{b^4} \equiv \frac{\epsilon^2 a_0^2}{b^4}$$
   donde $\epsilon = \sqrt{1 + (b/a_0)^2}$ es la **excentricidad de la hipérbola** ($\epsilon > 1$).

3. **Solución geométrica de la órbita:**
   $$u(\phi) = \frac{1}{r(\phi)} = \frac{a_0}{b^2} \left[ \epsilon \cos(\phi - \phi_0) - 1 \right]$$
   Eligiendo el perihelio (máximo acercamiento $r_{\text{min}}$) en $\phi = 0$:
   $$r(\phi) = \frac{b^2 / a_0}{\epsilon \cos\phi - 1}$$

4. **Direcciones asintóticas ($r \to \infty \implies u \to 0$):**
   $$\epsilon \cos\phi_\infty - 1 = 0 \implies \cos\phi_\infty = \frac{1}{\epsilon} = \frac{1}{\sqrt{1 + (b/a_0)^2}}$$
   Geométricamente, el ángulo de dispersión total $\theta$ es:
   $$\theta = \pi - 2\phi_\infty \implies \phi_\infty = \frac{\pi - \theta}{2} = \frac{\pi}{2} - \frac{\theta}{2}$$
   $$\implies \cos\phi_\infty = \cos\left(\frac{\pi}{2} - \frac{\theta}{2}\right) = \sin\left(\frac{\theta}{2}\right)$$
   Igualando con $\cos\phi_\infty = 1/\sqrt{1 + (b/a_0)^2}$:
   $$\sin^2\left(\frac{\theta}{2}\right) = \frac{1}{1 + (b/a_0)^2} \implies 1 + \left(\frac{b}{a_0}\right)^2 = \frac{1}{\sin^2(\theta/2)} = \csc^2\left(\frac{\theta}{2}\right)$$
   $$\left(\frac{b}{a_0}\right)^2 = \csc^2\left(\frac{\theta}{2}\right) - 1 = \cot^2\left(\frac{\theta}{2}\right)$$
   Tomando la raíz positiva ($b > 0$, $\theta \in (0, \pi]$):
   $$b(\theta) = a_0 \cot\left(\frac{\theta}{2}\right) \quad \blacksquare$$

---

### Deducción 2.3: Sección Eficaz Diferencial de Rutherford

1. Las partículas que inciden en el anillo de área diferencial $d\sigma = 2\pi b \, db$ emergen dentro del ángulo sólido $d\Omega = 2\pi \sin\theta \, d\theta$.
2. Por conservación del flujo:
   $$\frac{d\sigma}{d\Omega} = \frac{2\pi b \, |db|}{2\pi \sin\theta \, d\theta} = \frac{b}{\sin\theta} \left| \frac{db}{d\theta} \right|$$
3. Derivando $b(\theta) = a_0 \cot(\theta/2)$:
   $$\frac{db}{d\theta} = a_0 \left( -\frac{1}{2} \csc^2\left(\frac{\theta}{2}\right) \right) = -\frac{a_0}{2 \sin^2(\theta/2)}$$
4. Sustituyendo y usando $\sin\theta = 2 \sin(\theta/2)\cos(\theta/2)$:
   $$\frac{d\sigma}{d\Omega} = \frac{a_0 \cot(\theta/2)}{2 \sin(\theta/2)\cos(\theta/2)} \cdot \frac{a_0}{2 \sin^2(\theta/2)} = \frac{a_0^2 \frac{\cos(\theta/2)}{\sin(\theta/2)}}{4 \sin^3(\theta/2)\cos(\theta/2)} = \frac{a_0^2}{4 \sin^4(\theta/2)}$$
5. Sustituyendo $a_0 = \frac{Z_1 Z_2 k e^2}{2 E_0}$:
   $$\frac{d\sigma}{d\Omega}(\theta) = \left( \frac{Z_1 Z_2 k e^2}{4 E_0} \right)^2 \frac{1}{\sin^4(\theta/2)} \quad \blacksquare$$

---

### Deducción 2.4: Factor Cinemático $K(M_1, M_2, \theta)$ de RBS

**Objetivo:** Deducir analíticamente la fracción de energía $K \equiv E_1/E_0$ retenida por el proyectil tras una colisión elástica 2D con un blanco inicialmente en reposo.

1. **Conservación del momento y energía en el marco del laboratorio:**
   * Eje $x$ (longitudinal): $M_1 v_0 = M_1 v_1 \cos\theta + M_2 v_2 \cos\phi \implies M_2 v_2 \cos\phi = M_1(v_0 - v_1 \cos\theta)$
   * Eje $y$ (transversal): $0 = M_1 v_1 \sin\theta - M_2 v_2 \sin\phi \implies M_2 v_2 \sin\phi = M_1 v_1 \sin\theta$
   * Energía cinética: $\frac{1}{2} M_1 v_0^2 = \frac{1}{2} M_1 v_1^2 + \frac{1}{2} M_2 v_2^2 \implies M_2 v_2^2 = M_1(v_0^2 - v_1^2)$

2. **Eliminación del ángulo de retroceso $\phi$:**
   $$(M_2 v_2 \cos\phi)^2 + (M_2 v_2 \sin\phi)^2 = (M_2 v_2)^2$$
   $$M_1^2(v_0 - v_1 \cos\theta)^2 + M_1^2 v_1^2 \sin^2\theta = M_2 \cdot \left[M_2 v_2^2\right]$$
   $$M_1^2(v_0^2 - 2 v_0 v_1 \cos\theta + v_1^2 \cos^2\theta + v_1^2 \sin^2\theta) = M_2 \cdot \left[M_1(v_0^2 - v_1^2)\right]$$
   $$M_1^2(v_0^2 - 2 v_0 v_1 \cos\theta + v_1^2) = M_1 M_2(v_0^2 - v_1^2)$$

3. **División por $M_1 v_0^2$ y definición de $x \equiv v_1 / v_0 = \sqrt{K}$:**
   $$M_1 (1 - 2 x \cos\theta + x^2) = M_2 (1 - x^2)$$
   $$(M_1 + M_2) x^2 - (2 M_1 \cos\theta) x - (M_2 - M_1) = 0$$

4. **Resolución de la ecuación de segundo grado:**
   $$x = \frac{2 M_1 \cos\theta \pm \sqrt{4 M_1^2 \cos^2\theta + 4 (M_1 + M_2)(M_2 - M_1)}}{2 (M_1 + M_2)}$$
   Simplificando el discriminante dentro del radical:
   $$M_1^2 \cos^2\theta + (M_2^2 - M_1^2) = M_2^2 - M_1^2(1 - \cos^2\theta) = M_2^2 - M_1^2 \sin^2\theta$$
   Tomando la solución física positiva ($x > 0$):
   $$x = \frac{M_1 \cos\theta + \sqrt{M_2^2 - M_1^2 \sin^2\theta}}{M_1 + M_2}$$

5. **Elevando al cuadrado ($K = x^2 = E_1 / E_0$):**
   $$K(M_2, \theta) = \left[ \frac{\sqrt{M_2^2 - M_1^2 \sin^2\theta} + M_1 \cos\theta}{M_1 + M_2} \right]^2 \quad \blacksquare$$

---

### Deducción 2.5: Ecuación Relativista de Bethe-Bloch y Curva de Bragg

1. En una colisión cuántica inelástica entre un proyectil pesado de carga $z e$ y velocidad $v = \beta c$ y los electrones atómicos del blanco ($Z, A$), la transferencia diferencial de energía promedio integrada sobre todos los parámetros de impacto cuánticamente permitidos da:
   $$-\frac{dE}{dx} = 4\pi N_A r_e^2 m_e c^2 \cdot \rho \frac{Z}{A} \frac{z^2}{\beta^2} \left[ \frac{1}{2} \ln \left( \frac{2 m_e c^2 \beta^2 \gamma^2 W_{\text{max}}}{I^2} \right) - \beta^2 - \frac{\delta}{2} \right]$$
2. **Dependencia asintótica con la velocidad:**  
   A bajas energías no relativistas ($\beta \ll 1, \gamma \approx 1$):
   $$\ln\left(\frac{2 m_e v^2 W_{\text{max}}}{I^2}\right) \text{ varía muy lentamente (logarítmicamente)}$$
   El factor pre-logarítmico domina:
   $$-\frac{dE}{dx} \propto \frac{z^2}{\beta^2} \propto \frac{z^2}{v^2} \propto \frac{z^2 M_1}{E}$$
3. **Origen del Pico de Bragg:**  
   A medida que el ion penetra el tejido, pierde energía ($E \downarrow \implies v \downarrow$), lo que causa que $dE/dx \propto 1/v^2$ se dispare de forma abrupta justo antes de que el proyectil se detenga por completo ($v \to 0$).

---

## 3. Análisis e Integración de las 11 Fuentes de Referencia

A continuación se resume qué aporta específicamente cada fuente consultada y cómo valida las implementaciones del proyecto:

1. **EAG Laboratories (*RBS Tutorial: Theory and Instrumentation*)**:  
   * **Aporte clave:** Demuestra la instrumentación real con aceleradores Tandem (1 a 3 MV), la configuración de detectores de barrera de silicio (PIPS), y el uso de la aproximación de pérdida de energía superficial para cuantificación estequiométrica de películas delgadas.
   * **Uso en app:** Modela la respuesta del detector y el Factor de Parada $[S]$.

2. **CMAM - Centro de Microanálisis de Materiales (UAM, España)**:  
   * **Aporte clave:** Especificaciones de la línea experimental de 5 MV con haz de $\text{He}^+$ y $\text{H}^+$. Confirma la adopción de $\theta = 170^\circ$ (geometría IBM estándar) para evitar apantallamiento geométrico y maximizar resolución en masa.
   * **Uso en app:** Justifica el valor $\theta_{\text{det}} = 170^\circ$ en los Paneles B, C y D.

3. **ANSTO (Australian Nuclear Science and Technology Organisation)**:  
   * **Aporte clave:** Metrología no destructiva de composición elemental absoluta sin necesidad de patrones de referencia externos (*standardless quantitative analysis*), gracias a la exactitud analítica de la sección eficaz de Coulomb.
   * **Uso en app:** Fundamenta la exactitud cuantitativa de las alturas de picos.

4. **Covalent Metrology (*RBS Chemical Analysis*)**:  
   * **Aporte clave:** Rango dinámico de espesores medibles ($1\text{ nm}$ a $2\text{ \mu m}$), análisis de capas enterradas y densidad atómica de área ($10^{15}\text{ átomos/cm}^2$).
   * **Uso en app:** Diseño de la muestra multicapa C / Au / Si en el Panel D.

5. **HZDR - Helmholtz-Zentrum Dresden-Rossendorf (Ion Beam Center)**:  
   * **Aporte clave:** Análisis de daño por radiación y orientación cristalina (*Channeling* vs. *Random orientation*), así como complementariedad con ERDA para elementos ligeros.
   * **Uso en app:** Respalda las explicaciones de límites físicos para elementos ligeros ($M_2 < M_1$).

6. **Taylor & Francis (Royal Society of NZ / *Rutherford Legacy in IBA*)**:  
   * **Aporte clave:** Reconstrucción histórica rigurosa del laboratorio de Manchester (1909–1911), el rol de Ernest Marsden y Hans Geiger, y la transición conceptual de la física nuclear clásica al análisis de materiales del siglo XXI.
   * **Uso en app:** Textos del Panel A e Inset histórico de Geiger-Marsden.

7. **LibreTexts Español (*Retrodispersión de Rutherford de películas delgadas*)**:  
   * **Aporte clave:** Guía didáctica para la lectura e interpretación paso a paso de espectros RBS (escalones de sustrato, mesetas de capas delgadas, ensanchamiento por dispersión de energía).
   * **Uso en app:** Formato visual de los histogramas y espectros en los Paneles C y D.

8. **Revista TECNIA (Universidad Nacional de Ingeniería, Perú)**:  
   * **Aporte clave:** Aplicación de técnicas IBA y RBS en caracterización de semiconductores y películas delgadas en Latinoamérica, formulación de espesor de capa a partir del ancho del pico $\Delta E = [S] \cdot \Delta x$.
   * **Uso en app:** Valida la terminología académica en español neutro riguroso.

9. **Another Day In The Lab (*Un evento tipo Rutherford: luchando contra la estadística*)**:  
   * **Aporte clave:** Análisis de la estadística de eventos raros (1 en 8000), distribución de Poisson ($\sigma_N = \sqrt{N}$), corriente de haz ($I$) y tiempo de adquisición. Cita célebre de Rutherford sobre el diseño experimental y la estadística.
   * **Uso en app:** Slider de corriente en el Panel D y fluctuaciones estocásticas en tiempo real.

10. **Khan Academy (*Elastic and Inelastic Collisions*)**:  
    * **Aporte clave:** Pedagogía visual y deducción vectorial de la conservación de momento lineal $\vec{p}$ y energía cinética $K$ en colisiones elásticas 2D.
    * **Uso en app:** Animación interactiva del choque en el Panel B.

11. **Wilson (1946) & PDG (2022) (*Hadronterapia y Bethe-Bloch*)**:  
    * **Aporte clave:** Fundamentos de la deposición focal de dosis en tumores profundos, ventaja de iones pesados ($^{12}\text{C}^{6+}$) por alto LET ($z^2=36$) y preservación de tejido sano.
    * **Uso en app:** Física y visualización interactiva del Panel E.

---

## 4. Resumen de Fórmulas Clave para Defensa y Evaluación

$$\begin{aligned}
\text{Parámetro de Rutherford:} \quad & a_0 = \frac{Z_1 Z_2 k e^2}{2 E_0} \\[8pt]
\text{Parámetro de impacto:} \quad & b(\theta) = a_0 \cot\left(\frac{\theta}{2}\right) \\[8pt]
\text{Deflexión máxima Thomson:} \quad & \theta_{\text{max, Thomson}} = \frac{a_0}{R} \approx 0.0064^\circ \\[8pt]
\text{Factor cinemático RBS:} \quad & K(M_2, \theta) = \left[ \frac{\sqrt{M_2^2 - M_1^2 \sin^2\theta} + M_1 \cos\theta}{M_1 + M_2} \right]^2 \\[8pt]
\text{Sección eficaz relativa:} \quad & \frac{d\sigma}{d\Omega} \propto Z_2^2 \implies \frac{\text{Au}}{\text{C}} = \left(\frac{79}{6}\right)^2 \approx 173.4 \\[8pt]
\text{Conversión energía-profundidad:} \quad & \Delta E = [S] \cdot x = \left[ \frac{K}{\cos\theta_1}\left(\frac{dE}{dx}\right)_{\text{in}} + \frac{1}{\cos\theta_2}\left(\frac{dE}{dx}\right)_{\text{out}} \right] x \\[8pt]
\text{Poder de frenado de Bragg:} \quad & -\frac{dE}{dx} \propto \frac{z^2}{\beta^2} \propto \frac{z^2}{E}
\end{aligned}$$

---
*Documento compilado y validado como material de estudio integral para el Diplomado en Física Moderna.*