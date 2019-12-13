const { ipcMain } = require('electron');

const helper = require('../helpers/inicio');

//Informacion del Agente
ipcMain.on('getConsultarAgentes', async(event, campana, cola, ID, sts, stsres) => {
    if (cola == '0') {
        cola = '';
    }
    if (sts == "ALL") {
        sts = '';
    }
    if (sts == "LLAMADA") {
        sts = 'EN LLAMADA';
    }
    if (stsres == "ALL") {
        stsres = '';
    }
    if (campana == '') {
        campana = '';
    }
    const consultarAgentes = await helper.consultarAgentes(campana, cola, ID, sts, stsres);
    event.reply('getConsultarAgentesResult', consultarAgentes);
});

ipcMain.on('getAllCampanas', async(event, dato) => {
    const allCampanas = await helper.getAllCampanas();
    event.reply("getAllCampanasResult", allCampanas);
});


ipcMain.on('consultarSupervisores', async(event, usuarioid) => {
    const supervisores = await helper.consultarSupervisores(usuarioid);
    event.reply("consultarSupervisoresResult", supervisores);

});
ipcMain.on('getAllEstatus', async(event, dato) => {
    const allEstatus = await helper.getAllEstatus();
    event.reply("getAllEstatusResult", allEstatus);
});

ipcMain.on('getAllColas', async(event, dato) => {
    const allColas = await helper.getAllColas();
    event.reply("getAllColasResult", allColas);
});

ipcMain.on('getAllSupervisores', async(event, dato) => {
    const allSupervisores = await helper.getAllSupervisores(dato);
    event.reply("getAllSupervisoresResult", allSupervisores);

});
//Indicadores
ipcMain.on('conIndicadores', async(event, campana, cola, ID, sts, stsres) => {
    if (cola == '0') {
        cola = '';
    }
    if (sts == "ALL") {
        sts = '';
    }
    if (sts == "LLAMADA") {
        sts = 'EN LLAMADA';
    }
    if (stsres == "ALL") {
        stsres = '';
    }
    if (campana == '') {
        campana = '';
    }
    const conIndicadores = await helper.conIndicadores(campana, cola, ID, sts, stsres);
    event.reply('conIndicadoresResult', conIndicadores);
});

ipcMain.on('getConsultarMetricas', async(event, cola) => {
    if (cola == '0') {
        cola = '';
    }
    const getConsultarMetricas = await helper.getConsultarMetricas(cola);
    event.reply('getConsultarMetricasResult', getConsultarMetricas);
});

//recesos
ipcMain.on('getConsultarReceso', async(event, agnt, valor, modulo) => {
    const receso = await helper.getConsultaReceso(agnt, valor, modulo);
    event.reply('getConsultarRecesoResult', receso)
});
//cerrar sesion agente
ipcMain.on('cerrarSesionAgt', async(event, agnt, modulo) => {
    const cerrarAgt = await helper.cerrarSesionAgt(agnt,modulo);
    event.reply('cerrarSesionAgtResult', cerrarAgt)
});

//Acciones del supervisor con las llamadas
ipcMain.on('accionesLlamadas', async(event, extAgnt, extEscucha, valor) => {
    const acciones = await helper.accionesLlamadas(extAgnt, extEscucha, valor)
        //event.reply('accionesLlamadasResult', acciones)
});

//consulta de agente en bstnstatusllamada tabla donde se guarda la configuracion
ipcMain.on('getAgenteVideo', async(event, usr, modulo) => {
    const usrVideo = await helper.getAgenteVideo(usr, modulo)
    event.reply('getAgenteVideoResult', usrVideo)
})

//configurar video
ipcMain.on('configurarVideo', async(event, video, usr, ext, modulo) => {
    const Cvideo = await helper.configurarVideo(video, usr, ext, modulo)
});

//indicadores
ipcMain.on('getindicadoresOut', async(event, campana) => {
    if (campana == '') {
        campana = '';
    }
    const indicadores = await helper.getindicadoresOut(campana)
    event.reply('getindicadoresOutResult', indicadores)
});

// guarda las rondas de llamadas
ipcMain.on('lnzaRondaCampana', async(event, campana, arrancar_llamadas, numeroRonda, supervisor) => {
    console.log("ipc ronda");
    const indicadores = await helper.lnzaRondaCampana(campana, arrancar_llamadas, numeroRonda, supervisor)
    //event.reply('getindicadoresOutResult', indicadores)
});

//lanza las rondas de llamadas
ipcMain.on('consultarAgente', async(event, campana, arrancar_llamadas, numeroRonda) => {
    const consultarAgnt = await helper.consultarAgente(campana, arrancar_llamadas, numeroRonda)
});