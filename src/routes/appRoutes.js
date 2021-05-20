const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const { v4 } = require('uuid');
const fs = require('fs');
const resizeImg = require('resize-img');
const exec = require('child_process').exec;

const router = Router();

/********    SUBIDA DE IMAGENES    ********/
// FUNCION QUE ME CAMBIA EL TAMAÑO DE LAS FOTOS QUE ESTAN EN EL DIRECTORIO
// C:\../SRC/PUBLIC/IMG/UPLOAD
function cambiarTamnio(){
    let imagenes = [];

    // OBTENER EL NOMBRE DE LAS FOTOS Y LAS GUARDO EN UN ARRAY PARA TRABAJAR CON ELLAS.
    filenames = fs.readdirSync(path.join(__dirname, '../public/img/upload'));
    filenames.forEach(file => {
        imagenes.push(path.join(__dirname, '../public/img/upload/', file));
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
            cb(null, path.join(__dirname, '../public/img/upload'));
        }else if(res.fieldname === 'listToUpload'){
            cb(null, path.join(__dirname, '../public/img/listas'));
        }
    },
    // LE DIGO COMO SE VAN A LLAMAR LAS FOTOS QUE ESTOY SUBIENDO
    filename: (req, res, cb) => {
        // COMPRUEBO SI LA SUBIDA LA HE REALIZADO DESDE EL 'iconToUpload', EN CASO DE SER ASI
        // A LA FOTO LE DOY UN NOMBRE ALEATORIO PERO LE PONGO LA MISMA EXTENSION CON LA QUE SE
        // HA SUBIDO.
        if(res.fieldname === 'iconToUpload'){
            // OBTENGO LA EXTENSION DE LA IMAGEN PARA DESPUES PORNERSELA AL FINAL DEL NUEVO NOMBRE
            let extension = res.mimetype.split('/');
            // OBTENGO EL NUMERO DE MILISEGUNDOS DESDE 1970.
            let date = new Date().getTime();
            cb(null, date +'.'+ extension[1].toLowerCase());
        }
        // EN CASO DE SUBIRSE DESDE EL 'listToUpload', GUARDO LA IMAGEN CON EL MISMO NOMBRE CON EL
        // QUE SE HA SUBIDO PERO TODO EN MINUSCULAS, PARA EVITAR CONFLICTOS.
        else if(res.fieldname === 'listToUpload'){
            cb(null, res.originalname.toLowerCase());
        }
    }
});

// SI QUISIERAMOS LIMITAR LA CANTIDAD DE ARCHIVOS QUE PODEMOS SUBIR AL MISMO TIEMPO DESDE EL
// 'iconToUpload', SOLAMENTE LE TENDRIAMOS QUE AGREGAR 'maxCount: num' AL OBJETO DEL INPUT
let upload = multer({
    storage, 
    fileFilter
}).fields([{ name: 'iconToUpload' }, { name: 'listToUpload' }]);


/********    RUTA /    ********/
router.get('/', (req, res) => {
    console.log('Estoy en la ruta: ', req.path);

    res.render('index');
});

/********    RUTA /ADD    ********/
router.get('/add', (req, res, next) => {
    console.log('Estoy en la ruta /add');

    res.render('add');
});

router.post('/add', upload, (req, res) => {
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

    res.render('add');
});

module.exports = router;

/* 
    1. ARREGLAR FILEFILTER
    2. PODER SUBIR MUCHAS IMAGENES DESDE EL INPUT DEL ICONO
    3. ARREGLAR EL BOTON DEL FORMULARIO DE LA PARTE DEL CLIENTE.
*/