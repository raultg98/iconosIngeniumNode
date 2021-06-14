const iconToUpload = document.querySelectorAll('.archivo')[0];
const listToUpload = document.querySelectorAll('.archivo')[1];
const botonSubmit = document.getElementById('btnSubmit');

/**
 * FUNCION QUE ME CREA UN MENSAJE DE ERROR CUANDO LA EXTENSION DEL ARCHIVO NO ES VALIDA.
 * 
 * @param { String } mensaje 
 */
function crearMensajeError(mensaje){
    const divMensajeError = document.getElementById('mensajeError');

    const divAlert = document.createElement('div');
    const spanMensaje = document.createElement('span');
    const botonCerrar = document.createElement('button');

    divAlert.setAttribute('class', 'alert alert-danger alert-dismissible fade show');
    divAlert.setAttribute('role', 'alert');

    botonCerrar.setAttribute('class', 'btn-close');
    botonCerrar.setAttribute('type', 'button');
    botonCerrar.setAttribute('data-bs-dismiss', 'alert');
    botonCerrar.setAttribute('aria-label', 'Close');

    spanMensaje.innerText = mensaje;

    divAlert.appendChild(spanMensaje);
    divAlert.appendChild(botonCerrar);

    divMensajeError.appendChild(divAlert);

    // DESPUES DE 10S QUIERO QUE SE ME CIERRE EL ALERT
    setTimeout(() => {
        divMensajeError.removeChild(divMensajeError.lastChild   );
    }, 10000);
}


let desabilitarUnIcono = true;
let desabilitarListas = true;


iconToUpload.addEventListener('change', (e) => {
    const extensionArchivo = e.target.files[0].name.split('.')[1];
    console.log('FILESS');
    console.log(extensionArchivo);

    const iconPreview = document.getElementById('iconPreview');

    if(iconPreview.hasChildNodes){
        let numeroHijos = iconPreview.childNodes.length;

        for(let i=0; i<numeroHijos; i++){
            iconPreview.removeChild(iconPreview.lastChild);
        }
    }

    let cantidad = e.target.files.length;

    for(let i=0; i<cantidad; i++){
        const extensionArchivo = e.target.files[i].name.split('.')[1];
        const expresion = /png|jpeg|jpg/i;

        if(!expresion.test(extensionArchivo)){
            desabilitarUnIcono = true;
            crearMensajeError('LA EXTENSION '+ extensionArchivo +' NO ES VALIDA');
        }else {
            desabilitarUnIcono = false;

            let reader = new FileReader();
            reader.readAsDataURL(e.target.files[i]);

            reader.onload = function(){
                const img = document.createElement('img');

                iconPreview.style.width = '50%';
                iconPreview.style.height = '50%';
                img.style.width = '200px';
                img.style.height = '200px';
        
                img.src = reader.result;
                
                iconPreview.appendChild(img);
            }
        }
    }

    /**
     * disabled = true ==> BOTON DESACTIVADO.
     */
    if(desabilitarListas && desabilitarUnIcono){
        botonSubmit.disabled = true;
        botonSubmit.style.cursor = 'not-allowed';
    }else {
        botonSubmit.disabled = false;
        botonSubmit.style.cursor = 'pointer';
    }
});

listToUpload.addEventListener('change', (e) => {
    const listPreview = document.getElementById('listPreview');

    console.log('FILESS');
    console.log(e.target.files);

    if(listPreview.hasChildNodes){
        let numeroHijos = listPreview.childNodes.length;

        for(let i=0; i<numeroHijos; i++){
            listPreview.removeChild(listPreview.lastChild);
        }
    }

    const extensionArchivo = e.target.files[0].name.split('.')[1];
    const expresion = /png|jpeg|jpg/i;

    if(!expresion.test(extensionArchivo)){
        desabilitarListas = true;
        crearMensajeError(`LA EXTENSION '${extensionArchivo}' NO ES VALIDA`);
    }else {
        desabilitarListas = false;

        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        reader.onload = function(){
            const img = document.createElement('img');

            listPreview.style.width = '200px';
            listPreview.style.margin = '0 auto';
            img.style.width = '100%';
            img.style.height = '100%';

            img.src = reader.result;
            
            listPreview.appendChild(img);
        }
    }

    /**
     * disabled = true ==> BOTON DESACTIVADO.
     */
    if(desabilitarListas && desabilitarUnIcono){
        botonSubmit.disabled = true;
        botonSubmit.style.cursor = 'not-allowed';
    }else {
        botonSubmit.disabled = false;
        botonSubmit.style.cursor = 'pointer';
    }
});