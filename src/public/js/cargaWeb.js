const boton = document.getElementById('botonEnviar');
const contenedor = document.getElementById('contenedor-carga');

boton.addEventListener('click', () => {
    contenedor.style.visibility = ''
    contenedor.style.opacity = '0.9';
});

window.onload = function(){
    contenedor.style.visibility = 'hidden';
    contenedor.style.opacity = '0';
}



