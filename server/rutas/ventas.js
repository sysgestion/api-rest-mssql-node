const express = require('express');
const app = express();
const sql = require('mssql');
const config = require('../config/config');
const db = require('../db/db');

app.get('/notasventa', (req, res) => {
    
    let desde = req.query.desde || '';  //string
    let hasta = req.query.hasta || '';  //string
    let codven = parseInt(req.query.codven) || 0; //int
    let rut = parseInt(req.query.rut) || 0;  //int

    (async () => {
        try {
            let pool = await sql.connect(config.configMssql);

            let query = `select en_codven, en_numnot, en_rutcli, en_digcli, en_fecemi,
            en_nomcli, en_totnet, en_totdes, en_totiva, en_totexe,
            (select tb_destab from maetab where tb_tiptab = 5 and tb_codtab = en_conpgo) as en_conpgo,
            (select tb_destab from maetab where tb_tiptab = 61 and tb_codtab = en_forpgo) as en_forpgo
            from encnot where en_esnula = 0 and en_autori = 0 and en_closed = 0`;

            if (desde != '') {
                query = query + ` and en_fecemi >= ${desde}`;
            }
            
            if (hasta != '') {
                query = query + ` and en_fecemi <= ${hasta}`;
            }
            
            if (codven != 0) {
                query = query + ` and en_codven = ${codven}`;
            }

            if (rut > 0) {
                query = query + ` and en_rutcli = ${rut}`;
            }
        
            let result = await pool.request().query(query);

            res.json({
                ok: true,
                data: result.recordset,
                cant: result.rowsAffected[0]
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


app.get('/clientes', (req, res) => {

    let activos = parseInt(req.query.activos) || 0;  //int

    (async () => {
        try {
            let pool = await sql.connect(config.configMssql);

            let query = `select cl_rutcli, cl_codsuc, cl_digcli, cl_nomcli from maecli`;

            /* si el parametro viene en cero no entrara al if y no pondra el where, trayendo asi todos los clientes */
            if (activos != 0) {
                query = query + ` where cl_activo = ${activos}`;
            }
        
            let result = await pool.request().query(query);

            res.json({
                ok: true,
                data: result.recordset,
                cant: result.rowsAffected[0]
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


app.get('/notaventa', (req, res) => {
    
    let folio = req.query.folio;

    (async () => {
        try {
            let pool = await sql.connect(config.configMssql);
            let resultSP = await pool.request()
                .input('NumNot', sql.Int, parseInt(folio))
                .execute('SP_5001_DevuelveDantosNV');

            res.json({
                ok: true,
                data: resultSP.recordset
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



module.exports = app;