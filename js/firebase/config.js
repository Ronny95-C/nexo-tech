// js/firebase/config.js
// Inicialización de Firebase (Sprint 3). Los SDK se cargan como módulos desde el CDN oficial.
// Nota: el apiKey de una app web de Firebase no es un secreto; la seguridad real
// depende de las reglas de Firestore y de Authentication.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { initializeFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcWdirTDFzdMRxzqEOXkyG-TteptAYUK0",
  authDomain: "nexo-tech-4f269.firebaseapp.com",
  projectId: "nexo-tech-4f269",
  storageBucket: "nexo-tech-4f269.firebasestorage.app",
  messagingSenderId: "1094381989771",
  appId: "1:1094381989771:web:e349c852f443dca199498e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // por defecto la sesión persiste al recargar (IndexedDB)
// Algunas redes, antivirus o extensiones bloquean la conexión por defecto y Firestore queda "esperando".
// Con esta opción detecta el problema y cambia solo a una conexión alternativa (long-polling).
export const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
