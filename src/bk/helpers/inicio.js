const pool = require('../cnn/database');
const pool3 = require('../cnn/databasep');
const pool2 = require('../cnn/databaseMarcador.js');
const pool4 = require('../cnn/databaseMarcadorp.js');
const querys = require('../querys/inicio');
const $ = require('jquery');

//Informacion del agente
module.exports.consultarAgentes = async(campana, ID, sts, stsres) => {
    const supervisorOut = await pool3.query(querys.consultarAgentesOut, [campana, ID, sts, stsres, ]);
    const agentes = {};
    agentes.out = supervisorOut;
    /* console.log(agentes); */
    return agentes;
}
module.exports.getAllCampanas = async(datos) => {
    const allCampanasOut = await pool3.query(querys.getAllCampanasOut, []);
    var campanas = {};
    campanas = allCampanasOut;
    return campanas;
}

module.exports.getAllEstatus = async(datos) => {
    const allEstatus = await pool.query(querys.getAllEstatus, []);
    const estatusRes = await pool.query(querys.getEstatusRes, []);
    const Estatus = {};
    Estatus.agente = allEstatus,
        Estatus.receso = estatusRes;
    return Estatus
}

module.exports.consultarSupervisores = async(usuarioid) => {
    const allSupervisores = await pool3.query(querys.consultarSupervisores, [usuarioid]);
    return allSupervisores;
}

module.exports.getduracioncampana = async(idcampana, campo) => {
    console.log(idcampana, campo);
    let duracion = [];
    if (campo === "btfechahoraprimronda") {
        duracion = await pool3.query(querys.getduracioncampanaprimronda, [idcampana]);
    } else if (campo === "btfechahorasegronda") {
        duracion = await pool3.query(querys.getduracioncampanasegronda, [idcampana]);
    } else if (campo === "btfechahoraterronda") {
        duracion = await pool3.query(querys.getduracioncampanaterronda, [idcampana]);
    }
    console.log(duracion);
    return duracion[0];
}

//cerrar sesion agente
module.exports.cerrarSesionAgt = async(agnt, modulo) => {
    if (modulo == "I") {
        const cerrarSesionAgt = await pool.query(querys.cerrarSesionAgt, [agnt]);
        return cerrarSesionAgt;
    } else {
        const cerrarSesionAgt = await pool3.query(querys.cerrarSesionAgtOut, [agnt]);
        return cerrarSesionAgt;
    }
}

module.exports.getAllSupervisores = async(datos) => {
    const allSupervisor = await pool.query(querys.getSupervisor, [datos]);
    var supervisores = {};
    if (allSupervisor.length <= 0) {
        const allSupervisores = await pool.query(querys.getAllSupervisores, []);
        return supervisores.supervisores = allSupervisores;
    } else {
        return supervisores.supervisores = allSupervisor;
    }

}

module.exports.reLlamar = async(idcampana) => {
    const result = await pool3.query(querys.getrellamar, [idcampana, idcampana]);
    console.log("Resultado de actualizar contactos por Re-Llamar", result);
    return result;
}


//guardar las rondas 
module.exports.lnzaRondaCampana = async(campana, arrancar_llamadas, numeroRonda, supervisor) => {
    const retorno = {};
    var url = "http://93.188.164.92//BastiaanSoftwareCenter_Espartacus/php/repositorios/MonitorOutbound.php?accion=guardarRondasCampana&campanaId=" + campana + "&arrancarLlamadas=" + arrancar_llamadas + "&NumeroRonda=" + numeroRonda + "&usuario=" + supervisor;
    /* console.log(url) */
    var request = require('request');
    request(url, await
        function(error, response, body) {

            if (error) {
                retorno.valido = false;
                retorno.mensaje = "Error de conexión con el servidor";
            } else {
                retorno.valido = true;
                retorno.mensaje = "Success";
            }

        });
    /* console.log(retorno); */
}

//consultar agentes 
module.exports.consultarAgente = async(campana, arrancar_llamadas, numeroRonda) => {
    const retorno = {};
    var url = "http://93.188.164.92//BastiaanSoftwareCenter_Espartacus/php/repositorios/MonitorOutbound.php?accion=consultarAgentes&campanaId=" + campana + "&arrancarLlamadas=" + arrancar_llamadas + "&NumeroRonda=" + numeroRonda;
    /* console.log(url) */
    var request = require('request');
    request(url, await
        function(error, response, body) {

            if (error) {
                retorno.valido = false;
                retorno.mensaje = "Error de conexión con el servidor";
            } else {
                retorno.valido = true;
                retorno.mensaje = "Success";
            }

        });
    /* console.log(retorno); */
}