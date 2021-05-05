const fs = require('fs');

let ruta = './public/img/upload';

let items = fs.readdirSync(ruta);

module.exports = items.length;