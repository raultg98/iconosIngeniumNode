const fs = require('fs');
const mergeImg = require('merge-img');
const path = require('path');

// RUTA DONDE TENGO GUARDADOS LOS ICONOS CUSTOM SUBIDOS
let pathIconos = path.join(__dirname, '../datos/img/upload/');
// RUTA DONDE QUIERO QUE SE ME GUARDEN LAS IMAGEN COLUMNA
let pathColumna = path.join(__dirname, '../datos/img/');

// ARRAY DONDE GUARDO TODOS LOS ICONOS CUSTOM QUE TENGO.
let iconos = fs.readdirSync(pathIconos);

// ARRAYS DONDE VOY A GUARDAR LOS ICONOS CON SU RUTA ESPECIFICA
// TAMBIEN VOY A SEPARAR LOS ICONOS EN DOS ARRAYS QUE VAN A
// REPRESENTAR LAS COLUMNAS DE MI LISTA DE ICONOS FINAL
let listaIconosCol1 = [];
let listaIconosCol2 = [];

// RECORRO LA LISTA DE TODOS LOS ICONOS Y EN FUNCION SI HE PASADO DE LA 
// MITAD DEL TAMAÑO LOS GUARDO EN UN ARRAY O EN OTRO
for(let i=0; i<iconos.length; i++){
    // LO GUARDO EN EL PRIMER ARRAY
    if(iconos.length/2 >= i){
        listaIconosCol1.push(pathIconos + iconos[i]);
    }else{
        listaIconosCol2.push(pathIconos + iconos[i]);
    }
}

let nombreImgCol1 = 'columna1.png';
let nombreImgCol2 = 'columna2.png';
let listaCustomNombre = 'custom.png';

let columna1 = (pathColumna + nombreImgCol1);
let columna2 = (pathColumna + nombreImgCol2);
let listaCustom = path.join(__dirname, '../public/img/listas/' + listaCustomNombre);


// AHORA TENGO QUE JUNTAR LOS ICONOS DE CADA COLUMNA EN UNA SOLA FOTO
// Y QUE ESA UNION SE HAGA EN VERTICAL

/**
 * Con mergeImg consigo fusionar dos o mas imagenes en una sola.
 * 
 * @param { Array } listaIconosCol1 ,  Lista que contiene el nombre y la ruta donde estan 
 *                                     guardas las imagenes que deseamos juntar
 * @param { Object } direction ,       Podemos juntar las imagenes de dos formas, horizonatalmente 
 *                                     verticalmente. ( TRUE == horizontal | FALSE = verticalmente ).
 * @param { String } columna1,         Nombre y ruta donde se va a guardar la nueva imagen (fusionada). 
 */
function fusionarCol1(){
    mergeImg(listaIconosCol1,  { direction: true })
    .then((img) => {
        img.write(columna1, (err) => {
            if(err) throw err;

            console.log('Se han juntado correctamente');
        });
    });
}fusionarCol1();


/**
 * Con mergeImg consigo fusionar dos o mas imagenes en una sola.
 * 
 * @param { Array } listaIconosCol2 ,  Lista que contiene el nombre y la ruta donde estan 
 *                                     guardas las imagenes que deseamos juntar
 * @param { Object } direction ,       Podemos juntar las imagenes de dos formas, horizonatalmente 
 *                                     verticalmente. ( TRUE == horizontal | FALSE = verticalmente ).
 * @param { String } columna2,         Nombre y ruta donde se va a guardar la nueva imagen (fusionada). 
 */
function fusionarCol2(){
    mergeImg(listaIconosCol2,  { direction: true })
    .then((img) => {
        img.write(columna2, (err) => {
            if(err) throw err;
    
            console.log('Se han juntado correctamente');
        });
    });
}fusionarCol2();


/**
* Con mergeImg consigo fusionar dos o mas imagenes en una sola.
 * 
 * @param { Imagen } columna1 ,  Imagen fusionada de la primera mitad de iconos custom
 * @param { Imagen } columna2 ,  Imagen fusionada de la segunda mitad de iconos custom
 * @param { Object } direction , Podemos juntar las imagenes de dos formas, horizonatalmente 
 *                               verticalmente. ( TRUE == horizontal | FALSE = verticalmente ).
 * @param { String } listaCustom,   Nombre y ruta donde se va a guardar la nueva imagen (fusionada). 
 */
function fusionCols(){
    mergeImg([columna1, columna2], { direction: false })
    .then((img) => {
        img.write(listaCustom, (err) => {
            if(err) throw err;
    
            console.log('Se han juntado correctamente');
        });
    });
}fusionCols();