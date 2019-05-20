const sql = require('mssql');
const config = require('../config/config');

const conn = new sql.ConnectionPool(config.configMssql);

exports.ejecutaSelect = (consultaSQL, callback) => {

    conn.connect()
        .then(() => {
            let solicitud = new sql.Request(conn);
            return solicitud.query(consultaSQL);
        })
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err);
        });
}