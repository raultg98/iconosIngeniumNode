const { Router } = require('express');

// ESTO ES UN ARRAY DE OBJETOS, EL CUAL HE LEIDO DESDE 'Instal.dat'.
// const datos = require('../datosIconos');
// console.log(datos);

// ARRAY DE TODAS LAS LISTAS QUE TENEMOS DE ICONOS.
let listaIconos = [
    {
        foto: '/img/icons.png', 
        titulo: 'DEFAULT', 
        numero: 200
    }
    // ,{
    //     foto: 'foto3', 
    //     titulo: 'titulo3',
    //     numero: 0
    // }
];

const router = Router();

router.get('/', (req, res)=>{
    console.log('Estoy en la ruta: ', req.path);
    
    res.render('index', {
        listaIconos
    });
});

router.get('/add', (req, res, next)=>{
    console.log('Estoy en la ruta /add');

    res.render('add');
});

router.post('/add', (req, res)=>{
    // Muestro todas las propiedades del archivo.
    console.log('Se ha hecho una peticion POST')
});

module.exports = router;