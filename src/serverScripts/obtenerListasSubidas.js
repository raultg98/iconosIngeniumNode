const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const execSync = require('child_process').exec;

execSync('node \serverScripts/obtenerIconosCustom.js', (err, stdout) => {
    if(err) throw err;
    
    console.log('obtenerIconosCustom EJECUTADO')
});




// RUTA DONDE TENGO ALMACENADAS MIS LISTAS SUBIDAS (CLIENTE).
let pathLista = path.join(__dirname, '../public/img/listas/');
// RUTA Y NOMBRE DONDE VOY A GUARDAR EL JSON QUE CONTIENE LOS DATOS DE LAS LISTAS.
let pathJSON = path.join(__dirname, '../public/datos/listasSubidas.json');

// ARRAY QUE CONTIENE TODAS LAS LISTAS SUBIDAS EN LA RUTA ANTERIORMENTE INDICADA.
// 'pathLista'.
let arrayListas = fs.readdirSync(pathLista);

// ARRAY DONDE VOY A ALMACENAR LA RUTA Y EL NOMBRE DE LAS LISTAS, LAS CUALES HE 
// LEIDO ANTES 'arrayListas'.
let listasPathClient = [];

// RECORRO 'arrayLista' PARA GUARDAR EN 'listaPathCliente' EL NOMBRE Y LA RUTA DE
// CADA LISTA DE ICONOS.
for(let i=0; i<arrayListas.length; i++){
    let pathCliente = '/img/listas/';

    // ARRAY QUE CONTIENE EL NOMBRE Y LA EXTENSION DE LA LISTA
    // EN LA POS == 0 -> CONTIENE EL NOMBRE
    // EN LA POS == 1 -> CONTIENE LA EXTENSION 
    let nombre = arrayListas[i].split('.');
    
    // OBTENGO EL ALTO DE LA IMAGEN, Y CON ESO PUEDO CALCULAR EL NUMERO DE ICONOS QUE 
    // TIENE CADA LISTA DE ICONOS.
    const dimensiones = sizeOf((pathLista + arrayListas[i])).height;

    let objeto;

    // CUANDO LA LISTA ES 'custom' PUEDE TENER NO TENER UN ICONO EN LA ULTIMA POSICION
    // DE LA SEGUNDA COLUMNA PORQUE EL USUARIO SUBIO UN NUMERO IMPAR DE ICONOS, POR ESO
    // EL 'numIconos' SE LO PONEMOS LISTANDO EL DIRECTORIO 'upload'.
    if(nombre[0] === 'custom'){
        // AHORA TENGO QUE LEER EL DIRECTORIO DONDE ESTAN LOS ICONOS CUSTOM Y ESOS 
        // SON LOS ICONOS CUSTOM QUE TIENE LA IMAGEN.
        let numIconosCustom = fs.readdirSync(path.join(__dirname, '../datos/img/upload/'));

        objeto = {
            foto: (pathCliente + arrayListas[i]),   
            titulo: nombre[0], 
            numeroIconos: numIconosCustom.length 
        }
    }else{
        // CREO UN OBJETO QUE VA A CONTENER TODOS LOS DATOS DE LA LISTA. ESTE OBJETO ES 
        // EL QUE DESPUES VOY A INSERTAR EN EL JSON Y PASARLO AL CLIENTE.
        objeto = {
            foto: (pathCliente + arrayListas[i]),   
            titulo: nombre[0], 
            numeroIconos: (dimensiones*2)/100        
        }
    }
    
    console.log(objeto);

    listasPathClient.push(objeto);
}

// FUNCION QUE ME SIRVE PARA CREAR UN JSON EN CASO DE QUE NO EXISTA EN LA RUTA 
// INDICADA 'pathJSON' O EN CASO DE QUE EXISTA ME LO PISE.
function escribirJSON(){
    let json_obj = JSON.stringify(listasPathClient);
    fs.writeFileSync(pathJSON, json_obj);
}escribirJSON();