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
    // ✅ Añadir pinchEnabled para el zoom con pellizco
    pinchEnabled: true, // Habilita el zoom con pellizco en dispositivos táctiles
    // ✅ Añadir la función beforePan para limitar el movimiento del mapa
    beforePan: function(oldPan, newPan) {
      var sizes = this.getSizes();
      var panThreshold = 10; // Pequeño margen para la elasticidad en los bordes

      var newX = newPan.x;
      var newY = newPan.y;

      var mapScaledWidth = sizes.viewBox.width * sizes.realZoom;
      var mapScaledHeight = sizes.viewBox.height * sizes.realZoom;

      // Manejar el eje X
      if (mapScaledWidth < sizes.width) {
        // Si el mapa es más pequeño que la ventana de visualización, centrarlo
        newX = (sizes.width - mapScaledWidth) / 2;
      } else {
        // Si el mapa es más grande, aplicar el clamp con el umbral
        var minX = sizes.width - mapScaledWidth - panThreshold;
        var maxX = panThreshold;
        newX = Math.max(minX, Math.min(maxX, newPan.x));
      }

      // Manejar el eje Y
      if (mapScaledHeight < sizes.height) {
        // Si el mapa es más pequeño que la ventana de visualización, centrarlo
        newY = (sizes.height - mapScaledHeight) / 2;
      } else {
        // Si el mapa es más grande, aplicar el clamp con el umbral
        var minY = sizes.height - mapScaledHeight - panThreshold;
        var maxY = panThreshold;
        newY = Math.max(minY, Math.min(maxY, newPan.y));
      }

      return { x: newX, y: newY };
    }
  });

  // ✅ Manejo de selección de zonas
  const zonas = document.querySelectorAll(".zona"); // Selecciona los <g> con la clase "zona"
  const infoBox = document.getElementById("info-box");
  const infoContenido = document.getElementById("info-contenido");
  const btnCerrar = document.getElementById("cerrar-info");

  // ✅ Cargar descripciones personalizadas desde localStorage
  let customDescriptions = {};
  try {
    const storedDescriptions = localStorage.getItem('mapDescriptions');
    if (storedDescriptions) {
      customDescriptions = JSON.parse(storedDescriptions);
    }
  } catch (e) {
    console.error("Error al cargar descripciones de localStorage:", e);
  }

  // ✅ Manejo de botones de zoom
  const zoomInBtn = document.getElementById("zoom-in");
  const zoomOutBtn = document.getElementById("zoom-out");

  zoomInBtn.addEventListener("click", () => {
    panZoom.zoomIn();
  });

  zoomOutBtn.addEventListener("click", () => {
    panZoom.zoomOut();
  });

  zonas.forEach(zona => {
    // Change 'click' to 'touchstart' for better mobile responsiveness
    zona.addEventListener("touchstart", function(event) {
      event.stopPropagation();
      event.preventDefault(); // Prevent default touch behavior (like scrolling/panning)

      // Remover la clase 'seleccionado' de todas las zonas
      zonas.forEach(z => z.classList.remove("seleccionado"));

      // Añadir la clase 'seleccionado' a la zona (el elemento <g>) que fue clicada
      this.classList.add("seleccionado");

      // Lógica para mostrar la caja de información
      const territoryId = this.id.replace(/_/g, ' '); // Reemplaza todos los guiones bajos por espacios
      
      // ✅ Usar descripción personalizada si existe, de lo contrario, usar la predeterminada
      let descriptionToShow = customDescriptions[this.id] || `<h3>${territoryId}</h3><p>¡Has hecho clic en ${territoryId}!</p>`;
      infoContenido.innerHTML = descriptionToShow;
      infoBox.classList.remove("oculto");
    });

    // Keep click for desktop if needed, or if touch devices also fire click after touchstart
    zona.addEventListener("click", function(event) {
      event.stopPropagation();
      // Only proceed if a touchstart hasn't already handled it (to prevent double-triggering on some devices)
      if (event.type === 'click' && event.detail === 0) { // event.detail is 0 for synthetic clicks from touch
        return;
      }

      zonas.forEach(z => z.classList.remove("seleccionado"));
      this.classList.add("seleccionado");
      const territoryId = this.id.replace(/_/g, ' ');
      
      // ✅ Usar descripción personalizada si existe, de lo contrario, usar la predeterminada
      let descriptionToShow = customDescriptions[this.id] || `<h3>${territoryId}</h3><p>¡Has hecho clic en ${territoryId}!</p>`;
      infoContenido.innerHTML = descriptionToShow;
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

  // Also handle touch for closing the info box by tapping outside
  document.getElementById("miMapaSVG").addEventListener("touchstart", function(event) {
    // Check if the touch target is not a zone or a zoom control
    const isZone = event.target.closest('.zona');
    const isZoomControl = event.target.closest('#zoom-controls button');
    const isInfoBox = event.target.closest('#info-box');

    if (!isZone && !isZoomControl && !isInfoBox && !infoBox.classList.contains("oculto")) {
      infoBox.classList.add("oculto");
      zonas.forEach(z => z.classList.remove("seleccionado"));
    }
  });
});