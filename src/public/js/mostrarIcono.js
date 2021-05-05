function mostrarIconos(){
    const imagen = document.querySelectorAll('.imagen');

    for(let i=0; i<imagen.length; i++){
        let posIcon = imagen[i].getAttribute('id');
        
        let dondeEmpieza, dondeTermina;
        let TOTAL_PIXELES = 100*100;

        if(posIcon < 100){
            dondeEmpieza = posIcon*(-100);
            dondeTermina = (TOTAL_PIXELES + dondeEmpieza - 100)*(-1);

            imagen[i].style.margin = (dondeEmpieza +"px 0 "+ dondeTermina)+ "px 0";

        }else if(posIcon >= 100){
            posIcon -= 100;

            dondeEmpieza = posIcon*(-100);
            dondeTermina = (TOTAL_PIXELES + dondeEmpieza - 100)*(-1);

            imagen[i].style.margin = (dondeEmpieza +"px -200px "+ dondeTermina)+ "px -100px";
        }
    }
}

function iconosAcordeon(){
    // TODOS LOS ACORDEONES
    const divsDatos = document.querySelectorAll('.divConDatos');

    // LO TENGO QUE RECORRER PARA SACAR LOS DATOS DE CADA DIV.
    for(let i=0; i<divsDatos.length; i++){

        // Numero de iconos que tiene la imagen.
        const numIconos = divsDatos[i].getAttribute('value');
        // SRC de la imagen.
        const src = divsDatos[i].getAttribute('id');

        // COMPRUEBO QUE EL DIV TENGA UNA LISTA DE ICONOS VALIDA.
        if(numIconos > 0){

            // TENGO QUE CREAR LOS 200 DIVS DE CADA FOTO.
            for(let j=0; j<numIconos; j++){
                const divSinNada = document.createElement('div');

                // CREO EL DIV QUE CONTIENE A LA IMAGEN Y LA IMAGEN.
                const divImagen = document.createElement('div');
                const img = document.createElement('img');
                
                divImagen.setAttribute('class', 'div-icono');

                img.setAttribute('src', src);

                // LE TENGO QUE DAR ESTILOS A LA FOTO.
                let dondeEmpieza, dondeTermina;
                let TOTAL_PIXELES = 100*100;

                if(j < 100){
                    dondeEmpieza = j*(-100);
                    dondeTermina = (TOTAL_PIXELES + dondeEmpieza - 100)*(-1);

                    img.style.margin = (dondeEmpieza +'px 0 '+ dondeTermina +'px 0');
                }else if(j >= 100){
                    let posicion = j;
                    posicion -= 100;

                    dondeEmpieza = posicion*(-100);
                    dondeTermina = (TOTAL_PIXELES + dondeEmpieza - 100)*(-1);

                    img.style.margin = (dondeEmpieza + 'px 0 '+ dondeTermina +'px 0');
                }

                img.addEventListener('click', (e)=>{
                    console.log("EL icono pulsado es el: "+ j);
                });
                
                divImagen.appendChild(img);
                divSinNada.appendChild(divImagen);
                divsDatos[i].appendChild(divSinNada);
            }           
        }
    }
}


mostrarIconos();
iconosAcordeon();