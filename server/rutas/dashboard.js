const express = require('express');
const app = express();
const sql = require('mssql');
const config = require('../config/config');
const db = require('../db/db');
config.configMssql.database = 'a000_sysgesNC';

app.get('/sp1076', (req, res) => {
    
    let fecini = new Date(req.query.fecini) || new Date(2019, 0, 1);
    let fecter = new Date(req.query.fecter) || new Date(2019, 4, 31);
    let codven = parseInt(req.query.codven) || 0;
    let codloc = parseInt(req.query.codloc) || 0;

        
    (async () => {
        try {
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
    (async () => {
        try {
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





/* app.get('/sp1076', (req, res) => {

    let ini = new Date(2019, 0, 1);
    let ter = new Date(2019, 0, 05);

    sql.connect(config.configMssql, () => {
        let request = new sql.Request();
        request.output('NombreTabla', sql.NVarChar(50));
        request.input('fecini', sql.SmallDateTime, ini);
        request.input('fecter', sql.SmallDateTime, ter);
        request.input('codven', sql.SmallInt, '0');
        request.input('codloc', sql.SmallInt, '0');
        request.execute('SP_1076_GNTM', function(err, recordsets, returnValue, affected) {
            if (err) {
                return res.json({
                    ok: false,
                    error: {
                        mensaje: 'Error al ejecutar sp',
                        err
                    }
                })
            }

            if (recordsets.rowsAffected.length === 0) {
                return res.json({
                    ok: false,
                    mensaje: 'No hay informacion para la consulta'
                });
            }

            let tablaOutputSp = recordsets.output.NombreTabla.split('.')[1].slice(1, -1);

            res.json({
                ok: true,
                tablaOutputSp,
                data: recordsets
            });
        });
    })
}); */




/* prueba */
app.get('/hola/:msj', (req, res) => {

    /* el encabezado de la respuesta la configura de forma automatica segun el contenido que enviamos , para configurarlo de forma manual esta el metodo set()*/
    //res.set('Content-Type', 'text/html');

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

    //el metodo end lo podemos usar para finalizar la respuesta seria util tambien en un 40, tanto send como json terminan la respuesta automaticamente
    //res.status(404).end();
    //res.end();
});


module.exports = app;