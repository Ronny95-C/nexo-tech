document.addEventListener("DOMContentLoaded", () => {
    // Inicializar lógica de catálogo solo si estamos en la página del catálogo
    const inputBusqueda = document.getElementById("buscarProducto");
    const selectCategoria = document.getElementById("filtroCategoria");
    const selectOrden = document.getElementById("ordenarPor");
    const contenedor = document.getElementById("contenedorProductos");
    const alertaSinResultados = document.getElementById("sinResultados");

    if (inputBusqueda && selectCategoria && contenedor) {
        function filtrarYOrdenar() {
            const query = inputBusqueda.value.toLowerCase().trim();
            const categoria = selectCategoria.value;
            const criterioOrden = selectOrden ? selectOrden.value : "destacados";
            const items = Array.from(contenedor.querySelectorAll(".item-producto"));

            let visibles = 0;

            // Filtrado
            items.forEach(item => {
                const nombre = (item.dataset.nombre || "").toLowerCase();
                const textoCompleto = item.textContent.toLowerCase();
                const catItem = item.dataset.categoria || "";

                const coincideTexto = query === "" || nombre.includes(query) || textoCompleto.includes(query);
                const coincideCategoria = categoria === "todas" || catItem === categoria;

                if (coincideTexto && coincideCategoria) {
                    item.classList.remove("d-none");
                    visibles++;
                } else {
                    item.classList.add("d-none");
                }
            });

            // Ordenamiento de los elementos visibles
            if (criterioOrden === "precio-menor") {
                items.sort((a, b) => Number(a.dataset.precio || 0) - Number(b.dataset.precio || 0));
                items.forEach(item => contenedor.appendChild(item));
            } else if (criterioOrden === "precio-mayor") {
                items.sort((a, b) => Number(b.dataset.precio || 0) - Number(a.dataset.precio || 0));
                items.forEach(item => contenedor.appendChild(item));
            }

            // Mostrar u ocultar mensaje de "sin resultados"
            if (alertaSinResultados) {
                if (visibles === 0) {
                    alertaSinResultados.classList.remove("d-none");
                } else {
                    alertaSinResultados.classList.add("d-none");
                }
            }
        }

        // Listeners de eventos
        inputBusqueda.addEventListener("input", filtrarYOrdenar);
        selectCategoria.addEventListener("change", filtrarYOrdenar);
        if (selectOrden) {
            selectOrden.addEventListener("change", filtrarYOrdenar);
        }
    }
});