const { Router } = require('express');
const controllerRaiz = require('../controller/appControllerRaiz');
const controllerAdd = require('../controller/appControllerAdd');

const router = Router();

/********    RUTA /    ********/
router.get('/', controllerRaiz.get);

router.post('/', controllerRaiz.recortarIconos);


/********    RUTA /ADD    ********/
router.get('/add', controllerAdd.addGet);

router.post('/add', controllerAdd.upload, controllerAdd.addPost);

module.exports = router;