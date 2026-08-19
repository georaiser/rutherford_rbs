# Resumen de Estudio — Experimento de Rutherford, RBS y Hadronterapia
## Guía rápida y accesible | Módulo 2 — Diplomado de Física Moderna

> Este documento es un **resumen simplificado** de [`Estudio_Fisico_RBS.md`](Estudio_Fisico_RBS.md).
> Para deducciones formales, valores exactos y física avanzada, consultar el documento completo.

---

### Índice
0. ¿Qué es este proyecto?
1. Panel A — ¿Cómo rebota una partícula alfa?
2. Panel B — ¿Cuánta energía pierde al rebotar?
3. Panel C — ¿Cómo se ve el espectro?
4. Panel D — RBS en acción
5. Panel E — Hadronterapia y el Pico de Bragg
6. La gran pregunta: ¿Rutherford es física cuántica?
7. ¿Dónde entra la mecánica cuántica en las técnicas IBA?
8. Tabla de fórmulas esenciales
9. Glosario rápido

---

## 0. ¿Qué es este proyecto?

Este proyecto simula tres cosas conectadas entre sí:

1. **El experimento de Rutherford (1911):** disparar partículas alfa contra un átomo y ver cómo rebotan.
2. **RBS — Espectrometría de Retrodispersión de Rutherford:** una técnica moderna que usa exactamente el mismo principio para analizar materiales a nivel nanométrico.
3. **Hadronterapia:** el uso del comportamiento de las partículas cargadas en la materia para tratar tumores con precisión milimétrica.

Los tres temas comparten la misma física de base: **partículas cargadas interactuando con la materia.**

---

## 1. Panel A — ¿Cómo rebota una partícula alfa?

### La idea central
Cuando una partícula alfa (núcleo de helio, carga $+2e$) se acerca a un núcleo atómico (carga $+Z_2 e$), ambas cargas se repelen. Esa repulsión es la **Fuerza de Coulomb**. Cuanto más cerca pasa la partícula, más fuerte es el empujón y mayor es el ángulo de desvío.

### El parámetro de impacto $b$
Es la distancia de "puntería": qué tan centrado va el disparo respecto al núcleo.
- $b$ pequeño (disparo casi central) → rebote a ángulo grande
- $b$ grande (disparo lejano) → apenas se desvía

### La fórmula del ángulo
$$\theta = 2 \arctan\!\left(\frac{a_0}{b}\right)$$

donde $a_0 = \frac{Z_1 Z_2 \cdot 1.44 \text{ MeV·fm}}{2 E_0}$ es el **parámetro de Rutherford** (distancia de máximo acercamiento si el disparo fuera directo al centro).

**Ejemplo concreto:** alfa sobre Au ($Z_2=79$) a $E_0 = 7$ MeV → $a_0 = 16.25$ fm. Si $b = 5$ fm → $\theta = 143°$.

### Thomson vs. Rutherford
El modelo de Thomson (1904) suponía que la carga positiva estaba repartida por todo el átomo como una nube difusa. Con ese modelo, la desviación máxima posible es $\theta_{\max} \approx 0.006°$ — invisiblemente pequeña.

Cuando Geiger y Marsden observaron partículas rebotando a más de 90°, fue la prueba de que la carga estaba concentrada en un **núcleo puntual denso**. Eso fue el descubrimiento del núcleo atómico.

### ¿Por qué importa $Z_2$ y no el número de neutrones $N$?
Porque la fuerza que desvía la partícula es electromagnética (Coulomb). Los neutrones no tienen carga eléctrica, así que no contribuyen a la trayectoria. Solo los protones ($Z_2$) importan para la dispersión.

---

## 2. Panel B — ¿Cuánta energía pierde al rebotar?

### La idea central
Cuando la partícula alfa choca elásticamente con un núcleo, transfiere parte de su energía. Cuanto más ligero es el blanco, más energía le transfiere. El **Factor Cinemático $K$** dice qué fracción de la energía original conserva la partícula:

$$K = \frac{E_1}{E_0} = \left[\frac{\sqrt{M_2^2 - M_1^2\sin^2\theta} + M_1\cos\theta}{M_1+M_2}\right]^2$$

### Cómo leerlo
| Blanco | $K$ a 170° | Energía final (de 2 MeV) | Interpretación |
|---|:---:|:---:|---|
| Carbono ($M_2=12$) | 0.2525 | 0.505 MeV | Pierde 75% — blanco muy ligero |
| Silicio ($M_2=28$) | 0.5649 | 1.130 MeV | Pierde 44% |
| Hierro ($M_2=56$) | 0.7527 | 1.505 MeV | Pierde 25% |
| Oro ($M_2=197$) | 0.9226 | 1.845 MeV | Pierde solo 8% — blanco muy pesado |

**Conclusión clave:** medir la energía del rebote ($E_1$) identifica el elemento. Es la huella de masa del átomo blanco.

### Límite importante: ¿Por qué RBS no detecta Hidrógeno?
Si el blanco es más ligero que la partícula alfa ($M_2 < M_1 = 4$ u), matemáticamente no puede haber rebote hacia atrás. El hidrógeno ($M_2 = 1$ u) es invisible al RBS. Para detectarlo se usa **ERDA**, donde se observa el núcleo blanco que salió disparado hacia adelante.

---

## 3. Panel C — ¿Cómo se ve el espectro?

### La idea central
El detector registra cuántas partículas llegan a cada energía. El resultado es un histograma: los **peaks** (señales) aparecen en la energía $E_1 = K \cdot E_0$ de cada elemento.

- **Posición del peak** → masa del elemento ($K$)
- **Altura del peak** → cantidad del elemento ($\propto Z_2^2$)
- **Anchura del peak** → resolución del detector (~15-20 keV)

### La sección eficaz: por qué el oro "grita" y el carbono "susurra"
La probabilidad de dispersión crece con $Z_2^2$:

$$\frac{d\sigma}{d\Omega} \propto Z_2^2$$

Ejemplo: Au vs. C → $(79/6)^2 = 173.4$. **Con igual cantidad de átomos, el oro produce 173 veces más señal que el carbono.** RBS es muy sensible a elementos pesados, poco sensible a los ligeros.

### ¿Por qué el detector está a 170° y no a 180°?
A 180° la sensibilidad de masa es máxima, pero bloquearía el haz de entrada. A 170° se conserva el 99.8% de esa sensibilidad sin obstruir nada. Es el estándar de todos los laboratorios de RBS del mundo.

---

## 4. Panel D — RBS en acción

### La idea central
Simula un experimento real, evento a evento. Las partículas "llueven" sobre una muestra multicapa y el espectro se construye en tiempo real.

### Corriente del haz y velocidad del experimento
$$\dot{N} = \frac{I}{Z_1 e}$$
A 20 nA con partículas alfa: $\dot{N} \approx 6.25 \times 10^{10}$ partículas por segundo.

En la simulación: a mayor corriente, más rápido se llena el espectro.

### Estadística de Poisson: por qué el espectro "tiembla"
Cada canal del histograma tiene $N$ cuentas con incertidumbre:
$$\frac{\sigma_N}{N} = \frac{1}{\sqrt{N}}$$
Con pocas cuentas, el espectro es ruidoso. Con muchas cuentas, converge y se ve limpio. El panel muestra esta evolución estadística en tiempo real.

### Pérdida de energía en profundidad: el Factor de Parada $[S]$
Una partícula que interacciona a profundidad $x$ dentro del material pierde energía en el camino de entrada y de salida. La diferencia de energía respecto a un choque en superficie es:
$$\Delta E = [S] \cdot x$$
Esto convierte el espectro energético directamente en un **perfil de profundidad**: cada nm de profundidad corresponde a un desplazamiento medible en el eje de energía.

---

## 5. Panel E — Hadronterapia y el Pico de Bragg

### El problema clínico en una frase
Los rayos X depositan su máxima energía cerca de la piel y siguen dañando tejido sano hasta el tumor y más allá. Las partículas cargadas (hadrones) hacen lo contrario.

### La física: Bethe-Bloch
La pérdida de energía de un ion en la materia crece cuando el ion se frena:
$$-\frac{dE}{dx} \propto \frac{Z_1^2}{v^2}$$
Cuanto más lento va el ion, **más energía deposita**. Al final del recorrido, justo antes de detenerse, la deposición es máxima: ese es el **Pico de Bragg**.

### Comparación clínica

| Partícula | Energía típica | Rango en agua | RBE (eficacia biológica) |
|---|:---:|:---:|:---:|
| Rayos X 6 MV | — | Decae desde superficie | 1.0 (referencia) |
| Protón | 70–230 MeV | 4–32 cm | ~1.1 |
| Carbono-12 | 100–430 MeV/u | 3–26 cm | ~2–3 |

El **carbono-12** tiene ventaja extra: LET (densidad de ionización) $36\times$ mayor que los protones, lo que produce roturas dobles del ADN tumoral no reparables.

### SOBP: ajustar el pico al tamaño del tumor
Un pico monoenergético tiene 2–5 mm de ancho. Un tumor puede tener 5 cm. En la práctica se superponen múltiples picos a distintas profundidades y ponderados en intensidad, generando una meseta uniforme: el **SOBP** (*Spread-Out Bragg Peak*).

### Conexión con Rutherford
El mismo laboratorio de Rutherford en Manchester albergó a **Georg de Hevesy** (1912), quien formuló el principio de los radiotrazadores: los isótopos son bioquímicamente indistinguibles. Esto llevó décadas después al **PET** ($^{18}$F-FDG, 511 keV) y al **SPECT** ($^{99m}$Tc, 140.5 keV) — la medicina nuclear diagnóstica nació directamente del círculo de Rutherford.

---

## 6. La gran pregunta: ¿Rutherford es física cuántica?

**La respuesta honesta: el experimento en sí, no. Pero es la premisa que la hace necesaria.**

### Lo que Rutherford usa (todo clásico)
- Fuerza de Coulomb → mecánica newtoniana
- Conservación de energía y momento → leyes del siglo XVIII
- No hay $\hbar$, no hay $\Psi$, no hay cuantización

### El problema que Rutherford crea
Al descubrir el núcleo, Maxwell predice que el electrón en órbita debería radiar y colapsar en $\sim 10^{-11}$ s. La materia no debería existir. **Esa crisis es exactamente lo que obliga a Bohr a inventar la cuantización en 1913.**

### La cadena histórica

```
Thomson (1904): carga difusa → θ_max = 0.006°  [clásico]
     ↓
Geiger-Marsden (1909-11): rebotes a 150°  [clásico]
     ↓
Rutherford (1911): descubre el núcleo  [clásico]
     ↓
CRISIS: Maxwell → colapso en 10⁻¹¹ s
     ↓
Bohr (1913): L = nℏ  ← PRIMER ACTO CUÁNTICO
     ↓
De Broglie → Heisenberg → Schrödinger → QM completa
```

### El puente matemático (Gordon, 1928)
Walter Gordon demostró que la mecánica cuántica da exactamente la misma sección eficaz que Rutherford clásica para el potencial $1/r$. Esto significa que **RBS puede calcularse con física clásica y el resultado es cuánticamente exacto**. No es una casualidad — es una propiedad exclusiva del potencial coulombiano.

---

## 7. ¿Dónde entra la mecánica cuántica en las técnicas IBA?

### A — Efecto túnel (Gamow) → NRA

La barrera de Coulomb que la simulación muestra repeliendo partículas alfa es la **misma barrera** que el núcleo del Radio tuvo que dejar atravesar a esas alfas para emitirlas — por efecto túnel. Clásicamente imposible; cuánticamente necesario.

En **NRA** (*Nuclear Reaction Analysis*), el proyectil penetra el núcleo blanco por túnel a energías de resonancia específicas, desencadenando reacciones nucleares. Permite perfilar $^{16}$O y $^{12}$C con resolución de ~2 nm.

### B — Resonancias cuánticas (Breit-Wigner) → NRA/RNRA

A ciertas energías exactas, la sección eficaz se dispara órdenes de magnitud porque coincide con un **nivel de energía cuántico del núcleo compuesto** (análogo a las líneas de Bohr, pero nuclear). Sin QM, estas resonancias no existen.

### C — Transiciones electrónicas → PIXE

**PIXE** (*Particle-Induced X-ray Emission*) detecta los rayos X emitidos cuando un electrón interno del átomo es expulsado y otro cae a ocupar el hueco. Las energías de esos rayos X son la **huella digital cuántica** del átomo: únicas para cada elemento, gobernadas por reglas de selección cuánticas.

### Tabla resumen

| Técnica | ¿Usa QM? | ¿Para qué? |
|---|:---:|---|
| RBS | No (clásica exacta) | Masas y concentraciones |
| ERDA | No | Hidrógeno y elementos ultraligeros |
| **NRA / RNRA** | **Sí** — efecto túnel + resonancias | Perfiles de C, O, N con resolución nm |
| **PIXE** | **Sí** — transiciones atómicas | Elementos de masa muy similar |

> RBS es el punto de partida clásico. Las técnicas que amplían su alcance hacia mayor sensibilidad o resolución isotópica requieren mecánica cuántica. El ecosistema IBA completo ilustra cómo la QM amplía — sin reemplazar — la física clásica.

---

## 8. Tabla de fórmulas esenciales

| Fórmula | Qué dice en palabras |
|---|---|
| $a_0 = Z_1 Z_2 \cdot 1.44 / 2E_0$ [fm] | Tamaño característico de la colisión |
| $\theta = 2\arctan(a_0/b)$ | A menor puntería $b$, mayor rebote $\theta$ |
| $K = E_1/E_0 = [\cdots]^2$ | Fracción de energía conservada tras el rebote |
| $E_1 = K \cdot E_0$ | Energía de la partícula detectada |
| $d\sigma/d\Omega \propto Z_2^2 / \sin^4(\theta/2)$ | Señal más intensa para átomos más pesados |
| $\Delta E = [S] \cdot x$ | Pérdida de energía proporcional a la profundidad |
| $-dE/dx \propto Z_1^2/v^2$ | Más frenado cuando la partícula va más lenta (Bethe-Bloch) |
| $\sigma_N/N = 1/\sqrt{N}$ | Más cuentas → menos ruido estadístico |

---

## 9. Glosario rápido

| Término | Significado simple |
|---|---|
| **Partícula alfa** | Núcleo de helio ($Z_1=2$, $M_1=4$ u). El proyectil del RBS. |
| **Parámetro de impacto $b$** | Distancia de puntería: qué tan centrado va el disparo. |
| **Factor cinemático $K$** | Fracción de energía que conserva la alfa al rebotar. Identifica el elemento blanco. |
| **Sección eficaz $\sigma$** | Probabilidad de que ocurra la colisión. Crece con $Z_2^2$. |
| **Peak de Bragg** | Punto de máxima deposición de energía de un ion justo antes de detenerse. |
| **SOBP** | Superposición de picos de Bragg para cubrir tumores voluminosos. |
| **RBE** | Eficacia biológica relativa: cuánto daño causa una dosis respecto a rayos X. |
| **Factor de Parada $[S]$** | Convierte diferencia de energía en el espectro a profundidad en la muestra. |
| **Efecto túnel** | Penetración cuántica de una barrera de energía clásicamente infranqueable. |
| **Resonancia Breit-Wigner** | Pico de sección eficaz cuando la energía coincide con un nivel cuántico del núcleo. |
| **ERDA** | Técnica complementaria al RBS para detectar elementos ultraligeros (H, D, Li). |
| **PIXE** | Técnica basada en rayos X característicos; usa transiciones electrónicas cuánticas. |
| **NRA** | Técnica basada en reacciones nucleares resonantes; usa efecto túnel cuántico. |
| **Radiotrazador** | Isótopo radiactivo que actúa igual que su versión estable en el organismo. Base de PET y SPECT. |

---

*Documento complementario de* [`Estudio_Fisico_RBS.md`](Estudio_Fisico_RBS.md) *— para el documento completo con deducciones, valores exactos y física avanzada, consultar el archivo principal.*
