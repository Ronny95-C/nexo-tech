// js/roles.js
// Validación de rol: un usuario es administrador si su documento usuarios/{uid} tiene rol "admin".
// (La protección real está en las reglas de Firestore; esto solo decide qué se muestra.)

import { db } from "./firebase/config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { conTiempo } from "./productos-firebase.js";

const cache = new Map();

export async function esAdministrador(user) {
  if (!user) return false;
  if (cache.has(user.uid)) return cache.get(user.uid);
  try {
    const snap = await conTiempo(getDoc(doc(db, "usuarios", user.uid)));
    const admin = snap.exists() && snap.data().rol === "admin";
    cache.set(user.uid, admin);
    return admin;
  } catch (error) {
    console.error("No se pudo verificar el rol:", error);
    return false;
  }
}
