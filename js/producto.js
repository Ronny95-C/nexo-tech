// js/producto.js
// Detalle dinámico: lee ?id=... y consulta el producto en Cloud Firestore.

import { obtenerProductoConRespaldo, hayStock, esc } from "./productos-firebase.js";

const contenedor = document.getElementById("detalleProductoContenedor");
const noEncontrado = document.getElementById("productoNoEncontrado");
const breadcrumbNombre = document.getElementById("breadcrumbNombre");
const cantidadInput = document.getElementById("cantidadInput");
const btnAgregar = document.getElementById("btnAgregarCarritoDetalle");
const listaCaract = document.getElementById("productoCaracteristicas");

const idProducto = new URLSearchParams(window.location.search).get("id");

function mostrarMensaje(texto, titulo) {
    noEncontrado.querySelector("p").textContent = texto;
    noEncontrado.classList.remove("d-none");
    breadcrumbNombre.textContent = titulo;
}

async function cargarDetalle() {
    if (!idProducto) { mostrarMensaje("No se indicó qué producto mostrar.", "Producto no encontrado"); return; }

    let producto;
    try {
        producto = (await obtenerProductoConRespaldo(idProducto)).producto;
    } catch (error) {
        console.error("Error al consultar el producto:", error);
        mostrarMensaje("No se pudo cargar el producto. Revisá tu conexión e intentá de nuevo.", "Error al cargar");
        return;
    }
    if (!producto) { mostrarMensaje("El producto solicitado no existe.", "Producto no encontrado"); return; }

    document.title = `${producto.nombre} | Nexo Tech`;
    breadcrumbNombre.textContent = producto.nombre;
    const img = document.getElementById("productoImagen");
    img.src = producto.imagen;
    img.alt = producto.nombre;
    document.getElementById("productoCategoria").textContent = producto.categoria;
    document.getElementById("productoNombre").textContent = producto.nombre;
    document.getElementById("productoDescripcion").textContent = producto.descripcion;
    document.getElementById("productoPrecio").textContent = `$${producto.precio.toLocaleString("es-UY")}`;

    if (listaCaract) {
        listaCaract.innerHTML = producto.caracteristicas.map(c => `<li>${esc(c)}</li>`).join("");
        listaCaract.classList.toggle("d-none", producto.caracteristicas.length === 0);
    }

    if (!hayStock(producto)) {
        cantidadInput.value = 0;
        cantidadInput.disabled = true;
        btnAgregar.disabled = true;
        btnAgregar.textContent = "Producto agotado";
    } else {
        cantidadInput.max = producto.stock;
    }
    contenedor.classList.remove("d-none");
    document.dispatchEvent(new CustomEvent("producto-cargado", { detail: { id: producto.id } }));

    // Se vuelve a consultar el stock en el momento de agregar
    btnAgregar.addEventListener("click", async () => {
        const cantidad = parseInt(cantidadInput.value, 10) || 1;
        try {
            const actual = (await obtenerProductoConRespaldo(producto.id)).producto;
            if (!actual || !hayStock(actual)) { mostrarToast("El producto ya no está disponible."); return; }
            cantidadInput.max = actual.stock;
            agregarAlCarrito(actual.id, cantidad, actual);
        } catch (error) {
            console.error(error);
            mostrarToast("No se pudo verificar el stock. Intentá de nuevo.");
        }
    });
}

cargarDetalle();
