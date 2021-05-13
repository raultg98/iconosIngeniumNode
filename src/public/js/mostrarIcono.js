const divContenedor = document.getElementById('divPadre');
// divContenedor.setAttribute('class', 'd-flex justify-content-between')

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
            /* 
                FRAGMENTO QUE TENDRA A TODOS LOS DIV DE LOS DISPOSITIVOS
                DIV PARA CADA DISPOSITIVO
                DIV PARA MOSTRAR EL ICONO ACTUAL
                    - DIV IZQUIERDA (NOMBRE Y ICONO)
                    - FLECHA
                    - DIV PARA EL ICONO SELECCIONADO
                    - BOTON PARA CONFIRMAR EL CAMBIO DE ICONO
                        * EL BOTON DEL DIV TIENE QUE MANDAR UN FORMULARIO
                          AL SERVIDOR CON EL NUEVO ICONO DEL DISPOSITIVO
                          PARA DESPUES SOBREESCRIBIR EL INSTAL.DAT PARA 
                          ASI PODER GUARDAR EL NUEVO ICONO
                DIV PARA EL ACORDEON
            */

            const fragmento = document.createDocumentFragment();

            // RECORRO TODOS LOS DISPOSTIVOS
            for (let i=0; i<componentes.length; i++) {

                // CREACION DE ELEMENTOS
                const dispositivo = document.createElement('div');
                const superior = document.createElement('div');
                const iconoActual = document.createElement('div');
                const nombreIcono = document.createElement('h5');
                const divIcono = document.createElement('div');
                const flecha = document.createElement('i');
                const nuevoIcono = document.createElement('div');
                const botonAceptar = document.createElement('button');


                // ESTILOS
                dispositivo.setAttribute('class', 'container my-3 py-2 border border-primary border-3 rounded');
                superior.setAttribute('class', 'd-flex align-items-center justify-content-between flex-wrap');
                iconoActual.setAttribute('class', 'd-flex align-items-center');
                flecha.setAttribute('class', 'fas fa-arrow-right text-primary');
                botonAceptar.setAttribute('class', 'btn btn-outline-primary btn-block');
                botonAceptar.setAttribute('type', 'submit');


                // VALORES
                let nombre = (componentes[i].nombre + '( ' + i + ' )');
                nombreIcono.innerText = nombre;

                // ICONO
                let pos = parseInt(componentes[i].icono);


                setTimeout(function () {
                    const div2 = document.createElement('div');
                    div2.setAttribute('class', 'div2');

                    let c = iconosRecortados[pos].cloneNode(true);
                    c.getContext('2d').drawImage(iconosRecortados[pos], 0, 0);

                    div2.appendChild(c);
                    divIcono.appendChild(div2);
                }, 0);

                botonAceptar.innerText = 'Cambiar Icono';

                // console.log('COMPONENTE: ' + i + ', ICONO: ' + componentes[i].icono);

                // APPEND'S
                iconoActual.appendChild(nombreIcono);
                iconoActual.appendChild(divIcono);

                superior.appendChild(iconoActual);
                superior.appendChild(flecha);
                superior.appendChild(nuevoIcono);
                superior.appendChild(botonAceptar);

                dispositivo.appendChild(superior);

                // AGREGAR LA FUNCIONALIDAD DE QUE CUANDO PULSE EL BOTON DOS VECES ME ELIMINE EL ACORDEON
                botonAceptar.addEventListener('click', () => {
                    if (dispositivo.lastChild.getAttribute('id') === 'acordeonPadre') {
                        dispositivo.removeChild(dispositivo.lastChild);
                        console.log('Acordeon Eliminado');
                    } else {
                        dispositivo.appendChild(crearAcordeones(i));
                    }
                })

                fragmento.appendChild(dispositivo);
            }

            divContenedor.appendChild(fragmento);
        })
}
leerJSON();


function crearAcordeones(dispositivo) {
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
        acordeonHeader.setAttribute('id', `heading${dispositivo}${i}`);

        acordeonBoton.setAttribute('class', 'accordion-button bg-primary text-white collapsed');
        acordeonBoton.setAttribute('type', 'button');
        acordeonBoton.setAttribute('data-bs-toggle', 'collapse');
        acordeonBoton.setAttribute('data-bs-target', `#collapse${dispositivo}${i}`);
        acordeonBoton.setAttribute('aria-expanded', 'false');
        acordeonBoton.setAttribute('aria-controls', `collapse${dispositivo}${i}`);

        acordeonCollapse.setAttribute('class', 'accordion-collapse collapse bg-drak text-warning');
        acordeonCollapse.setAttribute('id', `collapse${dispositivo}${i}`);
        acordeonCollapse.setAttribute('aria-labelledby', `heading${dispositivo}${i}`);
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