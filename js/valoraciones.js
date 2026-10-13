// js/valoraciones.js
// Valoraciones (1 a 5 estrellas) y comentarios por producto, guardados en Firestore (colección "valoraciones").

import { auth, db } from "./firebase/config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  collection, query, where, getDocs, doc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { conTiempo, esc } from "./productos-firebase.js";

const idProducto = new URLSearchParams(window.location.search).get("id");
const seccion = document.getElementById("seccionValoraciones");
const resumen = document.getElementById("resumenValoraciones");
const lista = document.getElementById("listaValoraciones");
const formBox = document.getElementById("formularioValoracion");

let usuario = null;
let valoraciones = [];
let miPuntuacion = 0;
let iniciado = false;

function estrellas(n) {
  let html = "";
  for (let i = 1; i <= 5; i++) html += `<i class="bi ${i <= n ? "bi-star-fill" : "bi-star"} text-warning" aria-hidden="true"></i>`;
  return `<span role="img" aria-label="${n} de 5 estrellas">${html}</span>`;
}

function fechaCorta(v) {
  return v?.toDate ? v.toDate().toLocaleDateString("es-UY") : "";
}

function renderLista() {
  if (valoraciones.length === 0) {
    resumen.textContent = "Todavía no hay valoraciones para este producto.";
    lista.innerHTML = "";
    return;
  }
  const promedio = valoraciones.reduce((a, v) => a + v.puntuacion, 0) / valoraciones.length;
  resumen.innerHTML = `${estrellas(Math.round(promedio))} <strong>${promedio.toFixed(1)}</strong> de 5 · ${valoraciones.length} valoración(es)`;
  lista.innerHTML = valoraciones.map(v => `
    <article class="border-top py-3">
      <div class="d-flex justify-content-between flex-wrap gap-1">
        <strong>${esc(v.nombre || "Usuario")}</strong>
        <small class="text-secondary">${fechaCorta(v.fecha)}</small>
      </div>
      <div class="mb-1">${estrellas(v.puntuacion)}</div>
      <p class="mb-0">${esc(v.comentario)}</p>
    </article>`).join("");
}

async function cargarValoraciones() {
  try {
    const snap = await conTiempo(getDocs(query(collection(db, "valoraciones"), where("productoId", "==", idProducto))));
    valoraciones = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.fecha?.seconds || 0) - (a.fecha?.seconds || 0));
    renderLista();
  } catch (error) {
    console.error("Error al cargar valoraciones:", error);
    resumen.textContent = "No se pudieron cargar las valoraciones. Intentá de nuevo más tarde.";
    lista.innerHTML = "";
  }
}

function pintarEstrellas() {
  formBox.querySelectorAll("[data-valor]").forEach(b => {
    const activa = Number(b.dataset.valor) <= miPuntuacion;
    b.querySelector("i").className = `bi ${activa ? "bi-star-fill" : "bi-star"}`;
    b.setAttribute("aria-pressed", activa);
  });
}

function mensaje(tipo, texto) {
  const caja = document.getElementById("msgValoracion");
  caja.className = `alert alert-${tipo}`;
  caja.textContent = texto;
}

function renderFormulario() {
  if (!usuario) {
    formBox.innerHTML = `<div class="alert alert-secondary mb-0">Para dejar tu opinión necesitás
      <a href="acceso.html?next=${encodeURIComponent("producto.html?id=" + idProducto)}" class="alert-link">iniciar sesión</a>.</div>`;
    return;
  }
  const mia = valoraciones.find(v => v.uid === usuario.uid);
  miPuntuacion = mia ? mia.puntuacion : 0;

  formBox.innerHTML = `
    <h3 class="h6 fw-bold">${mia ? "Editar tu opinión" : "Dejá tu opinión"}</h3>
    <div id="msgValoracion" class="d-none" role="alert"></div>
    <div class="mb-3" role="group" aria-label="Puntuación de 1 a 5 estrellas">
      ${[1, 2, 3, 4, 5].map(n => `<button type="button" class="btn btn-link p-0 me-1 fs-3 text-warning" data-valor="${n}"
        aria-label="${n} estrella${n > 1 ? "s" : ""}"><i class="bi bi-star"></i></button>`).join("")}
    </div>
    <div class="mb-3">
      <label for="comentarioInput" class="form-label">Comentario</label>
      <textarea id="comentarioInput" class="form-control" rows="3" maxlength="500"></textarea>
      <div class="form-text">Entre 3 y 500 caracteres.</div>
    </div>
    <button type="button" id="btnPublicar" class="btn btn-primary">${mia ? "Actualizar valoración" : "Publicar valoración"}</button>`;

  document.getElementById("comentarioInput").value = mia ? mia.comentario : "";
  pintarEstrellas();

  formBox.querySelectorAll("[data-valor]").forEach(b => b.addEventListener("click", () => {
    miPuntuacion = Number(b.dataset.valor);
    pintarEstrellas();
  }));
  document.getElementById("btnPublicar").addEventListener("click", publicar);
}

async function publicar() {
  const comentario = document.getElementById("comentarioInput").value.trim();
  if (!Number.isInteger(miPuntuacion) || miPuntuacion < 1 || miPuntuacion > 5) { mensaje("danger", "Elegí una puntuación de 1 a 5 estrellas."); return; }
  if (comentario.length < 3 || comentario.length > 500) { mensaje("danger", "El comentario debe tener entre 3 y 500 caracteres."); return; }

  const btn = document.getElementById("btnPublicar");
  btn.disabled = true;
  try {
    // Un documento por usuario y producto: volver a opinar actualiza la valoración anterior
    await conTiempo(setDoc(doc(db, "valoraciones", `${idProducto}_${usuario.uid}`), {
      productoId: idProducto,
      uid: usuario.uid,
      nombre: usuario.displayName || usuario.email.split("@")[0],
      puntuacion: miPuntuacion,
      comentario,
      fecha: serverTimestamp()
    }));
    await cargarValoraciones();
    renderFormulario();
    mensaje("success", "¡Gracias! Tu valoración fue guardada.");
  } catch (error) {
    console.error("Error al guardar la valoración:", error);
    mensaje("danger", "No se pudo guardar tu valoración. Intentá de nuevo.");
    btn.disabled = false;
  }
}

// producto.js avisa cuando el producto existe y se mostró
document.addEventListener("producto-cargado", async () => {
  seccion.classList.remove("d-none");
  await cargarValoraciones();
  iniciado = true;
  renderFormulario();
});

onAuthStateChanged(auth, (u) => {
  usuario = u;
  if (iniciado) renderFormulario();
});
