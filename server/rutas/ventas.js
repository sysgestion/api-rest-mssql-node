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


app.get('/autorizarnotaventa', (req, res) => {

    let estado = parseInt(req.query.estado);  //int
    let folio = parseInt(req.query.folio);  //int
    let emp = req.query.emp;

    (async () => {
        try {
            config.configMssql.database = 'a000_sysges'+ emp;
            let pool = await sql.connect(config.configMssql);

            let query;

            if(estado > 0){
                query = `update encnot set en_autori = 1, en_rechaz = 0, en_dataut = 'ECV / ${new Date()}' where en_numnot = ${folio}`
            }else{
                query = `update encnot set en_autori = 0, en_rechaz = 1, en_dataut = 'ECV / ${new Date()}' where en_numnot = ${folio}`
            }
            
            let result = await pool.request().query(query);

            res.json({
                ok: true,
                estado: estado,
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
    let emp = req.query.emp;

    (async () => {
        try {
            config.configMssql.database = 'a000_sysges'+ emp;
            let pool = await sql.connect(config.configMssql);
            let resultSP = await pool.request()
                .input('NumNot', sql.Int, parseInt(folio)) //parseInt(folio)
                .execute('SP_5001_DevuelveDatosNV');

            if(resultSP.recordset.length === 0){
                sql.close();
                return res.json({
                    ok: false,
                    message: 'DOC_NO_EXISTE'
                });
            }
            
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