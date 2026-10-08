// js/perfil.js
// Página protegida: solo accesible con sesión iniciada.

import { auth, db } from "./firebase/config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const cargando = document.getElementById("perfilCargando");
const errorBox = document.getElementById("perfilError");
const contenido = document.getElementById("perfilContenido");

function formatearFecha(valor) {
  const fecha = valor && valor.toDate ? valor.toDate() : new Date(valor);
  return isNaN(fecha) ? "-" : fecha.toLocaleDateString("es-UY", { day: "2-digit", month: "long", year: "numeric" });
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("acceso.html?next=perfil.html");
    return;
  }

  try {
    const ref = doc(db, "usuarios", user.uid);
    const snap = await getDoc(ref);
    let datos;

    if (snap.exists()) {
      datos = snap.data();
    } else {
      // Autorreparación: si el documento no existe, se crea con los datos de la sesión
      datos = { uid: user.uid, nombre: user.displayName || "", email: user.email, rol: "cliente" };
      await setDoc(ref, { ...datos, fechaRegistro: serverTimestamp() });
      datos.fechaRegistro = user.metadata.creationTime;
    }

    const nombre = datos.nombre || user.displayName || user.email.split("@")[0];
    document.getElementById("perfilInicial").textContent = nombre.charAt(0).toUpperCase();
    document.getElementById("perfilNombre").textContent = nombre;
    document.getElementById("perfilEmail").textContent = datos.email || user.email;
    document.getElementById("perfilRol").textContent = datos.rol || "cliente";
    document.getElementById("perfilFecha").textContent = formatearFecha(datos.fechaRegistro || user.metadata.creationTime);
    document.getElementById("perfilUid").textContent = user.uid;

    cargando.classList.add("d-none");
    contenido.classList.remove("d-none");
  } catch (error) {
    console.error(error);
    cargando.classList.add("d-none");
    errorBox.textContent = "No se pudieron cargar tus datos. Verificá tu conexión e intentá de nuevo.";
    errorBox.classList.remove("d-none");
  }
});
