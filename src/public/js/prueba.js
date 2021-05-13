// const div = document.querySelector('.paco');
// div.setAttribute('class', 'd-flex justify-content-between')

// // PRIMER CANVAS
// const canvas = document.createElement('canvas');
// const contexto = canvas.getContext('2d');

// let inicioX = 0;
// let inicioY = 0;

// canvas.width  = 100;
// canvas.height = 100;

// let icono = new Image();

// icono.onload = function(){
//     contexto.drawImage(icono, inicioX, inicioY, 100, 100, 0, 0, 100, 100);
// }

// icono.src = '/img/icons.png';
// icono.setAttribute('class', 'icono');

// // SEGUNDO CANVAS
// // const canvas2 = document.createElement('canvas');
// // const contexto2 = canvas.getContext('2d');

// // let inicioX2 = 0;
// // let inicioY2 = 0;

// // canvas2.width  = 100;
// // canvas2.height = 100;

// // let icono2 = new Image();

// // icono2.onload = function(){
// //     contexto2.drawImage(icono2, inicioX2, inicioY2, 100, 100, 0, 0, 100, 100);
// // }

// // icono2.src = '/img/icons.png';

// // const div1 = document.createElement('div');
// // div1.setAttribute('id', 1);
// // div1.appendChild(icono)
// // div.appendChild(div1);

// // const div2 = document.createElement('div');
// // const icono22 = document.querySelector('.icono');
// // console.log(icono22)

// // let img = new Image();
// // img.innerHTML = icono22;
// // div2.setAttribute('id', 2);
// // div2.appendChild(icono22)
// // div.appendChild(div2);


// // function timeout(){
// //     setTimeout(function(){
// //         const div2 = document.createElement('div');
// //         const icono22 = document.querySelector('.icono');
// //         console.log(icono22)
// //         div2.setAttribute('id', 2);
// //         div2.appendChild(icono22)
// //         div.appendChild(div2);
// //     },2000,"JavaScript");
// // }

// const divPadre = document.querySelector('#pruebas');
// divPadre.setAttribute('class', 'd-flex justify-content-around')
// // let imagen = new Image();
// const imagen = document.createElement('img');
// imagen.src = '/img/icons.png';

// const canvas = document.createElement('canvas');
// const contexto = canvas.getContext('2d');

// let numIconos = listasDeIconos[j].numeroIconos;
    
// let inicioX;
// let inicioY;
// let ancho_alto = 100;
// let zoom = 1;            

// // ICONOS DE LA PRIMERA COLUMNA (i < 100)
    
// canvas.width = ancho_alto;
// canvas.height = ancho_alto;
    
// let icono = new Image();
    
// icono.onload = function(){
//     contexto.drawImage(icono, inicioX, inicioY, ancho_alto*zoom, 
//                        ancho_alto*zoom, 0, 0, ancho_alto, ancho_alto);
// }
    

// for(let i=0; i<2; i++){
//     const div1 = document.createElement('div');

//     // let img = new Image();
//     // img.src = imagen.getAttribute('src');

//     div1.appendChild(img);
    
//     divPadre.appendChild(div1);
// }