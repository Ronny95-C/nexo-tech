document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedorProductos");
    const inputBuscar = document.getElementById("buscarProducto");
    const selectCategoria = document.getElementById("filtroCategoria");
    const selectOrden = document.getElementById("ordenarPor");
    const sinResultados = document.getElementById("sinResultados");

    if (!contenedor) return;

    // Función auxiliar para normalizar texto (quitar tildes y convertir a minúsculas)
    function normalizarTexto(texto) {
        return (texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    function renderizarCatálogo() {
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
                        <span class="badge bg-light text-primary border border-primary-subtle align-self-start mb-2">${prod.categoria}</span>
                        <h5 class="card-title fw-bold text-dark fs-6">${prod.nombre}</h5>
                        <p class="card-text text-secondary small flex-grow-1">${prod.descripcion}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="fs-5 fw-bold text-primary">$${prod.precio.toLocaleString()}</span>
                            <div class="btn-group">
                                <a href="producto.html?id=${prod.id}" class="btn btn-outline-secondary btn-sm">Ver más</a>
                                <button class="btn btn-primary btn-sm btn-agregar-carrito" data-id="${prod.id}">
                                    🛒 Agregar
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
                const id = parseInt(e.currentTarget.dataset.id);
                if (typeof agregarAlCarrito === "function") {
                    agregarAlCarrito(id);
                }
            });
        });
    }

    // Escuchar eventos de cambio en filtros e input
    if (inputBuscar) inputBuscar.addEventListener("input", renderizarCatálogo);
    if (selectCategoria) selectCategoria.addEventListener("change", renderizarCatálogo);
    if (selectOrden) selectOrden.addEventListener("change", renderizarCatálogo);

    // Carga inicial
    renderizarCatálogo();
});