const { Router } = require('express');

const router = Router();

/********    RUTA /    ********/
router.get('/', (req, res)=>{
    console.log('Estoy en la ruta: ', req.path);

    res.render('index');
});

/********    RUTA /ADD    ********/
router.get('/add', (req, res, next)=>{
    console.log('Estoy en la ruta /add');

    res.render('add');
});

router.post('/add', (req, res)=>{
    // Muestro todas las propiedades del archivo.
    console.log('Se ha hecho una peticion POST')
});

module.exports = router;