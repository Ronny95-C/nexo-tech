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
* El botón **Finalizar Compra** informaba que la compra era simulada; desde el Sprint 3 registra pedidos reales (ver más abajo).
* `producto.html` ya no figura en el menú ni en el pie de página: se accede desde los destacados o el catálogo.
* Emojis reemplazados por Bootstrap Icons.
* El resumen del carrito muestra el IVA (22%) junto con subtotal y total.
* `perfil.html` y `admin.html` adoptan la marca Nexo Tech y el mismo navbar y pie de página.
* El formulario de newsletter es simulado. El botón "Ingresar" pasó a ser un acceso real en el Sprint 3 (ver más abajo).

## Sprint 3 · Firebase Authentication y Cloud Firestore

### Funcionalidades incorporadas
* Registro e inicio de sesión con correo y contraseña (Firebase Authentication), con validaciones y mensajes comprensibles. La sesión se mantiene al recargar.
* Navbar dinámico: "Ingresar" o menú "Hola, [nombre]" con acceso a Mi perfil y Cerrar sesión.
* `perfil.html` protegido: sin sesión redirige a `acceso.html`; con sesión muestra los datos del usuario y sus pedidos.
* Productos almacenados en Cloud Firestore (colección `productos`): catálogo, detalle y destacados leen de allí, con estados de carga y mensajes de error.
* Validación de disponibilidad y stock antes de agregar al carrito.
* Confirmación de compra con pedidos registrados en Firestore y descuento de stock.
* Valoraciones (1 a 5 estrellas) y comentarios por producto, asociados al usuario autenticado.
* Panel administrativo (`admin.html`), visible solo para administradores: alta, edición, baja y eliminación de productos, stock y disponibilidad, y consulta de pedidos.
* Reglas de seguridad de Firestore (`firestore.rules`).

### Organización de los archivos JavaScript
```text
js/
├── firebase/config.js      # Inicializa Firebase y exporta auth y db
├── auth.js                 # Navbar según el estado de la sesión (todas las páginas)
├── acceso.js               # Registro e inicio de sesión
├── perfil.js               # Perfil protegido y "Mis pedidos"
├── productos-firebase.js   # Consulta de productos en Firestore (con respaldo local)
├── catalogo.js             # Catálogo: búsqueda, filtros, orden y agregar al carrito
├── producto.js             # Detalle de producto (?id=)
├── inicio.js               # Productos destacados del inicio
├── carrito.js              # Carrito en LocalStorage
├── checkout.js             # Botón "Finalizar Compra"
├── pedidos.js              # Transacción de compra y consulta de pedidos
├── valoraciones.js         # Valoraciones y comentarios
├── roles.js                # Validación de rol (admin)
├── admin.js                # Panel administrativo
├── seed-productos.js       # Carga inicial de productos (uso único)
└── base.js                 # Utilidades comunes y arreglo local de respaldo
```
`cargar-productos.html` es una herramienta de uso único para subir los productos iniciales a Firestore (no figura en el menú).

### Registro y autenticación
1. En `acceso.html` el usuario se registra con nombre, correo y contraseña (mínimo 8 caracteres, con letras y números, repetida).
2. Se crea la cuenta con `createUserWithEmailAndPassword`, se guarda el nombre con `updateProfile` y se crea el documento `usuarios/{uid}` con nombre, correo, rol `cliente` y fecha de registro.
3. El inicio de sesión usa `signInWithEmailAndPassword`. Firebase mantiene la sesión al recargar y `onAuthStateChanged` actualiza el navbar y protege `perfil.html`.
4. Cerrar sesión usa `signOut`.

### Compra y actualización de stock
1. El carrito se guarda en LocalStorage. Antes de agregar un producto se consulta su stock actual en Firestore.
2. Al presionar **Finalizar Compra** se exige sesión iniciada.
3. Una transacción de Firestore (`runTransaction`) lee el stock actual de cada producto, valida disponibilidad y cantidades, calcula subtotales, IVA (22 %) y total con los precios vigentes, descuenta el stock (nunca queda negativo) y crea el documento en `pedidos` con usuario, productos, cantidades, precios, subtotales, total, fecha y estado `pendiente`.
4. Si algo falla no se guarda nada y el carrito no se modifica. El carrito se vacía únicamente cuando la compra finaliza correctamente.
5. Cada usuario ve solo sus pedidos en Mi perfil.

### Colecciones de Firestore
* `usuarios/{uid}`: nombre, email, rol, fechaRegistro.
* `productos/{id}`: nombre, descripcion, categoria, precio, stock, disponibilidad, imagenes, caracteristicas.
* `pedidos/{id}`: uid, email, nombre, items, subtotal, iva, total, fecha, estado.
* `valoraciones/{productoId_uid}`: productoId, uid, nombre, puntuacion, comentario, fecha.

### Usuarios de prueba
Cuentas creadas solo para evaluar el proyecto (no son personales):

| Rol | Correo | Contraseña |
|---|---|---|
| Cliente | cliente1@nexotech.test | Prueba2026 |
| Cliente | cliente2@nexotech.test | Prueba2026 |
| Administrador | admin1@nexotech.test | Prueba2026 |

## Sprint 4 · Roles, panel administrativo y publicación

### De qué trata
Nexo Tech es una tienda en línea de hardware, robótica y periféricos para makers y estudiantes de Uruguay. Este sprint cierra el proyecto con una diferenciación básica de usuarios, un panel administrativo para gestionar productos y las reglas de seguridad de Firestore.

### Sitio publicado
**Enlace público:** https://ronny95-c.github.io/nexo-tech/ *(completar con la dirección definitiva al publicar)*

### Funcionalidades principales
* Catálogo con búsqueda, filtros y orden, y detalle de cada producto.
* Carrito con control de stock y confirmación de compra con pedidos registrados.
* Registro, inicio y cierre de sesión; perfil con los pedidos propios.
* Valoraciones y comentarios por producto.
* Panel administrativo (`admin.html`).

### Tecnologías y servicios
HTML, CSS, Bootstrap 5 y JavaScript (módulos ES); Firebase Authentication y Cloud Firestore; GitHub Pages para la publicación.

### Roles
* **cliente:** se asigna automáticamente a quien se registra (el formulario no permite elegir otro rol). Puede navegar, comprar, ver sus pedidos y valorar productos.
* **admin:** se asigna manualmente en la consola de Firebase (Firestore Database → `usuarios` → campo `rol`). Ve el enlace "Administración" en el menú y puede usar el panel.
* Un cliente que escriba `admin.html` en la barra de direcciones ve un mensaje de acceso restringido y es redirigido al inicio. La protección real está en `firestore.rules`: un cliente no puede cambiar su propio rol ni modificar productos.

### Qué puede hacer el administrador
* Ver la lista de productos con nombre, categoría, precio, stock y disponibilidad.
* Crear productos y editar los existentes (con validación de nombre, categoría, precio y stock).
* Dar de baja o reactivar un producto con el interruptor "Disponible", y eliminarlo definitivamente.
* Consultar los pedidos de todos los clientes.

Los cambios se reflejan de inmediato en el catálogo, porque ambos leen la colección `productos` de Firestore.

### Reglas de seguridad (resumen)
* Los productos se pueden leer sin iniciar sesión y solo los administradores los crean, editan o eliminan. Un cliente únicamente descuenta stock al comprar.
* Cada usuario lee solo sus pedidos; el administrador puede leerlos todos.
* Cada usuario lee y modifica solo su propio documento de `usuarios`, sin poder cambiar su rol.

### Limitaciones conocidas
* No hay recuperación de contraseña ni verificación de correo.
* El pago no existe: la compra solo registra el pedido.
* El administrador no puede cambiar el estado de los pedidos ni gestionar usuarios o comentarios.
* Las imágenes de algunos productos pueden no coincidir exactamente con el artículo.
