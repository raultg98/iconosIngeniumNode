const controller = { };
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const resizeImg = require('resize-img');
const exec = require('child_process').exec;

/********    SUBIDA DE IMAGENES    ********/
// FUNCION QUE ME CAMBIA EL TAMAÑO DE LAS FOTOS QUE ESTAN EN EL DIRECTORIO
// C:\../SRC/PUBLIC/IMG/UPLOAD
function cambiarTamnio(){
    let imagenes = [];

    // OBTENER EL NOMBRE DE LAS FOTOS Y LAS GUARDO EN UN ARRAY PARA TRABAJAR CON ELLAS.
    filenames = fs.readdirSync(path.join(__dirname, '../datos/img/upload'));
    filenames.forEach(file => {
        imagenes.push(path.join(__dirname, '../datos/img/upload/', file));
    });

    // RECORRO LAS IMAGENES QUE TENGO DENTRO DEL DIRECTORIO, LE CAMBIO LAS DIMENSIONES
    // Y LAS VUELVO A GUARDAR CON EL MISMO NOMBRE
    for(let i=0; i<imagenes.length; i++){
        resizeImg(fs.readFileSync(imagenes[i]), {width: 100, height: 100})
        .then(buf => {
            fs.writeFileSync(imagenes[i], buf);
        });
    }
}

// FUNCION QUE ME COMPRUEBA SI UN ARCHIVO SUBIDO ES VALIDO O NO.
const fileFilter = (req, file, cb) => {
    // EXPRESION REGULAR PARA LOS FORMATOS DE IMAGENES QUE SOPORTAMOS.
    const fileTypes = /jpeg|jpg|png/;
    const extensionArchivo = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    // COMPRUEBO SI SE CUMPLEN LAS DOS CONDICIONES EN CASO DE SER ASI, ES QUE EL 
    // ARCHIVO SUBIDO ES UNA FOTO Y TIENE EL FORMATO DECLARADO EN 'fileTypes'
    if(extensionArchivo && extname){
        return cb(null, true);
    }else{
        cb('ERROR: El archivo debe ser una imagen');
    }
};

const storage = multer.diskStorage({
    // LE DOY LA RUTA DONDE QUIERO QUE SE ME GUARDEN MI FOTOS SUBIDAS.
    destination: (req, res, cb) => {
        // let input = res.fieldname;
        // console.log(input === 'iconToUpload'); // (true)

        // COMPRUEBO SI EL ARCHIVO SUBIDO VIENE DEL 'iconToUpload', EN CASO DE SER ASI LO 
        // GUARDO EN UN DIRECTORIO DETERMINADO
        if(res.fieldname === 'iconToUpload'){
            cb(null, path.join(__dirname, '../datos/img/upload'));
        }else if(res.fieldname === 'listToUpload'){
            cb(null, path.join(__dirname, '../public/img/listas'));
        }
    },
    // LE DIGO COMO SE VAN A LLAMAR LAS FOTOS QUE ESTOY SUBIENDO
    filename: (req, res, cb) => {
        // OBTENGO LA EXTENSION DE LA IMAGEN PARA DESPUES PORNERSELA AL FINAL DEL NUEVO NOMBRE
        let extension = res.mimetype.split('/');
        // COMPRUEBO SI LA SUBIDA LA HE REALIZADO DESDE EL 'iconToUpload', EN CASO DE SER ASI
        // A LA FOTO LE DOY UN NOMBRE ALEATORIO PERO LE PONGO LA MISMA EXTENSION CON LA QUE SE
        // HA SUBIDO.
        if(res.fieldname === 'iconToUpload'){
            // OBTENGO EL NUMERO DE MILISEGUNDOS DESDE 1970.
            let date = new Date().getTime();
            cb(null, date +'.'+ extension[1].toLowerCase());
        }
        // EN CASO DE SUBIRSE DESDE EL 'listToUpload', GUARDO LA IMAGEN CON EL MISMO NOMBRE CON EL
        // QUE SE HA SUBIDO PERO TODO EN MINUSCULAS, PARA EVITAR CONFLICTOS.
        else if(res.fieldname === 'listToUpload'){
            // EXPRESION QUE ME VALIDA QUE NINGUNA LISTA QUE SUBA SE LLAME ASI.
            let expresion = /custom.png|custom.jpeg|custom.jpg/i;

            // COMPRUEBO SI LA LISTA QUE ESTOY SUBIENDO SE LLAMA IGUAL QUE LAS DECLARADAS EN LA EXP.REG
            if(expresion.test(res.originalname)){
                // EN CASO DE QUE TENGAN EL MISMO NOMBRE, SE LO CAMBIO POR 'listCustom.ext';
                cb(null, ('listaCustom.'+ extension[1]));
            }else{
                // EN CASO DE QUE NO TENGA EL MISMO NOMBRE, LE PONGO EL NOMBRE CON EL QUE ME LA SUBISTES.
                cb(null, res.originalname.toLowerCase());
            }

            // cb(null, res.originalname.toLowerCase());
        }
    }
});

// SI QUISIERAMOS LIMITAR LA CANTIDAD DE ARCHIVOS QUE PODEMOS SUBIR AL MISMO TIEMPO DESDE EL
// 'iconToUpload', SOLAMENTE LE TENDRIAMOS QUE AGREGAR 'maxCount: num' AL OBJETO DEL INPUT
controller.upload = multer({
    storage, 
    fileFilter
}).fields([{ name: 'iconToUpload' }, { name: 'listToUpload' }]);

controller.addPost = (req, res) => {
    // LE CAMBIO EL TAMAÑO A LAS IMAGENES QUE ESTAN DENTRO DEL DIRECTORIO
    // 'C:\../src/public/img/upload', EN ESTA RUTA GUARDO LOS ICONOS INDIVIDUALES 
    // SUBIDOS DESDE EL CLIENTE.
    cambiarTamnio();

    exec('node \serverScripts/obtenerIconosCustom.js', (err, stdout) => {
        if(err) throw err;
    
        console.log('obtenerIconosCustom EJECUTADO')
    });

    exec('node \serverScripts/obtenerListasSubidas.js', (err, stdout) => {
        if(err) throw err;
    
        console.log('obtenerIconosCustom EJECUTADO')
    });

    exec('node \serverScripts/obtenerDatosInstal.js', (err, stdout) => {
        if(err) throw err;

        console.log('EJECUTADO ==> DatosInstal')
    });

    res.render('add');
}

controller.addGet = (req, res) => {
    console.log('Estoy en la ruta /add');

    res.render('add');
}

module.exports = controller;