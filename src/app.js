/***************    IMPORTS    ***************/
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exec = require('child_process').exec;

// EJECUTO ESTOS SCRIPTS NADA MAS COMENZAR EL SERVER ASI ME ASEGURO QUE HE CREADO 
// ARCHIVOS JSON QUE SON NECESARIOS PARA EL CLIENTE.
exec('node \serverScripts/obtenerDatosInstal.js', (err, stdout) => {
    if(err) throw err;

    console.log('obtenerDatosInstal EJECUTADO');
});

exec('node \serverScripts/obtenerIconosCustom.js', (err, stdout) => {
    if(err) throw err;

    console.log('obtenerIconosCustom EJECUTADO')
});

exec('node \serverScripts/obtenerListasSubidas.js', (err, stdout) => {
    if(err) throw err;

    console.log('obtenerIconosCustom EJECUTADO')
});

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


/***************    RUTAS    ***************/
app.use(require('./routes/appRoutes'));


/***************    STATIC FILES    ***************/
app.use(express.static(path.join(__dirname, 'public')));


// let port = process.env.POST || '5000';
app.listen(app.get('port'), ()=>{
    // console.log('Nombre de la aplicación: '+ app.get('appName'))
    console.log('Server on port: ', app.get('port'));
});