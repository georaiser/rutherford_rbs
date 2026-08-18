/**
 * app.js — Punto de entrada e inicialización de la app
 *
 * Inicializa los tres paneles y lanza el loop principal de animación.
 * El loop único de requestAnimationFrame maneja Paneles A y B.
 * El Panel C es estático y se redibuja solo cuando cambia M₂.
 *
 * Depende de: constants.js, physics.js, panelA.js, panelB.js, panelC.js
 */
'use strict';

(function init() {

  // ── Inicializar cada panel ──
  panelA.init();
  panelB.init();
  panelC.init();
  panelD.init();

  // Sincronizar el marcador de Panel C con el slider de M₂
  // (panelB.init() ya registra el slider, aquí añadimos la sincronización con C)
  document.getElementById('sliderM2').addEventListener('input', function () {
    panelC.setM2Marker(parseFloat(this.value));
  });

  // ── Loop principal de animación ──
  // Panel A: trayectorias en movimiento continuo
  // Panel B: máquina de estados de colisión
  // Panel C: estático, no necesita loop
  function loop(timestamp) {
    panelA.tick();
    panelB.draw(timestamp);
    panelD.tick(timestamp);
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

})();
