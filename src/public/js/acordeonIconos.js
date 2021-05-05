










// const imagen = document.querySelector('imagenAcordeon');
// let numeroIconos = imagen.getAttribute('id');


// function mostrarIconos(numIconos){

//     for(let i=0; i<numIconos; i++){
            
//         let dondeEmpieza, dondeTermina;
//         let TOTAL_PIXELES = 100*100;
    
//         if(i < 100){
//             let posIcon = i;
            
//             dondeEmpieza = posIcon*(-100);
//             dondeTermina = (TOTAL_PIXELES + dondeEmpieza - 100)*(-1);
    
//             imagen[i].style.margin = (dondeEmpieza +"px 0 "+ dondeTermina)+ "px 0";
    
//         }else if(i >= 100){
//             let posIcon = i;
//             posIcon -= 100;

//             dondeEmpieza = i*(-100);
//             dondeTermina = (TOTAL_PIXELES + dondeEmpieza - 100)*(-1);
    
//             imagen[i].style.margin = (dondeEmpieza +"px -200px "+ dondeTermina)+ "px -100px";
//         }

//     }
// }

// mostrarIconos(numeroIconos);