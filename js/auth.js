// js/auth.js
// Se carga en todas las páginas: actualiza el navbar según el estado de la sesión.

import { auth } from "./firebase/config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

function escapar(texto) {
  const d = document.createElement("div");
  d.textContent = texto;
  return d.innerHTML;
}

function renderNavbar(user) {
  const zona = document.getElementById("navUsuario");
  if (!zona) return;

  if (!user) {
    zona.innerHTML = `<a href="acceso.html" class="btn btn-primary btn-sm fw-semibold" id="btnIngresar">Ingresar</a>`;
    return;
  }

  const nombre = user.displayName || user.email.split("@")[0];
  zona.innerHTML = `
    <div class="dropdown">
      <button class="btn btn-outline-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="bi bi-person-circle me-1"></i>Hola, ${escapar(nombre)}
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><a class="dropdown-item" href="perfil.html">Mi perfil</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><button class="dropdown-item" type="button" id="btnCerrarSesion">Cerrar sesión</button></li>
      </ul>
    </div>`;

  document.getElementById("btnCerrarSesion").addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "index.html";
    } catch (e) {
      console.error(e);
      if (typeof mostrarToast === "function") mostrarToast("No se pudo cerrar la sesión. Intentá de nuevo.");
    }
  });
}

onAuthStateChanged(auth, renderNavbar);
