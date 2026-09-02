// js/producto.js

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("detalleProductoContenedor");
  const noEncontrado = document.getElementById("productoNoEncontrado");

  const breadcrumbNombre = document.getElementById("breadcrumbNombre");
  const imgElem = document.getElementById("productoImagen");
  const catElem = document.getElementById("productoCategoria");
  const nombreElem = document.getElementById("productoNombre");
  const descElem = document.getElementById("productoDescripcion");
  const precioElem = document.getElementById("productoPrecio");
  const cantidadInput = document.getElementById("cantidadInput");
  const btnAgregar = document.getElementById("btnAgregarCarritoDetalle");

  if (!contenedor) return;

  // Capturar ID de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const idProducto = urlParams.get("id");

  const listaProductos = typeof obtenerProductos === "function" ? obtenerProductos() : [];
  const producto = listaProductos.find(p => String(p.id) === String(idProducto));

  if (!producto) {
    if (noEncontrado) noEncontrado.classList.remove("d-none");
    if (breadcrumbNombre) breadcrumbNombre.textContent = "Producto no encontrado";
    return;
  }

  // Renderizar datos del producto
  document.title = `${producto.nombre} | Nexo Tech`;
  if (breadcrumbNombre) breadcrumbNombre.textContent = producto.nombre;
  
  if (imgElem) {
    imgElem.src = producto.imagen;
    imgElem.alt = producto.nombre;
  }
  
  if (catElem) catElem.textContent = producto.categoria;
  if (nombreElem) nombreElem.textContent = producto.nombre;
  if (descElem) descElem.textContent = producto.descripcion;
  if (precioElem) precioElem.textContent = `$${producto.precio.toLocaleString("es-UY")}`;

  // Ajustar límites del input según el stock disponible
  if (cantidadInput && producto.stock !== undefined) {
    cantidadInput.max = producto.stock;
    if (producto.stock <= 0) {
      cantidadInput.value = 0;
      cantidadInput.disabled = true;
      if (btnAgregar) btnAgregar.disabled = true;
    }
  }

  // Mostrar el contenedor de detalle
  contenedor.classList.remove("d-none");

  // Escuchador de eventos para agregar al carrito
  if (btnAgregar) {
    btnAgregar.addEventListener("click", () => {
      const cantidad = parseInt(cantidadInput ? cantidadInput.value : 1, 10) || 1;
      
      if (typeof agregarAlCarrito === "function") {
        agregarAlCarrito(producto.id, cantidad);
      }
    });
  }
});