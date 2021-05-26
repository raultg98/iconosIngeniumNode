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

console.log(listasDeIconos);

// FUNCION QUE ME RECORTA TODOS LOS ICONOS DE LA LISTA ICONOS.
function recortarIconosLista(){
    // RECORRO EL ARRAY CON TODAS LAS LISTA DE ICONOS
    for (let j=0; j<listasDeIconos.length; j++) {

        console.log('Tamaño de la lista de Iconos: '+ listasDeIconos.length)
        // RECORRO LOS ICONOS DE CADA LISTA.
        for (let i=0; i<listasDeIconos[j].numeroIconos; i++) {
            const canvas = document.createElement('canvas');
            const contexto = canvas.getContext('2d');

            let numIconos = listasDeIconos[j].numeroIconos;

            let inicioX;
            let inicioY;
            let ancho_alto = 100;
            let zoom = 1;

            // ICONOS DE LA PRIMERA COLUMNA (i < 100)
            if (i < (numIconos / 2)) {
                // console.log(listasDeIconos[j].foto)
                inicioX = 0;
                inicioY = i * ancho_alto;
            }
            // ICONOS DE LA SEGUNDA COLUMNA (i >= 100)
            else if (i >= (numIconos / 2)) {
                inicioX = ancho_alto;
                inicioY = (i - (numIconos / 2)) * ancho_alto;
            }

            canvas.width = ancho_alto;
            canvas.height = ancho_alto;

            let icono = new Image();

            icono.onload = function () {
                contexto.drawImage(icono, inicioX, inicioY, ancho_alto * zoom,
                    ancho_alto * zoom, 0, 0, ancho_alto, ancho_alto);
            }

            icono.src = listasDeIconos[j].foto;

            canvas.setAttribute('id', `${listasDeIconos[j].titulo}-${i}`);

            iconosRecortados.push(canvas);
        }
    }
    console.log('Tamaño iconosRecortados: '+ iconosRecortados.length);
}

// console.log(iconosRecortados);
console.log('Tamaño de la lista de Iconos: '+ listasDeIconos.length)


// TENGO QUE LEER EL JSON CON TODOS LOS DISPOSITIVOS PARA DESPUES MOSTRAR ESTOS. 
// LE METO UN 'setTimeOut', PARA QUE LE DE TIEMPO A RECORTAR Y ALMACENAR LOS ICONOS.
setTimeout(function leerJSON() {
    fetch('../datos/Instal.json')
        .then(res => res.json())
        .then(componentes => {
            const fragmento = document.createDocumentFragment();

            const divBonton = document.createElement('div');
            const botonEnviar = document.createElement('button');

            divBonton.setAttribute('class', 'row mx-3 mt-3');
            botonEnviar.setAttribute('type', 'submit');
            botonEnviar.setAttribute('class', 'col-12 btn btn-outline-primary');

            botonEnviar.innerText = 'GUARDAR CAMBIOS';

            divBonton.appendChild(botonEnviar);

            // RECORRO TODOS LOS DISPOSTIVOS
            for (let i=0; i<componentes.length; i++) {
                // CREACION
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

                // ESTILOS
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

                acordeon1.setAttribute('class', 'acordeon1');

                nuevoIconoEncendido.setAttribute('class', `nuevoIcono-ON${i}`);


                // VALORES
                nombreDipositivo.innerText = componentes[i].nombre;
                
                encabezadoEncendido.innerText = 'Encendido';
                encabezadoApagado.innerText = 'Apagado';


                // ICONOS
                // OBTENGO LA POSICION QUE TIENE EL ICONO
                let posicion = parseInt(componentes[i].icono);

                let posicionEncendido = -1;
                let posicionApagado = -1;

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


                // CUANDO NOSOTROS NO HEMOS SELECCIONADO TODAVIA NINGUN ICONO QUEREMOS VER QUE EL NUEVO
                // ICONO ES EL MISMO QUE NOSOTROS TENEMOS, LA COSA ES QUE LO VAMOS A VER CON ALGO DE OPACIDAD.

                let nuevoON = iconosRecortados[posicionEncendido].cloneNode(true);
                nuevoON.getContext('2d').drawImage(iconosRecortados[posicionEncendido], 0, 0);

                nuevoIconoEncendido.appendChild(nuevoON)
                nuevoIconoEncendido.style.opacity = '0.5';

                let nuevoOFF = iconosRecortados[posicionApagado].cloneNode(true);
                nuevoOFF.getContext('2d').drawImage(iconosRecortados[posicionApagado], 0, 0);

                nuevoIconoApagado.appendChild(nuevoOFF);
                nuevoIconoApagado.style.opacity = '0.5';


                // EVENTOS
                encendido.addEventListener('click', () => {
                    let enc = '-ON';

                    if (acordeon1.hasChildNodes()) {
                        acordeon1.removeChild(acordeon1.lastChild);
                    } else {
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


                // APPEND'S
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

            divContenedor.appendChild(divBonton);
            divContenedor.appendChild(fragmento);
        })
}, 50);


setTimeout(
    function(){
        const divPrueba = document.getElementById('prueba');
        console.log(iconosRecortados)
        let c = iconosRecortados[200].cloneNode(true);
        c.getContext('2d').drawImage(iconosRecortados[200], 0, 0);

        divPrueba.appendChild(c);
    }
, 300);

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

    let iconosPintados = 0;

    // RECORRO LA LISTA DE LISTAS DE ICONOS, PARA SABER CUANDOS ACORDEONES TENGO QUE CREAR.
    for (let i=0; i<listasDeIconos.length; i++) {
        console.log('Iconos pintados: '+ iconosPintados)
        // CREACION
        const acordeonHeader = document.createElement('h2');
        const acordeonBoton = document.createElement('button');
        const acordeonCollapse = document.createElement('div');
        const acordeonBody = document.createElement('div');

        // ESTILOS
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

        // ASIGNACIONES
        acordeonBoton.innerText = listasDeIconos[i].titulo.toUpperCase();

        // let posicionLista = listasDeIconos[i].numeroIconos + j;

        // RECORRO LA LISTA DE ICONOS QUE TIENE ESA LISTA
        for (let j=iconosPintados; j<(iconosPintados + listasDeIconos[i].numeroIconos); j++) {
            

            // CLONO EL ICONO DE LA LISTA
            let c = iconosRecortados[j].cloneNode(true);
            c.getContext('2d').drawImage(iconosRecortados[j], 0, 0);

            c.addEventListener('click', () => {
                mostrarIconoAcordeon(j, nuevoIcono);
                console.log("Se ha pulsado el icono: " + (j + 1) + ' del acordeon '+ listasDeIconos[i].titulo + ' del dispositivo: ' + (dispositivo + 1));
            });

            acordeonBody.appendChild(c);
        }

        acordeonCollapse.appendChild(acordeonBody);
        acordeonHeader.appendChild(acordeonBoton);

        acordeonItem.appendChild(acordeonHeader);
        acordeonItem.appendChild(acordeonCollapse);

        iconosPintados += listasDeIconos[i].numeroIconos;
    }

    acordeon.appendChild(acordeonItem);

    return acordeon;
}

function mostrarIconoAcordeon(posicion, nuevoIcono){
    nuevoIcono.style.opacity = '1';

    let icono = iconosRecortados[posicion].cloneNode(true);
    icono.getContext('2d').drawImage(iconosRecortados[posicion], 0, 0);

    if(nuevoIcono.hasChildNodes()){
        nuevoIcono.removeChild(nuevoIcono.lastChild);
    }

    nuevoIcono.appendChild(icono);
}


// function timer(icono) {
//     setTimeout(function () {
//         const div2 = document.createElement('div');
//         div2.setAttribute('class', 'div2');

//         let c = iconosRecortados[icono].cloneNode(true);
//         c.getContext('2d').drawImage(iconosRecortados[icono], 0, 0);

//         div2.appendChild(c);
//         divContenedor.appendChild(div2);
//     }, 30);
// }
// timer(0);