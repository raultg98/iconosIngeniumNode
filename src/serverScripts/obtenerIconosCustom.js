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
    if(iconos.length/2 > i){
        listaIconosCol1.push(pathIconos + iconos[i]);
    }else{
        listaIconosCol2.push(pathIconos + iconos[i]);
    }
}


// NOMBRE QUE VA A TENER LA IMAGEN FUSIONA DE LA PRIMERA MITAD DE ICONOS
let nombreImgCol1 = 'columna1.png';
// NOMBRE QUE VA A TENER LA IMAGEN FUSIONA DE LA SEGUNDA MITAD DE ICONOS.
let nombreImgCol2 = 'columna2.png';
// NOMBRE QUE VA A TENER LA IMAGEN FUSIONADA DE LAS DOS COLUMNAS
let listaCustomNombre = 'custom.png';

// NOMBRE Y RUTA QUE VA A TENER LA PRIMERA COLUMNA DE LA LISTA DE ICONOS CUSTOM
let columna1 = (pathColumna + nombreImgCol1);
// NOMBRE Y RUTA QUE VA A TENER LA SEGUNDA COLUMNA DE LA LISTA DE ICONOS CUSTOM
let columna2 = (pathColumna + nombreImgCol2);
// NOMBRE Y RUTA QUE VA A TENER LA FUSION DE LA PRIMERA Y DE LA SEGUNDA COLUMNA
let listaCustom = path.join(__dirname, '../public/img/listas/' + listaCustomNombre);


if(listaIconosCol1.length > 1){
    /**
     * CON ESTA FUNCION CONSIGO FUSIONAR DOS O MAS IMAGENES EN UNA SOLA, ESTA FUSION SE HACE EN VERTICAL
     * Y LA IMAGEN RESULTANTE DE ESTA FUSION ES UNA DE LAS COLUMNAS DE MI LISTA DE ICONOS CUSTOM.
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
}

if(listaIconosCol2.length > 1){
    /**
     * CON ESTA FUNCION CONSIGO FUSIONAR DOS O MAS IMAGENES EN UNA SOLA, ESTA FUSION SE HACE EN VERTICAL
     * Y LA IMAGEN RESULTANTE DE ESTA FUSION ES UNA DE LAS COLUMNAS DE MI LISTA DE ICONOS CUSTOM.
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
}

/*
* EXISTEN 4 CASOS DIFERENTES A LA HORA DE CREAR LA LISTA DE ICONOS CUSTOM. ESTOS CASOS VAN EN FUNCION DE 
* LOS ICONOS QUE TENGO SUBIDOS AL SERVIDOR.
*/
// CASO 1: CUANDO HAY 4 O MAS ICONOS SUBIDOS
if((listaIconosCol1.length > 1) && (listaIconosCol2.length > 1)){
    fusionCols([columna1, columna2]);
}
// CASO 2: CUANDO HAY 3 ICONOS SUBIDOS
else if((listaIconosCol1.length > 1) && (listaIconosCol2.length === 1)){
    fusionCols([columna1, listaIconosCol2[0]]);
}
// CASO 3: CUANDO SOLAMENTE HAY DOS ICONOS SUBIDOS
else if((listaIconosCol1.length === 1) && (listaIconosCol2.length === 1)){
    fusionCols([listaIconosCol1[0], listaIconosCol2[0]]);
}
// CASO 4: CUANDO HAY UN UNICO ICONO SUBIDO
// else if((listaIconosCol1.length === 1) && (listaIconosCol2.length < 1)){ }

/**
    * CON ESTA FUNCION CONSIGO FUSIONAR LAS IMAGENES PASADAS COMO PARAMETRO.
    * 
    * @param { Array } arrayImagenes ,  Array que contiene las imagenes las cuales se quieren fusionar.
    * @param { Object } direction ,     Podemos juntar las imagenes de dos formas, horizonatalmente 
    *                                   verticalmente. ( TRUE == horizontal | FALSE = verticalmente ).
    * @param { String } listaCustom,    Nombre y ruta donde se va a guardar la nueva imagen (fusionada). 
    */
 function fusionCols(arrayImagenes){
    mergeImg(arrayImagenes, { direction: false })
    .then((img) => {
        img.write(listaCustom, (err) => {
            if(err) throw err;
    
            console.log('Se han juntado correctamente');
        });
    });
}