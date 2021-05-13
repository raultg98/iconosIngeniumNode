let fs = require('fs');

// UBICACION DEL INSTAL.DAT
let pathDatos = './datos/Instal.dat';
// UBICACION DONDE VOY A GUARDAR MI JSON
let pathJSON = '/public/datos/Instal.json';

// 1. LEO LOS DATOS LOS CONVIERTO EN UN STRING Y LES QUITO LOS SALTOS 
//    DE LINEA
let componentesInstal = fs.readFileSync(pathDatos).toString().split(/\n/);

// 2. GUARDARLO EN OBJETOS Y METERLOS EN UN ARRAY
let arrayComponentes = [];

// RECORRO LA LISTA DE COMPONENTES INSTAL DE 8 EN 8 PORQUE CADA COMPONENTE
// ESTA FORMADO POR 8 LINEAS CONSECUTIVAS.
for(let i=0; i<componentesInstal.length; i+=8){
    const componente = {
        posicion1: componentesInstal[i],
        nombre:    componentesInstal[i+1],
        posicion3: componentesInstal[i+2],
        posicion4: componentesInstal[i+3],
        posicion5: componentesInstal[i+4],
        posicion6: componentesInstal[i+5],
        posicion7: componentesInstal[i+6],
        icono:     componentesInstal[i+7]
    }    

    arrayComponentes.push(componente);
}


// 3. GUARDO LOS DATOS LEIDOS EN UN JSON, PARA QUE PUEDA ACCEDER A ELLOS
//    DESDE LA PARTE DEL CLIENTE
let json_obj = JSON.stringify(arrayComponentes);
fs.writeFileSync(__dirname + pathJSON, json_obj);

// 3. DEVOLVER ESOS DATOS. CON EL JSON NO ES NECESARIO
// module.exports = arrayComponentes;