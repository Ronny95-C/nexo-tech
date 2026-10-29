// js/admin.js
// Panel administrativo: solo para usuarios con rol "admin".
// Gestión de productos (alta, edición, baja, eliminación, stock y disponibilidad) y consulta de pedidos.

import { auth, db } from "./firebase/config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { esAdministrador } from "./roles.js";
import { conTiempo, obtenerProductosFirestore, esc } from "./productos-firebase.js";

const $ = (id) => document.getElementById(id);
const dinero = (n) => `$ ${Number(n).toLocaleString("es-UY")}`;

let productos = [];
let modal = null;
let pedidosCargados = false;

function alerta(tipo, texto) {
  const a = $("adminAlerta");
  a.className = `alert alert-${tipo}`;
  a.textContent = texto;
}

// ---------------- Acceso ----------------
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("acceso.html?next=admin.html");
    return;
  }
  const admin = await esAdministrador(user);
  $("adminCargando").classList.add("d-none");
  if (!admin) {
    // Usuario sin permisos (por ejemplo, un cliente que escribió la URL): se le explica y se lo redirige
    $("adminDenegado").classList.remove("d-none");
    setTimeout(() => window.location.replace("index.html"), 4000);
    return;
  }
  $("adminPanel").classList.remove("d-none");
  iniciar();
});

let iniciado = false;
function iniciar() {
  if (iniciado) return;
  iniciado = true;
  modal = bootstrap.Modal.getOrCreateInstance($("modalProducto"));

  document.querySelectorAll("[data-tab]").forEach(b => b.addEventListener("click", () => cambiarPestana(b.dataset.tab)));
  $("btnNuevoProducto").addEventListener("click", () => abrirModal(null));
  $("formProducto").addEventListener("submit", guardarProducto);
  $("tablaProductos").addEventListener("click", accionTabla);
  $("tablaProductos").addEventListener("change", cambiarDisponibilidad);
  $("btnActualizarPedidos").addEventListener("click", cargarPedidos);
  cargarProductos();
}

function cambiarPestana(nombre) {
  document.querySelectorAll("[data-tab]").forEach(b => {
    const activa = b.dataset.tab === nombre;
    b.classList.toggle("active", activa);
    b.setAttribute("aria-selected", activa);
  });
  $("tabProductos").classList.toggle("d-none", nombre !== "productos");
  $("tabPedidos").classList.toggle("d-none", nombre !== "pedidos");
  if (nombre === "pedidos" && !pedidosCargados) cargarPedidos();
}

// ---------------- Productos ----------------
async function cargarProductos() {
  const cuerpo = $("tablaProductos");
  cuerpo.innerHTML = `<tr><td colspan="7" class="text-center py-4"><div class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></div> Cargando productos...</td></tr>`;
  try {
    productos = await obtenerProductosFirestore();
    renderProductos();
  } catch (error) {
    console.error(error);
    cuerpo.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4">No se pudieron cargar los productos.</td></tr>`;
  }
}

function renderProductos() {
  const cuerpo = $("tablaProductos");
  if (productos.length === 0) {
    cuerpo.innerHTML = `<tr><td colspan="7" class="text-center text-secondary py-4">No hay productos. Usá "Nuevo producto" para crear el primero.</td></tr>`;
    return;
  }
  cuerpo.innerHTML = productos.map(p => `
    <tr>
      <td><code>${esc(p.id)}</code></td>
      <td>${esc(p.nombre)}</td>
      <td>${esc(p.categoria)}</td>
      <td class="text-end">${dinero(p.precio)}</td>
      <td class="text-center">${p.stock}</td>
      <td class="text-center">
        <div class="form-check form-switch d-inline-block">
          <input class="form-check-input" type="checkbox" role="switch" data-id="${esc(p.id)}"
            aria-label="Disponible: ${esc(p.nombre)}" ${p.disponibilidad ? "checked" : ""}>
        </div>
      </td>
      <td class="text-end text-nowrap">
        <button type="button" class="btn btn-outline-primary btn-sm" data-accion="editar" data-id="${esc(p.id)}">
          <i class="bi bi-pencil" aria-hidden="true"></i> Editar</button>
        <button type="button" class="btn btn-outline-danger btn-sm" data-accion="eliminar" data-id="${esc(p.id)}">
          <i class="bi bi-trash" aria-hidden="true"></i> Eliminar</button>
      </td>
    </tr>`).join("");
}

function accionTabla(e) {
  const btn = e.target.closest("[data-accion]");
  if (!btn) return;
  const producto = productos.find(p => p.id === btn.dataset.id);
  if (!producto) return;
  if (btn.dataset.accion === "editar") abrirModal(producto);
  if (btn.dataset.accion === "eliminar") eliminarProducto(producto);
}

// Baja / alta rápida: cambia solo la disponibilidad
async function cambiarDisponibilidad(e) {
  const input = e.target.closest("input[type=checkbox][data-id]");
  if (!input) return;
  const producto = productos.find(p => p.id === input.dataset.id);
  try {
    await conTiempo(updateDoc(doc(db, "productos", producto.id), { disponibilidad: input.checked }));
    producto.disponibilidad = input.checked;
    alerta("success", `"${producto.nombre}" ahora está ${input.checked ? "disponible" : "dado de baja (no disponible)"}.`);
  } catch (error) {
    console.error(error);
    input.checked = !input.checked;
    alerta("danger", "No se pudo cambiar la disponibilidad.");
  }
}

async function eliminarProducto(producto) {
  if (!confirm(`¿Eliminar definitivamente "${producto.nombre}"? Esta acción no se puede deshacer.\n\nSi solo querés que no se venda, usá el interruptor de Disponible.`)) return;
  try {
    await conTiempo(deleteDoc(doc(db, "productos", producto.id)));
    productos = productos.filter(p => p.id !== producto.id);
    renderProductos();
    alerta("success", `"${producto.nombre}" fue eliminado.`);
  } catch (error) {
    console.error(error);
    alerta("danger", "No se pudo eliminar el producto.");
  }
}

function siguienteId() {
  const max = productos.reduce((m, p) => {
    const n = /^p(\d+)$/.exec(p.id);
    return n ? Math.max(m, Number(n[1])) : m;
  }, 0);
  return `p${max + 1}`;
}

function abrirModal(p) {
  $("msgProducto").className = "d-none";
  $("tituloModalProducto").textContent = p ? `Editar producto (${p.id})` : "Nuevo producto";
  $("pId").value = p ? p.id : "";
  $("pNombre").value = p ? p.nombre : "";
  $("pDescripcion").value = p ? p.descripcion : "";
  $("pCategoria").value = p ? p.categoria : "";
  $("pPrecio").value = p ? p.precio : "";
  $("pStock").value = p ? p.stock : "";
  $("pDisponible").checked = p ? p.disponibilidad : true;
  $("pImagenes").value = p ? p.imagenes.join("\n") : "";
  $("pCaracteristicas").value = p ? p.caracteristicas.join("\n") : "";
  modal.show();
}

async function guardarProducto(e) {
  e.preventDefault();
  const lineas = (texto) => texto.split("\n").map(l => l.trim()).filter(Boolean);

  const nombre = $("pNombre").value.trim();
  const descripcion = $("pDescripcion").value.trim();
  const categoria = $("pCategoria").value;
  const precio = Number($("pPrecio").value);
  const stock = Number($("pStock").value);
  const imagenes = lineas($("pImagenes").value);
  const caracteristicas = lineas($("pCaracteristicas").value);

  const errores = [];
  if (nombre.length < 3) errores.push("El nombre debe tener al menos 3 caracteres.");
  if (descripcion.length < 10) errores.push("La descripción debe tener al menos 10 caracteres.");
  if (!categoria) errores.push("Elegí una categoría.");
  if (!(precio > 0)) errores.push("El precio debe ser mayor que 0.");
  if (!Number.isInteger(stock) || stock < 0) errores.push("El stock debe ser un número entero de 0 o más.");
  if (imagenes.length === 0 || imagenes.some(u => !/^(https?:\/\/|assets\/)/.test(u))) {
    errores.push("Indicá al menos una imagen; cada línea debe empezar con http(s):// o assets/.");
  }
  if (errores.length) {
    const m = $("msgProducto");
    m.className = "alert alert-danger";
    m.textContent = errores.join(" ");
    return;
  }

  const id = $("pId").value || siguienteId();
  const btn = $("btnGuardarProducto");
  btn.disabled = true;
  try {
    await conTiempo(setDoc(doc(db, "productos", id), {
      nombre, descripcion, categoria, precio, stock,
      disponibilidad: $("pDisponible").checked,
      imagenes, caracteristicas
    }, { merge: true }));
    modal.hide();
    await cargarProductos();
    alerta("success", `Producto "${nombre}" guardado (${id}).`);
  } catch (error) {
    console.error(error);
    const m = $("msgProducto");
    m.className = "alert alert-danger";
    m.textContent = "No se pudo guardar el producto. Revisá tu conexión y tus permisos.";
  } finally {
    btn.disabled = false;
  }
}

// ---------------- Pedidos ----------------
async function cargarPedidos() {
  const lista = $("listaPedidosAdmin");
  lista.innerHTML = `<div class="text-center py-3" role="status"><div class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></div> Cargando pedidos...</div>`;
  try {
    const snap = await conTiempo(getDocs(collection(db, "pedidos")));
    const pedidos = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.fecha?.seconds || 0) - (a.fecha?.seconds || 0));
    pedidosCargados = true;
    if (pedidos.length === 0) {
      lista.innerHTML = `<div class="alert alert-info">Todavía no hay pedidos.</div>`;
      return;
    }
    lista.innerHTML = pedidos.map(p => `
      <article class="card border-0 shadow-sm rounded-4 p-3 mb-3">
        <div class="d-flex justify-content-between flex-wrap gap-2">
          <div>
            <h3 class="h6 fw-bold mb-0">Pedido <code>${esc(p.id)}</code></h3>
            <small class="text-secondary">${p.fecha?.toDate ? p.fecha.toDate().toLocaleString("es-UY") : "-"}</small>
          </div>
          <span class="badge bg-primary text-uppercase align-self-start">${esc(p.estado || "pendiente")}</span>
        </div>
        <div class="small mt-2">Cliente: <strong>${esc(p.nombre || "-")}</strong> (${esc(p.email || "-")})</div>
        <ul class="small mt-2 mb-2">
          ${(p.items || []).map(i => `<li>${i.cantidad} × ${esc(i.nombre)} — ${dinero(i.subtotal)}</li>`).join("")}
        </ul>
        <div class="text-end fw-bold">Total ${dinero(p.total)}</div>
      </article>`).join("");
  } catch (error) {
    console.error(error);
    lista.innerHTML = `<div class="alert alert-danger">No se pudieron cargar los pedidos.</div>`;
  }
}
