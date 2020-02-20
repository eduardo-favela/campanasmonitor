const pool = require('../cnn/database');
const pool2 = require('../cnn/databaseMarcador.js');
const querys = require('../querys/inicio');
const $ = require('jquery');

//Informacion del agente
module.exports.consultarAgentes = async(campana, ID, sts, stsres) => {
    const supervisorOut = await pool.query(querys.consultarAgentesOut, [campana, ID, sts, stsres, ]);
    const agentes = {};
    agentes.out = supervisorOut;
    /* console.log(agentes); */
    return agentes;
}
module.exports.getAllCampanas = async(spv) => {
    const allCampanasOut = await pool.query(querys.getAllCampanasOut, [spv]);
    var campanas = {};
    campanas = allCampanasOut;
    return campanas;
}

module.exports.getuniverso = async(campanaid, canal) => {
    const uni = await pool.query(querys.getuniverso, [campanaid, canal]);
    return uni[0].universo;
}

module.exports.getcmpcallback = async() => {
    let arraycmpcallback = [];
    const cmpcallback = await pool.query(querys.getcmpcallback);
    console.log("Campanas callback ", cmpcallback);
    for (var i = 0; i < cmpcallback.length; i++) {
        arraycmpcallback.push(cmpcallback[i].btcampanaid);
    }
    const respuesta = await pool.query(querys.updatecontcallback, arraycmpcallback);
    console.log("Respuesta de update callbacks", respuesta);
}


module.exports.consultarSupervisores = async(usuarioid) => {
    const allSupervisores = await pool.query(querys.consultarSupervisores, [usuarioid]);
    return allSupervisores;
}

module.exports.getduracioncampana = async(idcampana, campo) => {
    console.log(idcampana, campo);
    let duracion = [];
    if (campo === "btfechahoraprimronda") {
        duracion = await pool.query(querys.getduracioncampanaprimronda, [idcampana]);
    } else if (campo === "btfechahorasegronda") {
        duracion = await pool.query(querys.getduracioncampanasegronda, [idcampana]);
    } else if (campo === "btfechahoraterronda") {
        duracion = await pool.query(querys.getduracioncampanaterronda, [idcampana]);
    }
    /* console.log(duracion); */
    return duracion[0].duracion;
}

module.exports.reLlamar = async(idcampana, canal) => {
    console.log(canal);
    if (canal === 'WCAL' || canal === 'CALL') {
        await pool.query(querys.getrellamarcallbacks, [idcampana, idcampana]);
    } else {
        await pool.query(querys.getrellamar, [idcampana, idcampana]);
    }
}


//guardar las rondas 
module.exports.lnzaRondaCampana = async(event, campana, arrancar_llamadas, numeroRonda, supervisor) => {
    let retorno = {};
    var url = "http://" + pool2.host.toString() + "//BastiaanSoftwareCenter_Espartacus/php/repositorios/MonitorOutbound.php?accion=guardarRondasCampana&campanaId=" + campana + "&arrancarLlamadas=" + arrancar_llamadas + "&NumeroRonda=" + numeroRonda + "&usuario=" + supervisor;
    var request = require('request');
    request(url, await
        function(error, response, body) {
            let result = {};
            if (error) {
                retorno.valido = false;
                retorno.mensaje = "Error de conexión con el servidor";
                return retorno;
            } else {
                retorno.valido = true;
                retorno.mensaje = "Success";
                if (response.complete && response.statusCode == 200) {
                    result.result = true;
                    if (arrancar_llamadas === "NO") {
                        console.log("Ronda " + numeroRonda + " de la Campana " + campana + " detenida.");
                        result.status = false;
                    } else {
                        console.log("Ronda " + numeroRonda + " de la Campana " + campana + " lanzada.");
                        result.status = true;
                    }
                    const resp = JSON.parse(response.body);
                    if (resp.valor) {
                        setTimeout(function() {
                            event.reply('lanzaRondaCampanaResult', result);
                        }, 3000);
                    }
                }
                console.log(response.body);
            }
        });
}


//consultar agentes 
module.exports.consultarAgente = async(event, campana, arrancar_llamadas, numeroRonda) => {
    let retorno = {};
    var url = "http://" + pool2.host.toString() + "//BastiaanSoftwareCenter_Espartacus/php/repositorios/MonitorOutbound.php?accion=consultarAgentes&campanaId=" + campana + "&arrancarLlamadas=" + arrancar_llamadas + "&NumeroRonda=" + numeroRonda;
    var request = require('request');
    request(url, await
        function(error, response, body) {
            let resultado = false;
            if (error) {
                retorno.valido = false;
                retorno.mensaje = "Error de conexión con el servidor";
                resultado = false;
            } else {
                retorno.valido = true;
                retorno.mensaje = "Success";
                if (response.complete && response.statusCode == 200) {
                    console.log("Ronda " + numeroRonda + " " + arrancar_llamadas + " completada: ", response.complete, "Estatus de la peticion: ", response.statusCode);
                    resultado = true;
                } else {
                    console.log("Ronda no completada", response.complete, "  ", response.statusCode);
                    resultado = false;
                }
                console.log(response.body);
            }
        });
}


module.exports.getstatuscmp = async(campana) => {
    let result = {};
    const nocontactos = await pool.query(querys.getnocontactoscmp, [campana, campana]);
    const nocontactosasign = await pool.query(querys.getnocontactosasign, [campana, campana]);
    console.log("Numero de contactos de campana asignados a llamada: " + nocontactos[0].nocontactos + " Total de contactos de campana: " + nocontactosasign[0].nocontactos);
    result.cmp = campana;
    if (parseInt(nocontactos[0].nocontactos) == parseInt(nocontactosasign[0].nocontactos)) {
        result.statuscmp = true;
    } else {
        result.statuscmp = false;
    }
    return result.statuscmp;
}