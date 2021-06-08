/***************    IMPORTS    ***************/
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();


/***************    SETTINGS    ***************/
app.set('appName', 'Iconos Ingenium');
app.set('port', process.env.PORT || 5000);

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