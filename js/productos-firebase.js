// js/productos-firebase.js
// Acceso a la colección "productos" de Cloud Firestore (fuente principal del catálogo).

import { db } from "./firebase/config.js";
import { collection, getDocs, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Si Firestore no responde (base no creada, sin conexión), la interfaz no queda esperando para siempre
export function conTiempo(promesa, ms = 10000) {
  return Promise.race([
    promesa,
    new Promise((_, rechazar) => setTimeout(() => rechazar(new Error("tiempo-agotado")), ms))
  ]);
}

export function esc(texto) {
  const d = document.createElement("div");
  d.textContent = texto ?? "";
  return d.innerHTML;
}

// Unifica el formato de un documento: siempre tiene "imagenes" (lista) e "imagen" (la principal)
function normalizar(id, d) {
  const imagenes = Array.isArray(d.imagenes) ? d.imagenes : (d.imagen ? [d.imagen] : []);
  return {
    ...d,
    id,
    imagenes,
    imagen: imagenes[0] || "",
    caracteristicas: Array.isArray(d.caracteristicas) ? d.caracteristicas : [],
    precio: Number(d.precio) || 0,
    stock: Number(d.stock) || 0,
    disponibilidad: d.disponibilidad !== false
  };
}

export function hayStock(producto) {
  return producto.disponibilidad && producto.stock > 0;
}

export async function obtenerProductosFirestore() {
  const snap = await conTiempo(getDocs(collection(db, "productos")));
  return snap.docs
    .map(d => normalizar(d.id, d.data()))
    .sort((a, b) => a.id.localeCompare(b.id, "es", { numeric: true }));
}

// Devuelve el producto o null si no existe
export async function obtenerProductoPorId(id) {
  const snap = await conTiempo(getDoc(doc(db, "productos", String(id))));
  return snap.exists() ? normalizar(snap.id, snap.data()) : null;
}

// ---------- Respaldo local ----------
// El arreglo PRODUCTOS_INICIALES (js/base.js) se usa solo si Firestore falla o la colección está vacía.
function locales() {
  const lista = typeof PRODUCTOS_INICIALES !== "undefined" ? PRODUCTOS_INICIALES : [];
  return lista.map(p => normalizar(p.id, { ...p, disponibilidad: p.stock > 0 }));
}

export async function obtenerProductosConRespaldo() {
  try {
    const lista = await obtenerProductosFirestore();
    if (lista.length) return { productos: lista, respaldo: false };
    return { productos: locales(), respaldo: true, motivo: "La colección \"productos\" de Firestore está vacía." };
  } catch (error) {
    console.error("Error al consultar Firestore:", error);
    return { productos: locales(), respaldo: true, motivo: `No se pudo leer Firestore (${error.code || error.message}).` };
  }
}

export async function obtenerProductoConRespaldo(id) {
  try {
    const producto = await obtenerProductoPorId(id);
    if (producto) return { producto, respaldo: false };
    const lista = await obtenerProductosFirestore();
    if (lista.length) return { producto: null, respaldo: false };
  } catch (error) {
    console.error("Error al consultar Firestore:", error);
  }
  return { producto: locales().find(p => p.id === String(id)) || null, respaldo: true };
}
