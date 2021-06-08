const controller = {  }
const path = require('path');
const fs = require('fs');
const Jimp = require('jimp');
const sizeOf = require('image-size');
const mergeImg = require('merge-img');
const exec = require('child_process').exec;

// RUTAS NECESARIAS PARA EL POST
const pathInstal = path.join(__dirname, '../datos/Instal.dat');

const pathIconosRecortados = path.join(__dirname, '../datos/img/recortes/');
const pathFusiones = path.join(__dirname, '../datos/img/fusiones/');
const pathRecortesFusionMaster = path.join(__dirname, '../datos/img/recortesFusionMaster/');
const pathUpload = path.join(__dirname, '../datos/img/upload/');

const pathListas = path.join(__dirname, '../public/img/listas/');
const pathListaDefault = path.join(__dirname, '../public/img/default.png');
const pathFusionMaster = path.join(__dirname, '../public/img/fusion/fusionMaster.png');

controller.get = (req, res) => {
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
}

controller.post = (req, res) => {
    const iconosInput = req.body.input || '';

    console.log(iconosInput);

    // COMPRUEBO SI LA PETICION POST QUE RECIBO CONTIENE DATOS.
    if(iconosInput !== ''){
        recortarIconos(iconosInput);

        recortarIconosFusionMaster();

        setTimeout(() => {
            fusionHorizontal(iconosInput);
        }, 500);

        setTimeout(() => {
            fusionVertical();
        }, 1000);

        setTimeout(() => {
            actualizarInstal();
        }, 1500);

        setTimeout(() => {
            escribirJSON();
        }, 2000)

    }else {
        console.log('LA PETICION POST NO TIENE DATOS')
    }

    setTimeout(() => {
        res.redirect('/');
    }, 5500);
}

/**
 * FUNCIÓN QUE ME RECORTA LOS ICONOS QUE SE HAN CAMBIADO EN EL CLIENTE. ESTOS SE 
 * RECORTAN SIEMPRE Y CUANDO EL ICONO NO PERTENEZCA A LA LISTA DE LOS 'custom',
 * YA QUE ESTOS ICONOS LOS TENGO TODOS GUARDADOS EN '../datos/img/upload/' Y 
 * TAMPOCO SE RECORTAN LOS ICONOS LOS CUALES YA HE RECORTADO '../datos/img/recortes/'.
 * 
 * @param { ARRAY } iconosInput , Lista que contiene los datos del dispositivo al
 *                                cual se le han cambiando alguno de sus iconos
 *                                ( dispositivo - nombreLista - posicionEnLaLista )
 */
function recortarIconos(iconosInput){
    for(let i=0; i<iconosInput.length; i++){
        // OBTENGO LOS DATOS DE CADA ICONO.
        const icono = iconosInput[i].split('-');
        const dispositivo = icono[0];
        const nombreListaIcono = icono[1];
        const posicionIcono = icono[2];

        const nombreRecorte = nombreListaIcono +'-'+ posicionIcono +'.png';

        // TENGO QUE COMPROBAR SI EL RECORTE YA LO TENGO TENGO
        if(nombreListaIcono !== 'custom' && nombreListaIcono !== 'fusionMaster'){
            if(!comprobarRecorte(nombreRecorte)){

                let rutaLista;
                let rutaGuardadoRecorte = pathIconosRecortados + nombreRecorte;
    
                if(nombreListaIcono === 'default'){
                    rutaLista = pathListaDefault;
                    // rutaGuardadoRecorte = ;
                }else{
                    rutaLista = pathListas +  nombreListaIcono +'.png'
                }
    
                Jimp.read(rutaLista)
                .then(image => {
                    const numeroIconoLista = sizeOf(rutaLista).height/100;
    
                    let x, y;
    
                    if(posicionIcono < numeroIconoLista){
                        x = 0;
                        y = posicionIcono * 100;
                    }else{
                        x = 100;
                        y = (posicionIcono - 100) * 100;
                    }
    
                    image
                        .crop(x, y, 100, 100)
                        .write(rutaGuardadoRecorte)
                })
                
            }else{
                console.log('EL ICONO YA ESTABA RECORTADO');
            }
        }
    }
}

/**
 * FUNCION QUE ME COMPRUEBA SI TENGO YA UN ICONO EN CONCRETO RECORTADO
 * 
 * @param { String } nombreRecorte, Nombre que tiene el icono que quiero comprobar
 */
function comprobarRecorte(nombreRecorte){
    fs.readdir(pathIconosRecortados, (err, result) => {
        if(err) console.error(err);

        const recortes = result;

        if(recortes.includes(nombreRecorte)){
            return true;
        }else {
            return false;
        }
    });
}

/**
 * 
 * @param {*} iconosInput 
 */
function fusionHorizontal(iconosInput){
    // OBTENGO LOS DATOS DE LOS DOS ICONOS LOS CUALES VOY A FUSIONAR
    for(let i=0; i<iconosInput.length; i+=2){
        // DATOS EL ICONO ON
        const iconoON = iconosInput[i].split('-');
        const dispositivoON = iconoON[0];
        const nombreListaON = iconoON[1];
        const posicionIconoON = iconoON[2];
        const nombreRecorteON = nombreListaON +'-'+ posicionIconoON +'.png';

        // DATOS EL ICONO OFF
        const iconoOFF = iconosInput[(i+1)].split('-');
        const dispositivoOFF = iconoOFF[0];
        const nombreListaOFF = iconoOFF[1];
        const posicionIconoOFF = iconoOFF[2];
        const nombreRecorteOFF = nombreListaOFF +'-'+ posicionIconoOFF +'.png';

        // COMPRUEBO SI LOS DOS ICONOS PERTENECEN AL MISMO DISPOSITIVO
        if(dispositivoON ===  dispositivoOFF){
            // RUTA Y NOMBRE FUSION
            const pathYnombreFusion = pathFusiones +'dispositivo-'+ dispositivoON +'.png';

            let imgON, imgOFF;

            let listaUpload;
            if(nombreListaON === 'custom' || nombreListaOFF === 'custom'){
                listaUpload = fs.readdirSync(pathUpload);
            }

            // TENGO QUE OBTENER LA RUTA DONDE SE ENCUENTRA CADA ICONO
            if(nombreListaON === 'custom'){
                const nombreIconoUpload = listaUpload[posicionIconoON];
                imgON = pathUpload + nombreIconoUpload;
            }else if(nombreListaON === 'fusionMaster'){
                const nombreRecorteFusionMaster = 'fusionMaster-ON-'+ posicionIconoON +'.png';
                imgON = pathRecortesFusionMaster + nombreRecorteFusionMaster;
            }else {
                imgON = pathIconosRecortados + nombreRecorteON;
            }

            if(nombreListaOFF === 'custom'){
                const nombreIconoUpload = listaUpload[posicionIconoOFF];
                imgOFF = pathUpload + nombreIconoUpload;
            }else if(nombreListaOFF === 'fusionMaster'){
                const nombreRecorteFusionMaster = 'fusionMaster-OFF-'+ posicionIconoOFF +'.png';
                imgOFF = pathRecortesFusionMaster + nombreRecorteFusionMaster;
            }else {
                imgOFF = pathIconosRecortados + nombreRecorteOFF;
            }

            // console.log('IMAGEN ON: '+ imgON);
            // console.log('IMAGEN OFF: '+ imgOFF);

            mergeImg([imgON, imgOFF], { direction: false })
            .then(img => {
                img.write(pathYnombreFusion)
            })
            .catch(err => { console.error(err); })
        }
    }
}

/**
 * FUNCION QUE ME FUSIONA VERTICALMENTE TODOS LAS IMAGENES FUSIONADAS QUE HAY EN EL DIRECTORIO
 * '../datos/img/fusiones/', ESTA FUSION SE GUARDA EN '../public/img/fusion/fusionMaster.png'
 * CUANDO EN EL DIRECTORIO SOLAMENTE TENEMOS UNA IMAGEN FUSIONADA, ESTA SE COPIA AL DIRECTORIO
 * DONDE SE GUARDA LA FUSION VERTICAL.
 */
function fusionVertical(){
    const listaFusiones = fs.readdirSync(pathFusiones);

    if(listaFusiones.length === 1){
        const pathYnombreFusionAct = pathFusiones + listaFusiones[0]

        fs.copyFile(pathYnombreFusionAct, pathFusionMaster, (err) => {
            if (err) console.error(err);

            // console.log('COPIADO CORRECTO');
        });
    }else {
        const rutaYnombreFusion = [];

        for(let i=0; i<listaFusiones.length; i++){
            rutaYnombreFusion.push(pathFusiones + listaFusiones[i]);
        }

        setTimeout(() => {
            mergeImg(rutaYnombreFusion, { direction: true })
            .then(img => {
                img.write(pathFusionMaster)
            })
        }, 50);
        
    }
}

function actualizarInstal(){
    const datosInstal = fs.readFileSync(pathInstal).toString().split(/\n/);
    const listaFusiones = fs.readdirSync(pathFusiones);

    const nuevasLineas = [];

    // listaFusiones.forEach(fusion => {
    for(let i=0; i<listaFusiones.length; i++){

        const dispositivoEditado = parseInt(listaFusiones[i].split('-')[1].split('-'[0]));
        const lineaDispositivoIcono = (dispositivoEditado + 1) * 8 - 1;

        nuevasLineas.push(lineaDispositivoIcono);
    }
       
    let nuevosDatosInstal = '';
    let contadorDispositivosEditados = 0;

    for(let i=0; i<datosInstal.length; i++){
        if(nuevasLineas.includes(i)){
            nuevosDatosInstal += (1000 + contadorDispositivosEditados).toString() +'\n';

            contadorDispositivosEditados++;
        }else if((datosInstal.length - 1) === i){
            nuevosDatosInstal += datosInstal[i];
        }else {
            nuevosDatosInstal += datosInstal[i] +'\n';
        }
    }

    const buffer = Buffer.from(nuevosDatosInstal, 'utf-8', (err) => {
        if(err) console.error(err);
    });

    fs.writeFileSync(pathInstal, buffer);
}

function escribirJSON(){
    const pathJSON = path.join(__dirname, '../public/datos/fusionado.json');
    const numeroFusiones = fs.readdirSync(pathFusiones).length;

    const obj = {
        numero: numeroFusiones
    }

    let json_obj = JSON.stringify(obj);
    fs.writeFileSync(pathJSON, json_obj);
}

function recortarIconosFusionMaster(){
    const listaFusiones = fs.readdirSync(pathFusiones);

    for(let i=0; i<listaFusiones.length; i++){
        const rutaYnombreFusion = pathFusiones + listaFusiones[i];

        Jimp.read(rutaYnombreFusion)
        .then(iconoON => {
            const nombreRecorteON = 'fusionMaster-ON-'+ i +'.png';
            const rutaYnombreRecorteON = pathRecortesFusionMaster + nombreRecorteON;

            iconoON
                .crop(0, 0, 100, 100)
                .write(rutaYnombreRecorteON)
        }).catch(err => { console.error(err); })
        
        Jimp.read(rutaYnombreFusion)
        .then(iconoOFF => {
            const nombreRecorteOFF = 'fusionMaster-OFF-'+ i +'.png';
            const rutaYnombreRecorteOFF = pathRecortesFusionMaster + nombreRecorteOFF;

            iconoOFF
                .crop(100, 0, 100, 100)
                .write(rutaYnombreRecorteOFF)
        }).catch(err => { console.error(err); })
    }
}


 function recortarIconosFusionMaster2() {
    fs.readdir(pathFusiones, async (err, data) => {
        if(err){
            console.error(err);
        }else {
            const listaFusiones = data;

            for(let i=0; i<listaFusiones.length; i++){
                // OBTENGO LA IMAGEN UNA PARA CADA ICONO
                const iconoRecortadoON = await Jimp.read(listaFusiones[i]);
                const iconoRecortadoOFF = await Jimp.read(listaFusiones[i]);
                
                // NOMBRE QUE VAN A TENER LOS RECORTES
                const nombreRecorteON = 'fusionMaster-ON-'+ i +'.png';
                const nombreRecorteOFF = 'fusionMaster-OFF-'+ i +'.png';

                iconoRecortadoON.crop(0, 0, 100, 100);
                iconoRecortadoOFF.crop(100, 0, 100, 100);

                iconoRecortadoON.write(pathRecortesFusionMaster + nombreRecorteON, (err) => {
                    if(err){
                        console.error(err);
                    }
                });

                iconoRecortadoOFF.write(pathRecortesFusionMaster + nombreRecorteOFF, (err) => {
                    if(err){
                        console.error(err);
                    }
                });
            }
        }
    });
}


module.exports = controller;