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
│   ├── productos.js    # Base de datos estática local de productos
│   ├── catalogo.js     # Lógica de renderizado, búsqueda y filtrado
│   ├── producto.js     # Lógica para renderizar el detalle dinámico por ID
│   ├── carrito.js      # Gestión del carrito, stock y LocalStorage
│   └── base.js         # Scripts transversales e interacción del navbar
├── admin.html          # Panel de administración (Prototipo - Sprint futuro)
├── carrito.html        # Vista interactiva del carrito de compras
├── catalogo.html       # Catálogo dinámico con filtros y buscador
├── index.html          # Página principal del proyecto
├── perfil.html         # Perfil de usuario (Prototipo - Sprint futuro)
├── producto.html       # Vista detallada según el producto seleccionado
└── README.md           # Documentación general del proyecto

## Entregable: Sprint 2 — Tienda Dinámica y Carrito
En esta fase se transformó la maquetación estática del Sprint 1 en una aplicación funcional e interactiva del lado del cliente.

## Funcionalidades Incorporadas
Catálogo Dinámico:

Carga de productos mediante un arreglo de objetos dinámico (js/productos.js).

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
