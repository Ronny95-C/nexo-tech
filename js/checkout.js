// js/checkout.js
// Botón "Finalizar Compra" del carrito: exige sesión y registra el pedido en Firestore.

import { auth } from "./firebase/config.js";
import { confirmarCompra, ErrorCompra } from "./pedidos.js";
import { esc } from "./productos-firebase.js";

const btn = document.getElementById("btnFinalizarCompra");
const resultado = document.getElementById("resultadoCompra");

function mostrar(tipo, html) {
  resultado.className = `alert alert-${tipo}`;
  resultado.innerHTML = html;
  resultado.scrollIntoView({ behavior: "smooth", block: "center" });
}

btn.addEventListener("click", async () => {
  await auth.authStateReady?.();
  const usuario = auth.currentUser;

  if (!usuario) {
    mostrar("warning", `Para finalizar la compra tenés que <a href="acceso.html?next=carrito.html" class="alert-link">iniciar sesión</a>.`);
    return;
  }

  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    mostrar("info", "Tu carrito está vacío.");
    return;
  }

  const textoOriginal = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Procesando compra...";

  try {
    const pedido = await confirmarCompra(usuario, carrito);
    // El carrito se vacía solo cuando todo terminó bien
    guardarCarrito([]);
    renderizarPaginaCarrito();
    mostrar("success", `<strong>¡Compra confirmada!</strong> Tu pedido <code>${esc(pedido.pedidoId)}</code> por
      $ ${pedido.total.toLocaleString("es-UY")} quedó registrado. Podés verlo en <a href="perfil.html" class="alert-link">Mi perfil</a>.`);
  } catch (error) {
    console.error("Error al confirmar la compra:", error);
    if (error instanceof ErrorCompra) {
      const detalle = error.detalles.map(d => `<li>${esc(d)}</li>`).join("");
      mostrar("danger", `<strong>${esc(error.message)}</strong>${detalle ? `<ul class="mb-0 mt-2">${detalle}</ul>` : ""}
        <div class="mt-2">Ajustá las cantidades del carrito e intentá de nuevo.</div>`);
    } else {
      mostrar("danger", "No se pudo registrar la compra. Revisá tu conexión e intentá de nuevo. Tu carrito no se modificó.");
    }
  } finally {
    btn.disabled = false;
    btn.textContent = textoOriginal;
  }
});
