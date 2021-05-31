const formulario = document.getElementById('formulario');
const botonEnviar = document.getElementById('botonEnviar');
const botonPrueba = document.getElementById('botonPrueba');

formulario.addEventListener('submit', () => {
    const dispositivos = document.querySelectorAll('.dispositivo');

    // RECORRO TODOS LOS DISPOTIVOS
    for(let i=0; i<dispositivos.length; i++){

        /**********************************            ON            **********************************/
        // OBTENGO EL DIV QUE CONTIENE EL CANVAS, PARA LOS DISPOSITIVOS CUANDO ESTAN -ON
        const nuevoEncendido = dispositivos[i].querySelectorAll('.nuevoIcono')[0];
        // OBTENGO EL NOMBRE DE LA LISTA Y LA POSICION DEL ICONO EN LA MISMA.
        const nuevoIconoDatosEncendido = nuevoEncendido.querySelector('canvas').getAttribute('id').split('-');
        const nombreListaEncendido = nuevoIconoDatosEncendido[0]
        const posicionListaEncendido = nuevoIconoDatosEncendido[1];
        // OBTENGO LA OPACIDAD DEL DIV, PORQUE SI LA OPACIDAD ES 1, SIGNIFICA QUE HEMOS SELECCIONADO UN 
        // NUEVO ICONO PARA EL DISPOSITIVO CUANDO EL DISPOSITIVO ESTA ENCENDIDO.
        const opacidadEncendido = parseInt(nuevoEncendido.style.opacity);

        /**********************************            OFF            **********************************/
        const nuevoApagado = dispositivos[i].querySelectorAll('.nuevoIcono')[1];
        const nuevoIconoDatosApagado = nuevoApagado.querySelector('canvas').getAttribute('id').split('-');
        const nombreListaApagado = nuevoIconoDatosApagado[0]
        const posicionListaApagado = nuevoIconoDatosApagado[1];
        const opacidadApagado = parseInt(nuevoApagado.style.opacity);

        /*
         * COMPRUEVO SI LA OPACIDAD DE ALGUNO DE LOS DOS ESTADOS (ON | OFF) DE UN DISPOSITIVO HA CAMBIADO, EN 
         * CASO DE QUE HAYA CAMBIADO, SIGNIFICA QUE HEMOS SELECCIONADO UN ICONO DE LOS ACORDEONES. ESE ICONO
         * SELECCIONADO SERA EL NUEVO ICONO PARA ESE DISPOSITIVO. LE DIGO AL SERVIDOR QUE EN EL DISPOSITIVO 
         * 'X' SE HA CAMBIADO EL ICONO, POR LO TANTO TENGO QUE CAMBIAR EL 'Instal.dat' DE ESE DISPOSITIVO Y 
         * AGREGAR EL ICONO A LA NUEVA LISTA DE ICONOS.
         */
        if(opacidadApagado === 1 || opacidadEncendido === 1){
            /*
             * CREO UN INPUT PARA CADA UNO DE LOS DOS ESTADOS DEL DISPOSITIVO. Y LE AÑADO LOS DATOS DEL ICONO
             * QUE TIENE ACTUALMENTE (dispositivo - nombreLista - posicionLista)
             */
            const inputEncendido = document.createElement('input');
            inputEncendido.setAttribute('type', 'text');
            inputEncendido.setAttribute('name', 'input');
            inputEncendido.style.display = 'none';

            const inputApagado = document.createElement('input');
            inputApagado.setAttribute('type', 'text');
            inputApagado.setAttribute('name', 'input');
            inputApagado.style.display = 'none';

            // LE VAMOS A ENVIAR LOS DATOS AL SERVIDOR CON UNA CADENA QUE CONTENDAR TODO SOBRE ESE ICONO.
            // dispostivo - nombreLista - posicionLista (i-nombreListaEncendido-posicionListaEncendido)
            let valueEncendido = i +'-'+ nombreListaEncendido +'-'+ posicionListaEncendido;
            let valueApagado = i +'-'+ nombreListaApagado +'-'+ posicionListaApagado;

            inputEncendido.value = valueEncendido;
            inputApagado.value = valueApagado;

            formulario.appendChild(inputEncendido);
            formulario.appendChild(inputApagado);
        }
    };
});