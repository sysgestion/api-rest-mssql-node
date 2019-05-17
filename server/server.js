require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser'); //es para parsear datos de la peticion retornando un json
const cors = require('cors');



//app.use se disparará en cada peticion
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



//Cross-Origin Read Blocking (CORB) blocked cross-origin, nueva seguridad de chromme
app.use(cors());

//Configuracion global de rutas
app.use(require('./rutas/index'));
/* app.get('/hola/:msj', (req, res) => {
    mensaje = req.params.msj;
    return res.json({
        nombre: 'robinson',
        edad: 30,
        mensaje
    })
}); */


let puerto = process.env.PORT;

app.listen(puerto, () => {
    console.log('Escuchando puerto', puerto);
});