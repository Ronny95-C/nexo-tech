document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedorProductos");
    const inputBuscar = document.getElementById("buscarProducto");
    const selectCategoria = document.getElementById("filtroCategoria");
    const selectOrden = document.getElementById("ordenarPor");
    const sinResultados = document.getElementById("sinResultados");
    const btnLimpiar = document.getElementById("btnLimpiarFiltros");

    if (!contenedor) return;

    // Función auxiliar para normalizar texto (quitar tildes y convertir a minúsculas)
    function normalizarTexto(texto) {
        return (texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    function renderizarCatalogo() {
        let productos = obtenerProductos();

        // 1. Filtrar por Búsqueda de Texto (Nombre, Descripción o Categoría)
        const query = normalizarTexto(inputBuscar ? inputBuscar.value : "");
        if (query) {
            productos = productos.filter(p => {
                const nombre = normalizarTexto(p.nombre);
                const desc = normalizarTexto(p.descripcion);
                const cat = normalizarTexto(p.categoria);
                return nombre.includes(query) || desc.includes(query) || cat.includes(query);
            });
        }

        // 2. Filtrar por Categoría
        const catSeleccionada = selectCategoria ? selectCategoria.value : "todas";
        if (catSeleccionada !== "todas") {
            const catNorm = normalizarTexto(catSeleccionada);
            productos = productos.filter(p => normalizarTexto(p.categoria) === catNorm);
        }

        // 3. Ordenar
        const orden = selectOrden ? selectOrden.value : "destacados";
        if (orden === "precio-menor") {
            productos.sort((a, b) => a.precio - b.precio);
        } else if (orden === "precio-mayor") {
            productos.sort((a, b) => b.precio - a.precio);
        }

        // 4. Renderizar en el DOM
        contenedor.innerHTML = "";

        if (productos.length === 0) {
            if (sinResultados) sinResultados.classList.remove("d-none");
            return;
        }

        if (sinResultados) sinResultados.classList.add("d-none");

        productos.forEach(prod => {
            const col = document.createElement("div");
            col.className = "col-12 col-md-6 col-lg-4";
            col.innerHTML = `
                <div class="card h-100 shadow-sm border-0 product-card">
                    <img src="${prod.imagen}" class="card-img-top p-3 rounded" alt="${prod.nombre}" style="height: 200px; object-fit: contain;">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-light text-primary border border-primary-subtle">${prod.categoria}</span>
                            <span class="badge bg-success-subtle text-success border border-success-subtle">Stock: ${prod.stock} u.</span>
                        </div>
                        <h5 class="card-title fw-bold text-dark fs-6">${prod.nombre}</h5>
                        <p class="card-text text-secondary small flex-grow-1">${prod.descripcion}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="fs-5 fw-bold text-primary">$${prod.precio.toLocaleString()}</span>
                            <div class="btn-group">
                                <a href="producto.html?id=${prod.id}" class="btn btn-outline-secondary btn-sm">Ver más</a>
                                <button class="btn btn-primary btn-sm btn-agregar-carrito" data-id="${prod.id}">
                                    <i class="bi bi-cart-plus me-1"></i>Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            contenedor.appendChild(col);
        });

        // Eventos para botones de agregar al carrito
        document.querySelectorAll(".btn-agregar-carrito").forEach(btn => {
            btn.addEventListener("click", (e) => {
                // Mantener como String ("p1", "p2", etc.)
                const id = e.currentTarget.dataset.id;
                agregarAlCarritoCatalogo(id);
            });
        });
    }

    // Función auxiliar para añadir productos al carrito desde la tarjeta
    function agregarAlCarritoCatalogo(idProducto) {
        const productos = obtenerProductos();
        const producto = productos.find(p => p.id === idProducto);
        if (!producto) return;

        let carrito = obtenerCarrito();
        const itemExistente = carrito.find(item => item.id === idProducto);

        if (itemExistente) {
            if (itemExistente.cantidad < producto.stock) {
                itemExistente.cantidad++;
                mostrarToast(`Se agregó otra unidad de "${producto.nombre}" al carrito.`);
            } else {
                mostrarToast(`No hay más stock disponible de "${producto.nombre}".`);
                return;
            }
        } else {
            if (producto.stock > 0) {
                carrito.push({
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    imagen: producto.imagen,
                    stock: producto.stock,
                    cantidad: 1
                });
                mostrarToast(`"${producto.nombre}" se agregó al carrito.`);
            } else {
                mostrarToast(`Producto agotado.`);
                return;
            }
        }

        guardarCarrito(carrito);
    }

    // Restablece búsqueda, categoría y orden
    function limpiarFiltros() {
        if (inputBuscar) inputBuscar.value = "";
        if (selectCategoria) selectCategoria.value = "todas";
        if (selectOrden) selectOrden.value = "destacados";
        renderizarCatalogo();
        if (inputBuscar) inputBuscar.focus();
    }

    // Escuchar eventos de cambio en filtros e input
    if (inputBuscar) inputBuscar.addEventListener("input", renderizarCatalogo);
    if (selectCategoria) selectCategoria.addEventListener("change", renderizarCatalogo);
    if (selectOrden) selectOrden.addEventListener("change", renderizarCatalogo);
    if (btnLimpiar) btnLimpiar.addEventListener("click", limpiarFiltros);

    // Carga inicial
    renderizarCatalogo();
});
