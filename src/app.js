/***************    IMPORTS    ***************/
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exec = require('child_process').exec;
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');

// CON ESTE SCRIPT LO QUE CONSIGO ES PASAR LOS DATOS DE 'Instal.dat' AL CLIENTE 
// MEDIANTE UN ARCHIVO JSON LLAMADO 'Instal.json'
// exec('node \serverScripts/obtenerDatosInstal.js', (err, stdout) => {
//     if(err) throw err;
// });

// // CON ESTE SCRIPT CREO UNA IMAGEN QUE ES LA FUSION DE TODOS LOS ICONOS CUSTOM
// // QUE EL USUARIO ME HA SUBIDO. ESTA IMAGEN FUSIONADA TIENE DOS COLUMNAS.
// exec('node \serverScripts/obtenerIconosCustom.js', (err, stdout) => {
//     if(err) throw err;
// });


// // CON ESTE SCRIPT CREO UN JSON QUE TIENE UN OBJETO CON LOS DATOS DE CADA LISTA 
// // DE ICONOS QUE EL CLIENTE ME HA SUBIDO, MAS LA IMAGEN FUSIONA DE LOS ICONOS CUSTOM
// exec('node \serverScripts/obtenerListasSubidas.js', (err, stdout) => {
//     if(err) throw err;
// });

const app = express();


/***************    SETTINGS    ***************/
app.set('appName', 'Iconos Ingenium');
app.set('port', '5000');
// app.set('pathSubida', '/public/img/upload');

// MOTOR DE PLANTILLAS.
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

/***************    MIDDLEWARE    ***************/
// Morgan me dice por consola la peticion que estoy haciendo, la ruta
// el status y el tiempo que tardo la peticion.
// app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));


/***************    RUTAS    ***************/
app.use(require('./routes/appRoutes'));


/***************    STATIC FILES    ***************/
app.use(express.static(path.join(__dirname, '/public')));



// let port = process.env.POST || '5000';
app.listen(app.get('port'), ()=>{
    // console.log('Nombre de la aplicación: '+ app.get('appName'))
    console.log('Server on port: ', app.get('port'));
});