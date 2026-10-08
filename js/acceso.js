// js/acceso.js
// Registro e inicio de sesión con Firebase Authentication + documento de usuario en Firestore.

import { auth, db } from "./firebase/config.js";
import {
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const formLogin = document.getElementById("formLogin");
const formRegistro = document.getElementById("formRegistro");
const alerta = document.getElementById("alertaAcceso");
const tabs = document.querySelectorAll("[data-form]");
let enProceso = false;

function destino() {
  const next = new URLSearchParams(window.location.search).get("next");
  return /^[a-z]+\.html$/.test(next || "") ? next : "index.html";
}

function mostrarAlerta(mensaje, tipo = "danger") {
  alerta.className = `alert alert-${tipo}`;
  alerta.textContent = mensaje;
}
function limpiarAlerta() { alerta.className = "d-none"; alerta.textContent = ""; }

function errorCampo(input, mensaje) {
  input.classList.add("is-invalid");
  const elFeedback = input.parentElement.querySelector(".invalid-feedback");
  if (elFeedback) elFeedback.textContent = mensaje;
}
function limpiarErrores(form) {
  form.querySelectorAll(".is-invalid").forEach(i => i.classList.remove("is-invalid"));
}

function traducirError(error) {
  const mensajes = {
    "auth/email-already-in-use": "Ya existe una cuenta con ese correo electrónico.",
    "auth/invalid-email": "El correo electrónico no es válido.",
    "auth/weak-password": "La contraseña es demasiado débil.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/user-not-found": "Correo o contraseña incorrectos.",
    "auth/wrong-password": "Correo o contraseña incorrectos.",
    "auth/too-many-requests": "Demasiados intentos. Esperá unos minutos e intentá de nuevo.",
    "auth/network-request-failed": "No hay conexión con el servidor. Revisá tu internet.",
    "auth/operation-not-allowed": "El acceso con correo y contraseña no está habilitado en Firebase."
  };
  return mensajes[error.code] || "Ocurrió un error inesperado. Intentá de nuevo.";
}

function cambiarPestana(nombre) {
  tabs.forEach(t => {
    const activa = t.dataset.form === nombre;
    t.classList.toggle("active", activa);
    t.setAttribute("aria-selected", activa);
  });
  formLogin.classList.toggle("d-none", nombre !== "login");
  formRegistro.classList.toggle("d-none", nombre !== "registro");
  limpiarAlerta();
}
tabs.forEach(t => t.addEventListener("click", () => cambiarPestana(t.dataset.form)));
if (new URLSearchParams(window.location.search).get("modo") === "registro") cambiarPestana("registro");

function bloquear(form, bloqueado, textoBoton) {
  const btn = form.querySelector("button[type=submit]");
  if (btn) {
    btn.disabled = bloqueado;
    btn.textContent = bloqueado ? "Procesando..." : textoBoton;
  }
}

// ---------- Registro ----------
formRegistro.addEventListener("submit", async (e) => {
  e.preventDefault();
  limpiarAlerta();
  limpiarErrores(formRegistro);

  const nombre = document.getElementById("regNombre");
  const email = document.getElementById("regEmail");
  const pass = document.getElementById("regPassword");
  const pass2 = document.getElementById("regPassword2");

  let valido = true;
  if (nombre.value.trim().length < 2) { errorCampo(nombre, "Ingresá tu nombre (mínimo 2 caracteres)."); valido = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { errorCampo(email, "Ingresá un correo electrónico válido."); valido = false; }
  if (pass.value.length < 8 || !/[A-Za-z]/.test(pass.value) || !/\d/.test(pass.value)) {
    errorCampo(pass, "Mínimo 8 caracteres, con al menos una letra y un número."); valido = false;
  }
  if (pass2.value !== pass.value) { errorCampo(pass2, "Las contraseñas no coinciden."); valido = false; }
  
  if (!valido) return;

  enProceso = true;
  bloquear(formRegistro, true, "Crear cuenta");

  try {
    const cred = await createUserWithEmailAndPassword(auth, email.value.trim(), pass.value);
    
    // Guardamos nombre en el perfil de Auth
    await updateProfile(cred.user, { displayName: nombre.value.trim() });
    
    // Guardamos documento completo en Firestore
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      uid: cred.user.uid,
      nombre: nombre.value.trim(),
      email: cred.user.email,
      rol: "cliente",
      fechaRegistro: serverTimestamp()
    });

    window.location.href = destino();
  } catch (error) {
    console.error("Error en registro:", error);
    mostrarAlerta(traducirError(error));
    enProceso = false;
    bloquear(formRegistro, false, "Crear cuenta");
  }
});

// ---------- Inicio de sesión ----------
formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  limpiarAlerta();
  limpiarErrores(formLogin);

  const email = document.getElementById("loginEmail");
  const pass = document.getElementById("loginPassword");

  let valido = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { errorCampo(email, "Ingresá un correo electrónico válido."); valido = false; }
  if (!pass.value) { errorCampo(pass, "Ingresá tu contraseña."); valido = false; }
  
  if (!valido) return;

  enProceso = true;
  bloquear(formLogin, true, "Iniciar sesión");

  try {
    await signInWithEmailAndPassword(auth, email.value.trim(), pass.value);
    window.location.href = destino();
  } catch (error) {
    console.error("Error en login:", error);
    mostrarAlerta(traducirError(error));
    enProceso = false;
    bloquear(formLogin, false, "Iniciar sesión");
  }
});

// Solo redirige automáticamente si la sesión ya estaba iniciada previamente
onAuthStateChanged(auth, (user) => {
  if (user && !enProceso) {
    window.location.replace(destino());
  }
});