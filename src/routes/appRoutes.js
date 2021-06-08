const { Router } = require('express');
const controllerRaiz = require('../controller/controllerRaiz');
const controllerAdd = require('../controller/controllerAdd');

const router = Router();

/********    RUTA /    ********/
router.get('/', controllerRaiz.get);

router.post('/', controllerRaiz.post);


/********    RUTA /ADD    ********/
router.get('/add', controllerAdd.addGet);

router.post('/add', controllerAdd.upload, controllerAdd.addPost);

module.exports = router;