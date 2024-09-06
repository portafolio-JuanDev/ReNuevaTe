const menu = document.querySelector(".menu");
const openMenuBtn = document.querySelector(".open-menu");
const closeMenuBtn = document.querySelector(".close-menu");

function toggleMenu() {
  menu.classList.toggle("menu_opened");
}

if (openMenuBtn) {
  openMenuBtn.addEventListener("click", toggleMenu);
} else {
  console.error('Elemento "openMenuBtn" no encontrado.');
}

if (closeMenuBtn) {
  closeMenuBtn.addEventListener("click", toggleMenu);
} else {
  console.error('Elemento "closeMenuBtn" no encontrado.');
}

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
  registrarEventsListeners(); // Mover aquí para asegurar que los elementos están cargados
});

// Registrar eventos listeners
function registrarEventsListeners() {
  if (listaCursos) {
    listaCursos.addEventListener('click', agregarCurso);
  } else {
    console.error('Elemento "listaCursos" no encontrado.');
  }

  if (carrito) {
    carrito.addEventListener('click', eliminarCurso);
  } else {
    console.error('Elemento "carrito" no encontrado.');
  }

  // Vaciar el carrito
  if (vaciarCarritoBtn) {
    vaciarCarritoBtn.addEventListener('click', () => {
      articulosCarrito = [];
      limpiarHTML();
      localStorage.removeItem('carrito'); // Limpiar localStorage
      emitirEventoCarritoActualizado(); // Emitir evento al vaciar el carrito
    });
  } else {
    console.error('Elemento "vaciarCarritoBtn" no encontrado.');
  }
}

function agregarCurso(e) {
  if (e.target.tagName === 'BUTTON') {
    const cursoSeleccionado = e.target.closest('.right');
    leerInfo(cursoSeleccionado);
  }
}

function leerInfo(curso) {
  const infoCurso = {
    imagen: curso.parentElement.querySelector('.main_image img').src,
    titulo: curso.querySelector('h3').textContent,
    precio: parseFloat(curso.querySelector('h4').textContent.replace('$', '')),
    id: curso.querySelector('button').getAttribute('data-id'),
    cantidad: 1
  };

  const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);

  if (existe) {
    articulosCarrito = articulosCarrito.map(curso => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
      }
      return curso;
    });
  } else {
    articulosCarrito = [...articulosCarrito, infoCurso];
  }

  carritoHTML();
  guardarCarritoEnLocalStorage();
  emitirEventoCarritoActualizado(); // Emitir evento al agregar un curso
}

function eliminarCurso(e) {
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute('data-id');
    articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
    carritoHTML();
    guardarCarritoEnLocalStorage();
    emitirEventoCarritoActualizado(); // Emitir evento al eliminar un curso
  }
}

function carritoHTML() {
  limpiarHTML();

  articulosCarrito.forEach(curso => {
    const { imagen, titulo, precio, cantidad, id } = curso;

    const row = document.createElement('div');
    row.classList.add('curso');
    row.innerHTML = `
      <img src="${imagen}" alt="${titulo}">
      <h5>${titulo}</h5>
      <h5>$${precio}</h5>
      <p>Cantidad: ${cantidad}</p>
      <button <span class="borrar-curso" data-id="${id}">X</span></button>
    `;

    contenedorCarrito.appendChild(row);
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

// Emitir evento personalizado
function emitirEventoCarritoActualizado() {
  const evento = new CustomEvent('carritoActualizado', { detail: articulosCarrito });
  document.dispatchEvent(evento);
}
