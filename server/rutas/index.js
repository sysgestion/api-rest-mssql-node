const express = require('express');
const app = express();

//este es el nombre del archivo, no la url de la peticion
app.use(require('./dashboard'));
app.use(require('./ventas'));

module.exports = app;