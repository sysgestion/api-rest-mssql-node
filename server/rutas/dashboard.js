const express = require('express');
const app = express();
const sql = require('mssql');
const config = require('../config/config');

app.get('/sp1076', (req, res) => {
    
    let fecini = new Date(req.query.fecini) || new Date(2019, 0, 1);
    let fecter = new Date(req.query.fecter) || new Date(2019, 4, 31);
    let codven = parseInt(req.query.codven) || 0;
    let codloc = parseInt(req.query.codloc) || 0;
    let emp = req.query.emp;

        
    (async () => {
        try {
            config.configMssql.database = process.env.NAME + emp;

            let pool = await sql.connect(config.configMssql);
            let resultSP = await pool.request()
                .output('NombreTabla', sql.VarChar(50))
                .input('fecini', sql.SmallDateTime, fecini)
                .input('fecter', sql.SmallDateTime, fecter)
                .input('codven', sql.SmallInt, codven)
                .input('codloc', sql.SmallInt, codloc)
                .execute('SP_1076_GNTM');
                
            let tablaOutputSp = resultSP.output.NombreTabla.split('.')[1].slice(1, -1);
        
            let resultTabla = await pool.request()
                .query('select * from ' + tablaOutputSp);

            res.json({
                ok: true,
                data: resultTabla.recordset
            });

            sql.close();
        } catch (err) {
            res.json({
                ok:false,
                nombre: err.name,
                mensaje: err.message,
                err
            });
            sql.close();
        }
    })()
});


app.get('/tablas', (req, res) => {

    let emp = req.query.emp;

    (async () => {
        try {
            config.configMssql.database = process.env.NAME + emp;
            let pool = await sql.connect(config.configMssql);
            let resultTablaVen = await pool.request()
                .query('select ve_codven, ve_nomven from maeven');
            let resultTablaLoc = await pool.request()
                .query('select lc_codloc, lc_nomloc from maeloc');
            res.json({
                ok: true,
                vendedores: resultTablaVen.recordset,
                locales: resultTablaLoc.recordset
            });

            sql.close();
        } catch (err) {
            res.json({
                ok:false,
                nombre: err.name,
                mensaje: err.message,
                err
            });
            sql.close();
        }
    })()
});


/* prueba */
app.get('/hola/:msj', (req, res) => {
    //parametro obligatorio
    mensaje = req.params.msj;
    res.json({
        nombre: 'Robinson',
        edad: 30,
        sexo: 'H',
        mensaje,
        direccion: {
            calle: 'Villanova',
            numero: 1587,
            comuna: {
                codigo: 45,
                nombre: 'Cerro Navia'
            },
            ciudad: 'Santiago',
            pais: 'Chile'
        }
    });
});


module.exports = app;