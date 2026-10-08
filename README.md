# Nexo Tech — Tienda Oficial

**Proyecto Académico:** Desarrollo Web  
**Estudiante / Desarrollador:** Ronny Carrasco  
**Año:** 2026  

---

##  Descripción del Proyecto

Nexo Tech es un e-commerce especializado en la comercialización de hardware, componentes de electrónica, kits de robótica educativa, sensores para desarrollo maker y periféricos de alto rendimiento en Uruguay.

El objetivo de la plataforma es brindar a entusiastas de la tecnología, estudiantes, educadores y creadores de proyectos (*makers*) una tienda con una interfaz moderna, limpia, ágil e intuitiva.

---

##  Temática y Público Objetivo

* **Temática:** Hardware, robótica, componentes de electrónica y periféricos informáticos.
* **Makers y Hobbistas:** Personas interesadas en la electrónica, DIY (*Do It Yourself*), domótica y prototipado.
* **Estudiantes y Educadores:** Estudiantes de ingeniería, informática, electrónica y robótica que buscan kits educativos y componentes confiables.
* **Gamers y Usuarios Avanzados:** Usuarios que buscan periféricos y accesorios informáticos de alta calidad.

---

##  Categorías de Productos

* **Kits de Robótica y Arduino:** Placas de desarrollo, protoboards y sets para principiantes.
* **Sensores y Componentes:** Servomotores, sensores ultrasónicos, módulos de comunicación y accesorios.
* **Periféricos Gamer:** Teclados mecánicos, mouses, auriculares y accesorios.
* **Audio y Gadgets:** Sistemas de audio y accesorios informáticos.

---

##  Tecnologías Utilizadas

* **HTML5:** Estructura semántica de la aplicación (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
* **CSS3:** Personalización de estilos, paleta de colores, tipografías y sombras en `css/styles.css`.
* **Bootstrap 5.3.3:** Framework de diseño responsivo para grid, navegación adaptativa, componentes y modales.
* **JavaScript Vanilla (ES6+):** Manipulación dinámica del DOM, procesamiento de eventos y lógica del negocio sin frameworks externos.
* **Git & GitHub:** Control de versiones con historial de commits progresivos y descriptivos.

---

##  Estructura del Proyecto

```text
nexo-tech/
├── assets/             # Imágenes y recursos multimedia de productos
├── css/
│   └── styles.css      # Estilos personalizados de la tienda
├── js/
│   ├── catalogo.js     # Lógica de renderizado, búsqueda y filtrado
│   ├── producto.js     # Lógica para renderizar el detalle dinámico por ID
│   ├── carrito.js      # Gestión del carrito, stock y LocalStorage
│   ├── inicio.js       # Productos destacados del home (leen de base.js)
│   └── base.js         # Productos (PRODUCTOS_INICIALES), toast, login simulado y utilidades comunes
├── admin.html          # Panel de administración (Prototipo - Sprint futuro)
├── carrito.html        # Vista interactiva del carrito de compras
├── catalogo.html       # Catálogo dinámico con filtros y buscador
├── index.html          # Página principal del proyecto
├── perfil.html         # Perfil de usuario (Prototipo - Sprint futuro)
├── producto.html       # Vista detallada según el producto seleccionado
└── README.md           # Documentación general del proyecto
```

## Entregable: Sprint 2 — Tienda Dinámica y Carrito
En esta fase se transformó la maquetación estática del Sprint 1 en una aplicación funcional e interactiva del lado del cliente.

## Funcionalidades Incorporadas
Catálogo Dinámico:

Carga de productos mediante un arreglo de objetos dinámico (`PRODUCTOS_INICIALES` en js/base.js).

Inserción dinámica de tarjetas en catalogo.html.

Búsqueda y Filtros en Tiempo Real:

Filtrado por categorías y búsqueda por nombre sin recargar la página.

Mensaje de aviso informativo al no haber coincidencias.

Detalle Único de Producto:

Vista reutilizable producto.html procesando identificadores por URL (URLSearchParams).

Renderizado de imagen, descripción, precio y control de stock según el ID.

Carrito de Compras y Persistencia:

Agregar, modificar cantidades, eliminar productos y vaciar el carrito.

Control estricto de stock máximo por producto.

Cálculo en tiempo real de Subtotal, IVA (22%) y Total.

Estado visual y alerta para carrito vacío.

Persistencia completa con localStorage.

 Persistencia de Datos en LocalStorage
El carrito utiliza el almacenamiento local bajo la clave nexotech_carrito.

Serialización (JSON.stringify): Guarda la información al agregar, modificar o vaciar elementos.

Deserialización (JSON.parse): Recupera los artículos guardados al cargar cualquier página de la tienda.

## Funcionalidades Pendientes (Sprint 3)
[ ] Registro e inicio de sesión de usuarios.

[ ] Integración con Firebase Authentication.

[ ] Base de datos remota con Cloud Firestore.

[ ] Panel de administración funcional para gestión de inventario (admin.html).

[ ] Procesamiento de pedidos reales.

## Correcciones posteriores al Sprint 2
* Los productos destacados del inicio se generan desde `js/inicio.js` con los mismos datos del catálogo y enlazan a `producto.html?id=...`.
* Se unificó la fuente de datos en `js/base.js` y se eliminó `js/productos.js`, que duplicaba la información.
* Botón **Limpiar filtros** en el catálogo (restablece búsqueda, categoría y orden).
* El botón **Finalizar Compra** informa que la compra es simulada.
* `producto.html` ya no figura en el menú ni en el pie de página: se accede desde los destacados o el catálogo.
* Emojis reemplazados por Bootstrap Icons.
* El resumen del carrito muestra el IVA (22%) junto con subtotal y total.
* `perfil.html` y `admin.html` adoptan la marca Nexo Tech y el mismo navbar y pie de página.
* El botón "Ingresar" muestra un aviso (Sprint 3) y el formulario de newsletter es simulado.


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcWdirTDFzdMRxzqEOXkyG-TteptAYUK0",
  authDomain: "nexo-tech-4f269.firebaseapp.com",
  projectId: "nexo-tech-4f269",
  storageBucket: "nexo-tech-4f269.firebasestorage.app",
  messagingSenderId: "1094381989771",
  appId: "1:1094381989771:web:e349c852f443dca199498e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);