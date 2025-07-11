document.addEventListener("DOMContentLoaded", () => {
  // ✅ Inicializar svg-pan-zoom correctamente
  const panZoom = svgPanZoom("#miMapaSVG", {
    zoomEnabled: true,
    controlIconsEnabled: true, // Deshabilita los iconos de control predeterminados de svg-pan-zoom
    fit: true,
    center: true,
    panEnabled: true,
    mouseWheelZoomEnabled: true,
    zoomScaleSensitivity: 0.2,
    // Importante para el zoom táctil:
    // Asegúrate de que los eventos táctiles estén habilitados y que el elemento de escucha sea el contenedor.
    eventsListenerElement: document.getElementById('mapa-container') 
  });

  // ✅ Manejo de selección de zonas
  // Corrección: Selecciona elementos con la CLASE "zona" (usa el punto antes de zona)
  const zonas = document.querySelectorAll(".zona"); 
  const infoBox = document.getElementById("info-box");
  const infoContenido = document.getElementById("info-contenido");
  const btnCerrar = document.getElementById("cerrar-info");

  // ✅ Manejo de botones de zoom
  const zoomInBtn = document.getElementById("zoom-in");
  const zoomOutBtn = document.getElementById("zoom-out");

  // Añadir event listeners para los botones de zoom si existen
  if (zoomInBtn && zoomOutBtn) { 
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

      // Lógica para mostrar la caja de información: "Territorio [ID sin guiones]"
      const territoryId = this.id.replace(/_/g, ' '); // Reemplaza todos los guiones bajos por espacios
      infoContenido.innerHTML = `<h3>Territorio ${territoryId}</h3><p>¡Has hecho clic en ${territoryId}!</p>`;
      infoBox.classList.remove("oculto");
    });
  });

  btnCerrar.addEventListener("click", () => {
    infoBox.classList.add("oculto");
    zonas.forEach(z => z.classList.remove("seleccionado")); // Desseleccionar todas las zonas al cerrar la info
  });

  // Opcional: Cerrar la caja de información y deseleccionar la zona al hacer clic fuera de la caja de info y fuera de una zona
  document.getElementById("miMapaSVG").addEventListener("click", function(event) {
    // Si el clic no fue dentro de la caja de información y la caja no está oculta
    if (!infoBox.contains(event.target) && !infoBox.classList.contains("oculto")) {
      infoBox.classList.add("oculto");
      zonas.forEach(z => z.classList.remove("seleccionado"));
    }
  });
});
