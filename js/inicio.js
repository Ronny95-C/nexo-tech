// js/inicio.js
// Genera los productos destacados del home a partir de obtenerProductos() (js/base.js),
// para que precios, nombres y stock coincidan siempre con el catálogo.

const IDS_DESTACADOS = ["p1", "p4", "p3", "p7"];

function renderDestacados() {
  const contenedor = document.getElementById("contenedorDestacados");
  if (!contenedor) return;

  const productos = obtenerProductos();
  const destacados = IDS_DESTACADOS
    .map(id => productos.find(p => p.id === id))
    .filter(Boolean);

  contenedor.innerHTML = destacados.map(p => `
    <div class="col-md-6 col-xl-3">
      <article class="card h-100 shadow-sm product-card">
        <img src="${p.imagen}" class="card-img-top p-3 rounded-4" alt="${p.nombre}" style="height: 200px; object-fit: contain;">
        <div class="card-body d-flex flex-column p-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-primary text-uppercase">${p.categoria}</span>
            <span class="badge ${p.stock > 0 ? "bg-success-subtle text-success border border-success-subtle" : "bg-danger-subtle text-danger border border-danger-subtle"}">
              ${p.stock > 0 ? `Stock: ${p.stock} u.` : "Sin stock"}
            </span>
          </div>
          <h3 class="h5 card-title fw-bold text-dark">${p.nombre}</h3>
          <p class="card-text text-secondary small flex-grow-1">${p.descripcion}</p>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <strong class="fs-5 text-dark">$${p.precio.toLocaleString()}</strong>
            <a href="producto.html?id=${p.id}" class="btn btn-primary btn-sm">Ver producto</a>
          </div>
        </div>
      </article>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", renderDestacados);
