const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

let pathLista = path.join(__dirname, '../public/img/listas/');

let pathJSON = path.join(__dirname, '../public/datos/listasSubidas.json');

let arrayListas = fs.readdirSync(pathLista);

let listasPathClient = [];

for(let i=0; i<arrayListas.length; i++){
    let pathCliente = '/img/listas/';

    let nombre = arrayListas[i].split('.');
    let numIconos = -1;

    sizeOf((pathLista + arrayListas[i]), (err, dimensiones) => {
        if(err) throw err;

        numIconos = (dimensiones.height*2);
        console.log(numIconos)
    })


    // LE PONGO UN POCO DE RETARDO PARA QUE ASI LE DE TIEMPO A HACER EL 'sizeOf'
    setTimeout( function(){
        const objeto = {
            foto: (pathCliente + arrayListas[i]),   
            titulo: nombre[0], 
            numeroIconos: numIconos/100
        }

        console.log(objeto);

        listasPathClient.push(objeto);
    }, 5);
}

setTimeout( function(){
    console.log(listasPathClient)

    let json_obj = JSON.stringify(listasPathClient);
    fs.writeFileSync(pathJSON, json_obj);
}, 5);