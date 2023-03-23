
//use el archivo .env para ver las variables locales
require('dotenv').config();

//process, obj global que existe mientras corre la app de node y cambia dependiendo de el entorno donde este la app

//=======================
// puerto
//=======================
//si no existe process.env.PORT, el puerto sera el 3000(cuando corra local)
process.env.PORT = process.env.PORT || 3000;


//=======================
// entorno (envioroment)
//=======================
//process.env.NODE_ENV es una variable de entonrno en heroku, si existe esta variable estamos en produccion, si no en dessarrllo
process.env.NODE_ENV = process.env.NODE_ENV || 'desarrollo';


//=========================
// base de datos SQL SERVER
//=========================
//estos valores deben ser una variable de entorno en el servidor
//CONFIG MSSQL
const configMssql = {
    user: process.env.USER_BD,
    password: process.env.PWD_BD,
    server: process.env.HOSTNAME_BD, // instancia
    database: process.env.NAME_BD,
    port: parseInt(process.env.PORT_BD), // por defecto 1433
    options: {
        encrypt: false, // true si es windows azure
    },
    pool: {
        max: 20,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

process.env.NAME = configMssql.database.substr(configMssql.database-2, configMssql.database.length);

module.exports = {
    configMssql,
}