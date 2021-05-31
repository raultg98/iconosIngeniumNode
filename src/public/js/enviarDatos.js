const formulario = document.getElementById('formulario');
const botonEnviar = document.getElementById('botonEnviar');
// const botonPrueba = document.getElementById('botonPrueba');

// botonPrueba.addEventListener('click', () => {
//     const listaNuevosIconos = document.querySelectorAll('.nuevoIcono');

//     listaNuevosIconos.forEach(nuevoIcono => {
//         let nuevoIconoStyle = nuevoIcono.style.opacity;
//         // let nuevoIconoOpacidad = nuevoIconoStyle.getPropertyValue('opacity');

//         // console.log(nuevoIconoStyle);
//         if(nuevoIconoStyle !== '0.5'){
//             console.log(nuevoIcono);
//         }
//     });
// });

/* CUANDO LE DOY AL BOTON DE ENVIAR FORMULARIO: 
        - OBTENGO TODOS LOS DIV DE LOS NUEVOS ICONOS
        - OBTENGO TODOS LOS CANVAS DE LOS NUEVOS ICONOS
        - CREO UN INPUT TEXT POR CADA UNO DE LOS CANVAS
        - EN CADA INPUT TEXT LE TENGO QUE ENVIAR EL DEL CANVAS
        - ENVIO ESOS DATOS AL SERVIDOR
*/
formulario.addEventListener('submit', () => {
    // ARRAY QUE CONTIENE TODOS LOS DIV 'nuevoIcono', DENTRO TIENEN UN CANVAS
    // CON EL NOMBRE DE LA LISTA DE ICONOS A LA QUE PERTENECE Y POSICION EN 
    // DICHA LISTA. (nombreLista - posicionIcono)
    const listaNuevosIconos = document.querySelectorAll('.nuevoIcono');

    listaNuevosIconos.forEach(nuevoIcono => {

        const canvas = nuevoIcono.lastChild;
        // EL ID DEL CANVAS CONTIENE EL NOMBRE DE LA LISTA DE ICONOS A LA QUE 
        // PERTENECE Y LA POSICION DEL ICONO EN DICHA LISTA.
        const idCanvas = canvas.getAttribute('id');

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'input');
        input.style.display = 'none';

        input.value = idCanvas;

        formulario.appendChild(input);
    });
});