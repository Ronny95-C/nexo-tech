// js/perfil.js
// Página protegida: solo accesible con sesión iniciada.

import { auth, db } from "./firebase/config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { obtenerPedidosUsuario } from "./pedidos.js";
import { esc } from "./productos-firebase.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const cargando = document.getElementById("perfilCargando");
const errorBox = document.getElementById("perfilError");
const contenido = document.getElementById("perfilContenido");

function conTiempo(promesa, ms = 8000) {
  return Promise.race([
    promesa,
    new Promise((_, rechazar) => setTimeout(() => rechazar(new Error("tiempo-agotado")), ms))
  ]);
}

function formatearFecha(valor) {
  const fecha = valor && valor.toDate ? valor.toDate() : new Date(valor);
  return isNaN(fecha) ? "-" : fecha.toLocaleDateString("es-UY", { day: "2-digit", month: "long", year: "numeric" });
}

const dinero = (n) => `$ ${Number(n).toLocaleString("es-UY")}`;

function tarjetaPedido(p) {
  const filas = (p.items || []).map(i => `
    <tr><td>${esc(i.nombre)}</td><td class="text-center">${i.cantidad}</td>
    <td class="text-end">${dinero(i.precioUnitario)}</td><td class="text-end">${dinero(i.subtotal)}</td></tr>`).join("");
  return `
    <article class="card border-0 shadow-sm rounded-4 p-3 p-md-4 mb-3">
      <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
        <div>
          <h3 class="h6 fw-bold mb-0">Pedido <code>${esc(p.id)}</code></h3>
          <small class="text-secondary">${p.fecha?.toDate ? p.fecha.toDate().toLocaleString("es-UY") : "Procesando fecha..."}</small>
        </div>
        <span class="badge bg-primary text-uppercase">${esc(p.estado || "pendiente")}</span>
      </div>
      <div class="table-responsive">
        <table class="table table-sm align-middle mb-2">
          <thead><tr><th>Producto</th><th class="text-center">Cant.</th><th class="text-end">Precio</th><th class="text-end">Subtotal</th></tr></thead>
          <tbody>${filas}</tbody>
        </table>
      </div>
      <div class="text-end small text-secondary">Subtotal ${dinero(p.subtotal)} · IVA ${dinero(p.iva)}</div>
      <div class="text-end fw-bold fs-5">Total ${dinero(p.total)}</div>
    </article>`;
}

async function cargarPedidos(uid) {
  const lista = document.getElementById("pedidosLista");
  lista.innerHTML = `<div class="text-center py-3" role="status"><div class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></div> <span class="text-secondary">Cargando pedidos...</span></div>`;
  try {
    const pedidos = await obtenerPedidosUsuario(uid);
    lista.innerHTML = pedidos.length
      ? pedidos.map(tarjetaPedido).join("")
      : `<div class="alert alert-info">Todavía no realizaste ninguna compra. <a href="catalogo.html" class="alert-link">Ir al catálogo</a></div>`;
  } catch (error) {
    console.error("Error al cargar pedidos:", error);
    lista.innerHTML = `<div class="alert alert-danger">No se pudieron cargar tus pedidos. Intentá de nuevo más tarde.</div>`;
  }
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("acceso.html?next=perfil.html");
    return;
  }

  let datos = { uid: user.uid, nombre: user.displayName || "", email: user.email, rol: "cliente" };
  let avisoFirestore = false;

  try {
    const ref = doc(db, "usuarios", user.uid);
    const snap = await conTiempo(getDoc(ref));

    if (snap.exists()) {
      datos = { ...datos, ...snap.data() };
    } else {
      // Autorreparación: si el documento no existe, se crea con los datos de la sesión
      await conTiempo(setDoc(ref, { ...datos, fechaRegistro: serverTimestamp() }));
      datos.fechaRegistro = user.metadata.creationTime;
    }
  } catch (error) {
    console.error("Firestore no respondió:", error);
    avisoFirestore = true;
  }

  try {
    // El nombre de la sesión (Authentication) tiene prioridad
    const nombre = user.displayName || datos.nombre || user.email.split("@")[0];
    document.getElementById("perfilInicial").textContent = nombre.charAt(0).toUpperCase();
    document.getElementById("perfilNombre").textContent = nombre;
    document.getElementById("perfilEmail").textContent = user.email;
    document.getElementById("perfilRol").textContent = datos.rol || "cliente";
    document.getElementById("perfilFecha").textContent = formatearFecha(datos.fechaRegistro || user.metadata.creationTime);
    document.getElementById("perfilUid").textContent = user.uid;
    if (avisoFirestore) {
      const aviso = document.getElementById("perfilAviso");
      aviso.textContent = "No se pudo consultar la base de datos (Firestore). Se muestran los datos de tu sesión.";
      aviso.classList.remove("d-none");
    }

    cargando.classList.add("d-none");
    contenido.classList.remove("d-none");
    cargarPedidos(user.uid);
  } catch (error) {
    console.error(error);
    cargando.classList.add("d-none");
    errorBox.textContent = "No se pudieron cargar tus datos. Verificá tu conexión e intentá de nuevo.";
    errorBox.classList.remove("d-none");
  }
});
