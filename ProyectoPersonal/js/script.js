const contenedorGatito = document.getElementById('contenedor-perrito');
const contenedorFavoritos = document.getElementById('favoritos');
const botonMostrar = document.getElementById('btn-gatito');
const botonLimpiar = document.getElementById('btn-limpiar');
const botonBorrarFavoritos = document.getElementById('btn-borrar-favoritos');

botonMostrar.textContent = 'Mostrar un gatito';

botonMostrar.addEventListener('click', () => {

    if (botonMostrar.textContent === 'Mostrar un gatito') {
        botonMostrar.textContent = 'Mostrar otro gatito';
    }

});

let favoritos = [];

// 🧠 Cargar favoritos al iniciar
window.addEventListener('DOMContentLoaded', () => {
    const almacenados = localStorage.getItem('gatitosFavoritos');
    if (almacenados) {
        favoritos = JSON.parse(almacenados);
        favoritos.forEach(url => mostrarFavorito(url));
    }
});

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
            const img = document.createElement('img');
            img.src = url;
            img.alt = "Imagen de Gatito";

            const botonFavorito = document.createElement('button');
            botonFavorito.textContent = '💖 Guardar';
            botonFavorito.style.display = 'block';
            botonFavorito.style.margin = '10px auto';
            botonFavorito.style.backgroundColor = '#ffd4d4';
            botonFavorito.style.border = 'none';
            botonFavorito.style.padding = '0.5rem 1rem';
            botonFavorito.style.borderRadius = '8px';
            botonFavorito.style.cursor = 'pointer';

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

botonBorrarFavoritos.addEventListener('click', () => {
    const confirmacion = confirm('¿Estás seguro de que quieres borrar todos los favoritos? 🐾');
    if (confirmacion) {
        localStorage.removeItem('gatitosFavoritos');
        favoritos = [];
        contenedorFavoritos.innerHTML = '';
    }
});


