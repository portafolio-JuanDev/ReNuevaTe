const menu = document.querySelector(".menu");
const openMenuBtn = document.querySelector(".open-menu");
const closeMenuBtn = document.querySelector(".close-menu");

function toggleMenu() {
  menu.classList.toggle("menu_opened");
}

openMenuBtn.addEventListener("click", toggleMenu);
closeMenuBtn.addEventListener("click", toggleMenu);

// -------Carrito de Compras-----------
const carrito = document.getElementById("carrito"),
  listaCursos = document.getElementById("lista-cursos"),
  contenedorCarrito = document.querySelector('.buy-card .lista_de_cursos'),
  vaciarCarritoBtn = document.querySelector('#vaciar_carrito');

let articulosCarrito = [];

// Cargar los artículos del carrito desde localStorage al inicio
document.addEventListener('DOMContentLoaded', () => {
  articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carritoHTML();
});

registrarEventsListeners();

function registrarEventsListeners() {
  carrito.addEventListener('click', eliminarCurso);
  
  // Vaciar el carrito
  vaciarCarritoBtn.addEventListener('click', () => {
    articulosCarrito = [];
    limpiarHTML();
    localStorage.removeItem('carrito'); // Limpiar localStorage
  });
}

function agregarCurso(e) {
  const cursoSeleccionado = e.target.closest('.right');
  leerInfo(cursoSeleccionado);
}

function leerInfo(curso) {
  const infoCurso = {
    imagen: curso.parentElement.querySelector('.main_image img').src,
    titulo: curso.querySelector('h3').textContent,
    precio: curso.querySelector('h4').textContent,
    id: curso.querySelector('button').getAttribute('data-id'),
    cantidad: 1
  };

  const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);

  if (existe) {
    const cursos = articulosCarrito.map(curso => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso;
      } else {
        return curso;
      }
    });
    articulosCarrito = [...cursos];
  } else {
    articulosCarrito = [...articulosCarrito, infoCurso];
  }

  carritoHTML();
  guardarCarritoEnLocalStorage();
}

function eliminarCurso(e) {
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute('data-id');
    articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
    carritoHTML();
    guardarCarritoEnLocalStorage();
  }
}

function carritoHTML() {
  limpiarHTML();
  articulosCarrito.forEach(curso => {
    const fila = document.createElement('div');
    fila.innerHTML = `
      <img width="100px" height="100px" src="${curso.imagen}"></img>
      <p>${curso.titulo}</p>
      <p>${curso.precio}</p>
      <p>${curso.cantidad}</p>
      <p><span class="borrar-curso" data-id="${curso.id}">X</span></p>
    `;
    contenedorCarrito.appendChild(fila);
  });
}

function limpiarHTML() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}
