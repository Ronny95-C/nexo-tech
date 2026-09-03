/**
 * js/base.js
 * Base de datos local y utilidades globales para Nexo Tech
 */

const PRODUCTOS_INICIALES = [
  { id: "p1", nombre: "Kit Robótica Arduino Uno R3", descripcion: "Kit inicial completo con protoboard, LEDs, resistencias y componentes maker.", categoria: "Robótica", precio: 3200, stock: 8, imagen: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=500&auto=format&fit=crop&q=60" },
  { id: "p2", nombre: "Sensor Ultrasónico HC-SR04", descripcion: "Módulo medidor de distancia por ultrasonido para prototipado y robótica.", categoria: "Sensores", precio: 450, stock: 15, imagen: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500&auto=format&fit=crop&q=60" },
  { id: "p3", nombre: "Teclado Mecánico RGB Switch Red", descripcion: "Teclado compacto para desarrolladores y gamers con iluminación personalizable.", categoria: "Periféricos", precio: 4800, stock: 5, imagen: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60" },
  { id: "p4", nombre: "Placa ESP32 Wi-Fi + Bluetooth", descripcion: "Módulo de desarrollo avanzado para proyectos de IoT, domótica y automatización.", categoria: "Robótica", precio: 1200, stock: 10, imagen: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=500&auto=format&fit=crop&q=60" },
  { id: "p5", nombre: "Sensor de Humedad y Temp DHT11", descripcion: "Sensor digital para medición de temperatura ambiental y humedad relativa.", categoria: "Sensores", precio: 380, stock: 20, imagen: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60" },
  { id: "p6", nombre: "Mouse Gamer 16000 DPI Sensor Óptico", descripcion: "Mouse ergonómico con botones programables y luces RGB configurables.", categoria: "Periféricos", precio: 2100, stock: 7, imagen: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60" },
  { id: "p7", nombre: "Auriculares Studio Monitor 40mm", descripcion: "Auriculares de alta fidelidad para producción, edición de audio y gaming.", categoria: "Audio", precio: 3900, stock: 4, imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60" },
  { id: "p8", nombre: "Kit Servo Motores SG90 (Pack x4)", descripcion: "Set de 4 micro servomotores de 9g para control de movimiento en robótica.", categoria: "Robótica", precio: 1600, stock: 12, imagen: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=500&auto=format&fit=crop&q=60" }
];

// Obtener la lista de productos
function obtenerProductos() {
  return PRODUCTOS_INICIALES;
}

// === GESTIÓN DE CARRITO (LocalStorage) ===

// Leer carrito desde LocalStorage
function obtenerCarrito() {
  const data = localStorage.getItem("nexotech_carrito");
  return data ? JSON.parse(data) : [];
}

// Guardar carrito en LocalStorage
function guardarCarrito(carrito) {
  localStorage.setItem("nexotech_carrito", JSON.stringify(carrito));
  actualizarBadgeCarrito();
}

// Actualizar el contador del carrito en el Navbar
function actualizarBadgeCarrito() {
  const carrito = obtenerCarrito();
  const badgeEl = document.getElementById("cartBadge") || document.querySelector('a[aria-label="Ver carrito"] .badge');
  
  if (badgeEl) {
    badgeEl.id = "cartBadge";
    // Suma la cantidad total de unidades
    const totalUnidades = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    badgeEl.textContent = totalUnidades;
  }
}

// Utilidad global para mostrar notificaciones Toast
function mostrarToast(mensaje) {
  const toastElem = document.getElementById("appToast");
  const msgElem = document.getElementById("toastMessage");
  if (toastElem && msgElem) {
    msgElem.textContent = mensaje;
    const toast = new bootstrap.Toast(toastElem);
    toast.show();
  } else {
    alert(mensaje);
  }
}

// Inicializar badge al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
  actualizarBadgeCarrito();
});