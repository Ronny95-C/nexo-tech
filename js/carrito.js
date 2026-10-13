/**
 * js/carrito.js
 * Lógica del carrito de compras con persistencia en localStorage.
 */

const STORAGE_KEY_CARRITO = "nexotech_carrito";

// Obtener el carrito desde LocalStorage
function obtenerCarrito() {
    try {
        const data = localStorage.getItem(STORAGE_KEY_CARRITO);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Error al leer el carrito de localStorage:", e);
        return [];
    }
}

// Guardar el carrito en LocalStorage y actualizar el badge
function guardarCarrito(carrito) {
    try {
        localStorage.setItem(STORAGE_KEY_CARRITO, JSON.stringify(carrito));
        actualizarBadgeCarrito();
    } catch (e) {
        console.error("Error al guardar el carrito en localStorage:", e);
    }
}

// Actualizar el contador del badge en el Navbar
function actualizarBadgeCarrito() {
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);
    const badge = document.getElementById("cartBadge");
    if (badge) {
        badge.textContent = totalItems;
    }
}

// Agregar un producto respetando el stock disponible
// "productoActual" es el producto recién consultado en Firestore; si no se pasa, se usa el arreglo local de respaldo
function agregarAlCarrito(productoId, cantidad = 1, productoActual = null) {
    const listaProductos = typeof obtenerProductos === "function" ? obtenerProductos() : [];
    const producto = productoActual || listaProductos.find(p => String(p.id) === String(productoId));

    if (!producto) {
        mostrarNotificacion("Producto no encontrado.", "danger");
        return false;
    }

    if (producto.disponibilidad === false || producto.stock <= 0) {
        mostrarNotificacion(`"${producto.nombre}" está agotado.`, "warning");
        return false;
    }

    const carrito = obtenerCarrito();
    const itemExistente = carrito.find(item => String(item.id) === String(productoId));

    const cantidadActual = itemExistente ? itemExistente.cantidad : 0;
    const nuevaCantidad = cantidadActual + cantidad;

    if (nuevaCantidad > producto.stock) {
        mostrarNotificacion(`No puedes agregar más de ${producto.stock} unidades (stock disponible).`, "warning");
        return false;
    }

    if (itemExistente) {
        itemExistente.cantidad = nuevaCantidad;
        itemExistente.stock = producto.stock;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            stock: producto.stock,
            cantidad: cantidad
        });
    }

    guardarCarrito(carrito);
    mostrarNotificacion(`"${producto.nombre}" agregado al carrito.`, "success");
    return true;
}

// Modificar cantidad (aumentar o disminuir)
function modificarCantidad(productoId, cambio) {
    const carrito = obtenerCarrito();
    const item = carrito.find(i => String(i.id) === String(productoId));
    if (!item) return;

    const nuevaCantidad = item.cantidad + cambio;

    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(productoId);
        return;
    }

    if (nuevaCantidad > item.stock) {
        mostrarNotificacion(`Solo disponemos de ${item.stock} unidades en stock.`, "warning");
        return;
    }

    item.cantidad = nuevaCantidad;
    guardarCarrito(carrito);
    renderizarPaginaCarrito();
}

// Eliminar un producto por completo
function eliminarDelCarrito(productoId) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => String(item.id) !== String(productoId));
    guardarCarrito(carrito);
    mostrarNotificacion("Producto eliminado del carrito.", "info");
    renderizarPaginaCarrito();
}

// Vaciar el carrito completo
function vaciarCarrito() {
    if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
        guardarCarrito([]);
        mostrarNotificacion("Carrito vaciado.", "info");
        renderizarPaginaCarrito();
    }
}

// Notificaciones Toast de Bootstrap
function mostrarNotificacion(mensaje, tipo = "info") {
    const toastEl = document.getElementById("appToast");
    const toastMsg = document.getElementById("toastMessage");
    if (toastEl && toastMsg && typeof bootstrap !== "undefined") {
        toastMsg.textContent = mensaje;
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    } else {
        console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
    }
}

// Renderizar la vista de la tabla en carrito.html
function renderizarPaginaCarrito() {
    const contenedor = document.getElementById("itemsCarrito");
    const resumenSubtotal = document.getElementById("resumenSubtotal");
    const resumenIva = document.getElementById("resumenIva");
    const resumenTotal = document.getElementById("resumenTotal");
    const vistaVacia = document.getElementById("carritoVacio");
    const vistaContenido = document.getElementById("carritoContenido");

    if (!contenedor) return; // Si no existe la tabla, salimos silenciosamente

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        if (vistaVacia) vistaVacia.classList.remove("d-none");
        if (vistaContenido) vistaContenido.classList.add("d-none");
        return;
    }

    if (vistaVacia) vistaVacia.classList.add("d-none");
    if (vistaContenido) vistaContenido.classList.remove("d-none");

    contenedor.innerHTML = "";
    let subtotal = 0;

    carrito.forEach(item => {
        const totalItem = item.precio * item.cantidad;
        subtotal += totalItem;

        const tr = document.createElement("tr");
        tr.className = "align-middle";
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center gap-3">
                    <img src="${item.imagen}" alt="${item.nombre}" class="rounded-3 object-fit-cover" width="60" height="60">
                    <div>
                        <a href="producto.html?id=${item.id}" class="fw-bold text-dark text-decoration-none d-block">${item.nombre}</a>
                        <small class="text-secondary">$ ${item.precio.toLocaleString("es-UY")} c/u</small>
                    </div>
                </div>
            </td>
            <td class="text-center">
                <div class="input-group input-group-sm d-inline-flex" style="width: 110px;">
                    <button class="btn btn-outline-secondary" onclick="modificarCantidad('${item.id}', -1)" type="button">-</button>
                    <input type="text" class="form-control text-center bg-light" value="${item.cantidad}" readonly>
                    <button class="btn btn-outline-secondary" onclick="modificarCantidad('${item.id}', 1)" type="button">+</button>
                </div>
            </td>
            <td class="text-end fw-bold text-dark">$ ${totalItem.toLocaleString("es-UY")}</td>
            <td class="text-center">
                <button class="btn btn-outline-danger btn-sm" onclick="eliminarDelCarrito('${item.id}')" title="Eliminar producto">
                    <i class="bi bi-trash" aria-hidden="true"></i><span class="visually-hidden">Eliminar ${item.nombre}</span>
                </button>
            </td>
        `;
        contenedor.appendChild(tr);
    });

    const iva = subtotal * 0.22;
    const total = subtotal + iva;

    if (resumenSubtotal) resumenSubtotal.textContent = `$ ${subtotal.toLocaleString("es-UY")}`;
    if (resumenIva) resumenIva.textContent = `$ ${Math.round(iva).toLocaleString("es-UY")}`;
    if (resumenTotal) resumenTotal.textContent = `$ ${Math.round(total).toLocaleString("es-UY")}`;
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    actualizarBadgeCarrito();
    renderizarPaginaCarrito();
});