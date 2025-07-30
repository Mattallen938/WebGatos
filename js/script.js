// DOM Elements
const btnGatito = document.getElementById('btn-gatito');
const btnLimpiar = document.getElementById('btn-limpiar');
const btnBorrarFavoritos = document.getElementById('btn-borrar-favoritos');
const contenedorGatito = document.getElementById('contenedor-gatito');
const favoritosContenedor = document.getElementById('favoritos');
const themeSwitch = document.getElementById('theme-switch');
const body = document.getElementById('page-body');

// API URL
const API_GATITOS = 'https://api.thecatapi.com/v1/images/search';

// Guardar favoritos en localStorage con clave 'favoritosGatitos'
let favoritos = JSON.parse(localStorage.getItem('favoritosGatitos')) || [];

// Mostrar favoritos en la UI
function mostrarFavoritos() {
  favoritosContenedor.innerHTML = '';
  if (favoritos.length === 0) {
    favoritosContenedor.innerHTML = '<p>No tienes favoritos aún.</p>';
    return;
  }

  favoritos.forEach(gatito => {
    const card = document.createElement('div');
    card.classList.add('gatito-card');
    card.innerHTML = `
      <img src="${gatito.url}" alt="Gatito favorito" loading="lazy" />
      <button class="btn-favorito" aria-label="Eliminar favorito" title="Eliminar favorito" data-id="${gatito.id}">&times;</button>
    `;

    favoritosContenedor.appendChild(card);

    const btnEliminar = card.querySelector('.btn-favorito');
    btnEliminar.addEventListener('click', () => {
      eliminarFavorito(gatito.id);
    });
  });
}

// Eliminar favorito
function eliminarFavorito(id) {
  favoritos = favoritos.filter(g => g.id !== id);
  localStorage.setItem('favoritosGatitos', JSON.stringify(favoritos));
  mostrarFavoritos();
}

// Agregar gatito a favoritos
function agregarAFavoritos(gatito) {
  if (favoritos.some(g => g.id === gatito.id)) {
    alert('Este gatito ya está en favoritos.');
    return;
  }
  favoritos.push(gatito);
  localStorage.setItem('favoritosGatitos', JSON.stringify(favoritos));
  mostrarFavoritos();
}

// Limpiar galería de gatitos mostrados
function limpiarGaleria() {
  contenedorGatito.innerHTML = '';
}

// Mostrar gatito en la galería principal
function mostrarGatito(gatito) {
  contenedorGatito.innerHTML = '';

  const card = document.createElement('div');
  card.classList.add('gatito-card');

  card.innerHTML = `
    <img src="${gatito.url}" alt="Imagen gatito" loading="lazy" />
    <button class="btn-favorito" aria-label="Agregar a favoritos" title="Agregar a favoritos">&hearts;</button>
  `;

  contenedorGatito.appendChild(card);

  const btnFavorito = card.querySelector('.btn-favorito');
  btnFavorito.addEventListener('click', () => agregarAFavoritos(gatito));
}

// Mostrar loader mientras carga la imagen
function mostrarLoader() {
  contenedorGatito.innerHTML = '<p class="spinner">Cargando gatito...</p>';
}

// Obtener un gatito desde API
async function obtenerGatito() {
  try {
    mostrarLoader();
    const respuesta = await fetch(API_GATITOS);
    if (!respuesta.ok) throw new Error('Error en la respuesta de la API');
    const datos = await respuesta.json();
    const gatito = datos[0];
    mostrarGatito(gatito);
  } catch (error) {
    contenedorGatito.innerHTML = `<p>Error al cargar el gatito. Intenta de nuevo.</p>`;
    console.error(error);
  }
}

// Modo nocturno persistente
function cargarModoNocturno() {
  const modo = localStorage.getItem('modoNocturno');
  if (modo === 'true') {
    body.classList.add('dark-mode');
    themeSwitch.checked = true;
  }
}

function guardarModoNocturno(estado) {
  localStorage.setItem('modoNocturno', estado);
}

// Evento toggle modo nocturno
themeSwitch.addEventListener('change', (e) => {
  if (e.target.checked) {
    body.classList.add('dark-mode');
    guardarModoNocturno(true);
  } else {
    body.classList.remove('dark-mode');
    guardarModoNocturno(false);
  }
});

// Evento click mostrar gatito
btnGatito.addEventListener('click', obtenerGatito);

// Evento click limpiar galería
btnLimpiar.addEventListener('click', limpiarGaleria);

// Evento borrar todos favoritos
btnBorrarFavoritos.addEventListener('click', () => {
  if (confirm('¿Estás seguro que quieres borrar todos los favoritos?')) {
    favoritos = [];
    localStorage.removeItem('favoritosGatitos');
    mostrarFavoritos();
  }
});

// Cargar favoritos y modo nocturno al cargar página
window.addEventListener('load', () => {
  mostrarFavoritos();
  cargarModoNocturno();
  obtenerGatito();
});
