const express = require('express');
const app = express();
const sql = require('mssql');
const config = require('../config/config');


app.post('/login', (req, res) => {
    
    let correo = req.body.correo.trim();
    let clave = req.body.clave;
    
    (async () => {
        try {
            config.configMssql.database = 'a000_sysgesNC';
            let pool = await sql.connect(config.configMssql);
            let query = `select * from nucusr_w where correo = '${correo}'`
            let result = await pool.request().query(query);
            userBD = result.recordset[0];
        
            //no existe
            if(!userBD){
                sql.close();
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: 'USER_NO_EXISTE'
                    }
                });
            }

            //clave no corresponde
            if(clave !== userBD.clave){
                sql.close();
                return res.status(400).json({
                    ok:false,
                    err:{
                        message: 'NO_VALIDO'
                    }
                })
            }
            
            //borramos la clave para enviar al front
            delete userBD.clave;
            
            //cargamos las empresas si corresponde
            if(userBD.empresa.length === 0){
                sql.close();
                userBD.empresa = [];
                return res.json({
                    ok:true,
                    user: userBD
                });
            }else{
                let empresasBD = await pool.request()
                .query(`select em_codigo, em_nombre from nucemp where em_codigo in (${userBD.empresa})`);
                userBD.empresa = empresasBD.recordset;
            }

            sql.close();
            res.json({
                ok: true,
                user: userBD
            });

        } catch (err) {
            sql.close();
            res.status(500).json({
                ok:false,
                nombre: err.name,
                mensaje: err.message,
                err
            });
        }
    })()

});



module.exports = app;