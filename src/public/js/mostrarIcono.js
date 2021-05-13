const divContenedor = document.getElementById('divPadre');
// divContenedor.setAttribute('class', 'd-flex justify-content-center')

let iconosRecortados = [];

// ARRAY DE OBJETOS QUE CONTIENEN TODAS LAS LISTAS DE ICONOS. CADA OBJETO CONTIENE LA UBICACION DE LA 
// IMAGEN, EL TITULO Y EL NUMERO DE ICONOS QUE TIENE LA LISTA.
let listasDeIconos = [{
    foto: '/img/icons.png',
    titulo: 'DEFAULT',
    numeroIconos: 200
}
    // OTRA LISTA DE ICONOS
//     , {
//         foto: '',
//         titulo: 'PRUEBA',
//         numeroIconos: 0
// }
];

// FUNCION QUE ME RECORTA TODOS LOS ICONOS DE LA LISTA ICONOS.
function recortarIconosLista() {
    // RECORRO EL ARRAY CON TODAS LAS LISTA DE ICONOS
    for (let j = 0; j < listasDeIconos.length; j++) {

        // RECORRO LOS ICONOS DE CADA LISTA.
        for (let i = 0; i < listasDeIconos[j].numeroIconos; i++) {
            const canvas = document.createElement('canvas');
            const contexto = canvas.getContext('2d');

            let numIconos = listasDeIconos[j].numeroIconos;

            let inicioX;
            let inicioY;
            let ancho_alto = 100;
            let zoom = 1;

            // ICONOS DE LA PRIMERA COLUMNA (i < 100)
            if (i < (numIconos / 2)) {
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

            canvas.setAttribute('id', i);

            iconosRecortados.push(canvas);
        }
    }
}
recortarIconosLista();


// TENGO QUE LEER EL JSON CON TODOS LOS DISPOSITIVOS PARA DESPUES MOSTRAR ESTOS.
function leerJSON() {
    fetch('../datos/Instal.json')
        .then(res => res.json())
        .then(componentes => {
            const fragmento = document.createDocumentFragment();

            // RECORRO TODOS LOS DISPOSTIVOS
            for (let i=0; i<componentes.length; i++) {
                // CREACION
                const dispositivo = document.createElement('div');
                const nombre = document.createElement('h1');
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
                dispositivo.setAttribute('class', 'row mx-3 my-5 p-2 border border-2 border-primary rounded');

                nombre.setAttribute('class', 'text-center text-primary');

                encabezadoEncendido.setAttribute('class', 'my-1 text-primary');
                encabezadoApagado.setAttribute('class', 'my-1 text-primary');

                divEncendido.setAttribute('class', 'col-md-6 col-sm-12');
                divApagado.setAttribute('class', 'col-md-6 col-sm-12');

                encendido.setAttribute('class', 'd-flex justify-content-between align-items-center p-3 border border-2 border-primary rounded');
                apagado.setAttribute('class', 'd-flex justify-content-between align-items-center p-3 border border-2 border-primary rounded');
                flecha1.setAttribute('class', 'fas fa-arrow-right text-primary');
                flecha2.setAttribute('class', 'fas fa-arrow-right text-primary');

                acordeon1.setAttribute('class', 'acordeon1');

                
                // VALORES
                nombre.innerText = componentes[i].nombre;
                
                encabezadoEncendido.innerText = 'Encendido';
                encabezadoApagado.innerText = 'Apagado';

                // ICONOS
                let posicion = parseInt(componentes[i].icono);

                // HAY VECES QUE AL RECARGAR LA PAGINA NO SE CARGAN BIEN LOS ICONOS DE CADA DISPOSITIVO.
                // setTimeout(function(){
                    let posicionEncendido = -1;
                    let posicionApagado = -1;

                    if(posicion < 100){
                        posicionEncendido = posicion;
                        posicionApagado = (posicion + 100);
                    }

                    let on = iconosRecortados[posicionEncendido].cloneNode(true);
                    on.getContext('2d').drawImage(iconosRecortados[posicionEncendido], 0, 0);

                    let off = iconosRecortados[posicionApagado].cloneNode(true);
                    off.getContext('2d').drawImage(iconosRecortados[posicionApagado], 0, 0);

                    iconoEncendido.appendChild(on);
                    iconoApagado.appendChild(off);
                // }, 0);


                // EVENTOS
                encendido.addEventListener('click', ()=>{
                    let enc = '-ON';

                    console.log(acordeon1);

                    if(acordeon1.hasChildNodes()){
                        acordeon1.removeChild(acordeon1.lastChild);
                    }else{
                        acordeon1.appendChild(crearAcordeones(i, enc))
                        console.log('Se ha pulsado en encendido');
                    }
                    
                });

                apagado.addEventListener('click', ()=>{
                    let apg = '-OFF'

                    if(acordeon2.hasChildNodes()){
                        acordeon2.removeChild(acordeon2.lastChild);
                    }else{
                        acordeon2.appendChild(crearAcordeones(i, apg))
                        console.log('Se ha pulsado en apagado');
                    }
                    
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

                dispositivo.appendChild(nombre);
                dispositivo.appendChild(divEncendido);
                dispositivo.appendChild(divApagado);
                // dispositivo.appendChild(acordeon);
                
                fragmento.appendChild(dispositivo);
            }

            divContenedor.appendChild(fragmento);
        })
}
leerJSON();


function crearAcordeones(dispositivo, estado) {
    const acordeon = document.createElement('div');
    const acordeonItem = document.createElement('div');

    acordeon.setAttribute('class', 'accordion');
    acordeon.setAttribute('id', 'acordeonPadre');
    acordeonItem.setAttribute('class', 'accordion-item');

    // RECORRO LA LISTA DE LISTAS DE ICONOS, PARA SABER CUANDOS ACORDEONES TENGO QUE CREAR.
    for (let i = 0; i < listasDeIconos.length; i++) {
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
        acordeonBoton.innerText = listasDeIconos[i].titulo;

        // RECORRO LA LISTA DE ICONOS QUE TIENE ESA LISTA
        for (let j=0; j<listasDeIconos[i].numeroIconos; j++) {

            // CLONO EL ICONO DE LA LISTA
            let c = iconosRecortados[j].cloneNode(true);
            c.getContext('2d').drawImage(iconosRecortados[j], 0, 0);

            c.addEventListener('click', () => {
                console.log("Se ha pulsado el icono: " + (j + 1) + ' del dispositivo: ' + (dispositivo + 1));
            });

            acordeonBody.appendChild(c);
        }

        acordeonCollapse.appendChild(acordeonBody);
        acordeonHeader.appendChild(acordeonBoton);

        acordeonItem.appendChild(acordeonHeader);
        acordeonItem.appendChild(acordeonCollapse);
    }


    acordeon.appendChild(acordeonItem);

    return acordeon;
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

// CREACION DE ELEMENTOS
// const dispositivo = document.createElement('div');
// const superior = document.createElement('div');
// const iconoActual = document.createElement('div');
// const nombreIcono = document.createElement('h5');
// const divIcono = document.createElement('div');
// const flecha = document.createElement('i');
// const nuevoIcono = document.createElement('div');
// const botonAceptar = document.createElement('button');


// // ESTILOS
// dispositivo.setAttribute('class', 'container my-3 py-2 border border-primary border-3 rounded');
// superior.setAttribute('class', 'd-flex align-items-center justify-content-between flex-wrap');
// iconoActual.setAttribute('class', 'd-flex align-items-center');
// flecha.setAttribute('class', 'fas fa-arrow-right text-primary');
// botonAceptar.setAttribute('class', 'btn btn-outline-primary btn-block');
// botonAceptar.setAttribute('type', 'submit');


// // VALORES
// let nombre = (componentes[i].nombre + '( ' + i + ' )');
// nombreIcono.innerText = nombre;

// // ICONO
// let pos = parseInt(componentes[i].icono);


// setTimeout(function () {
//     const div2 = document.createElement('div');
//     div2.setAttribute('class', 'div2');

//     let c = iconosRecortados[pos].cloneNode(true);
//     c.getContext('2d').drawImage(iconosRecortados[pos], 0, 0);

//     div2.appendChild(c);
//     divIcono.appendChild(div2);
// }, 0);

// botonAceptar.innerText = 'Cambiar Icono';

// // console.log('COMPONENTE: ' + i + ', ICONO: ' + componentes[i].icono);

// // APPEND'S
// iconoActual.appendChild(nombreIcono);
// iconoActual.appendChild(divIcono);

// superior.appendChild(iconoActual);
// superior.appendChild(flecha);
// superior.appendChild(nuevoIcono);
// superior.appendChild(botonAceptar);

// dispositivo.appendChild(superior);

// // AGREGAR LA FUNCIONALIDAD DE QUE CUANDO PULSE EL BOTON DOS VECES ME ELIMINE EL ACORDEON
// botonAceptar.addEventListener('click', () => {
//     if (dispositivo.lastChild.getAttribute('id') === 'acordeonPadre') {
//         dispositivo.removeChild(dispositivo.lastChild);
//         console.log('Acordeon Eliminado');
//     } else {
//         dispositivo.appendChild(crearAcordeones(i));
//     }
// })

// fragmento.appendChild(dispositivo);
