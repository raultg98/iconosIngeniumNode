/***************    IMPORTS    ***************/
const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');

const iconosSubidos = require('./listarUpload');
console.log("Archivos en upload: "+ iconosSubidos);

const app = express();

/***************    SETTINGS    ***************/
app.set('appName', 'Iconos Ingenium');
app.set('port', '5000');
app.set('pathSubida', '/public/img/upload');

// MOTOR DE PLANTILLAS.
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

/***************    MIDDLEWARE    ***************/
// Morgan me dice por consola la peticion que estoy haciendo, la ruta
// el status y el tiempo que tardo la peticion.
app.use(morgan('dev'));

// GUARDO EL ARCHIVO SUBIDO EN LA CARPETA.
const storage = multer.diskStorage({
    destination: __dirname + app.get('pathSubida'),
    filename: (req, file, cb)=>{
        cb(null, ('custom_' + iconosSubidos + '.jpg'));
    }
});

app.use(multer({
    storage,
    // Le doy la ruta donde esta la carpeta
    dest: (__dirname, app.get('pathSubida'))
}).single('fileToUpload'));

/***************    RUTAS    ***************/
app.use(require('./routes/appRoutes'));


/***************    ARCHIVOS ESTATICOS    ***************/
app.use(express.static(path.join(__dirname, 'public')));


// let port = process.env.POST || '5000';
app.listen(app.get('port'), ()=>{
    console.log('Nombre de la aplicación: '+ app.get('appName'))
    console.log('Server on port: ', app.get('port'));
});