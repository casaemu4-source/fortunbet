(function () {
  // CONFIGURACIÓN: Lista de números en formato internacional (sin símbolos '+' ni espacios)
  // Ejemplo para Argentina: 54911xxxxxxxx
  const CONFIG = {
    numeros: [
      "5493834886962"
    ],
    // Mensaje predeterminado opcional (déjalo vacío "" si no quieres mensaje)
    mensaje: "Hola! vi su publicidad y quiero información sobre la plataforma",
    // Nombre del evento personalizado para Facebook Pixel (opcional)
    pixelEvent: "Lead"
  };

  /**
   * Obtiene un número aleatorio de la lista
   */
  function obtenerNumeroAleatorio() {
    if (!CONFIG.numeros || CONFIG.numeros.length === 0) return null;
    const indice = Math.floor(Math.random() * CONFIG.numeros.length);
    return CONFIG.numeros[indice];
  }

  /**
   * Construye la URL final de WhatsApp
   */
  function construirUrlWhatsApp(telefono) {
    let url = `https://wa.me/${telefono}`;
    if (CONFIG.mensaje && CONFIG.mensaje.trim() !== "") {
      url += `?text=${encodeURIComponent(CONFIG.mensaje)}`;
    }
    return url;
  }

  /**
   * Manejador del clic
   */
  function handleWhatsAppClick(event) {
    // Evita la navegación por defecto del navegador hacia '#'
    event.preventDefault();

    const telefono = obtenerNumeroAleatorio();
    if (!telefono) {
      console.warn("No hay números de WhatsApp configurados.");
      return;
    }

    // 1. Disparar evento de Meta Pixel si está activo en la página
    if (typeof fbq === "function") {
      fbq("track", CONFIG.pixelEvent, {
        content_name: "Boton WhatsApp",
        source: event.currentTarget.getAttribute("data-btn") || "CTA_Principal"
      });
    }

    const destinoUrl = construirUrlWhatsApp(telefono);

    // 2. Redirección en tiempo real (mismo comportamiento que MetaPush)
    window.location.href = destinoUrl;
  }

  // Inicialización: vincula todos los botones con el atributo data-wa-click
  document.addEventListener("DOMContentLoaded", function () {
    const botones = document.querySelectorAll("[data-wa-click]");
    botones.forEach(function (btn) {
      btn.addEventListener("click", handleWhatsAppClick);
    });
  });
})();