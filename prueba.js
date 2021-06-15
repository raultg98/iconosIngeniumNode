function recortarIconos(iconosInput){
    return new Promise((resolve, reject) => {
        console.log('DENTRO DE RECORTAR ICONOS');

        for(let i=0; i<iconosInput.length; i++){
            console.log('BUCLE POSICION: '+ i);

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

            if(i === (iconosInput.length - 1)){
                console.log('DENTRO DEL IF FINAL DE RECORTAR ICONOS: '+ i);
                resolve();
            }
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
    // return new Promise((resolve, reject) => {
        console.log('DENTRO DE FUSION HORIZONTAL');

        // OBTENGO LOS DATOS DE LOS DOS ICONOS LOS CUALES VOY A FUSIONAR
        for(let i=0; i<iconosInput.length; i+=2){
            console.log('BUCLE FUSION HORIZONTAL = '+ i);

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
                    console.log('SE HA REALIZADO LA FUSION DE: '+ i);
                    img.write(pathYnombreFusion);
                })
                .catch(err => { 
                    console.log('ERROR DENTRO DE MERGE_IMG');
                    console.error(err);
                })
            }

            // console.log('BUCLEEEEEEEEEEEEEEEEEE i: '+ i);
            // console.log('.length = '+ iconosInput.length);
            // if(i === (iconosInput.length - 2)){
            //     console.log('DENTRO DEL IF DE LA FUSION HORIZONTAL');
            //     resolve();
            // }
        }
    // });
}