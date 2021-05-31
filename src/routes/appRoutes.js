const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const resizeImg = require('resize-img');
const exec = require('child_process').exec;
const Jimp = require('jimp');
const sizeOf = require('image-size');
const { type } = require('os');


const router = Router();

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
let upload = multer({
    storage, 
    fileFilter
}).fields([{ name: 'iconToUpload' }, { name: 'listToUpload' }]);


/**
 * CREACION DE ALGO MUY SIMILAR A UN CONTROLADOR, PARA ASI TENER EL CODIGO MAS ENTENDIBLE.
 * ESTA FUNCION ES FLECHA ES LLAMADA DESDE LA PETICION 'router.post('/')'
 * 
 * @param { Object } req, Datos recibidos desde el cliente al hacer la peticion
 * @param { Object } res, Datos enviados desde el servidor al hacer dicha peticion
 */
const recortarIconos = async (req, res) => {
    /*
        1. OBTENGO EL ARRAY CON TODOS LOS DATOS DE LOS NUEVOS ICONOS.
        2. RECORTO TODOS LOS ICONOS. CUANDO LOS RECORTE TENGO QUE 
           COMPROBAR SI YA HE RECORTADO ESE ICONO ANTES
        3. CREO UNA LISTA DE ICONOS CON TODOS ESOS RECORTES.
        4. ELIMINO ESOS RECORTES. ???
    */
    // ARRAY QUE CONTIENE EL NOMBRE DE LA LISTA Y LA POSICION DEL ICONO EN DICHA LISTA.
    // ESTOS DATOS SON OBTENIDOS DEL DIV 'nuevoIcono' AL HACER CLICK EN EL BOTON 
    // 'Guardar Cambios'. (nombreLista-posicionIcono)
    const iconosInput = req.body.input;
    console.log(iconosInput);
    
    // UBICACION DONDE SE VAN A GUARDAR LOS RECORTES DE LAS LISTAS DE ICONOS
    const pathRecortes = path.join(__dirname, '../datos/img/recortes/');
    // UBICACION DONDE ESTAN LAS LISTAS DE LOS ICONOS.
    const pathListas = path.join(__dirname, '../public/img/listas/');

    // RECORRO LA LISTA DE TODOS LOS ICONOS QUE HE RECIBIDO DESDE EL CLIENTE.
    for(let i=0; i<iconosInput.length; i++){

        // SEPARO LA LISTA DE ICONO A LA QUE PERTENECE Y LA POSICION DE ESA LISTA.
        const listaPosIcono = iconosInput[i].split('-');

        // OBETENGO EL NOMBRE DE LA LISTA DE ICONOS CON LA EXTENSION QUE ESTA TIENE
        const listaIcono = listaPosIcono[0] +'.png';

        // OBTENGO LA POSICION QUE TIENE EL ICONO EN LA LISTA DE ICONOS
        const posicionIcono = parseInt(listaPosIcono[1]);

        // OBTENGO LA UBICACION Y NOMBRE QUE VA A TENER EL RECORTE
        // path\'nombreLista - posicionIconoEnLaListaDeIconos' .png
        // C:\Users\Ingenium\Desktop\Iconos\src\datos\img\recortes\default-0.png
        const pathConNombreRecorte = pathRecortes + iconosInput[i] + '.png';

        // OBTENGO EL NOMBRE Y LA EXTENSION DEL RECORTE. (default-0.png)
        const nombreRecorte = iconosInput[i] + '.png';

        // LISTO TODOS LOS ICONOS RECORTADOS QUE TENGO, PARA ASI DESPUES NO RECORTAT UN
        // ICONO MAS DE UNA VEZ.
        const recortes = fs.readdirSync(pathRecortes);

        // HAGO LA COMPROBACION DE QUE SI EL ICONO YA LO HE RECORTADO CON ANTERIORIDAD
        if(!recortes.includes(nombreRecorte)){
            // OBTENGO LA LISTA DE ICONOS DEL ICONO QUE QUIERO RECORTAR.
            const iconoRecortado = await Jimp.read(pathListas + listaIcono);

            // TENGO QUE SABER EL TAMAÑO QUE TIENE LA LISTA, PARA SABER SI EL
            // ICONO ES DE LA PRIMERA O DE LA SEGUNDA COLUMNA
            const numIconosLista = (sizeOf(pathListas + listaIcono).height/100);

            // console.log('Posicion: '+ i + ', '+ recortes.includes(aux) +', ICONO: ' +iconosInput[i]);
        
            // PRIMERA COLUMNA
            if(posicionIcono < numIconosLista){
                // RECORTO EL ICONO: .crop(x, y, ancho, alto).
                // x === 0 ====> Primera Columna
                // x === 100 ==> Segunda Columna
                iconoRecortado.crop(0, (posicionIcono*100), 100, 100);
            }
            // SEGUNDA COLUMNA
            else{
                iconoRecortado.crop(100, ((posicionIcono-100)*100), 100, 100);
            }
    
            iconoRecortado.write(pathConNombreRecorte);
        }
    }

    res.render('index'); 
}


/********    RUTA /    ********/
router.get('/', (req, res) => {
    console.log('Estoy en la ruta: ', req.path);

    exec('node \serverScripts/obtenerIconosCustom.js', (err, stdout) => {
        if(err) throw err;
    
        console.log('obtenerIconosCustom EJECUTADO')
    });


    exec('node \serverScripts/obtenerListasSubidas.js', (err, stdout) => {
        if(err) throw err;

        console.log('obtenerIconosCustom EJECUTADO')   
    });

    res.render('index');
});

router.post('/', recortarIconos);


/********    RUTA /ADD    ********/
router.get('/add', (req, res) => {
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