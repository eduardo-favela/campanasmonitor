const { ipcMain } = require('electron');

const helper = require('../helpers/inicio');

//Informacion del Agente
ipcMain.on('getConsultarAgentes', async(event, campana, ID, sts, stsres) => {
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
    const consultarAgentes = await helper.consultarAgentes(campana, ID, sts, stsres);
    event.reply('getConsultarAgentesResult', consultarAgentes);
});

ipcMain.on('getAllCampanas', async(event, spv) => {
    let allCampanas = await helper.getAllCampanas(spv);
    for (let b = 0; b < allCampanas.length; b++) {
        if (allCampanas[b].fechahoraultprim !== '' && allCampanas[b].fechahoraultprimdet === '') {
            allCampanas[b].ronda = "01";
            allCampanas[b].duracion = await helper.getduracioncampana(allCampanas[b].ID, 'btfechahoraprimronda');
            allCampanas[b].status = await helper.getstatuscmp(allCampanas[b].ID);
            /* allCampanas[b].UNI = await helper.getuniverso(allCampanas[b].ID,allCampanas[b].canal); */
        } else if (allCampanas[b].fechahoraultseg !== '' && allCampanas[b].fechahoraultsegdet === '') {
            allCampanas[b].ronda = "02";
            allCampanas[b].duracion = await helper.getduracioncampana(allCampanas[b].ID, 'btfechahorasegronda');
            allCampanas[b].status = await helper.getstatuscmp(allCampanas[b].ID);
            /* allCampanas[b].UNI = await helper.getuniverso(allCampanas[b].ID,allCampanas[b].canal); */
        } else if (allCampanas[b].fechahoraultter !== '' && allCampanas[b].fechahoraultterdet === '') {
            allCampanas[b].ronda = "03";
            allCampanas[b].duracion = await helper.getduracioncampana(allCampanas[b].ID, 'btfechahoraterronda');
            allCampanas[b].status = await helper.getstatuscmp(allCampanas[b].ID);
            /* allCampanas[b].UNI = await helper.getuniverso(allCampanas[b].ID,allCampanas[b].canal); */
        } else {
            allCampanas[b].ronda = "00";
            allCampanas[b].duracion = "00";
            allCampanas[b].status = false;
        }
        allCampanas[b].UNI = await helper.getuniverso(allCampanas[b].ID, allCampanas[b].canal);
    }
    event.reply("getAllCampanasResult", allCampanas);
});

// guarda las rondas de llamadas
ipcMain.on('lnzaRondaCampana', async(event, campana, arrancar_llamadas, numeroRonda, supervisor, canal) => {
    if (arrancar_llamadas === "SI_NO") {
        let ronda = "0" + (parseInt(numeroRonda) + 1).toString();
        /* let ronda = "";
        if (canal === "CALL" || canal === "WCAL") {
            ronda = "01";
        } else {
            ronda = "0" + (parseInt(numeroRonda) + 1).toString();
        } */
        await helper.lnzaRondaCampana(event, campana, "NO", numeroRonda, supervisor);
        await helper.lnzaRondaCampana(event, campana, "SI", ronda, supervisor);
    } else {
        await helper.lnzaRondaCampana(event, campana, arrancar_llamadas, numeroRonda, supervisor);
    }

});

//lanza las rondas de llamadas
ipcMain.on('consultarAgente', async(event, campana, arrancar_llamadas, numeroRonda, consrellamar, canal) => {

    if (consrellamar === "SI") {
        await helper.reLlamar(campana, canal);
    }
    if (arrancar_llamadas === "SI_NO") {
        let ronda = "0" + (parseInt(numeroRonda) + 1).toString();
        /* let ronda = "";
        if (canal === "CALL" || canal === "WCAL") {
            ronda = "01";
        } else {
            ronda = "0" + (parseInt(numeroRonda) + 1).toString();
        } */
        await helper.consultarAgente(event, campana, "NO", numeroRonda);
        await helper.reLlamar(campana, canal);
        await helper.consultarAgente(event, campana, "SI", ronda);
    } else {
        await helper.consultarAgente(event, campana, arrancar_llamadas, numeroRonda);
    }
});

ipcMain.on('updatecontcallback', async(event) => {
    await helper.getcmpcallback();
});