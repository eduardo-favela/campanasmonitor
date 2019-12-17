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
    campanas.out = allCampanasOut;
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
    //Indicadores
module.exports.conIndicadores = async(campana, cola, ID, sts, stsres) => {
    const conIndicadores = await pool.query(querys.conIndicadores, [campana, cola, ID, sts, stsres, campana, sts, stsres]);
    const supervisorOut = await pool3.query(querys.consultarAgentesOut, [campana, sts, stsres, ]);
    const arr_indicadores = {};
    arr_indicadores.in = conIndicadores;
    arr_indicadores.out = supervisorOut;
    return arr_indicadores;
}

module.exports.getConsultarMetricas = async(cola) => {
    var status = "";
    const asteriskuser = "manager";
    const asteriskpswd = "manager"
    try {
        await pool2.query(querys.actualizarMetricas);
    } catch (Exception) {
        return status = "NO_OK";
    }
    var ami = new require('asterisk-manager')(5038, pool2.host.toString(), asteriskuser, asteriskpswd, true);
    ami.on('connect', function(evt) {});

    ami.on('response', async function(evt) {
        let ivr = 0;
        if (evt.output != undefined) {
            var canales = evt.output.slice();
            for (var i = 0; i < canales.length; i++) {
                if (canales[i].includes("ivr")) {
                    ivr = ivr + 1;
                }
            }
            ami.action({
                'Action': 'Logoff',
                'ActionID': '2',
            }, function(err, res) {
                if (err != undefined) {
                    console.log("Error al ejecutar la acción: ", err);
                }
            });
            try {
                await pool2.query(querys.ActualizarIvr, [ivr]);
            } catch (Exception) {
                console.log("Error try/catch: ", Exception);
                return status = "NO_OK";
            }
        }
    });
    ami.action({
        'Action': 'Command',
        'Command': 'core show channels concise',
        'ActionID': '1',
    }, function(err, res) {
        if (err != undefined) {
            console.log("Error al ejecutar la acción: ", err);
        }
    });
    var ami2 = new require('asterisk-manager')(5038, pool2.host.toString(), asteriskuser, asteriskpswd, true);
    ami2.on('connect', function(evt) {});

    ami2.on('response', async function(evt) {
        var enespera = 0;
        if (evt.output != undefined) {
            var colas = evt.output.slice();
            for (var i = 0; i < colas.length; i++) {
                if (colas[i].includes("strategy")) {
                    var linea = colas[i].split(" ");
                    result = linea[2];
                }
            }
            ami2.action({
                'Action': 'Logoff',
                'ActionID': '2',
            }, function(err, res) {
                if (err != undefined) {
                    console.log("Error al ejecutar la acción: ", err);
                }
            });
            try {
                await pool2.query(querys.ActualizarEspera, [enespera]);
            } catch (Exception) {
                console.log("Error try/catch: ", Exception);
                return status = "NO_OK";
            }
        }
    });
    ami2.action({
        'Action': 'Command',
        'Command': 'queue show ' + cola,
        'ActionID': '1',
    }, function(err, res) {
        if (err != undefined) {
            console.log("Error al ejecutar la acción: ", err);
        }
    });
    let resultado = [];
    try {
        resultado = await pool2.query(querys.getConsultarMetricas);
    } catch (Exception) {
        console.log("Error try/catch: ", Exception);
        return status = "NO_OK";
    }
    console.log("resultado ", resultado);
    return resultado[0];
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


module.exports.getAllColas = async(datos) => {
    const allColas = await pool.query(querys.getAllColas, []);
    var colas = {};
    return colas.colas = allColas;
}

module.exports.getAgenteVideo = async(usr, modulo) => {
    if (modulo == "I") {
        const agntVideo = await pool.query(querys.getAgenteVideo, [usr]);
        return agntVideo;
    } else {
        const agntVideo = await pool3.query(querys.getAgenteVideo, [usr]);
        return agntVideo;
    }
}

module.exports.configurarVideo = async(video, usr, ext, modulo) => {
    if (modulo == "I") {
        const agt = await pool.query(querys.getAgenteVideo, [usr])
        if (agt.length > 0) {
            if (video.ConfiguraGrabacion == "numLlamadas") {
                const agt = await pool.query(querys.configuracionNumLlamadas, [video.ConfiguraGrabacion, video.Valor, usr])
            } else if (video.ConfiguraGrabacion == "numDias") {
                const agt = await pool.query(querys.configuracionNumDias, [video.ConfiguraGrabacion, video.Valor, video.Valor, usr])
            } else if (video.ConfiguraGrabacion == "numTiempo") {
                const agt = await pool.query(querys.configuracionNumTiempo, [video.ConfiguraGrabacion, video.Valor, video.Valor, usr])
            } else if (video.ConfiguraGrabacion == "siempre" || video.ConfiguraGrabacion == "no") {
                const agt = await pool.query(querys.configuracionVideo, [video.ConfiguraGrabacion, usr])
            }
        } else {
            const agt = await pool.query(querys.newConfiguracion, [ext, '', video.ConfiguraGrabacion, video.Valor, usr])
        }
    } else {
        const agt = await pool3.query(querys.getAgenteVideo, [usr])
        if (agt.length > 0) {
            if (video.ConfiguraGrabacion == "numLlamadas") {
                const agt = await pool3.query(querys.configuracionNumLlamadas, [video.ConfiguraGrabacion, video.Valor, usr])
            } else if (video.ConfiguraGrabacion == "numDias") {
                const agt = await pool3.query(querys.configuracionNumDias, [video.ConfiguraGrabacion, video.Valor, video.Valor, usr])
            } else if (video.ConfiguraGrabacion == "numTiempo") {
                const agt = await pool3.query(querys.configuracionNumTiempo, [video.ConfiguraGrabacion, video.Valor, video.Valor, usr])
            } else if (video.ConfiguraGrabacion == "siempre" || video.ConfiguraGrabacion == "no") {
                const agt = await pool3.query(querys.configuracionVideo, [video.ConfiguraGrabacion, usr])
            }
        } else {
            const agt = await pool3.query(querys.newConfiguracion, [ext, '', video.ConfiguraGrabacion, video.Valor, usr])
        }
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

//Recesos
module.exports.getConsultaReceso = async(agnt, valor, modulo) => {
    retorno = {}
    if (modulo == "I") {
        const receso = await pool.query(querys.agenteReceso, [agnt]);
        //validacion de si el usuario solicitó un receso
        if (receso.length > 0) {
            //valida el valor pasado por el boton en inicio.html
            if (valor == 1) {
                //autoriza el receso
                const autReceso = await pool.query(querys.autorizaReceso, [agnt]);
                retorno.valido = true;
                retorno.mensaje = "Receso Autorizado"
            } else {
                //rechaza el receso
                const rechReceso = await pool.query(querys.rechazarReceso, [agnt]);
                retorno.valido = true;
                retorno.mensaje = "Receso Rechazado"
            }
        } else {
            retorno.valido = false;
            retorno.mensaje = "Agente no solicitó receso"
        }
        return retorno;
    } else {
        const receso = await pool3.query(querys.agenteReceso, [agnt]);
        //validacion de si el usuario solicitó un receso
        if (receso.length > 0) {
            //valida el valor pasado por el boton en inicio.html
            if (valor == 1) {
                //autoriza el receso
                const autReceso = await pool3.query(querys.autorizaReceso, [agnt]);
                retorno.valido = true;
                retorno.mensaje = "Receso Autorizado"
            } else {
                //rechaza el receso
                const rechReceso = await pool3.query(querys.rechazarReceso, [agnt]);
                retorno.valido = true;
                retorno.mensaje = "Receso Rechazado"
            }
        } else {
            retorno.valido = false;
            retorno.mensaje = "Agente no solicitó receso"
        }
        return retorno;
    }

}

//Acciones Llamadas
module.exports.accionesLlamadas = async(extAgnt, extEscucha, valor) => {
    const retorno = {};
    if (valor == 1) {
        //escucha llamada
        var url = "http://31.220.63.112/BastiaanSoftwareCenter_Espartacus/php/repositorios/Asterisk_cli.php?&accion=crearArchivo&extesionEscucha=" + extEscucha + "&extesionAgente=" + extAgnt + "&contexto=app-chanspy";
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
    } else {
        //interviene llamada
        var url = "http://31.220.63.112/BastiaanSoftwareCenter_Espartacus/php/repositorios/Asterisk_cli.php?&accion=crearArchivo&extesionEscucha=" + extEscucha + "&extesionAgente=" + extAgnt + "&contexto=app-inteview";
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
    }
    return retorno;
}

//indicadores outbound
module.exports.getindicadoresOut = async(campanas) => {
    const indicadores = {};
    const universo = await pool3.query(querys.universo, [campanas]);
    const realizadas = await pool4.query(querys.realizadas, [campanas]);
    const exitosas = await pool3.query(querys.exitosas, [campanas]);
    const noExitosas = await pool3.query(querys.noExitosas, [campanas]);
    const rellamar = await pool3.query(querys.rellamar, [campanas]);
    console.log(campanas)
    indicadores.universo = universo;
    indicadores.realizadas = realizadas;
    indicadores.exitosas = exitosas;
    indicadores.noExitosas = noExitosas;
    indicadores.rellamar = rellamar;
    return indicadores;
}

//guardar las rondas 
module.exports.lnzaRondaCampana = async(campana, arrancar_llamadas, numeroRonda, supervisor) => {
    const retorno = {};
    var url = "http://93.188.164.92//BastiaanSoftwareCenter_Espartacus/php/repositorios/MonitorOutbound.php?accion=guardarRondasCampana&campanaId=" + campana + "&arrancarLlamadas=" + arrancar_llamadas + "&NumeroRonda=" + numeroRonda + "&usuario=" + supervisor;
    console.log(url)
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
    console.log(retorno);
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