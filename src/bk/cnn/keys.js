const Cryptr = require('cryptr');
const cryptr = new Cryptr('bsw2019');
const fs = require('fs');

module.exports = {
    database: leerConexion(),
    databaseMarcador: leerConexionMarcador()
};

function leerConexion() {
    let cnn2020 = fs.readFileSync('cnn2020.json');
    let conf = JSON.parse(cnn2020);
    const decryptedString = cryptr.decrypt(conf.conexiones);
    var configuraciones = JSON.parse(decryptedString);
    var conexiones = configuraciones.conexiones;
    var selected = conexiones.filter(conexion => conexion.select)[0];
    var coneObj = {
        host: selected.mysql.crm.ip,
        user: selected.mysql.crm.usuario,
        password: selected.mysql.crm.contrasena,
        database: selected.mysql.crm.baseDatos,
        connectionLimit: 10
    };

    return coneObj;
}

function leerConexionMarcador() {
    let cnn2020 = fs.readFileSync('cnn2020.json');
    let conf = JSON.parse(cnn2020);
    const decryptedString = cryptr.decrypt(conf.conexiones);
    var configuraciones = JSON.parse(decryptedString);
    var conexiones = configuraciones.conexiones;
    var selected = conexiones.filter(conexion => conexion.select)[0];
    var coneObj = {
        host: selected.mysql.cc.ip,
        user: selected.mysql.cc.usuario,
        password: selected.mysql.cc.contrasena,
        database: selected.mysql.cc.baseDatos,
        connectionLimit: 10
    };

    return coneObj;
}