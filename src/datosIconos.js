let fs = require('fs');
let pathDatos = './datos/Instal.dat';


// 1. LEER LOS DATOS Y CONVERTIRLOS EN UN STRING
let datos = fs.readFileSync(pathDatos).toString().split(/\n/);

// 2. GUARDARLO EN OBJETOS Y METERLOS EN UN ARRAY
let arrayDatos = [];

for(let i=0; i<datos.length; i+=8){
    const objeto = {
        posicion1: datos[i],
        nombre:    datos[i+1],
        posicion3: datos[i+2],
        posicion4: datos[i+3],
        posicion5: datos[i+4],
        posicion6: datos[i+5],
        posicion7: datos[i+6],
        icono:     datos[i+7]
    }

    arrayDatos.push(objeto);
}

// 3. DEVOLVER ESOS DATOS
module.exports = arrayDatos;