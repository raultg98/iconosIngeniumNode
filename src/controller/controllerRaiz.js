const controller = {  }
const path = require('path');
const fs = require('fs');
const Jimp = require('jimp');
const sizeOf = require('image-size');
const mergeImg = require('merge-img');
const script = require('../serverScripts/serverScripts');

/**********     RUTAS NECESARIAS PARA EL POST     **********/
const pathInstal = path.join(__dirname, '../datos/Instal.dat');

const pathIconosRecortados = path.join(__dirname, '../datos/img/recortes/');
const pathFusiones = path.join(__dirname, '../datos/img/fusiones/');
const pathRecortesFusionMaster = path.join(__dirname, '../datos/img/iconosImportados/');
const pathUpload = path.join(__dirname, '../datos/img/upload/');

const pathListas = path.join(__dirname, '../public/img/listas/');
const pathListaDefault = path.join(__dirname, '../public/img/default.png');
const pathFusionMaster = path.join(__dirname, '../public/img/fusion/iconos_importados.png');

/**********     FUNCIONES     **********/
controller.get = (req, res) => {
    console.log('Estoy en la ruta: ', req.path);

    script.obtenerDatosInstal();
    script.obtenerIconosCustom();
    script.obtenerListasSubidas();

    res.render('index');
}

controller.post = (req, res) => {
    const iconosInput = req.body.input || '';

    console.log('ICONO INPUT: ');
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
        }, 1500);

        setTimeout(() => {
            actualizarInstal();
        }, 2000);

        setTimeout(() => {
            escribirJSON();
        }, 2500)

        setTimeout(() => {
            res.redirect('/');
        }, 6500);
    }else {
        console.log('LA PETICION POST NO TIENE DATOS');
        
        res.redirect('/');
    }
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
        if(nombreListaIcono !== 'custom' && nombreListaIcono !== 'iconos_importados'){
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
 * FUNCION QUE ME FUSIONA LOS DOS ICONOS QUE VA A TENER MI DISPOSITIVO. ESTA FUSION
 * SE REALIZA EN HORIZONTAL
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

            // RUTA Y NOMBRE DONDE ESTA EL ICONO QUE SE DESEA FUSIONAR.
            let imgON, imgOFF;

            let listaUpload;
            if(nombreListaON === 'custom' || nombreListaOFF === 'custom'){
                listaUpload = fs.readdirSync(pathUpload);
            }

            // TENGO QUE OBTENER LA RUTA DONDE SE ENCUENTRA LOS DOS ICONOS DE CADA DISPOSITIVO.
            if(nombreListaON === 'custom'){
                const nombreIconoUpload = listaUpload[posicionIconoON];
                imgON = pathUpload + nombreIconoUpload;
            }else if(nombreListaON === 'iconos_importados'){
                const nombreRecorteFusionMaster = 'iconos_importados-ON-'+ posicionIconoON +'.png';
                imgON = pathRecortesFusionMaster + nombreRecorteFusionMaster;
            }else {
                imgON = pathIconosRecortados + nombreRecorteON;
            }

            if(nombreListaOFF === 'custom'){
                const nombreIconoUpload = listaUpload[posicionIconoOFF];
                imgOFF = pathUpload + nombreIconoUpload;
            }else if(nombreListaOFF === 'iconos_importados'){
                const nombreRecorteFusionMaster = 'iconos_importados-OFF-'+ posicionIconoOFF +'.png';
                imgOFF = pathRecortesFusionMaster + nombreRecorteFusionMaster;
            }else {
                imgOFF = pathIconosRecortados + nombreRecorteOFF;
            }

            // REALIZO LA FUSION
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
    const listaFusionesSinOrdenar = fs.readdirSync(pathFusiones);
    const listaFusionesOrdenadas = [];

    const aux = [];
    for(let i=0; i<listaFusionesSinOrdenar.length; i++){
        // OBTENGO LA POSICION QUE OCUPA EL DISPOSITIVO EN EL 'Instal.dat'
        // ( dispositivo - numeroDispositivo .png)
        const numeroDispositivo = listaFusionesSinOrdenar[i].split('-')[1].split('.')[0];

        aux.push(numeroDispositivo);
    }

    aux.sort((a, b) => a - b );

    for(let i=0; i<aux.length; i++){
        const nombreFusion = 'dispositivo-'+ aux[i] +'.png';
        
        listaFusionesOrdenadas.push(nombreFusion);
    }

    // SI SOLAMENTE HE REALIZO UNA FUSION EN HORIZONTAL NO HACE FALTA QUE HAGA LA FUSION EN 
    // VERTICAL YA QUE PARA HACERLA NECESITO MINIMO DOS FUSIONES HORIZONTALES.
    if(listaFusionesOrdenadas.length === 1){
        const pathYnombreFusionAct = pathFusiones + listaFusionesOrdenadas[0]

        fs.copyFile(pathYnombreFusionAct, pathFusionMaster, (err) => {
            if (err) console.error(err);
        });
    }else {
        // ARRAY QUE COTIENE EL NOMBRE Y LA RUTA DE CADA FUSION EN VERTICAL.
        const rutaYnombreFusion = [];

        for(let i=0; i<listaFusionesOrdenadas.length; i++){
            // HAGO UN PUSH DE LA RUTA Y EL NOMBRE DE CADA UNA DE LAS FUSIONES
            rutaYnombreFusion.push(pathFusiones + listaFusionesOrdenadas[i]);
        }

        // REALIZO LA FUSION EN VERTICAL
        setTimeout(() => {
            mergeImg(rutaYnombreFusion, { direction: true })
            .then(img => {
                img.write(pathFusionMaster)
            })
        }, 200);
        
    }
}


/**
 * FUNCION QUE ME ACTULIZA LOS DATOS DEL 'Instal.dat'. EN CONCRETO SOLAMENTE ME ACTULIZA
 * LA LINEA DE CODIGO DE CADA DISPOSITIVO EDITADO RELACIONADO CON EL ICONO DEL MISMO.
 */
function actualizarInstal(){
    // OBTENGO TODOS LOS DATOS DEL 'Instal.dat'
    const datosInstal = fs.readFileSync(pathInstal).toString().split(/\n/);

    // OBTENGO TODAS LAS FUSIONES EN HORIZONTAL QUE SE HAN REALIZADO
    const listaFusiones = fs.readdirSync(pathFusiones);

    // ARRAY QUE VA A CONTENER TODAS LAS LINEAS DEL 'Instal.dat' QUE TENGO QUE MODIFICAR.
    const nuevasLineas = [];

    // TENGO QUE COMPROBAR DE QUE TIPO ES EL 'Instal.dat'
    if(datosInstal[0].split(':')[0] === 'KNX'){
        console.log('EL INSTAL ES DE KNX');
        for(let i=0; i<listaFusiones.length; i++){

            const numeroComponente = listaFusiones[i].split('-')[1].split('.')[0];

            // OBTENGO LA LINEA QUE TENGO QUE EDITAR EN EL 'Instal.dat' PARA UN COMPONENTE EN CONCRETO.
            lineaIconoComponente(numeroComponente, datosInstal, (linea) => {
                nuevasLineas.push(linea);
            });
        }
        
    }else {
        console.log('EL INSTAL ES DE BUSing')
        for(let i=0; i<listaFusiones.length; i++){
            // DISPOSITIVO AL CUAL LE QUIERO EDITAR UNA LINEA.
            const dispositivoEditado = parseInt(listaFusiones[i].split('-')[1].split('-'[0]));
            // LINEA DEL ICONO DE UN DISPOSITIVO EN CONCRETO.
            const lineaDispositivoIcono = (dispositivoEditado + 1) * 8 - 1;
    
            nuevasLineas.push(lineaDispositivoIcono);
        }
    }

    console.log('NUEVAS LINEAS: ');
    console.log(nuevasLineas);
    
    // STRING QUE VA CONTENER LOS DATOS EDITADOS DEL 'Instal.dat'.
    let nuevosDatosInstal = '';
    // CONTADOR PARA SABER A CUANTOS DISPOSITIVOS MODIFICADOS LES HE CAMBIADO YA LA LINEA 
    // DEL ICONO.
    let contadorDispositivosEditados = 0;

    // RECORRO LINEA POR LINEA LOS DATOS DEL 'Instal.dat'.
    for(let i=0; i<datosInstal.length; i++){
        // COMPRUEBO SI LA LINEA EN LA QUE ESTOY ES UNA DE LAS LINEAS QUE QUIERO EDITAR
        if(nuevasLineas.includes(i)){
            // EL ICONO DE CADA DISPOSITIVO EDITADO VA A SER 
            // (1000 +  LOS DISPOSITIVOS QUE YA HE EDITADO)
            if((datosInstal.length - 1) === i){
                nuevosDatosInstal += (1000 + contadorDispositivosEditados).toString();
            }else{
                nuevosDatosInstal += (1000 + contadorDispositivosEditados).toString() +'\n';
            }
              
            contadorDispositivosEditados++;
        }
        // CUANDO ESTOY EN LA ULTIMA LINEA DEL 'Instal.dat' NO QUIERO METER UN SALTO DE LINEA
        else if((datosInstal.length - 1) === i){
            nuevosDatosInstal += datosInstal[i];
        }else {
            nuevosDatosInstal += datosInstal[i] +'\n';
        }
    }

    // TENGO QUE CONVERTIR EL STRING QUE CONTIENE LOS NUEVOS DATOS DEL INSTAL EN UN BUFFER
    // PARA ASI PODER ESCRIBIR LOS DATOS EN EL ARCHIVO 'Instal.dat'.
    const buffer = Buffer.from(nuevosDatosInstal, 'utf-8', (err) => {
        if(err) console.error(err);
    });

    fs.writeFileSync(pathInstal, buffer);
}

/**
 * ME PASAN LA POSICION DE UN COMPONENTE EN EL ARRAY DE COMPONENTES NO REPETIDO. Y TENGO
 * QUE OBTENER LA LINEA EN LA CUAL TIENE EL ICONO ESE DISPOSITIVO. PARA ELLO:
 * 
 *      - TENGO QUE TENER TODOS LOS DATOS DEL INSTAL.DAT
 *      - TENGO QUE TENER UNA LISTA CON TODOS LOS COMPONENTES NO REPETIDOS.
 *      - TENGO QUE SABER CUANTOS COMPONENTES REPETIDOS TENGO ANTES DEL COMPONENTE AL QUE LE DESEO 
 *        CAMBIAR LA LINEA:
 *          * UN CONTADOR CON TODOS LOS COMPONENTES QUE TENGO HASTA QUE LOS DATOS COINCIDAN.
 * 
 * 
 */
 function lineaIconoComponente(posicion, datosInstal, callback){
    // LISTA QUE CONTIENE TODOS LOS COMPONENTES DEL 'Instal.dat' ESTEN REPETIDOS O NO.
    const componentesNoRepetidos = [];
    // LISTA QUE SOLO CONTIENE LOS COMPONENTES, NINGUN COMPONENTE ESTA REPETIDO EN ESTA LISTA.
    const componentesRepetidos = [];

    // AÑADO LOS COMPONENTES A LA LISTA DE 'componentesRepetidos'.
    for(let i=1; i<datosInstal.length; i+=8){
        const componente = {
            posicion1: datosInstal[i], 
            nombre: datosInstal[i+1], 
            posicion3: datosInstal[i+2], 
            posicion4: datosInstal[i+3], 
            icono: datosInstal[i+7]
        }

        componentesRepetidos.push(componente);
    }

    // AÑADO LOS COMPONENTES A LA LISTA DE 'componenteNoRepetidos'.
    for(let i=1; i<datosInstal.length; i+=8){
        const componente = {
            posicion1: datosInstal[i], 
            nombre: datosInstal[i+1], 
            posicion3: datosInstal[i+2], 
            posicion4: datosInstal[i+3], 
            icono: datosInstal[i+7]
        }

        if(i === 1){
            componentesNoRepetidos.push(componente);
        }else {
            if(!isComponenteInArray(componentesNoRepetidos, componente)){
                componentesNoRepetidos.push(componente);
            }
        }
    }

    // COMPONENTE AL CUAL LE QUIERO EDITAR LA LINEA.
    const componenteEditado = componentesNoRepetidos[parseInt(posicion)];
    
    // RECORRO LA LISTA DE TODOS LOS COMPONENTES Y CUANDO ENCUENTRE UNO QUE SEA IGUAL QUE EL 
    // QUE ESTOY COMPARANDO, CALCULO LA LINEA EN FUNCION A LA POSICION QUE ESTA OCUPANDO EL
    // COMPONENTE EN LA LISTA.
    for(let i=0; i<componentesRepetidos.length; i++){
        // COMPRUEBO QUE COINCIDEN ESTOS CAMPOS.
        if(componenteEditado.posicion1 === componentesRepetidos[i].posicion1 && 
           componenteEditado.nombre === componentesRepetidos[i].nombre &&
           componenteEditado.posicion3 === componentesRepetidos[i].posicion3 &&
           componenteEditado.posicion4 === componentesRepetidos[i].posicion4){
                
                let posicionComponenteListaRepetidos = i;
                // CALCULO LA LINEA EN LA QUE ESTA EL ICONO DEL DISPOSITIVO.
                // ( posicionEnLaLista * numeroDeLineasQueTieneUnComponente + laLineaEnLaQueEstaElIcono ).
                let lineaConcreta = posicionComponenteListaRepetidos * 8 + 8;

                return callback(lineaConcreta)
        }
    }
}
    

function isComponenteInArray(lista, componente){
    let contador = 0;
    let igual = false;

    while(contador < lista.length && igual === false){
        const listaObj = lista[contador];

        if(listaObj.posicion1 === componente.posicion1 && listaObj.nombre === componente.nombre &&
           listaObj.posicion3 === componente.posicion3 && listaObj.posicion4 === componente.posicion4){
                igual = true;
        }else{
            igual = false;
        }

        contador++;
    }

    return igual;
}


/**
 * FUNCION QUE ME CREA UN JSON QUE OBTENGO DESDE EL CLIENTE CON EL NUMERO DE DISPOSITIVOS LOS
 * CUALES EL CLIENTE HA MODIFICADO.
 */
function escribirJSON(){
    const pathJSON = path.join(__dirname, '../public/datos/fusionado.json');
    const numeroFusiones = fs.readdirSync(pathFusiones).length;

    const obj = {
        numero: numeroFusiones
    }

    let json_obj = JSON.stringify(obj);
    fs.writeFileSync(pathJSON, json_obj);
}

/**
 * FUNCION CON LA CUAL RECORTO LOS ICONOS CON DE LA LISTA 'fusionMaster'. TENGO QUE HACER
 * DOS RECORTES UNO PARA EL ICONO CUANDO EL DISPOSITIVO ESTA EN 'ON' Y OTRO PARA EL 'OFF'.
 */
function recortarIconosFusionMaster(){
    const listaFusiones = fs.readdirSync(pathFusiones);

    for(let i=0; i<listaFusiones.length; i++){
        const rutaYnombreFusion = pathFusiones + listaFusiones[i];

        // ICONO ON
        Jimp.read(rutaYnombreFusion)
        .then(iconoON => {
            // NOMBRE QUE VA A TENER EL RECORTE DEL ICONO ON
            const nombreRecorteON = 'iconos_importados-ON-'+ i +'.png';
            // RUTA Y NOMBRE QUE VA A TENER EL RECORTE DEL ICONO ON.
            const rutaYnombreRecorteON = pathRecortesFusionMaster + nombreRecorteON;

            // RECORTO Y GUARDO EL ICONO ON.
            iconoON
                .crop(0, 0, 100, 100)
                .write(rutaYnombreRecorteON)
        }).catch(err => { console.error(err); })
        
        // ICONO OFF
        Jimp.read(rutaYnombreFusion)
        .then(iconoOFF => {
            // NOMBRE QUE VA A TENER EL RECORTE DEL ICONO OFF.
            const nombreRecorteOFF = 'iconos_importados-OFF-'+ i +'.png';
            // RUTA Y NOMBRE QUE VA A TENER EL RECORTE DEL ICONO OFF.
            const rutaYnombreRecorteOFF = pathRecortesFusionMaster + nombreRecorteOFF;

            // RECORTO Y GUARDO EL ICONO OFF
            iconoOFF
                .crop(100, 0, 100, 100)
                .write(rutaYnombreRecorteOFF)
        }).catch(err => { console.error(err); })
    }
}


module.exports = controller;