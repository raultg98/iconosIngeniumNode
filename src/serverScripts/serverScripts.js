const path = require('path');
const fs = require('fs');
const sizeOf = require('image-size');
const mergeImg = require('merge-img');
const script = { };

/******************     RUTAS SERVIDOR     ******************/
const pathListas = path.join(__dirname, '../public/img/listas/');
const pathColumna = path.join(__dirname, '../datos/img/');
const pathDatos = path.join(__dirname, '../datos/Instal.dat');
const pathUpload = path.join(__dirname, '../datos/img/upload/');

/******************     RUTAS CLIENTE     ******************/
const jsonListasSubidas = path.join(__dirname, '../public/datos/listasSubidas.json');
const jsonInstal = path.join(__dirname, '../public/datos/Instal.json');


/******************     FUNCIONES     ******************/
/**
 * FUNCION CON LA CUAL PASO LOS DATOS QUE TENGO EN EL ARCHIVO 'Instal.dat' AL CLIENTE.
 * ESTO LO HAGO CREANDO UN JSON QUE CONTIENE UN ARRAY DE OBJETOS DONDE CADA OBJETO
 * SERA UN COMPONENTE. CAD COMPONENTE ESTA COMPUESTO POR 8 LINEAS DEL 'Instal.dat'.
 * A MI SOLO ME INTERESAN LAS LINEAS:
 *      - 1 --> nombre
 *      - 7 --> icono
 */
script.obtenerDatosInstal = () => {
    /**
     * 1. LEO LOS DATOS, LOS CONVIERTO EN UN STRING Y LES QUITO LOS SALTOS DE LINEA
     * 2. GUARDO LOS DATOS DE CADA COMPONENTE EN UN OBJETO Y METO LOS OBJETOS EN UN ARRAY
     * 3. GUARDO EL ARRAY EN UN ARCHIVO '.json' PARA ACCEDER A EL DESDE EL CLIENTE.
     */

    // STRING QUE CONTIENE TODOS LOS DATOS DEL 'Instal.dat'
    const componentesInstal = fs.readFileSync(pathDatos).toString().split(/\n/);

    // LISTA QUE VA A CONTENER TODOS LOS OBJETOS (CADA OBJETO ES UN COMPONENTE).
    const arrayComponentes = [];
    for(let i=0; i<componentesInstal.length; i+=8){
        // COMO SOLO ME INTERESAN 2 LINEAS DE CAD COMPONENTE, A LAS OTRAS LES DOY EL NOMBRE
        // DE LA POSICION QUE OCUPAN EN EL COMPONENTE.
        const componente = {
            posicion0: componentesInstal[i],
            nombre:    componentesInstal[i+1],
            posicion2: componentesInstal[i+2],
            posicion3: componentesInstal[i+3],
            posicion4: componentesInstal[i+4],
            posicion5: componentesInstal[i+5],
            posicion6: componentesInstal[i+6],
            icono:     componentesInstal[i+7]
        }

        arrayComponentes.push(componente);
    }

    // PASO LA LISTA DE OBJETOS A UN JSON
    const json_obj = JSON.stringify(arrayComponentes);
    fs.writeFileSync(jsonInstal, json_obj);
}

/**
 * FUNCION CON LA CUAL PASO LOS DATOS DE LAS LISTAS AL CLIENTE. ESTAS LISTAS SON LAS QUE EL CLIENTE
 * HA SUBIDO. PASO LOS DATOS AL CLIENTE MEDIANTE UN ARCHIVO '.json'. ESTE ARCHIVO CONTIENE UNA LISTA
 * DE OBJETOS, DONDE CADA OBJETO ES UNA LISTA QUE EL USUARIO ME HA SUBIDO. ESTE OBJETO ESTARA COMPUESTO
 * POR:
 *      - foto: UBICACION Y NOMBRE DE LA LISTA DE ICONOS QUE EL CLIENTE ME HA SUBIDO.
 *      - titulo: NOMBRE CON EL CUAL EL USUARIO ME HA SUBIDO LA LISTA. ESTE SERA EL ENCABEZADO DEL 
 *                ACORDEON DONDE SE PODRAN SELECCIONAR ESTOS ICONOS.
 *      - numeroIconos: EL NUMERO TOTAL DE ICONOS QUE TIENE LA LISTA (CONTANDO LAS DOS COLUMNAS).
 */
script.obtenerListasSubidas = () => {
    // ARRAY QUE CONTIENE EL NOMBRE DE TODAS LAS LISTAS QUE EL CLIENTE ME HA SUBIDO
    const arrayListas = fs.readdirSync(pathListas);

    // ARRAY QUE VA CONTENER LA RUTA Y EL NOMBRE DE LA LISTA (objeto.foto)
    const listasPathCliente = [];
    for(let i=0; i<arrayListas.length; i++){
        // EL CLIENTE NO HACE FALTA QUE ACCEDE A LA LISTA CON LA RUTA RELATIVA DE LA IMAGE
        // CON PASARLE EL DIRECTORIO DONDE ESTA EN LA CARPETA 'public' ES SUFICIENTE
        const pathCliente = '/img/listas/';

        // NOMBRE EL CUAL TIENE LA LISTA. HAGO UN SPLIT PARA PODER OBTENER SOLO EL NOMBRE, SIN LA EXT.
        const nombreLista = arrayListas[i].split('.');
        
        let numeroIconosLista;
        let objeto;

        // TENGO QUE COMPROBAR QUE LA LISTA NO ES 'custom' YA QUE PARA CALCULAR EL 'numeroIconos' QUE 
        // TIENE LA LISTA 'custom' NOS SIRVE CON LISTAR EL DIRECTORIO DONDE TENGO GUARDADOS LOS ICONOS
        // SUBIDOS POR EL CLIENTE, ES DECIR, LOS CUSTOMS
        if(nombreLista[0] === 'custom'){
            numeroIconosLista = fs.readdirSync(pathUpload).length;

            objeto = {
                foto: (pathCliente + arrayListas[i]),
                titulo: nombreLista[0], 
                numeroIconos: numeroIconosLista
            }
        }else {
            numeroIconosLista = (sizeOf((pathListas + arrayListas[i])).height*2)/100;
            
            objeto = {
                foto: (pathCliente + arrayListas[i]), 
                titulo: nombreLista[0], 
                numeroIconos: numeroIconosLista
            }
        }

        listasPathCliente.push(objeto);
    }

    // PASO LA LISTA DE OBJETOS AL JSON
    let json_obj = JSON.stringify(listasPathCliente);
    fs.writeFileSync(jsonListasSubidas, json_obj);
}

/**
 * FUNCION CON LA CUAL CREO LA LISTA DE ICONOS CUSTOM. ESTA LISTA ESTA COMPUESTA POR TOODS LOS ICONOS
 * INDIVIDUALES QUE EL CLIENTE HA SUBIDO. LOS ICONOS CUSTOM CUANDO LOS SUBO LOS REDIMENSIONO, ENTONCES
 * AQUI SOLAMENTE TENGO QUE REALIZAR LAS FUSIONES. REALIZO TRES FUSIONES, DOS EN VERTICAL CON LA MITAD 
 * DE LOS ICONOS EN CADA FUSION Y DESPUES LA TERCERA FUSION ES LA FUSION DE ESTAS DOS EN HORIZONTAL
 */
script.obtenerIconosCustom = () => {
    // NOMBRE QUE VA A TENER LA PRIMERA FUSION EN VERTICAL (PRIMERA MITAD DE ICONOS).
    const nombreImgCol1 = 'columna1.png';
    // NOMBRE QUE VA A TENER LA SEGUNDA FUSION EN VERTICAL (SEGUNDA MITAD DE ICONOS).
    const nombreImgCol2 = 'columna2.png';
    // NOMBRE QUE VA A TENER LA LISTA DE LA FUSION DE COL1 Y COL2.
    const listaCustomNombre = 'custom.png';

    // RUTA Y NOMBRE DE LAS FUIONES.
    const pathYnombreColumna1 = (pathColumna + nombreImgCol1);
    const pathYnombreColumna2 = (pathColumna + nombreImgCol2);
    const pathYnombreCustom = (pathListas + listaCustomNombre)

    // ARRAY QUE CONTIENE TODOS LOS NOMBRE DE LOS ICONOS CUSTOM QUE EL CLIENTE A SUBIDO.
    const iconos = fs.readdirSync(pathUpload);

    // ARRAY QUE VA A COTENER LA PRIMERA MITAD DE ICONOS SUBIDOS.
    const listaIconosCol1 = [];
    // ARRAY QUE VA A COTENER LA SEGUNDA MITAD DE ICONOS SUBIDOS.
    const listaIconosCol2 = [];

    for(let i=0; i<iconos.length; i++){
        if(iconos.length/2 > i){
            listaIconosCol1.push(pathUpload + iconos[i]);
        }else {
            listaIconosCol2.push(pathUpload + iconos[i]);
        }
    }

    /**
     * REALIZO LAS DOS PRIMERAS FUSIONES EN VERTICAL. ESTAS FUSIONES EN VERTICAL SOLO SE
     * PUEDEN HACER SI LAS LISTAS QUE CONTINEN LA MITAD DE CADA ICONO TIENEN MAS DE 1 ICONO
     */
    if(listaIconosCol1.length > 1){
        mergeImg(listaIconosCol1, { direction: true })
        .then(img => {
            img.write(pathYnombreColumna1);
        })
    }

    if(listaIconosCol2.length > 1){
        mergeImg(listaIconosCol2, { direction: true })
        .then(img => {
            img.write(pathYnombreColumna2);
        })
    }

    function fusionCols(arrayImagenes){
        mergeImg(arrayImagenes, { direction: false })
        .then(img => {
            img.write(pathYnombreCustom);
        })
    }

    /**
     * EXISTEN 4 CADOS DIFERENTES A LA HORA DE HACER LA FUSION EN HORIZONTAL.
     *      - CASO 1: EN LAS DOS COLUMNAS HAY MAS DE 1 ICONO EN CADA UNA.
     *      - CASO 2: EN LA PRIMERA COLUMNA HAY MAS DE UN ICONO Y EN LA SEGUNDA SOLO HAY UNO
     *      - CASO 3: EN LA PRIMERA COLUMNA SOLO HAY UN ICONO Y EN LA SEGUNDA HAY MAS DE UNO 
     *        ( NO SERIA NECESARIO PERO LO HAGO PARA ASEGURARME ).
     *      - CASO 4: DONDE TENGO UN ICONO EN CADA COLUMNA.
     */
    setTimeout(() => {
        if((listaIconosCol1.length > 1) && (listaIconosCol2.length > 1)){
            fusionCols([pathYnombreColumna1, pathYnombreColumna2]);
        }else if((listaIconosCol1.length > 1) && (listaIconosCol2.length === 1)) {
            fusionCols([pathYnombreColumna1, listaIconosCol2[0]]);
        }else if((listaIconosCol1.length === 1) && (listaIconosCol2.length > 1)){
            fusionCols([listaIconosCol1[0], pathYnombreColumna2]);
        }else if((listaIconosCol1.length === 1) && (listaIconosCol2.length === 1)){
            fusionCols([listaIconosCol1[0], listaIconosCol2[0]]);
        }
    }, 200);    
}

module.exports = script;