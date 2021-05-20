const fs = require('fs');
const path = require('path');

// RUTA DONDE TENGO GUARDADOS LOS ICONOS
let pathIconos = path.join(__dirname, '../public/img/upload/');
// RUTA DONDE VOY A GUARDAR EL JSON, EN CASO DE YA EXISTIR UNO LO PISO.
let pathJSON = path.join(__dirname, '../public/datos/iconosCustom.json');

// LISTA QUE CONTIENE EL NOMBRE Y EXTENSION DE TODAS LAS FOTOS QUE ESTAN EN EL
// DIRECTORIO DONDE SE GUARDAN AL HACER EL UPLOAD
let listaIconos = fs.readdirSync(pathIconos);

// NUEVA LISTA QUE VOY A UTILIZAR PARA GUARDAR LA RUTA Y EL NOMBRE DE LA IMAGEN
// DE TODAS LAS IMAGENES DEL DIRECTORIO UPLOAD
let listaIconosRuta = [];

for(let i=0; i<listaIconos.length; i++){
    // RUTA DONDE ESTAN LAS IMAGENES EN LA PARTE DEL CLIENTE.
    let pathCliente = '/img/upload/';

    listaIconosRuta.push(pathCliente + listaIconos[i]);
}

// GUARDO LA LISTA DE ICONOS QUE TIENE SU NOMBRE Y SU RUTA EN EL ARCHIVO JSON
// EN LA RUTA INDICADA ANTERIORMENTE.
let json_obj = JSON.stringify(listaIconosRuta);
fs.writeFileSync(pathJSON, json_obj);