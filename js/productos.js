// js/productos.js

// Base de datos local inicial de productos para Nexo Tech
const productos = [
  {
    id: "p1",
    nombre: "Kit Robótica Arduino Uno R3",
    descripcion: "Kit inicial completo con protoboard, LEDs, resistencias y componentes maker.",
    categoria: "Robótica",
    precio: 3200,
    stock: 8,
    imagen: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "p2",
    nombre: "Sensor Ultrasónico HC-SR04",
    descripcion: "Módulo medidor de distancia por ultrasonido para prototipado y robótica.",
    categoria: "Sensores",
    precio: 450,
    stock: 15,
    imagen: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "p3",
    nombre: "Teclado Mecánico RGB Switch Red",
    descripcion: "Teclado compacto para desarrolladores y gamers con iluminación personalizable.",
    categoria: "Periféricos",
    precio: 4800,
    stock: 5,
    imagen: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "p4",
    nombre: "Placa ESP32 Wi-Fi + Bluetooth",
    descripcion: "Módulo de desarrollo avanzado para proyectos de IoT, domótica y automatización.",
    categoria: "Robótica",
    precio: 1200,
    stock: 10,
    imagen: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "p5",
    nombre: "Sensor de Humedad y Temp DHT11",
    descripcion: "Sensor digital para medición de temperatura ambiental y humedad relativa.",
    categoria: "Sensores",
    precio: 380,
    stock: 20,
    imagen: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "p6",
    nombre: "Mouse Gamer 16000 DPI Sensor Óptico",
    descripcion: "Mouse ergonómico con botones programables y luces RGB configurables.",
    categoria: "Periféricos",
    precio: 2100,
    stock: 7,
    imagen: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "p7",
    nombre: "Auriculares Studio Monitor 40mm",
    descripcion: "Auriculares de alta fidelidad para producción, edición de audio y gaming.",
    categoria: "Audio",
    precio: 3900,
    stock: 4,
    imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "p8",
    nombre: "Kit Servo Motores SG90 (Pack x4)",
    descripcion: "Set de 4 micro servomotores de 9g para control de movimiento en robótica.",
    categoria: "Robótica",
    precio: 1600,
    stock: 12,
    imagen: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=500&auto=format&fit=crop&q=60"
  }
];

// --- FUNCIONES DE ALMACENAMIENTO Y LÓGICA COMPARTIDA ---

// 1. Inicializa LocalStorage si aún no existe
function inicializarProductos() {
  if (!localStorage.getItem("productos")) {
    localStorage.setItem("productos", JSON.stringify(productos));
  }
}

// 2. Retorna los productos guardados en LocalStorage
function obtenerProductos() {
  inicializarProductos();
  return JSON.parse(localStorage.getItem("productos")) || [];
}

// 3. Guarda la lista de productos modificada
function guardarProductos(prods) {
  localStorage.setItem("productos", JSON.stringify(prods));
}

// 4. Gestión del carrito en LocalStorage
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const cartBadge = document.getElementById("cartBadge");
  if (!cartBadge) return;
  const carrito = obtenerCarrito();
  const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  cartBadge.textContent = totalUnidades;
}

// 5. Agregar un producto al carrito controlando el stock disponible
function agregarAlCarrito(idProducto, cantidad = 1) {
  const listaProductos = obtenerProductos();
  const producto = listaProductos.find(p => String(p.id) === String(idProducto));

  if (!producto) {
    mostrarToast("El producto solicitado no existe.");
    return;
  }

  const carrito = obtenerCarrito();
  const indice = carrito.findIndex(item => String(item.id) === String(idProducto));
  
  const cantidadActualEnCarrito = indice !== -1 ? carrito[indice].cantidad : 0;
  const nuevaCantidad = cantidadActualEnCarrito + cantidad;

  if (nuevaCantidad > producto.stock) {
    mostrarToast(`No hay suficiente stock. Disponible: ${producto.stock} unidades.`);
    return;
  }

  if (indice !== -1) {
    carrito[indice].cantidad = nuevaCantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: cantidad
    });
  }

  guardarCarrito(carrito);
  mostrarToast(`Se agregaron ${cantidad} unidad(es) de "${producto.nombre}" al carrito.`);
}

// 6. Notificación Toast
function mostrarToast(mensaje) {
  const toastElement = document.getElementById("appToast");
  const toastBody = document.getElementById("toastMessage");
  if (!toastElement || !toastBody) return;

  toastBody.textContent = mensaje;
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

// Ejecución al cargar
document.addEventListener("DOMContentLoaded", () => {
  inicializarProductos();
  actualizarContadorCarrito();
});