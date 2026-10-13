// js/pedidos.js
// Confirmación de compra (transacción en Firestore) y consulta de pedidos del usuario.

import { db } from "./firebase/config.js";
import {
  collection, doc, runTransaction, serverTimestamp, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { conTiempo } from "./productos-firebase.js";

export const TASA_IVA = 0.22;

export class ErrorCompra extends Error {
  constructor(mensaje, detalles = []) {
    super(mensaje);
    this.detalles = detalles;
  }
}

// Todo ocurre dentro de una transacción: se lee el stock ACTUAL, se valida, se descuenta y se registra el pedido.
// Si algo falla no se guarda nada; y como se valida stock >= cantidad, nunca queda un stock negativo.
export async function confirmarCompra(usuario, carrito) {
  if (!usuario) throw new ErrorCompra("Tenés que iniciar sesión para comprar.");
  if (!carrito.length) throw new ErrorCompra("El carrito está vacío.");

  const pedidoRef = doc(collection(db, "pedidos"));

  const resultado = await runTransaction(db, async (tx) => {
    // 1) Lecturas (Firestore exige leer todo antes de escribir)
    const lecturas = [];
    for (const item of carrito) {
      const ref = doc(db, "productos", String(item.id));
      lecturas.push({ item, ref, snap: await tx.get(ref) });
    }

    // 2) Validación con los datos actuales
    const problemas = [];
    const lineas = [];
    for (const { item, ref, snap } of lecturas) {
      const cantidad = Number(item.cantidad);
      if (!Number.isInteger(cantidad) || cantidad < 1) { problemas.push(`${item.nombre}: cantidad inválida.`); continue; }
      if (!snap.exists()) { problemas.push(`${item.nombre}: ya no está disponible.`); continue; }
      const p = snap.data();
      const stock = Number(p.stock) || 0;
      if (p.disponibilidad === false || stock <= 0) { problemas.push(`${p.nombre}: está agotado.`); continue; }
      if (cantidad > stock) { problemas.push(`${p.nombre}: solo quedan ${stock} unidad(es).`); continue; }
      const precio = Number(p.precio) || 0;
      lineas.push({
        ref,
        stockNuevo: stock - cantidad,
        linea: { productoId: snap.id, nombre: p.nombre, precioUnitario: precio, cantidad, subtotal: precio * cantidad }
      });
    }
    if (problemas.length) throw new ErrorCompra("No se pudo confirmar la compra.", problemas);

    // 3) Total calculado con los precios actuales
    const subtotal = lineas.reduce((acc, l) => acc + l.linea.subtotal, 0);
    const iva = Math.round(subtotal * TASA_IVA);
    const total = subtotal + iva;

    // 4) Escrituras: stock y pedido
    for (const l of lineas) {
      tx.update(l.ref, { stock: l.stockNuevo, disponibilidad: l.stockNuevo > 0 });
    }
    tx.set(pedidoRef, {
      uid: usuario.uid,
      email: usuario.email,
      nombre: usuario.displayName || "",
      items: lineas.map(l => l.linea),
      subtotal, iva, total,
      fecha: serverTimestamp(),
      estado: "pendiente"
    });
    return { subtotal, iva, total };
  });

  return { pedidoId: pedidoRef.id, ...resultado };
}

// Solo los pedidos del usuario indicado (las reglas de Firestore también lo exigen)
export async function obtenerPedidosUsuario(uid) {
  const snap = await conTiempo(getDocs(query(collection(db, "pedidos"), where("uid", "==", uid))));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.fecha?.seconds || 0) - (a.fecha?.seconds || 0));
}
