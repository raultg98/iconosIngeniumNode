const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const resizeImg = require('resize-img');
const exec = require('child_process').exec;
const Jimp = require('jimp');
const sizeOf = require('image-size');
const mergeImg = require('merge-img');

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
const recortarIconos1 = async (req, res) => {
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

/**
 * FUNCION MUY PARECIDA A UN CONTROLADOR DE 'MVC', PERO SIN IMPLEMENTAR UN ARCHIVO ESPECIFICO
 * PARA EL CONTROLADOR. ESTA FUNCION OBTIENE LOS DATOS DE UN FORMULARIO QUE CREAMOS DESDE EL 
 * CLIENTE AL DARLE AL BOTON DE 'Guardar Cambios', LEEMOS LOS VALORES DE DOS INPUTS QUE 
 * CORRESPONDERIAN A LOS DOS ESTADOS (ON | OFF) QUE TIENE UN DISPOSITIVO. CREAMOS UNA IMAGEN
 * QUE VA A SER LA FUSION DE LOS DOS INPUT DE UN DISPOSITIVO Y SI TENEMOS MAS DE UN DISPOSITIVO 
 * CREAREMOS UNA IMAGEN QUE SERA LA FUSION DE TODAS LAS IMAGENES DE LOS DISPOSITIVOS. ESTOS
 * DISPOSITIVOS QUE NOSOTROS RECIBIMOS SON LOS DISPOSITIVOS EN LOS QUE SE HA SELECCIONADO UN
 * NUEVO ICONO PARA CUALQUIERA DE LOS DOS ESTADOS DEL DISPOSITIVO.
 * 
 * @param { Object } req, Datos enviados desde el cliente al servidor.
 * @param { Object } res, Datos enviados desde el servidor al cliente.
 */
const recortarIconos = async (req, res) => {
    console.log(req)
    /**
     *  1. COMPROBAR QUE HE RECIBIDO INFORMACION.
     *  2. COMPROBAR SI LOS ICONOS QUE NOS HAN PASADO YA LOS TENGO RECORTADOS
     *  3. JUNTAR LOS DOS ICONOS DE UN DISPOSITIVO EN UNA IMAGEN EN HORIZONTAL.
     *  4. JUNTAR TODOS LAS IMAGENES DE LOS DISPOSITIVOS EN VERTICAL
     */
    const iconosInput = req.body.input || '';

    // COMPRUEBO QUE LA PETICION POST QUE RECIBO NO CONTIENE DATOS, PORQ
    if(iconosInput !== ''){
        // RUTA DONDE TENGO GUARDADOS LOS ICONOS RECORTADOS.
        const pathIconosRecortados = path.join(__dirname, '../datos/img/recortes/');
        // RUTA DONDE ESTAS TODAS LAS LISTAS DE ICONOS.
        const pathListas = path.join(__dirname, '../public/img/listas/');
        // RUTA DONDE SE VAN A GUARDAR LAS IMAGENES FUSIONADAS DE CADA DISPOSITIVO.
        const pathFusiones = path.join(__dirname, '../datos/img/fusiones/');
        // RUTA DONDE SE VAN A GUARDAR LA IMAGEN QUE ES LA FUSION DE TODOS LOS DISPOSITIVOS.
        const pathFusionMaster = path.join(__dirname, '../public/img/fusion/fusionMaster.png');

        // const prueba = path.join(__dirname, '../public/img/fusionMaster.png');
        
        // TENGO QUE RECORTAR LOS ICONOS
        for(let i=0; i<iconosInput.length; i++){
            // DATOS DEL ICONO
            const icono = iconosInput[i].split('-');
            const dispositivo = icono[0];
            const posicionIcono = icono[2];
            const nombreListaIcono = icono[1];

            // NOMBRE QUE VA A TENER EL ICONO AL SER RECORTADO
            const nombreRecorte = nombreListaIcono +'-'+ posicionIcono + '.png';

            // LISTO TODOS LOS ICONOS QUE YA TENGO RECORTADOS
            const recortes = fs.readdirSync(pathIconosRecortados);

            // COMPRUEBO SI EL ICONO QUE TENGO AHORA MISMO YA LO TENGO RECORTADO O SI ES UN ICONO
            // CUSTOM QUE EN ESE CASO, YA TENGO LOS ICONOS GUARDADOS.
            if(!recortes.includes(nombreRecorte) && nombreListaIcono !== 'custom'){
                let iconoRecortado;
                let numeroIconosLista;

                // COMPRUEBO SI LA LISTA DE ICONOS ES LA DEFAULT, PORQUE EN CASO DE SER ASI TIENE UNA
                // RUTA DIFERENTE AL RESTO DE LISTAS.
                if(nombreListaIcono === 'default'){
                    const pathListaDefault = path.join(__dirname, '../public/img/default.png');

                    // OBTENGO LA LISTA A LA QUE PERTENECE EL ICONO
                    iconoRecortado = await Jimp.read(pathListaDefault);
                    // OBTENGO EL NUMERO DE ICONOS QUE TIENE LA LISTA
                    numeroIconosLista = (sizeOf(pathListaDefault).height/100);
                }else{
                    iconoRecortado = await Jimp.read(pathListas + nombreListaIcono +'.png');
                    numeroIconosLista = (sizeOf(pathListas + nombreListaIcono +'.png').height/100);
                    // console.log('iconos: '+ numeroIconosLista)
                }
                
                // RECORTO EL ICONO Y LO GUARDO EN '../datos/img/recortes/
                if(posicionIcono < numeroIconosLista){
                    iconoRecortado.crop(0, (posicionIcono*100), 100, 100);
                }else {
                    iconoRecortado.crop(100, ((posicionIcono-100)*100), 100, 100);
                }

                iconoRecortado.write(pathIconosRecortados + nombreRecorte);
            }
        }

        // AHORA TENGO QUE FUSIONAR LAS IMAGENES EN HORIZONTAL
        for(let i=0; i<iconosInput.length; i+=2){
            // DATOS DEL ICONO EN ESTADO ON
            // numeroDispositivo - nombreLista - posicionIcono
            const iconoON = iconosInput[i].split('-');
            const dispositivoON = iconoON[0];
            const nombreListaON = iconoON[1];
            const nombreRecorteON = iconoON[1] +'-'+ iconoON[2] +'.png';

            // DATOS DEL ICONO EN ESTADO OFF
            const iconoOFF = iconosInput[(i+1)].split('-');
            const dispositivoOFF = iconoOFF[0];
            const nombreListaOFF = iconoOFF[1];
            const nombreRecorteOFF = iconoOFF[1] +'-'+ iconoOFF[2] +'.png';

            // TENGO QUE COMPROBAR QUE PERTENECEN AL MISMO DISPOSITIVO
            if(dispositivoON === dispositivoOFF){
                // RUTA Y NOMBRE QUE TENDRA LA IMAGEN FUSIONADA DE UN DISPOSITIVO
                // ../datos/img/fusiones/dispositivo-0.png
                const pathNombreFusion = pathFusiones + 'dispositivo-'+ dispositivoON +'.png';
                const pathUpload = path.join(__dirname, '../datos/img/upload/');

                const imgSubidas = fs.readdirSync(pathUpload);

                let imgON, imgOFF;

                // TENGO QUE COMPROBAR SI ALGUNO DE LOS DOS ICONOS ES CUSTOM, EN ESE CASO
                // LE PASO LA RUTA Y EL NOMBRE QUE TIENE EL ICONO.
                if(nombreListaON === 'custom'){
                    // LA POSICION DEL ICONO EN LISTA ES LA MISMA QUE CUANDO YO LEO EL 
                    // DIRECTORIO DE LOS CUSTOM.
                    imgON = pathUpload + imgSubidas[parseInt(iconoON[2])];
                }else{
                    imgON = pathIconosRecortados + nombreRecorteON;
                }

                if(nombreListaOFF === 'custom'){
                    imgOFF = pathUpload + imgSubidas[parseInt(iconoOFF[2])];
                }else{
                    imgOFF = pathIconosRecortados + nombreRecorteOFF;
                }

                // FUSIONO LAS DOS LOS DOS ICONOS EN HORIZONTAL
                mergeImg([imgON, imgOFF], { direction: false})
                .then((img) => {
                    img.write(pathNombreFusion, (err) => {
                        if(err) console.error(err);

                        console.log('FUSIONADOS')
                    });
                });     
            }
        }

        
        setTimeout(() => {
            const listaFusiones = fs.readdirSync(pathFusiones, (err, files) => {
                if(err) console.error(err);
                console.log('Se han leido correctamente las fusiones');
            });

            /**
             * VOY A ORDENAR LAS FUSIONES, PORQUE SI NO LAS ORDENO Y TENGO POR EJEMPLO 3 DISPOSITIVOS (1, 2, 11).
             * LA FUSION EN VERTICAL DE ESTOS 3 DISPOSITIVOS SERIA 1, 11, 2. Y NOSOTROS QUEREMOS QUE NOS LOS 
             * ORDENE BIEN, ES DECIR: 1, 2, 11     1, 11, 2 ===> 1, 2, 11
             */

            // ARRAY DONDE VOY A GUARDAR LOS 'numeroDispositivo', PARA DESPUES ORDENARLOS
            const ordenandoFusiones = [];
            for(let i=0; i<listaFusiones.length; i++){
                // OBTENGO EL NUMERO DE DISPOSITIVO QUE TENGO 'dispositivo - numeroDispositivo .png'.
                // HACIENDO UNOS CUANTOS SPLITS
                let recorte = parseInt(listaFusiones[i].split('-')[1].split('.')[0]);

                ordenandoFusiones.push(recorte);
            }

            // ORDENO LA LISTA QUE CONTIENE LOS 'numeroDispositivo', ES DECIR, 'ordenandoFusiones'.
            ordenandoFusiones.sort((a, b) => a - b );

            // ARRAY QUE VA A CONTENER EL NOMBRE Y LA EXTENSION DE LAS IMAGENES DE LOS DISPOSITIVOS 
            // FUSIONADOS, PERO ESTA VEZ ORDENADOS EJ: (1, 11, 2 ====> 1, 2, 11). 
            const fusiones = [];
            for(let i=0; i<ordenandoFusiones.length; i++){
                let nuevaFusion = 'dispositivo-'+ ordenandoFusiones[i] +'.png';

                fusiones.push(nuevaFusion);
            }

            /**
             * EXISTEN DOS CASOS A LA HORA DE FUSIONAR LAS IMAGENES DE CADA DISPOSITIVO.
             *     - CASO 1: QUE SOLO TENGAMOS UN DISPOSITIVO, EN ESE CASO NO SE PRODUCIRA LA FUSION
             *               SI NO QUE SE COPIARA LA IMAGEN A LA RUTA DONDE VA A ESTAR LAS FUSION
             *               DE FUSIONES 'pathFusionDispositivo'.
             *     - CASO 2: CUANDO TENEMOS MAS DE UN DISPOSITIVO, ES EL CASO POR DEFECTO EN EL QUE
             *               JUNTAMOS DOS O MAS IMAGENES EN VERTICAL.
             */
            if(fusiones.length === 1){
                // RUTA Y NOMBRE DE LA IMAGEN FUSIONADA DE LOS DOS ESTADOS DEL UNICO DISPOSITIVO
                // AL CUAL SE LE HA CAMBIADO EL ICONO DE ALGUNO DE SUS DOS ESTADOS.
                const pathYnombreFusionAct = pathFusiones + fusiones[0];

                // COPIO LA IMAGEN FUSIONADA DEL UNICO DISPOSITVO AL CUAL SE LE HA CAMBIADO EL 
                // ICONO. Y LE PONGO EL MISMO NOMBRE QUE VA TIENE LA IMAGEN QUE ES LA FUSION
                // DE MUCHOS DISPOSITIVOS.
                fs.copyFile(pathYnombreFusionAct, pathFusionMaster, (err) => {
                    if (err) console.error(err);
                    console.log('EL COPIADO SE HA REALIZADO CORRECTAMENTE');
                });
                
            }else if(fusiones.length > 1){
                // ARRAY QUE VA A CONTENER LA RUTA Y EL NOMBRE DE LAS FUSIONES DE CADA DISPOSITIVO.
                const fusionesPath = [];

                fusiones.forEach(fus => {
                    fusionesPath.push(pathFusiones + fus);
                });

                // console.log('FusionesPath: ')
                // console.log(fusionesPath);

                // FUSIONO LAS IMAGENES DE TODOS LOS DISPOSITIVOS EN VERTICAL.
                mergeImg(fusionesPath, { direction: true})
                .then((img) => {
                    img.write(pathFusionMaster, (err) => {
                        if(err) throw err;
                    });
                });
            }
        }, 200);

        // AHORA TENGO QUE MODIFICAR EL 'Instal.dat' DE CADA UNO DE LOS DISPOSITIVOS.
        const pathInstal = path.join(__dirname, '../datos/Instal.dat');
        const datosInstal = fs.readFileSync(pathInstal).toString().split(/\n/);
        
        const dispositivosEditados = fs.readdirSync(pathFusiones);
        console.log(dispositivosEditados)

        // setTimeout(() => {
        //     for(let i=0; i<dispositivosEditados.length; i++){
        //         // DATOS DEL ICONO
        //         const dispositivo = parseInt(dispositivosEditados[i].split('-')[1].split('.')[0]);
        //         console.log('dispositivo: '+ dispositivo)
        
        //         const iconoInstal = (dispositivo + 1)*8 - 1; 

        //         datosInstal[iconoInstal] = 1000+i;
        
        //         // fs.appendFileSync(pathInstal, 'data to append');
        //     }

        //     // fs.appendFileSync('message.txt', 'data to append');

        //     // console.log(datosInstal);

        //     // fs.writeFileSync(pathInstal, datosInstal.toString())
        // }, 20);
    } else {
        console.log('La peticion POST no contiene datos');
    }
    
    res.render('index');
}


/********    RUTA /    ********/
router.get('/', (req, res) => {
    console.log('Estoy en la ruta: ', req.path);

    exec('node \serverScripts/obtenerListasSubidas.js', (err, stdout) => {
        if(err) throw err;

        exec('node \serverScripts/obtenerIconosCustom.js', (err1, stdout1) => {
            if(err1) throw err1;
        
            console.log('EJECUTADO ==> IconosCustom')
        });

        console.log('EJECUTADO ==> ListasSubidas')   
    });

    exec('node \serverScripts/obtenerDatosInstal.js', (err, stdout) => {
        if(err) throw err;

        console.log('EJECUTADO ==> DatosInstal')
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