// js/seed-productos.js
// Carga inicial de la colección "productos" en Firestore a partir del arreglo local
// PRODUCTOS_INICIALES (js/base.js). Se ejecuta manualmente desde cargar-productos.html.

import { db } from "./firebase/config.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const CARACTERISTICAS = {
  p1: ["Placa compatible con Arduino Uno R3", "Protoboard para armar circuitos", "LEDs, resistencias y cables jumper", "Ideal para iniciarse en electrónica"],
  p2: ["Rango de medición de 2 cm a 4 m", "Alimentación de 5 V", "Pines Trig y Echo", "Compatible con Arduino y ESP32"],
  p3: ["Switches lineales Red", "Iluminación RGB personalizable", "Formato compacto", "Conexión USB"],
  p4: ["Wi-Fi y Bluetooth integrados", "Procesador de doble núcleo", "Programable desde el IDE de Arduino", "Ideal para IoT y domótica"],
  p5: ["Mide temperatura y humedad relativa", "Salida digital", "Alimentación de 3,3 a 5 V", "Compatible con Arduino y ESP32"],
  p6: ["Sensor óptico de hasta 16000 DPI", "Botones programables", "Iluminación RGB configurable", "Diseño ergonómico"],
  p7: ["Drivers de 40 mm", "Diseño pensado para monitoreo de estudio", "Aptos para edición de audio y gaming"],
  p8: ["Pack de 4 micro servomotores SG90", "Peso de 9 g cada uno", "Control por señal PWM", "Para brazos robóticos y mecanismos"]
};

// Si Firestore no responde, se avisa en vez de quedar esperando en silencio
function conTiempo(promesa, paso, ms = 15000) {
  return Promise.race([
    promesa,
    new Promise((_, rechazar) => setTimeout(() => rechazar(new Error(`Firestore no respondió al ${paso} (más de ${ms / 1000} s)`)), ms))
  ]);
}

export async function poblarProductos(log = console.log) {
  log("Iniciando carga...");
  // PRODUCTOS_INICIALES es global: viene de js/base.js (script clásico)
  const lista = PRODUCTOS_INICIALES.map(p => ({
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion,
    categoria: p.categoria,
    precio: p.precio,
    stock: p.stock,
    disponibilidad: p.stock > 0,
    imagenes: [p.imagen],
    caracteristicas: CARACTERISTICAS[p.id] || []
  }));

  // Si ya existen, se pregunta antes de pisarlos (pisar restablece el stock)
  log("Comprobando qué productos ya existen...");
  const existentes = [];
  for (const p of lista) {
    const snap = await conTiempo(getDoc(doc(db, "productos", p.id)), "consultar " + p.id);
    if (snap.exists()) existentes.push(p.id);
  }
  log(`Existentes: ${existentes.length}. A subir: ${lista.length - existentes.length}${existentes.length ? " (más los que elijas sobrescribir)" : ""}.`);
  const sobrescribir = existentes.length > 0 &&
    confirm(`Ya existen ${existentes.length} productos en Firestore. ¿Sobrescribirlos? (se restablece el stock)`);

  let subidos = 0;
  for (const p of lista) {
    if (existentes.includes(p.id) && !sobrescribir) { log(`Se omite ${p.id} (ya existe)`); continue; }
    await conTiempo(setDoc(doc(db, "productos", p.id), p), "guardar " + p.id);
    subidos++;
    log(`Subido: ${p.nombre} (${p.id})`);
  }
  return subidos;
}
