const mysql = require('mysql');
const { promisify } = require('util');
const { databasep } = require('./keys');
const { ipcMain } = require('electron');
var conexion = "";
console.log("Conectado al crm de : " + databasep.host)
const pool = mysql.createPool(databasep);
ipcMain.on('conexion', async(event) => {
    conexion = event;
})
pool.getConnection((err, connection) => {
    if (err) {
        console.log("Error: ", err.code);
        conexion.reply('errorconexion', err);

        if (err.code === 'ECONNRESET') {
            conexion.reply('errorconexion', err);
        }
        if (err.code === 'EHOSTUNREACH') {
            conexion.reply('errorconexion', err);
        }
        if (err.code === 'ETIMEDOUT') {
            conexion.reply('errorconexion', err);
        }
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has to many connections');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused');
        }
    }

    if (connection) connection.release();
    console.log('DB is Connected');
    return;
});

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;