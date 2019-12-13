const { ipcMain} = require('electron');

const helper = require('../helpers/login');

ipcMain.on('validarUsuario', async(event, usuarioid) => {
  await helper.validarUsuario(usuarioid, event); 
});

ipcMain.on('consultarNombre', async(event, usuarioid) => {
  const usuario = await helper.consultarNombre(usuarioid); 
  event.reply("consultarNombreResult", usuario[0]);
});

ipcMain.on('consultarPorId', async(event, usuarioid) => {
  const usuarioda = await helper.consultarPorId(usuarioid); 
  event.reply("consultarPorIdResult", usuarioda);
});