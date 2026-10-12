# Nexo Tech — Tienda Oficial

**Proyecto Académico:** Desarrollo Web  
**Estudiante / Desarrollador:** Ronny Carrasco  
**Año:** 2026  

---

##  Descripción del Proyecto

Nexo Tech es un e-commerce especializado en la comercialización de hardware, componentes de electrónica, kits de robótica educativa, sensores para desarrollo maker y periféricos de alto rendimiento en Uruguay.

El objetivo de la plataforma es brindar a entusiastas de la tecnología, estudiantes, educadores y creadores de proyectos (*makers*) una tienda con una interfaz moderna, limpia, ágil e intuitiva conectada a servicios en la nube.

---

##  Temática y Público Objetivo

- **Temática:** Hardware, robótica, componentes de electrónica y periféricos informáticos.
- **Makers y Hobbistas:** Personas interesadas en la electrónica, DIY (*Do It Yourself*), domótica y prototipado.
- **Estudiantes y Educadores:** Estudiantes de ingeniería, informática, electrónica y robótica que buscan kits educativos y componentes confiables.
- **Gamers y Usuarios Avanzados:** Usuarios que buscan periféricos y accesorios informáticos de alta calidad.

---

##  Categorías de Productos

- **Kits de Robótica y Arduino:** Placas de desarrollo, protoboards y sets para principiantes.
- **Sensores y Componentes:** Servomotores, sensores ultrasónicos, módulos de comunicación y accesorios.
- **Periféricos Gamer:** Teclados mecánicos, mouses, auriculares y accesorios.
- **Audio y Gadgets:** Sistemas de audio y accesorios informáticos.

---

##  Tecnologías Utilizadas

- **HTML5:** Estructura semántica de la aplicación (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **CSS3:** Personalización de estilos, paleta de colores, tipografías y sombras en `css/styles.css`.
- **Bootstrap 5.3.3:** Framework de diseño responsivo para grid, navegación adaptativa, componentes y modales.
- **Bootstrap Icons:** Iconografía moderna para la interfaz de usuario.
- **JavaScript Vanilla (ES6+):** Módulos nativos (`import/export`), manipulación dinámica del DOM y lógica del negocio.
- **Firebase 10.14.1 (CDN ES Modules):** 
  - **Firebase Authentication:** Gestión de cuentas, registro, inicio de sesión y persistencia de sesión.
  - **Cloud Firestore:** Base de datos NoSQL en la nube para almacenamiento de usuarios y productos (*Nota: Actualmente se utilizan URLs externas para las imágenes de productos, planificando migrar a una carpeta local e imágenes propias en los próximos días*).
- **Git & GitHub:** Control de versiones con historial de commits progresivos y descriptivos.

---

##  Estructura del Proyecto

```text
nexo-tech/
├── assets/             # Recursos multimedia e imágenes
├── css/
│   └── styles.css      # Estilos personalizados de la tienda
├── js/
│   ├── firebase/
│   │   └── config.js   # Configuración e inicialización de Firebase App, Auth y Firestore
│   ├── auth.js         # Lógica de registro, inicio de sesión y actualización del Navbar
│   ├── acceso.js       # Control y validaciones para formularios de autenticación
│   ├── perfil.js       # Carga y renderizado protegido de datos del usuario desde Firestore
│   ├── seed-productos.js # Script auxiliar para la carga masiva inicial de productos a Firestore
│   ├── catalogo.js     # Lógica de renderizado, búsqueda y filtrado dinámico desde Firestore
│   ├── producto.js     # Lógica para renderizar el detalle dinámico por ID desde Firestore
│   └── carrito.js      # Gestión del carrito, stock y persistencia local
├── admin.html          # Panel de administración (Prototipo en evolución)
├── carrito.html        # Vista interactiva del carrito de compras
├── catalogo.html       # Catálogo conectado a Cloud Firestore
├── index.html          # Página principal del proyecto
├── perfil.html         # Vista protegida de perfil de usuario
├── producto.html       # Vista detallada del producto seleccionado
└── README.md           # Documentación general del proyecto


##  Entregable: Sprint 3 — Autenticación y Cloud Firestore

En esta fase se integraron servicios en la nube para dotar a la plataforma de persistencia real, seguridad y gestión centralizada de datos.

## Funcionalidades Incorporadas (Sprint 3)
Autenticación con Firebase: Registro de usuarios por correo y contraseña, validaciones de campos, inicio/cierre de sesión y persistencia de sesión activa al recargar la página.

Gestión de Usuarios en Firestore: Sincronización automática creando un documento asociado al uid del usuario en la colección usuarios.

Navbar Dinámico: Actualización automática de la barra de navegación según el estado de autenticación (usuario invitado vs. usuario logueado).

Ruta Protegida de Perfil: Validación de sesión activa en perfil.html, mostrando de forma dinámica el nombre, rol, correo y fecha de registro obtenidos directamente desde Firestore.

Base de Datos Remota (Cloud Firestore): Migración del catálogo hacia la colección productos en la nube, permitiendo consultas en tiempo real. (Nota sobre imágenes: Las referencias visuales actuales emplean URLs externas estables; la estructuración de imágenes locales en carpeta dedicada se implementará en los próximos días).


## Historial de Versiones y Correcciones Anteriores (Sprint 2)
Catálogo y Filtros: Búsqueda en tiempo real y filtrado por categoría sin recargar la página.

Detalle de Producto: Renderizado mediante parámetros dinámicos por URL (URLSearchParams).

Carrito de Compras: Control de stock, cálculo en tiempo real de Subtotal, IVA (22%) y Total con persistencia en localStorage.

Optimización visual: Emojis reemplazados por Bootstrap Icons, unificación de flujos y adaptación de la identidad visual en todas las vistas de la tienda (index, catalogo, carrito, perfil).
