const { ipcMain} = require('electron');

const helper = require('../helpers/modulos');

ipcMain.on('getUsuarioModulos', async(event, usuarioid) => {
  const areasUsuario = await helper.getUsuario(usuarioid); 
  event.reply("getUsuarioModulosResult", areasUsuario);
});

ipcMain.on('getModulosArea', async(event, datos) => {
    const modulosArea = await helper.getModulosArea(datos); 
    event.reply("getModulosAreaResult", modulosArea);
});
  

ipcMain.on('getArbol', async(event, datos) => {
  const arbol = await helper.getArbol(datos); 
  event.reply("getArbolResult", arbol);
});
