// js/catalogo.js
// Catálogo dinámico: los productos se leen de Cloud Firestore (colección "productos").

import { obtenerProductosConRespaldo, obtenerProductoConRespaldo, hayStock, esc } from "./productos-firebase.js";

const contenedor = document.getElementById("contenedorProductos");
const inputBuscar = document.getElementById("buscarProducto");
const selectCategoria = document.getElementById("filtroCategoria");
const selectOrden = document.getElementById("ordenarPor");
const sinResultados = document.getElementById("sinResultados");
const btnLimpiar = document.getElementById("btnLimpiarFiltros");

let todos = [];

function normalizarTexto(texto) {
    return (texto || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function mostrarEstado(html) {
    contenedor.innerHTML = `<div class="col-12">${html}</div>`;
}

function mostrarAvisoRespaldo(motivo) {
    let aviso = document.getElementById("avisoRespaldo");
    if (!motivo) { aviso?.remove(); return; }
    if (!aviso) {
        aviso = document.createElement("div");
        aviso.id = "avisoRespaldo";
        aviso.className = "alert alert-warning";
        aviso.setAttribute("role", "alert");
        contenedor.parentElement.before(aviso);
    }
    aviso.textContent = `Mostrando datos de respaldo. ${motivo}`;
}

function renderizarCatalogo() {
    let productos = [...todos];

    const query = normalizarTexto(inputBuscar ? inputBuscar.value : "");
    if (query) {
        productos = productos.filter(p =>
            normalizarTexto(p.nombre).includes(query) ||
            normalizarTexto(p.descripcion).includes(query) ||
            normalizarTexto(p.categoria).includes(query));
    }

    const catSeleccionada = selectCategoria ? selectCategoria.value : "todas";
    if (catSeleccionada !== "todas") {
        const catNorm = normalizarTexto(catSeleccionada);
        productos = productos.filter(p => normalizarTexto(p.categoria) === catNorm);
    }

    const orden = selectOrden ? selectOrden.value : "destacados";
    if (orden === "precio-menor") productos.sort((a, b) => a.precio - b.precio);
    else if (orden === "precio-mayor") productos.sort((a, b) => b.precio - a.precio);

    contenedor.innerHTML = "";
    if (productos.length === 0) {
        sinResultados?.classList.remove("d-none");
        return;
    }
    sinResultados?.classList.add("d-none");

    productos.forEach(prod => {
        const disponible = hayStock(prod);
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";
        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0 product-card">
                <img src="${esc(prod.imagen)}" class="card-img-top p-3 rounded" alt="${esc(prod.nombre)}" style="height: 200px; object-fit: contain;">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-light text-primary border border-primary-subtle">${esc(prod.categoria)}</span>
                        ${disponible
                            ? `<span class="badge bg-success-subtle text-success border border-success-subtle">Stock: ${prod.stock} u.</span>`
                            : `<span class="badge bg-danger-subtle text-danger border border-danger-subtle">Agotado</span>`}
                    </div>
                    <h5 class="card-title fw-bold text-dark fs-6">${esc(prod.nombre)}</h5>
                    <p class="card-text text-secondary small flex-grow-1">${esc(prod.descripcion)}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="fs-5 fw-bold text-primary">$${prod.precio.toLocaleString()}</span>
                        <div class="btn-group">
                            <a href="producto.html?id=${encodeURIComponent(prod.id)}" class="btn btn-outline-secondary btn-sm">Ver más</a>
                            <button class="btn btn-primary btn-sm btn-agregar-carrito" data-id="${esc(prod.id)}" ${disponible ? "" : "disabled"}>
                                <i class="bi bi-cart-plus me-1"></i>Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        contenedor.appendChild(col);
    });

    document.querySelectorAll(".btn-agregar-carrito").forEach(btn => {
        btn.addEventListener("click", (e) => agregarAlCarritoCatalogo(e.currentTarget.dataset.id));
    });
}

// Antes de agregar se consulta el stock actual en Firestore
async function agregarAlCarritoCatalogo(idProducto) {
    let producto;
    try {
        producto = (await obtenerProductoConRespaldo(idProducto)).producto;
    } catch (error) {
        console.error(error);
        mostrarToast("No se pudo verificar el stock. Intentá de nuevo.");
        return;
    }
    if (!producto) { mostrarToast("El producto ya no está disponible."); return; }
    if (!hayStock(producto)) { mostrarToast(`"${producto.nombre}" está agotado.`); return; }

    const carrito = obtenerCarrito();
    const item = carrito.find(i => i.id === producto.id);

    if (item) {
        if (item.cantidad >= producto.stock) {
            mostrarToast(`No hay más stock disponible de "${producto.nombre}". Disponible: ${producto.stock}.`);
            return;
        }
        item.cantidad++;
        item.stock = producto.stock;
    } else {
        carrito.push({
            id: producto.id, nombre: producto.nombre, precio: producto.precio,
            imagen: producto.imagen, stock: producto.stock, cantidad: 1
        });
    }
    guardarCarrito(carrito);
    mostrarToast(`"${producto.nombre}" se agregó al carrito.`);
}

function limpiarFiltros() {
    if (inputBuscar) inputBuscar.value = "";
    if (selectCategoria) selectCategoria.value = "todas";
    if (selectOrden) selectOrden.value = "destacados";
    renderizarCatalogo();
    inputBuscar?.focus();
}

async function cargarProductos() {
    mostrarEstado(`<div class="text-center py-5" role="status">
        <div class="spinner-border text-primary" aria-hidden="true"></div>
        <p class="mt-3 text-secondary">Cargando productos...</p></div>`);
    try {
        const resultado = await obtenerProductosConRespaldo();
        todos = resultado.productos;
        mostrarAvisoRespaldo(resultado.respaldo ? resultado.motivo : null);
        if (todos.length === 0) {
            mostrarEstado(`<div class="alert alert-info text-center" role="alert">Todavía no hay productos cargados en la tienda.</div>`);
            return;
        }
        renderizarCatalogo();
    } catch (error) {
        console.error("Error al consultar productos:", error);
        mostrarEstado(`<div class="alert alert-danger text-center" role="alert">
            No se pudieron cargar los productos. Revisá tu conexión e intentá de nuevo.
            <div class="mt-3"><button type="button" class="btn btn-outline-danger btn-sm" id="btnReintentar">Reintentar</button></div></div>`);
        document.getElementById("btnReintentar").addEventListener("click", cargarProductos);
    }
}

inputBuscar?.addEventListener("input", renderizarCatalogo);
selectCategoria?.addEventListener("change", renderizarCatalogo);
selectOrden?.addEventListener("change", renderizarCatalogo);
btnLimpiar?.addEventListener("click", limpiarFiltros);

cargarProductos();
