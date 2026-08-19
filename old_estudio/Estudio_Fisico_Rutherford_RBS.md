# Fundamentos Físicos, Conceptuales y Metrológicos del Proyecto Rutherford → RBS

**Documento de Estudio Integral y Referencia Académica**  
*Módulo 2: Teoría Cuántica Temprana — Diplomado en Física Moderna*  
*De la Dispersión de Rutherford a la Espectrometría RBS y la Hadronterapia*

---

## Resumen Ejecutivo

Este documento constituye la guía conceptual, física y analítica exhaustiva que sustenta el proyecto. Su propósito es proporcionar una comprensión académica sólida, rigurosa y accesible de cada fenómeno modelado en la aplicación web, explicando de dónde provienen las fórmulas, qué principios físicos las gobiernan, qué limitaciones experimentales existen y cómo se conectan los cinco paneles en un hilo conductor continuo: **desde el descubrimiento del núcleo atómico y la crisis de la física clásica en 1911, hasta las tecnologías analíticas de películas delgadas (RBS) y la medicina nuclear moderna (Hadronterapia y radiotrazadores).**

---

## 1. Introducción y el Hilo Conductor del Proyecto

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                   EL HILO CONDUCTOR                                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ 1904: Modelo de Thomson (Pudín de pasas) ──> Átomo continuo y difuso                     │
│                           ↓                                                              │
│ 1909: Experimento de Geiger-Marsden ───────> 1 de cada 8000 partículas alfa rebota       │
│                           ↓                                                              │
│ 1911: Modelo Nuclear de Rutherford ────────> Núcleo diminuto y denso (Panel A)           │
│                           ↓                                                              │
│  CRISIS CLÁSICA: El electrón orbitante acelera, irradia y colapsa en ~10⁻¹¹ s            │
│                           ↓                                                              │
│ 1913: Postulados de Bohr (L = nℏ) ─────────> Cuantización de órbitas y espectros         │
│                           ↓                                                              │
│ APLICACIÓN 1 (Materiales): RBS ────────────> Cinemática (Panel B) + Sección eficaz (C)   │
│                                              + Perfiles de profundidad [S] (Panel D)     │
│                           ↓                                                              │
│ APLICACIÓN 2 (Medicina): Hadronterapia ────> Curva de Bragg + Bethe-Bloch (Panel E)      │
│                                              + Radiotrazadores (de Hevesy, PET / SPECT)  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

El experimento de Rutherford no solo descubrió el núcleo atómico: **creó la necesidad de la física cuántica** al demostrar que el átomo es un sistema planetario inestable bajo las leyes de Maxwell, y al mismo tiempo sentó las bases de dos de las herramientas más potentes del siglo XXI: la caracterización no destructiva de materiales y la radioterapia de máxima precisión.

---

## 2. Panel A: El Descubrimiento del Núcleo y la Dispersión Coulombiana

### 2.1 El Modelo de Thomson (1904) y su Imposibilidad Física
A inicios del siglo XX, el modelo atómico aceptado postulaba que la carga positiva $+Z_2 e$ ocupaba uniformemente una esfera de radio atómico $R \approx 1.45\text{ \AA} = 145{,}000\text{ fm}$.

* **El campo eléctrico interior:** Por la ley de Gauss, el campo eléctrico dentro de una esfera homogénea crece linealmente desde el centro hacia afuera:
  $$E(r) = \frac{k Z_2 e}{R^3} r$$
* **Fuerza suave y continua:** Una partícula alfa ($Z_1=2$) que atraviesa la esfera con parámetro de impacto $b$ experimenta una fuerza transversal constante a lo largo de su paso.
* **El ángulo máximo calculado:** Al integrar el impulso transferido durante el tiempo de tránsito $\Delta t = 2\sqrt{R^2 - b^2} / v_0$, la deflexión angular máxima ocurre en $b = R/\sqrt{2}$ y resulta ser:
  $$\theta_{\text{max, Thomson}} = \frac{a_0}{R} = \frac{Z_1 Z_2 k e^2}{2 E_0 R}$$
  Para una lámina de oro ($Z_2 = 79$) y partículas alfa de $E_0 = 7.0\text{ MeV}$:
  $$\theta_{\text{max, Thomson}} \approx \frac{16.25\text{ fm}}{145{,}000\text{ fm}} \approx 1.12 \times 10^{-4}\text{ rad} \approx 0.0064^\circ$$
* **Significado físico:** La deflexión predicha por Thomson es una fracción diminuta de grado (invisible a escala visual, menor que un píxel). Es matemáticamente imposible que este modelo produzca rebotes hacia atrás ($\theta > 90^\circ$).

### 2.2 La Hipótesis Nuclear de Rutherford (1911)
Ante la observación de que partículas alfa rebotaban en ángulos de hasta $150^\circ$, Rutherford dedujo que toda la carga positiva $+Z_2 e$ y casi el $99.98\%$ de la masa debían estar concentradas en un volumen $100{,}000$ veces más pequeño que el átomo: el **núcleo atómico** ($r \sim 1 - 10\text{ fm}$).

Al concentrar la carga, el campo eléctrico en la vecindad del núcleo no es lineal ni suave, sino inversamente proporcional a $r^2$ (potencial de Coulomb $V \propto 1/r$), alcanzando magnitudes enormes cerca del origen.

### 2.3 Parámetros Físicos Clave del Panel A

#### 1. Distancia de Máximo Acercamiento Frontal ($a_0$)
Si una partícula alfa es disparada en línea recta hacia el centro del núcleo ($b=0$), viaja desacelerando hasta que toda su energía cinética inicial $E_0$ se convierte en energía potencial electrostática en el punto de retorno:
$$E_0 = \frac{k Z_1 Z_2 e^2}{a_0} \implies a_0 = \frac{Z_1 Z_2 k e^2}{2 E_0}$$
* Con $k e^2 = 1.44\text{ MeV}\cdot\text{fm}$, $Z_1 = 2$, $Z_2 = 79$ (Au) y $E_0 = 7.0\text{ MeV}$:
  $$a_0 = \frac{(2)(79)(1.44)}{2(7.0)} \approx 16.25\text{ fm}$$
* **Física detrás:** $a_0$ define la escala de longitud natural del choque. A mayor energía del haz ($E_0$), $a_0$ disminuye y la partícula penetra más cerca del núcleo.

#### 2. Parámetro de Impacto ($b$) y Ángulo de Dispersión ($\theta$)
El parámetro de impacto $b$ es la distancia perpendicular desde el centro del núcleo a la trayectoria rectilínea inicial del proyectil:
$$b(\theta) = a_0 \cot\left(\frac{\theta}{2}\right) \iff \theta(b) = 2 \arctan\left(\frac{a_0}{b}\right)$$
* **Impactos cercanos ($b < a_0$):** La partícula siente una repulsión violenta y se dispersa en ángulos grandes ($\theta > 90^\circ$, retrodispersión).
* **Impactos lejanos ($b \gg a_0$):** La fuerza disminuye rápidamente y la partícula pasa casi en línea recta ($\theta \to 0^\circ$).

#### 3. ¿Por qué el control es $Z_2$ (protones) y no el número de neutrones ($N$)?
La interacción que desvía la partícula es **estrictamente electromagnética** (Ley de Coulomb):
$$F = \frac{Z_1 Z_2 k e^2}{r^2}$$
* Cada **protón** nuclear porta una carga elemental $+e$, sumando una carga neta $+Z_2 e$.
* Los **neutrones** poseen carga eléctrica nula ($q=0$). Por lo tanto, no ejercen fuerza electrostática sobre la partícula alfa y no modifican la trayectoria de dispersión angular.
* El slider de la app controla $Z_2$ (de Neón $Z=10$ a Uranio $Z=92$). Al aumentarlo, la repulsión crece, $a_0$ aumenta y las trayectorias se curvan a distancias mayores.

---

## 3. Panel B: Cinemática de Colisión Elástica y el Factor Cinemático $K$

Cuando una partícula alfa ($M_1$) choca contra un núcleo blanco ($M_2$) inicialmente en reposo, no se requiere conocer los detalles del campo de fuerzas para predecir la energía final: las **leyes de conservación del momento lineal y de la energía cinética** determinan exactamente el resultado.

```
Antes del choque:
  (M1, E0, v0) ───────────────>   (M2 en reposo)

Después del choque:
        (M1, E1, v1)  ↖ θ
                        ● (M2, E_recoil) ↘ φ
```

### 3.1 Origen del Factor Cinemático $K(M_1, M_2, \theta)$
Planteando la conservación de momento en los ejes longitudinal ($x$) y transversal ($y$), junto con la conservación de energía cinética elástica, y eliminando el ángulo de retroceso del blanco $\phi$, se llega a la relación de velocidades $x = v_1 / v_0 = \sqrt{E_1 / E_0}$.

Al resolver la ecuación cuadrática resultante, se obtiene la fórmula fundamental de RBS (Chu, Mayer & Nicolet, 1978):

$$K(M_2, \theta) \equiv \frac{E_1}{E_0} = \left[ \frac{\sqrt{M_2^2 - M_1^2 \sin^2\theta} + M_1 \cos\theta}{M_1 + M_2} \right]^2$$

Donde la energía residual del proyectil detectado es simplemente:
$$E_1 = K \cdot E_0$$

### 3.2 Interpretación Física y Casos Límite

1. **Choque contra un blanco infinitamente pesado ($M_2 \gg M_1$):**
   * El término $M_2$ domina tanto en el numerador como en el denominador.
   * $K \to (M_2 / M_2)^2 = 1 \implies E_1 \approx E_0$.
   * **Analogía física:** Como lanzar una pelota de tenis contra una pared de concreto; la partícula rebota casi sin perder energía cinética.
   * En RBS: El Oro ($M_2 = 197\text{ u}$) tiene $K = 0.9226$, reteniendo el $92.3\%$ de la energía ($E_1 = 1.845\text{ MeV}$ para $E_0 = 2.0\text{ MeV}$).

2. **Choque contra un blanco liviano ($M_2 \approx M_1$):**
   * Una fracción significativa de la energía cinética se transfiere al núcleo blanco en forma de retroceso (*nuclear recoil*).
   * En choque frontal ($\theta = 180^\circ$): $K = \left(\frac{M_2 - M_1}{M_1 + M_2}\right)^2$.
   * En RBS: El Carbono ($M_2 = 12\text{ u}$) tiene $K = 0.2525$, perdiendo casi el $75\%$ de su energía en el rebote ($E_1 = 0.505\text{ MeV}$).

3. **Límite físico de retrodispersión ($M_2 < M_1$):**
   * Si el núcleo blanco es más liviano que la partícula alfa ($M_2 < 4\text{ u}$, como el Hidrógeno $M_2 = 1\text{ u}$), el término bajo el radical $M_2^2 - M_1^2 \sin^2\theta$ se vuelve negativo para ángulos grandes.
   * **Significado físico:** Una bola pesada no puede rebotar hacia atrás al chocar contra una bola más liviana en reposo; el proyectil siempre continúa hacia adelante ($\theta < \arcsin(M_2/M_1)$). Por eso RBS tradicional no detecta Hidrógeno directamente (requiere la técnica complementaria ERDA).

### 3.3 ¿Por qué el detector se coloca a $\theta = 170^\circ$?
* A $\theta = 180^\circ$, la diferencia de energía entre masas contiguas ($dK/dM_2$) es matemáticamente máxima.
* Sin embargo, colocar el detector a $180^\circ$ exactos bloquearía el haz incidente.
* La geometría estándar de laboratorio (**geometría IBM a $\theta = 170^\circ$**) ofrece el compromiso óptimo: conserva el $99.8\%$ de la resolución en masa teórica mientras permite colocar físicamente el detector de silicio a un lado del haz.

---

## 4. Panel C: Espectrometría RBS y la Sección Eficaz ($\propto Z_2^2$)

El Panel C traslada la física de una sola colisión a la **estadística de millones de partículas**, construyendo el espectro característico que ve un científico de materiales en la pantalla de su analizador multicanal.

### 4.1 La Sección Eficaz Diferencial de Rutherford
La probabilidad de que una partícula sea dispersada dentro del ángulo sólido $d\Omega$ del detector viene dada por:

$$\frac{d\sigma}{d\Omega}(\theta) = \left(\frac{Z_1 Z_2 k e^2}{4 E_0}\right)^2 \frac{1}{\sin^4(\theta/2)}$$

* **Dependencia cuadrática con la carga nuclear ($\propto Z_2^2$):**  
  La fuerza electrostática escala con $Z_2$, y como la probabilidad de dispersión depende del cuadrado de la fuerza, el número de partículas retrodispersadas es proporcional a $Z_2^2$.
* **Consecuencia metrológica directa:**  
  A igual número de átomos por $\text{cm}^2$, un elemento pesado genera picos enormemente más altos que un elemento ligero:
  $$\frac{\text{Altura del pico de Au}(Z=79)}{\text{Altura del pico de C}(Z=6)} = \left(\frac{79}{6}\right)^2 = \left(13.167\right)^2 \approx 173.4$$

### 4.2 Cómo se Lee un Espectro RBS
Un espectro RBS es un histograma de número de cuentas detectadas vs. energía de la partícula:

```
Cuentas (Intensidad ∝ Z₂²)
  │
  │                                     ┌──┐ Au (Z=79, M=197)
  │                                     │  │ E₁ = 1.845 MeV
  │                               ┌──┐  │  │ (Pico altísimo)
  │                               │Ag│  │  │
  │                         ┌──┐  │  │  │  │
  │                   ┌──┐  │Fe│  │  │  │  │
  │             ┌──┐  │Si│  │  │  │  │  │  │
  │       ┌──┐  │  │  │  │  │  │  │  │  │  │
  │       │C │  │  │  │  │  │  │  │  │  │  │
  └───────┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴────────> Energía (MeV)
         0.50  1.13  1.51  1.73  1.85  2.00 (E₀)
```

1. **Posición en el eje de energía ($E_1 = K E_0$):**  
   Identifica **qué elemento** está presente en la muestra (análisis cualitativo / masa atómica $M_2$).
2. **Área o altura del pico ($Y \propto N_{\text{at}} \cdot Z_2^2$):**  
   Permite calcular **cuánto hay** de ese elemento (análisis cuantitativo estequiométrico / concentración atómica).
3. **Característica única de RBS:**  
   Como la sección eficaz $\sigma(Z_2)$ se calcula exactamente mediante física clásica/cuántica pura sin factores empíricos, RBS es una técnica **sin necesidad de patrones de calibración externos** (*standardless quantitative analysis*).

---

## 5. Panel D: Análisis de Muestra Real en Películas Delgadas

En una muestra real multicapa (por ejemplo, una película delgada de Oro sobre un sustrato de Silicio con una capa protectora de Carbono), las partículas no solo colisionan en la superficie: **penetran en el material**.

### 5.1 Pérdida de Energía en Profundidad ($dE/dx$) y Factor de Parada $[S]$
A medida que el ion $\alpha$ viaja a través del sólido, interactúa continuamente mediante colisiones inelásticas con los electrones orbitales del medio, perdiendo energía de manera gradual a una tasa $dE/dx$ (típicamente $20 - 80\text{ eV}/\text{\AA}$).

1. **Trayecto de entrada:** El proyectil entra con $E_0$ y llega a la profundidad $x$ con energía reducida $E(x) = E_0 - x \left(\frac{dE}{dx}\right)_{\text{in}}$.
2. **Choque elástico a profundidad $x$:** Rebota con energía $E' = K \cdot E(x)$.
3. **Trayecto de salida:** Emerge hacia el detector perdiendo energía adicional: $E_1(x) = E' - \frac{x}{\cos\theta} \left(\frac{dE}{dx}\right)_{\text{out}}$.

La diferencia de energía entre un choque en la superficie y un choque a profundidad $x$ es linealmente proporcional al espesor:

$$\Delta E = [S] \cdot x$$

Donde $[S]$ es el **Factor Cinemático de Pérdida de Energía**:
$$[S] = \left[ \frac{K}{\cos\theta_{\text{in}}} \left(\frac{dE}{dx}\right)_{\text{in}} + \frac{1}{\cos\theta_{\text{out}}} \left(\frac{dE}{dx}\right)_{\text{out}} \right]$$

### 5.2 Morfología del Espectro Real: Película Delgada vs. Sustrato Grueso
* **Película delgada (ej. capa de Au de 50 nm):**  
  Aparece como un **pico bien definido con un ancho $\Delta E$**. El borde de alta energía marca la superficie delantera y el borde de baja energía marca la interfaz trasera. El ancho $\Delta E$ mide directamente el espesor en nanómetros.
* **Sustrato grueso (ej. oblea de Si):**  
  Aparece como un **escalón continuo con una meseta ancha**, ya que se detectan partículas dispersadas desde la superficie hasta profundidades de varios micrómetros, donde la energía se degrada progresivamente.

### 5.3 Corriente del Haz y Fluctuaciones Estadísticas (Poisson)
En el Panel D, el slider de corriente del haz ($5 - 100\text{ nA}$) regula la tasa de llegada de iones:
$$Q = \int I \, dt \implies N_{\text{proyectiles}} = \frac{Q}{q_{\text{ion}}}$$
* La detección de partículas es un proceso estocástico regido por la **estadística de Poisson**.
* La incertidumbre relativa en el conteo de cada canal es:
  $$\frac{\sigma_N}{N} = \frac{\sqrt{N}}{N} = \frac{1}{\sqrt{N}}$$
* **Comportamiento visible en la app:** A baja corriente ($5\text{ nA}$), el espectro se acumula lentamente con fluctuaciones y ruido visible; al subir a $100\text{ nA}$, la estadística converge rápidamente a curvas suaves y precisas.

---

## 6. Panel E: Hadronterapia, Curva de Bragg y Medicina Nuclear

### 6.1 Pérdida de Energía de Iones en Tejido Biológico: Ecuación de Bethe-Bloch
Cuando un haz de protones ($z=1$) o de iones de carbono ($z=6$) ingresa en el cuerpo humano (modelado principalmente como agua, $\text{H}_2\text{O}$), la pérdida de energía por unidad de distancia ($dE/dx$) sigue la **fórmula relativista de Bethe-Bloch** (Bethe 1930; PDG 2022):

$$-\frac{dE}{dx} \propto \rho \frac{Z}{A} \frac{z^2}{\beta^2} \left[ \ln\left(\frac{2 m_e c^2 \beta^2 \gamma^2}{I_{\text{ion}}}\right) - \beta^2 \right]$$

### 6.2 Origen del Pico de Bragg
* A altas velocidades ($\beta \approx 0.5 - 0.7$, energía de $100 - 250\text{ MeV}$), el ion pasa muy rápido junto a los átomos del tejido y la interacción coulombiana es débil: la tasa de ionización es **baja y casi constante en la entrada** (zona de piel y tejido sano).
* A medida que el ion se frena y pierde velocidad ($v \downarrow$), el tiempo de interacción con los electrones aumenta drásticamente:
  $$-\frac{dE}{dx} \propto \frac{1}{v^2} \propto \frac{1}{E}$$
* En los últimos milímetros de su recorrido, la tasa de liberación de energía se dispara en un máximo ultra-focalizado: el **Pico de Bragg**. Inmediatamente después de frenarse por completo, la dosis cae abruptamente a **cero**.

```
Dosis Relativa
  │
  │  Fotones 6 MV (Rayos X) ───\
  │  (Dosis máxima en piel,     \───\
  │   daño a tejido sano)            \───\
  │                                       \───\
  │                                    ╭───╮  ← PICO DE BRAGG
  │  Protones / Iones C6+              │   │    (Dosis máxima en el tumor,
  │  (Baja entrada, depósito focal) ───╯   │     cero daño posterior)
  └────────────────────────────────────────┴───────────────────────>
  Entrada (Piel)              Tejido Sano   Tumor              Profundidad (cm)
```

### 6.3 Comparación Clínica: Protones vs. Iones de Carbono-12
Debido al factor de carga del proyectil al cuadrado ($z^2$) en Bethe-Bloch:
* **Protones ($z=1$):** $z^2 = 1$. Excelente conformación de dosis espacial, ideal para tumores pediátricos y cercanos a órganos críticos (nervio óptico, médula espinal).
* **Iones de Carbono ($^{12}\text{C}^{6+}$, $z=6$):** $z^2 = 36$. Depositan 36 veces más densidad de ionización local (**alto LET**, *Linear Energy Transfer*). Producen roturas dobles complejas y letales en la doble hélice de ADN tumoral (*Double Strand Breaks*), destruyendo tumores radioresistentes e hipóxicos que no responden a radioterapia convencional.

### 6.4 El Hilo Conductor a la Medicina Nuclear Diagnóstica
* **1911 (Rutherford):** Descubre el núcleo atómico.
* **1912 (Georg de Hevesy):** Trabajando como investigador postdoctoral en el laboratorio de Rutherford en Manchester, intentó por encargo de Rutherford separar químicamente Radio-D (un isótopo de Plomo) del plomo común. Al constatar que era químicamente imposible, comprendió que **los isótopos se comportan idénticamente en procesos químicos y biológicos**. Concibió así el **principio de los radiotrazadores**, fundando la medicina nuclear diagnóstica (Premio Nobel de Química 1943).
* **1928 (Dirac) $\to$ PET (Tomografía por Emisión de Positrones):** La ecuación de Dirac predice el positrón ($e^+$). Los radiofármacos emisores $\beta^+$ (como la fluorodesoxiglucosa $^{18}\text{F}\text{-FDG}$) emiten positrones que al frenarse se aniquilan con electrones del tejido, emitiendo dos fotones gamma colineales de $511\text{ keV}$ detectados por coincidencia para mapear el metabolismo tumoral.
* **SPECT (Tomografía por Emisión de Fotón Único):** Emplea radionúclidos en estados cuánticos isoméricos metaestables (como $^{99m}\text{Tc}$, tiempo de vida media $6\text{ h}$), que decaen al estado fundamental emitiendo un fotón gamma puro de $140.5\text{ keV}$.

---

## 7. Física y Metrología Avanzada (Fondo Teórico Complementario)

### 7.1 Límites de la Física Clásica: Radio Nuclear y Barrera de Coulomb
RBS clásico asume que el núcleo es una carga puntual. Sin embargo, los núcleos reales tienen un radio finito dado por:
$$R_{\text{núcleo}} \approx r_0 A^{1/3} \quad (r_0 \approx 1.25\text{ fm})$$
Para que la colisión sea puramente electromagnética (sin reacciones nucleares ni absorción), la distancia de máximo acercamiento debe superar la suma de los radios nucleares ($a_0 > R_1 + R_2$). Esto impone un límite superior a la energía del haz (**Barrera de Coulomb**):
$$E_{\text{Coulomb}} = \frac{Z_1 Z_2 k e^2}{R_1 + R_2}$$
Por ello, los laboratorios comerciales de RBS utilizan haces de $\text{He}$ a $E_0 = 2.0\text{ MeV}$, garantizando colisiones 100% coulombianas elásticas para elementos de $Z \ge 6$.

### 7.2 La "Coincidencia Cuántica" de Gordon (1928)
Cuando Walter Gordon resolvió en 1928 la ecuación de Schrödinger cuántica no relativista para el potencial repulsivo $V(r) = k Z_1 Z_2 e^2 / r$, descubrió que la sección eficaz diferencial cuántica exacta $|f(\theta)|^2$ **coincide de manera idéntica con la fórmula clásica de Rutherford**:
$$\left(\frac{d\sigma}{d\Omega}\right)_{\text{Cuántica}} = \left(\frac{d\sigma}{d\Omega}\right)_{\text{Rutherford Clásica}} = \left(\frac{Z_1 Z_2 k e^2}{4E_0}\right)^2 \frac{1}{\sin^4(\theta/2)}$$
Esta coincidencia exacta solo ocurre para el potencial coulombiano puro $1/r$.

### 7.3 Instrumentación del Laboratorio: Aceleradores Tandem y Detectores PIPS
* **Acelerador Tandem (1 a 3 MV):** Genera iones negativos $\text{He}^-$, los acelera hacia una terminal de alto voltaje positivo $+V$, donde una celda de gas *stripper* arranca electrones convirtiéndolos en $\text{He}^{2+}$, y luego los repele hacia tierra, logrando una energía final $E_0 = (1 + q) V_{\text{term}} = 3 V_{\text{term}}$.
* **Detectores PIPS de Silicio:** Cada partícula dispersada genera pares electrón-hueco en la zona de agotamiento del semiconductor ($3.62\text{ eV}$ por par a $300\text{ K}$). Para una partícula de $1.845\text{ MeV}$ rebotada en Oro, se crean $\approx 509{,}668$ electrones, que un preamplificador sensible a carga convierte en un pulso de tensión proporcional a la energía.

---

## 8. Glosario de Parámetros, Nomenclatura y Unidades

| Símbolo | Nombre del Parámetro | Significado Físico | Unidad SI | Unidad Nuclear / IBA |
|---|---|---|---|---|
| $Z_1, Z_2$ | Número atómico (proyectil / blanco) | Número de protones | Adimensional | Adimensional |
| $M_1, M_2$ | Masa atómica (proyectil / blanco) | Masa de los núcleos colisionantes | $\text{kg}$ | $\text{u}$ (uma) |
| $E_0, E_1$ | Energía inicial / retrodispersada | Energía cinética del ion | $\text{J}$ | $\text{MeV}$ o $\text{keV}$ |
| $K$ | Factor cinemático | Fracción $E_1 / E_0$ retenida tras el choque | Adimensional | Adimensional ($0 < K \le 1$) |
| $\theta$ | Ángulo de dispersión | Ángulo de deflexión respecto al haz incidente | $\text{rad}$ | Grados ($^\circ$, estándar $170^\circ$) |
| $b$ | Parámetro de impacto | Distancia perpendicular asintótica al núcleo | $\text{m}$ | $\text{fm}$ ($1\text{ fm} = 10^{-15}\text{ m}$) |
| $a_0$ | Parámetro de Rutherford | Distancia de máximo acercamiento frontal | $\text{m}$ | $\text{fm}$ ($a_0 = \frac{Z_1 Z_2 k e^2}{2E_0}$) |
| $k e^2$ | Constante de Coulomb $\times e^2$ | Constante de acoplamiento electrostático | $\text{J}\cdot\text{m}$ | $1.439965\text{ MeV}\cdot\text{fm}$ |
| $d\sigma/d\Omega$ | Sección eficaz diferencial | Probabilidad de dispersión por ángulo sólido | $\text{m}^2/\text{sr}$ | $\text{barn}/\text{sr}$ ($1\text{ b} = 10^{-28}\text{ m}^2$) |
| $dE/dx$ | Poder de frenado (*Stopping power*) | Pérdida de energía por unidad de longitud | $\text{J}/\text{m}$ | $\text{eV}/\text{\AA}$ o $\text{keV}/\text{nm}$ |
| $[S]$ | Factor cinemático de parada | Factor de conversión energía-profundidad | $\text{J}/\text{m}$ | $\text{eV}/\text{\AA}$ ($\Delta E = [S] \cdot x$) |
| $Q, I$ | Carga acumulada / Corriente | Dosis de partículas del acelerador | $\text{C}, \text{A}$ | $\mu\text{C}, \text{nA}$ ($10^{-9}\text{ A}$) |
| LET | *Linear Energy Transfer* | Densidad lineal de energía transferida | $\text{J}/\text{m}$ | $\text{keV}/\mu\text{m}$ |

---

## 9. Tabla de Valores de Referencia Exactos (Verificación NIST / Python 3.13)

Calculados para un haz de $E_0 = 2.0000\text{ MeV}$ a $\theta = 170.00^\circ$ ($M_1 = 4.0015\text{ u}$, $ke^2 = 1.439965\text{ MeV}\cdot\text{fm}$):

| Elemento Blanco | Símbolo | $Z_2$ | Masa $M_2$ (u) | Factor Cinemático $K$ | Energía $E_1$ (MeV) | $\Delta E_{\text{recoil}}$ (MeV) | Sección Eficaz ($\propto Z_2^2$) | Razón vs. Carbono |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Carbono** | C | 6 | 12.011 | **0.2525** | 0.5051 | 1.4949 | 36 | 1.00 |
| **Silicio** | Si | 14 | 28.085 | **0.5649** | 1.1299 | 0.8701 | 196 | 5.44 |
| **Hierro** | Fe | 26 | 55.845 | **0.7527** | 1.5055 | 0.4945 | 676 | 18.78 |
| **Plata** | Ag | 47 | 107.868 | **0.8632** | 1.7264 | 0.2736 | 2209 | 61.36 |
| **Oro** | Au | 79 | 196.967 | **0.9226** | 1.8451 | 0.1549 | 6241 | **173.36** |

---

## 10. Síntesis de las 11 Fuentes de Referencia Consultadas

1. **EAG Laboratories (*RBS Tutorial: Theory and Instrumentation*)**: Validó los modelos de instrumentación de aceleradores Tandem, detectores de silicio PIPS y cálculo de factores de parada $[S]$ en películas delgadas.
2. **CMAM - Centro de Microanálisis de Materiales (UAM, España)**: Validó los parámetros de operación del acelerador de 5 MV y la geometría canónica $\theta = 170^\circ$.
3. **ANSTO (Australian Nuclear Science and Technology Organisation)**: Fundamentó el análisis estequiométrico absoluto no destructivo sin patrones de calibración externos.
4. **Covalent Metrology (*RBS Chemical Analysis*)**: Respaldó la arquitectura de la muestra multicapa C / Au / Si y los rangos de resolución en profundidad.
5. **HZDR - Helmholtz-Zentrum Dresden-Rossendorf**: Aportó la complementariedad con ERDA y los límites de corte cinemático para elementos con $M_2 < M_1$.
6. **Taylor & Francis (Royal Society of NZ / *Rutherford's Legacy*)**: Sustentó la reconstrucción histórica de Manchester (1909–1911) y la transición hacia la física cuántica temprana.
7. **LibreTexts Español (*Retrodispersión de Rutherford de películas delgadas*)**: Guió la interpretación visual de escalones de sustrato y mesetas en espectrometría.
8. **Revista TECNIA (UNI, Perú)**: Validó la terminología metrológica y pedagógica en español académico riguroso.
9. **Another Day In The Lab (*Un evento tipo Rutherford*)**: Aportó el modelado estocástico de Poisson ($\sigma_N = \sqrt{N}$) en la acumulación de cuentas y la emulación de corriente del haz.
10. **Khan Academy (*Elastic and Inelastic Collisions*)**: Respaldó la formulación vectorial 2D de conservación de momento y energía.
11. **Wilson (1946) & PDG (2022) (*Hadronterapia y Bethe-Bloch*)**: Fundamentó la física de penetración de iones pesados, el pico de Bragg y la radiobiología de rotura de ADN.

---

## 11. Bibliografía Canónica

1. **Chu, W.-K., Mayer, J. W., & Nicolet, M.-A.** (1978). *Backscattering Spectrometry*. Academic Press, New York. *(Texto canónico fundamental de RBS)*.
2. **Feldman, L. C., & Mayer, J. W.** (1986). *Fundamentals of Surface and Thin Film Analysis*. North-Holland, Elsevier.
3. **Rutherford, E.** (1911). *The Scattering of $\alpha$ and $\beta$ Particles by Matter and the Structure of the Atom*. Philosophical Magazine, 21(125), 669–688.
4. **Bethe, H.** (1930). *Zur Theorie des Durchgangs schneller Korpuskularstrahlen durch Materie*. Annalen der Physik, 397(3), 325–400.
5. **Gordon, W.** (1928). *Über den Stoß zweier Punktladungen nach der Wellenmechanik*. Zeitschrift für Physik, 48(3), 180–191.
6. **Wilson, R. R.** (1946). *Radiological Use of Fast Protons*. Radiology, 47(5), 487–491.
7. **Particle Data Group (PDG)** (2022). *Passage of Particles Through Matter*. Progress of Theoretical and Experimental Physics, 2022(8), 083C01.

---
*Documento compilado y validado como tratado integral de física, conceptualización y metrología nuclear para el Diplomado en Física Moderna.*