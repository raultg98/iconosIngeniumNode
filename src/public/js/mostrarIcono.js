const divContenedor = document.getElementById('divPadre');
// divContenedor.setAttribute('class', 'd-flex justify-content-center')

// ARRAY QUE CONTENDRA LOS ICONOS DE TODAS LAS LISTAS DE ICONOS.
let iconosRecortados = [];

// ARRAY DE OBJETOS QUE CONTIENEN TODAS LAS LISTAS DE ICONOS. CADA OBJETO CONTIENE LA UBICACION DE LA 
// IMAGEN, EL TITULO Y EL NUMERO DE ICONOS QUE TIENE LA LISTA.
let listasDeIconos = [{
    foto: '/img/icons.png',
    titulo: 'default',
    numeroIconos: 200
}];


fetch('../datos/listasSubidas.json')
.then(res => res.json())
.then(listas => {
    for(let i=0; i<listas.length; i++){
        listasDeIconos.push(listas[i]);
    }
    
    recortarIconosLista();
});


// FUNCION QUE ME RECORTA TODOS LOS ICONOS DE LA LISTA ICONOS.
function recortarIconosLista(){
    // RECORRO EL ARRAY CON TODAS LAS LISTA DE ICONOS
    for (let j=0; j<listasDeIconos.length; j++) {

        // console.log('Tamaño de la lista de Iconos: '+ listasDeIconos.length)
        // RECORRO LOS ICONOS DE CADA LISTA.
        for (let i=0; i<listasDeIconos[j].numeroIconos; i++) {
            const canvas = document.createElement('canvas');
            const contexto = canvas.getContext('2d');

            // NUMERO DE ICONOS TOTALES QUE TIENE LA LISTA (CON LAS DOS COLUMNAS).
            let numIconos = listasDeIconos[j].numeroIconos;

            let inicioX;
            let inicioY;
            let ancho_alto = 100;
            let zoom = 1;

            // ICONOS DE LA PRIMERA COLUMNA
            if (i < (numIconos / 2)) {
                // AL SER DE LA PRIMERA COLUMNA EMPIEZA EN 0
                inicioX = 0;
                // PARA SABER A QUE ALTURA TENGO QUE HACER EL RECORTE, ES LA POSICION
                // QUE TIENES EN LA LISTA 'i' QUE ES EL ALTO DEL ICONO (i * 100)
                inicioY = i * ancho_alto;
            }
            // ICONOS DE LA SEGUNDA COLUMNA
            else if (i >= Math.round(numIconos / 2)) {
                // COMO ES UN ICONO DE LA SEGUNDA COLUMNA EMPIEZA EN 100, PORQUE CADA 
                // ICONO TIENE DE DIMESIONES 100*100 px
                inicioX = ancho_alto;
                inicioY = (i - Math.round(numIconos / 2)) * ancho_alto;
            }

            canvas.width = ancho_alto;
            canvas.height = ancho_alto;

            // new Image() === document.createElement('img');
            const icono = new Image();

            icono.onload = function () {
                contexto.drawImage(icono, inicioX, inicioY, ancho_alto * zoom,
                    ancho_alto * zoom, 0, 0, ancho_alto, ancho_alto);
            }

            icono.src = listasDeIconos[j].foto;

            // CADA CANVAS VA A ESTAR IDENTIFICADO POR LA LISTA A LA QUE PERTENCE Y LA POSICION
            // QUE TIENE EN EL ARRAY DE 'iconosRecortados'.
            canvas.setAttribute('id', `${listasDeIconos[j].titulo}-${i}`);

            iconosRecortados.push(canvas);
        }
    }
}


// TENGO QUE LEER EL JSON CON TODOS LOS DISPOSITIVOS PARA DESPUES MOSTRAR ESTOS. 
// LE METO UN 'setTimeOut', PARA QUE LE DE TIEMPO A RECORTAR Y ALMACENAR LOS ICONOS.
setTimeout(function leerJSON() {
    fetch('../datos/Instal.json')
        .then(res => res.json())
        .then(componentes => {
            const fragmento = document.createDocumentFragment();

            // RECORRO TODOS LOS DISPOSTIVOS
            for (let i=0; i<componentes.length; i++) {
                /**********     CREACION ELEMENTOS     **********/
                const dispositivo = document.createElement('div');
                const nombreDipositivo = document.createElement('h1');
                const divEncendido = document.createElement('div');
                const divApagado = document.createElement('div');
                const encabezadoEncendido = document.createElement('h5');
                const encabezadoApagado = document.createElement('h5');
                const encendido = document.createElement('div');
                const apagado = document.createElement('div');
                const iconoEncendido = document.createElement('div');
                const iconoApagado = document.createElement('div');
                const flecha1 = document.createElement('i');
                const flecha2 = document.createElement('i');
                const nuevoIconoEncendido = document.createElement('div');
                const nuevoIconoApagado = document.createElement('div');
                const acordeon1 = document.createElement('div');
                const acordeon2 = document.createElement('div');

                /**********     ESTILOS     **********/
                dispositivo.setAttribute('class', 'row mx-3 mt-3 mb-4 border border-2 border-primary rounded');

                nombreDipositivo.setAttribute('class', 'text-center text-primary');

                encabezadoEncendido.setAttribute('class', 'my-1 text-primary');
                encabezadoApagado.setAttribute('class', 'my-1 text-primary');

                divEncendido.setAttribute('class', 'col-md-6 col-sm-12');
                divApagado.setAttribute('class', 'col-md-6 col-sm-12');

                encendido.setAttribute('class', 'd-flex justify-content-between align-items-center p-3 my-3 border border-2 border-primary rounded');
                apagado.setAttribute('class', 'd-flex justify-content-between align-items-center p-3 my-3 border border-2 border-primary rounded');
                flecha1.setAttribute('class', 'fas fa-arrow-right text-primary');
                flecha2.setAttribute('class', 'fas fa-arrow-right text-primary');

                nuevoIconoEncendido.setAttribute('class', 'nuevoIcono');
                nuevoIconoEncendido.setAttribute('id', `nuevoIcono-ON-${i}`);
                nuevoIconoApagado.setAttribute('class','nuevoIcono');
                nuevoIconoApagado.setAttribute('id', `nuevoIcono-OFF-${i}`);
                

                /**********     VALORES     **********/
                nombreDipositivo.innerText = componentes[i].nombre;
                
                encabezadoEncendido.innerText = 'Encendido';
                encabezadoApagado.innerText = 'Apagado';


                /**********     ICONOS     **********/
                // OBTENGO LA POSICION QUE TIENE EL ICONO EN EL 'Instal.dat'
                let posicion = parseInt(componentes[i].icono);

                let posicionEncendido = -1;
                let posicionApagado = -1;

                /*************************************************************************************************
                        REVISAR CONDICION DE ESTOS IF's PORQUE SOLO SE CUMPLEN PARA LISTAS CON 200 ICONOS.        
                *************************************************************************************************/
                if (posicion < 100) {
                    posicionEncendido = posicion;
                    posicionApagado = (posicion + 100);
                }else if(posicion >= 100){
                    posicionEncendido = posicion;
                    posicionApagado = (posicion - 100);
                }

                let on = iconosRecortados[posicionEncendido].cloneNode(true);
                on.getContext('2d').drawImage(iconosRecortados[posicionEncendido], 0, 0);

                let off = iconosRecortados[posicionApagado].cloneNode(true);
                off.getContext('2d').drawImage(iconosRecortados[posicionApagado], 0, 0);

                iconoEncendido.appendChild(on);
                iconoApagado.appendChild(off);

                /*
                * CUANDO NOSOTROS NO HEMOS SELECCIONADO TODAVIA NINGUN ICONO QUEREMOS VER QUE EL NUEVO
                * ICONO ES EL MISMO QUE NOSOTROS TENEMOS, LA COSA ES QUE LO VAMOS A VER CON ALGO DE OPACIDAD
                * PARA ASI PODER DIFERENCIAR LOS ICONOS QUE HAS CAMBIADO Y LOS QUE NO.
                * 
                * TENEMOS QUE CLONAR LOS CANVAS DE LOS 'iconosRecortados' PORQUE SI LLAMAMOS VARIAS VECES AL 
                * MISMO CANVAS DE 'iconosRecortados' ESTE SOLO SE MOSTRARA EN LA ULTIMA POSICION EN LA QUE LO 
                * LAMASTES
                */
                let nuevoON = iconosRecortados[posicionEncendido].cloneNode(true);
                nuevoON.getContext('2d').drawImage(iconosRecortados[posicionEncendido], 0, 0);

                nuevoIconoEncendido.appendChild(nuevoON)
                nuevoIconoEncendido.style.opacity = '0.5';

                let nuevoOFF = iconosRecortados[posicionApagado].cloneNode(true);
                nuevoOFF.getContext('2d').drawImage(iconosRecortados[posicionApagado], 0, 0);

                nuevoIconoApagado.appendChild(nuevoOFF);
                nuevoIconoApagado.style.opacity = '0.5';


                /**********     EVENTOS     **********/
                /* CUANDO YO DOY 'click' EN ESTE DIV ME DESPLIEGA/PLIEGA UN 'acordeonPadre' QUE CONTIENE TODOS LOS
                   ACORDEONES CON TODAS LAS LISTAS DE ICONOS. CUANDO EL 'acordeonPadre' ESTA PLEGADO Y HAGO 'click'
                   ESTE SE DESPLIEGA, BUENO MAS BIEN LO CREO DESDE 0. Y CUANDO EL 'acordeonPadre' ESTE DESPLEGADO
                   Y HAGO 'click', ELIMINO AL ULTIMO HIJO DE ESTE DIV, ES DECIR, ELIMINO AL 'acordeonPadre' */
                encendido.addEventListener('click', () => {
                    let enc = '-ON';

                    // COMPRUEBO SI ESTA PLEGADO O DESPLAGADO (SI TIENE HIJOS DESPLEGAGO)
                    if (acordeon1.hasChildNodes()) {
                        // EL ACORDEON ESTA DESPLEGADO, POR LO TANTO ELIMINO AL 'acordeonPadre.
                        acordeon1.removeChild(acordeon1.lastChild);
                    } else {
                        /* EL ACORDEON ESTA PLEGADO, POR LO TANTO LLAMO A UN METODO QUE ME CREA EL 'acordeonPadre'.
                         LE PASO 3 PARAMETROS: 
                            - i --------------------> DISPOSITIVO AL CUAL SE LE ESTA CREANDO EL ACORDEON.
                            - enc ------------------> ESTADO DEL DISPOSITIVO AL CUAL SE LE ESTA CREANDO EL ACORDEON
                            - nuevoIconoEncendido --> DIV DONDE SE VA CREAR EL 'acordeonPadre'
                        */
                        acordeon1.appendChild(crearAcordeones(i, enc, nuevoIconoEncendido))
                    }

                });

                apagado.addEventListener('click', () => {
                    let apg = '-OFF'

                    if (acordeon2.hasChildNodes()) {
                        acordeon2.removeChild(acordeon2.lastChild);
                    } else {
                        acordeon2.appendChild(crearAcordeones(i, apg, nuevoIconoApagado))
                    }

                });

                botonEnviar.addEventListener('submit', (e) =>{
                    e.preventDefault();
                });


                /**********     APPEND'S     **********/
                encendido.appendChild(iconoEncendido);
                encendido.appendChild(flecha1);
                encendido.appendChild(nuevoIconoEncendido);

                apagado.appendChild(iconoApagado);
                apagado.appendChild(flecha2);
                apagado.appendChild(nuevoIconoApagado);

                divEncendido.appendChild(encabezadoEncendido);
                divEncendido.appendChild(encendido);
                divEncendido.appendChild(acordeon1);

                divApagado.appendChild(encabezadoApagado);
                divApagado.appendChild(apagado);
                divApagado.appendChild(acordeon2)

                dispositivo.appendChild(nombreDipositivo);
                dispositivo.appendChild(divEncendido);
                dispositivo.appendChild(divApagado);

                fragmento.appendChild(dispositivo);
            }

            divContenedor.appendChild(fragmento);
        })
}, 200);

/**
 * Función que me crea el acordeonPadre de un dispositivo en concreto. Este dispositivo tiene dos estados 
 * encendido o apagado, los cuales tienen su acordeonPadre diferente, pero el contenido de los dos es el 
 * mismo, solo le cambian las propiedad para que respondan de forma individual. Creo tanto acordeones como
 * el numero de objetos tenga en el array de listasDeIconos y otro más si tengo iconos personalizados subidos.
 * 
 * @param { Number } dispositivo ,       Dispositivo al cual le estoy creando los acordeones
 * @param { -ON | -OFF } estado , Si el acordeon que estoy creando es para cuando el dispositivo esta
 *                                encendido o apagado
 * @param { div } nuevoIcono ,    Cuando yo le doy a unos de los iconos del acordeon quiero que se me ponga
 *                                en el div nuevoIconoEstado para yo asi poder ver el cambio de iconos que hago.                     
 * @returns Devuelvo el acordeonPadre con todos sus respectivos acordeones.
 */
function crearAcordeones(dispositivo, estado, nuevoIcono) {
    const acordeon = document.createElement('div');
    const acordeonItem = document.createElement('div');

    acordeon.setAttribute('class', 'accordion');
    acordeon.setAttribute('id', 'acordeonPadre');
    acordeonItem.setAttribute('class', 'accordion-item');

    // VARIABLE QUE ME SIRVE PARA LLEVAR LA CUENTA DE LOS ICONOS QUE LLEVO PINTADO EN LOS ACORDEONES
    let iconosPintados = 0;

    // RECORRO LA LISTA DE LISTAS DE ICONOS, PARA SABER CUANDOS ACORDEONES TENGO QUE CREAR.
    for (let i=0; i<listasDeIconos.length; i++) {
        // console.log('Iconos pintados: '+ iconosPintados)

        /**********     CREACION ELEMENTOS     **********/
        const acordeonHeader = document.createElement('h2');
        const acordeonBoton = document.createElement('button');
        const acordeonCollapse = document.createElement('div');
        const acordeonBody = document.createElement('div');

        /**********     ESTILOS     **********/
        acordeonHeader.setAttribute('class', 'accordion-header my-1');
        acordeonHeader.setAttribute('id', `heading${dispositivo}${i}${estado}`);

        acordeonBoton.setAttribute('class', 'accordion-button bg-primary text-white collapsed');
        acordeonBoton.setAttribute('type', 'button');
        acordeonBoton.setAttribute('data-bs-toggle', 'collapse');
        acordeonBoton.setAttribute('data-bs-target', `#collapse${dispositivo}${i}${estado}`);
        acordeonBoton.setAttribute('aria-expanded', 'false');
        acordeonBoton.setAttribute('aria-controls', `collapse${dispositivo}${i}${estado}`);

        acordeonCollapse.setAttribute('class', 'accordion-collapse collapse bg-drak text-warning');
        acordeonCollapse.setAttribute('id', `collapse${dispositivo}${i}${estado}`);
        acordeonCollapse.setAttribute('aria-labelledby', `heading${dispositivo}${i}${estado}`);
        acordeonCollapse.setAttribute('data-bs-parent', '#acordeonPadre');

        acordeonBody.setAttribute('class', 'accordion-body d-flex flex-wrap justify-content-between');

        /**********     ASIGNACIONES     **********/
        acordeonBoton.innerText = listasDeIconos[i].titulo.toUpperCase();

        // RECORRO LA LISTA DE ICONOS QUE TIENE ESA LISTA
        for (let j=iconosPintados; j<(iconosPintados + listasDeIconos[i].numeroIconos); j++) {
            
            // CUANDO LOS ICONOS SON CUSTOM QUIERO QUE TENGAN UNA SEPARACION POR DEBAJO PARA QUE SE VEAN BIEN.
            // POR ESO LE METO UN ID, PARA PODER IDENTIFICAR AL ACORDEON LOS ICONOS CUSTOM.
            if(listasDeIconos[i].foto === '/img/listas/custom.png'){
                acordeonBody.setAttribute('id', 'acordeonBody');
            }

            // CLONO EL ICONO DE LA LISTA
            let c = iconosRecortados[j].cloneNode(true);
            c.getContext('2d').drawImage(iconosRecortados[j], 0, 0);

            // EVENTO PARA QUE CUANDO HAGAS 'click' EN ALGUN ICONO DEL ACORDEON, ESTE ICONO PULSADO SE VISUALICE
            // EN COMO EL NUEVO ICONO, ES DECIR, EN 'nuevoIcono'. 
            c.addEventListener('click', () => {
                // LLAMO A UNA FUNCION PARA QUE ME PINTE EL ICONO EN EL DIV 'nuevoIcono'.
                mostrarIconoAcordeon(j, nuevoIcono);
                console.log('Se ha pulsado el icono: '+ (j + 1) +' del acordeon '+ listasDeIconos[i].titulo 
                            +' del dispositivo: '+ (dispositivo + 1) +' con estado: '+ estado);
            });

            acordeonBody.appendChild(c);
        }

        acordeonCollapse.appendChild(acordeonBody);
        acordeonHeader.appendChild(acordeonBoton);

        acordeonItem.appendChild(acordeonHeader);
        acordeonItem.appendChild(acordeonCollapse);

        // AL TERMINAR DE PINTAR TODOS LOS ICONOS QUE CORRESPONDEN AL ACORDEON, LE TENGO QUE SUMAR LOS ICONOS QUE
        // HE PINTADO EN DICHO ARCORDEON, PARA QUE ASI CUANDO EMPIECE A PINTAR EL SIGUIENTE ACORDEON YA ME PINTE 
        // LOS ICONOS DEL ACORDEON 'iconosRecortados' EMPEZANDO EN ESTE POSICION.
        iconosPintados += listasDeIconos[i].numeroIconos;
    }

    acordeon.appendChild(acordeonItem);

    return acordeon;
}

/**
 * Función que me sirve para pintar un icono determinado en un dispositivo en concreto, este icono pulsado
 * va a ser el nuevo icono del dispositivo cuando confirmemos los cambios en el boton 'guardar' 
 * 
 * @param { Number } posicion , posicion del icono en el array 'iconosRecortados' el cual se ha pulsado 
 *                              en el acordeon
 * @param { div } nuevoIcono ,  div en el que se va a agregar el icono pulsado, este div representa al 
 *                              nuevo icono que va a tener el dispositivo.
 */
function mostrarIconoAcordeon(posicion, nuevoIcono){
    // LE QUITO LA OPACIDAD AL DIV, QUE POR DEFECTO LA TIENE AL 50%.
    nuevoIcono.style.opacity = '1';

    // CLONO EL ICONO PARA PODER MOSTRARLO.
    let icono = iconosRecortados[posicion].cloneNode(true);
    icono.getContext('2d').drawImage(iconosRecortados[posicion], 0, 0);

    // ANTES DE AGREGAR EL CLONE AL DIV, TENGO QUE ELIMINAR EL ICONO QUE TIENE ACTUALMENTE EL DIV.
    // ESTE ICONO QUE TIENE DIV, ES EL ICONO QUE TIENE ACTUALMENTE EL DISPOSITIVO PERO CON UNA 
    // OPACIDAD REDUCIDA.
    if(nuevoIcono.hasChildNodes()){
        nuevoIcono.removeChild(nuevoIcono.lastChild);
    }

    nuevoIcono.appendChild(icono);
}