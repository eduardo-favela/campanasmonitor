//eventos de Squirrel en windows
const setupEvents = require('./../installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}
const { app, Menu, ipcMain, BrowserWindow, BrowserView } = require('electron')

const fs = require('fs');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('bsw2019');

try {
    let archivo = fs.readFileSync('cnn2020.json');
} catch (err) {
    if (err.code === 'ENOENT') {
        require('./enc/cambiarcnn');
        console.log('file or directory does not exist');
    }
}


// variables de sistema en la aplicacion, como: usuario logueado y datos de agente
let usuario;
var datosAgente;
//  variables de ventana
let pantallaConfig;
let login;
let modulos;
let conexiones = [];
let urls = [];

//oculta los errores de uncaughtException
process.on("uncaughtException", (err) => {
    console.log(err);
});

app.on('ready', leerConexiones)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (login === null) {
        leerConexiones();
    }
})

//abre la ventana de login
function ventanaLogin() {

    Menu.setApplicationMenu(null);
    login = new BrowserWindow({
            width: 800,
            height: 600,
            icon: __dirname + "/icons/favi.png",
            transparent: true,
            webPreferences: {
                nodeIntegration: true
            },
            show: false,
            frame: false
        })
        /* login.webContents.openDevTools() */
    login.loadFile('src/frnt/views/login.html')
    login.on('closed', () => { login = null })
    login.once('ready-to-show', () => { login.show() })

}

//abre la pantalla de configuracion
function abrirPantallaConfig() {

    Menu.setApplicationMenu(null);
    pantallaConfig = new BrowserWindow({
        width: 600,
        height: 400,
        icon: __dirname + "/icons/favi.png",
        transparent: true,
        webPreferences: {
            nodeIntegration: true
        },
        show: false
    })
    pantallaConfig.loadFile('src/frnt/views/conexiones.html')
    pantallaConfig.on('closed', () => { pantallaConfig = null })
    pantallaConfig.once('ready-to-show', () => { pantallaConfig.show() })
        /* pantallaConfig.webContents.openDevTools() */
}

//abre la pantalla principal del usuario
function ventanaMain() {

    Menu.setApplicationMenu(null);
    modulos = new BrowserWindow({
            width: 1200,
            height: 1000,
            icon: __dirname + "/icons/favi.png",
            webPreferences: {
                nodeIntegration: true,
                nodeIntegrationInWorker: false,
                webviewTag: true
            },
            show: false
        })
        //modulos.webContents.openDevTools()
    modulos.loadFile('src/frnt/views/inicio.html')
    modulos.on('closed', () => { modulos = null })
    modulos.once('ready-to-show', () => {
        modulos.show();
        login.close();
        modulos.maximize();
    })

}

function modificarConf(conf) {
    const editJsonFile = require("edit-json-file");
    let file = editJsonFile(`${__dirname}/bk/cnn/conexion.json`);
    file.set("ip", conf.ip);
    file.set("usuario", conf.usuario);
    file.set("contrasena", conf.contrasena);
    file.set("baseDatos", conf.baseDatos);
    file.set("elegida", "");
    file.save();
}

/*
metodos para la configuracion dela conexion
*/
ipcMain.on('guardarConfig', async(event, conf) => {
    await modificarConf(conf);
});

ipcMain.on('leerConfi', async(event, arg) => {

    event.reply('leerConfiResult', conexiones)

});

//metodo que escucha cuando una ventana pide el usuario logeado

ipcMain.on('getUsuario', async(event, arg) => {
    var dato = {};
    dato.usuario = usuario;
    event.reply('getUsuarioResult', dato);
});

//metodo que recarga la aplicacion despues de cerrar sesion
ipcMain.on('cerrarSesion_', async(event, arg) => {
    app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
    app.exit(0)
});

//actualizacion al terminar receso, permite recargar solo la ventana de modulos
ipcMain.on('recargarPantalla', async(event, arg) => {
    datosAgente.estatusRec = "DIS";
    modulos.reload();
});

//abre pantalla de configuracion
ipcMain.on('abrirPantallaConf', async(event, arg) => {
    await abrirPantallaConfig();
});

//guarda o actualiza el usuario logueado
ipcMain.on('setUsuario', async(event, dato) => {
    usuario = dato;

    console.log(dato)
    await ventanaMain();
});

//cierra la ventana de login al dar clic en la parte de cancelar
ipcMain.on('cerrarVentana', async(event, arg) => {
    login.close();
});

//Cierra la pantalla de configuración de conexiones
ipcMain.on('cerrarVentana2', async(event, arg) => {
    pantallaConfig.close();
});

ipcMain.on('geturls', async(event) => {
    event.reply('geturlsresult', urls)
});

//////////////////////////////////////////////////////////////*Parte para seleccionar la conexión*//////////////////////////////////////////////////////////////
ipcMain.on('seleccionarConexion', async(event, id) => {

    conexiones.forEach(conexion => {

        if (conexion.id == id) {
            conexion.select = true;
        } else {
            conexion.select = false;
        }

    });
    var conf = { conexiones }
    const conexiones_ = cryptr.encrypt(JSON.stringify(conf));
    let cnn = { conexiones: conexiones_ };
    let data = JSON.stringify(cnn);
    fs.writeFileSync('cnn2020.json', data);
    event.reply("seleccionarConexionResult", "")

});


async function leerConexiones() {

    try {

        let cnn2020 = fs.readFileSync('cnn2020.json');
        let conf = JSON.parse(cnn2020);
        const decryptedString = cryptr.decrypt(conf.conexiones);
        var configuraciones = JSON.parse(decryptedString);
        conexiones = configuraciones.conexiones;

        if (configuraciones.conexiones.length == 1) {
            //Abrir login
            urls = configuraciones.conexiones[0].urls;
            console.log(configuraciones.conexiones);
            requerirIpc()
            ventanaLogin()
        } else {
            //abrir pantalla de conf
            var selected = await conexiones.filter(conexion => conexion.select);
            if (selected.length == 0) {
                abrirPantallaConfig()
            } else {
                urls = selected[0].urls;
                requerirIpc()
                ventanaLogin()
            }

        }

    } catch (err) {
        if (err.code === 'ENOENT') {


            const options = {
                type: 'info',
                buttons: ['Ok'],
                title: 'Falta configuraciones',
                message: 'No existen conexiones configuradas',
            };
            dialog.showMessageBoxSync(null, options);
            app.quit()

        }
    }
}



function requerirIpc() {
    require('./bk/ipc/login');
    require('./bk/ipc/modulos');
    require('./bk/ipc/usuario');
    require('./bk/ipc/inicio');
}