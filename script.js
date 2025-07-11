document.addEventListener("DOMContentLoaded", () => {
  // ✅ Inicializar svg-pan-zoom correctamente
  const panZoom = svgPanZoom("#miMapaSVG", {
    zoomEnabled: true,
    controlIconsEnabled: false, // Deshabilita los iconos de control predeterminados
    fit: true,
    center: true,
    panEnabled: true,
    mouseWheelZoomEnabled: true,
    zoomScaleSensitivity: 0.2,
    // Asegúrate de que los eventos táctiles estén habilitados
    eventsListenerElement: document.getElementById('mapa-container') // Escucha eventos en el contenedor del mapa
  });

  // ✅ Manejo de selección de zonas
  // Corrección: Selecciona elementos con la CLASE "zona" (usa el punto)
  const zonas = document.querySelectorAll(".zona");
  const infoBox = document.getElementById("info-box");
  const infoContenido = document.getElementById("info-contenido");
  const btnCerrar = document.getElementById("cerrar-info");

  // ✅ Manejo de botones de zoom
  const zoomInBtn = document.getElementById("zoom-in");
  const zoomOutBtn = document.getElementById("zoom-out");

  if (zoomInBtn && zoomOutBtn) { // Asegurarse de que los botones existen antes de añadir listeners
    zoomInBtn.addEventListener("click", () => {
      panZoom.zoomIn();
    });

    zoomOutBtn.addEventListener("click", () => {
      panZoom.zoomOut();
    });
  }

  zonas.forEach(zona => {
    zona.addEventListener("click", function(event) {
      // Detener la propagación del evento para evitar que svg-pan-zoom lo maneje como un "pan"
      event.stopPropagation(); 

      // Remover la clase 'seleccionado' de todas las zonas
      zonas.forEach(z => z.classList.remove("seleccionado"));

      // Añadir la clase 'seleccionado' a la zona (el elemento <g>) que fue clicada
      this.classList.add("seleccionado");

      // Lógica para mostrar la caja de información
      const territoryId = this.id.replace(/_/g, ' '); // Reemplaza todos los guiones bajos por espacios
      infoContenido.innerHTML = `<h3>Territorio ${territoryId}</h3><p>¡Has hecho clic en ${territoryId}!</p>`;
      infoBox.classList.remove("oculto");
    });
  });

  btnCerrar.addEventListener("click", () => {
    infoBox.classList.add("oculto");
    zonas.forEach(z => z.classList.remove("seleccionado"));
  });

  // Opcional: Cerrar la caja de información al hacer clic en cualquier parte del SVG
  // que no sea una zona seleccionable.
  document.getElementById("miMapaSVG").addEventListener("click", function() {
    if (!infoBox.classList.contains("oculto")) {
      infoBox.classList.add("oculto");
      zonas.forEach(z => z.classList.remove("seleccionado"));
    }
  });
});
