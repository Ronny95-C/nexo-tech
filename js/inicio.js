// js/inicio.js
// Productos destacados del home: se leen de Firestore, igual que el catálogo.

import { obtenerProductosConRespaldo, hayStock, esc } from "./productos-firebase.js";

const IDS_DESTACADOS = ["p1", "p4", "p3", "p7"];
const contenedor = document.getElementById("contenedorDestacados");

function tarjeta(p) {
  const disponible = hayStock(p);
  return `
    <div class="col-md-6 col-xl-3">
      <article class="card h-100 shadow-sm product-card">
        <img src="${esc(p.imagen)}" class="card-img-top p-3 rounded-4" alt="${esc(p.nombre)}" style="height: 200px; object-fit: contain;">
        <div class="card-body d-flex flex-column p-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-primary text-uppercase">${esc(p.categoria)}</span>
            <span class="badge ${disponible ? "bg-success-subtle text-success border border-success-subtle" : "bg-danger-subtle text-danger border border-danger-subtle"}">
              ${disponible ? `Stock: ${p.stock} u.` : "Agotado"}
            </span>
          </div>
          <h3 class="h5 card-title fw-bold text-dark">${esc(p.nombre)}</h3>
          <p class="card-text text-secondary small flex-grow-1">${esc(p.descripcion)}</p>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <strong class="fs-5 text-dark">$${p.precio.toLocaleString()}</strong>
            <a href="producto.html?id=${encodeURIComponent(p.id)}" class="btn btn-primary btn-sm">Ver producto</a>
          </div>
        </div>
      </article>
    </div>`;
}

async function renderDestacados() {
  contenedor.innerHTML = `<div class="col-12 text-center py-4" role="status">
    <div class="spinner-border text-primary" aria-hidden="true"></div>
    <p class="mt-2 text-secondary">Cargando productos destacados...</p></div>`;
  try {
    const { productos } = await obtenerProductosConRespaldo();
    const destacados = IDS_DESTACADOS.map(id => productos.find(p => p.id === id)).filter(Boolean);
    contenedor.innerHTML = destacados.length
      ? destacados.map(tarjeta).join("")
      : `<div class="col-12"><div class="alert alert-info text-center" role="alert">Todavía no hay productos destacados.</div></div>`;
  } catch (error) {
    console.error("Error al consultar destacados:", error);
    contenedor.innerHTML = `<div class="col-12"><div class="alert alert-danger text-center" role="alert">
      No se pudieron cargar los productos destacados. <a href="catalogo.html" class="alert-link">Ir al catálogo</a></div></div>`;
  }
}

renderDestacados();
