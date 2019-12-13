module.exports = {
    database: leerConexion(),
    databaseMarcador: leerConexionMarcador(),
    databasep: leerConexionp(),
    databaseMarcadorp: leerConexionMarcadorp()
};

function leerConexion() {
    const editJsonFile = require("edit-json-file");
    let file = editJsonFile(`${__dirname}/conexion.json`);
    var coneObj = {
        host: file.toObject().crm.ip,
        user: file.toObject().crm.usuario,
        password: file.toObject().crm.contrasena,
        database: file.toObject().crm.baseDatos,
        connectionLimit: 1000,
        connectTimeout: 60 * 10 * 1000,
        acquireTimeout: 60 * 10 * 1000,
        timeout: 60 * 10 * 1000,
    };
    return coneObj;
}

function leerConexionMarcador() {
    const editJsonFile = require("edit-json-file");
    let file = editJsonFile(`${__dirname}/conexion.json`);
    var coneObj = {
        host: file.toObject().marcador.ip,
        user: file.toObject().marcador.usuario,
        password: file.toObject().marcador.contrasena,
        database: file.toObject().marcador.baseDatos,
        connectionLimit: 1000,
        connectTimeout: 60 * 10 * 1000,
        acquireTimeout: 60 * 10 * 1000,
        timeout: 60 * 10 * 1000,
    };
    return coneObj;
}

function leerConexionp() {
    const editJsonFile = require("edit-json-file");
    let file = editJsonFile(`${__dirname}/conexion_.json`);
    var coneObj = {
        host: file.toObject().crm.ip,
        user: file.toObject().crm.usuario,
        password: file.toObject().crm.contrasena,
        database: file.toObject().crm.baseDatos,
        connectionLimit: 1000,
        connectTimeout: 60 * 10 * 1000,
        acquireTimeout: 60 * 10 * 1000,
        timeout: 60 * 10 * 1000,
    };
    return coneObj;
}

function leerConexionMarcadorp() {
    const editJsonFile = require("edit-json-file");
    let file = editJsonFile(`${__dirname}/conexion_.json`);
    var coneObj = {
        host: file.toObject().marcador.ip,
        user: file.toObject().marcador.usuario,
        password: file.toObject().marcador.contrasena,
        database: file.toObject().marcador.baseDatos,
        connectionLimit: 1000,
        connectTimeout: 60 * 10 * 1000,
        acquireTimeout: 60 * 10 * 1000,
        timeout: 60 * 10 * 1000,
    };
    return coneObj;
}
