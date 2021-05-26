const iconToUpload = document.querySelectorAll('.archivo')[0];
const listToUpload = document.querySelectorAll('.archivo')[1];
const botonSubmit = document.getElementById('btnSubmit');

iconToUpload.addEventListener('change', (e) => {
    const iconPreview = document.getElementById('iconPreview');

    if(iconPreview.hasChildNodes){
        let numeroHijos = iconPreview.childNodes.length;

        for(let i=0; i<numeroHijos; i++){
            iconPreview.removeChild(iconPreview.lastChild);
        }
    }

    let cantidad = e.target.files.length;
    console.log(cantidad);

    for(let i=0; i<cantidad; i++){
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

    if(iconToUpload.files.length === 0){
        botonSubmit.disabled = true;
    }else{
        botonSubmit.disabled = false;
    }
});

listToUpload.addEventListener('change', (e) => {
    const listPreview = document.getElementById('listPreview');

    if(listPreview.hasChildNodes){
        let numeroHijos = listPreview.childNodes.length;

        for(let i=0; i<numeroHijos; i++){
            listPreview.removeChild(listPreview.lastChild);
        }
    }

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

    if(listToUpload.files.length === 0){
        botonSubmit.disabled = true;
    }else{
        botonSubmit.disabled = false;
    }

});