const contenedorGatito = document.getElementById('contenedor-gatito'); // corregido
const contenedorFavoritos = document.getElementById('favoritos');
const botonMostrar = document.getElementById('btn-gatito');
const botonLimpiar = document.getElementById('btn-limpiar');
const botonBorrarFavoritos = document.getElementById('btn-borrar-favoritos');

let favoritos = [];

// Texto inicial
botonMostrar.textContent = 'Mostrar un gatito';

// Cambiar texto del botón al primer clic
botonMostrar.addEventListener('click', () => {
    if (botonMostrar.textContent === 'Mostrar un gatito') {
        botonMostrar.textContent = 'Mostrar otro gatito';
    }
});

// Cargar favoritos guardados al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    const almacenados = localStorage.getItem('gatitosFavoritos');
    if (almacenados) {
        favoritos = JSON.parse(almacenados);
        favoritos.forEach(url => mostrarFavorito(url));
    }
});

// Mostrar un nuevo gatito desde la API
botonMostrar.addEventListener('click', () => {
    const cargando = document.createElement('p');
    cargando.textContent = 'Cargando gatito...';
    cargando.classList.add('spinner');
    contenedorGatito.appendChild(cargando);

    fetch('https://api.thecatapi.com/v1/images/search')
        .then(response => response.json())
        .then(data => {
            cargando.remove();

            const url = data[0].url;

            const wrapper = document.createElement('div');
            wrapper.classList.add('gatito-card'); // aplica estilos uniformes

            const img = document.createElement('img');
            img.src = url;
            img.alt = "Imagen de Gatito";

            const botonFavorito = document.createElement('button');
            botonFavorito.textContent = '💖 Guardar';
            botonFavorito.className = 'btn-favorito';

            botonFavorito.addEventListener('click', () => {
                if (!favoritos.includes(url)) {
                    favoritos.push(url);
                    localStorage.setItem('gatitosFavoritos', JSON.stringify(favoritos));
                    mostrarFavorito(url);
                }
            });

            wrapper.appendChild(img);
            wrapper.appendChild(botonFavorito);
            contenedorGatito.appendChild(wrapper);
        })
        .catch(error => {
            cargando.textContent = 'Hubo un problema al cargar la imagen.';
            console.error('Error al obtener imagen:', error);
        });
});

// Borrar todos los favoritos
botonBorrarFavoritos.addEventListener('click', () => {
    const confirmacion = confirm('¿Estás seguro de que quieres borrar todos los favoritos? 🐾');
    if (confirmacion) {
        localStorage.removeItem('gatitosFavoritos');
        favoritos = [];
        contenedorFavoritos.innerHTML = '';
    }
});

// Limpiar galería de gatitos mostrados
botonLimpiar.addEventListener('click', () => {
    contenedorGatito.innerHTML = '';
});

// Mostrar gatito favorito guardado
function mostrarFavorito(url) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('gatito-card');

    const img = document.createElement('img');
    img.src = url;
    img.alt = "Gatito favorito";

    wrapper.appendChild(img);
    contenedorFavoritos.appendChild(wrapper);
}
