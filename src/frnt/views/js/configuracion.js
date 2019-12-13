const { ipcRenderer } = require('electron');

const $ = require('jquery');


function login()
{
    if($('#inputContrasenaConf').val()=="TeamPaco")
    {
        $('#loginConf').hide();
        $('#conf').show();  
        leerConfi();       
    }
}

function guardar()
{
    $('#inputIp').val()
    $('#inputUsuario').val()
    $('#inputContrasena').val()
    $('#inputDataBase').val()

    var confi={};
    confi.ip=  $('#inputIp').val();
    confi.usuario=  $('#inputUsuario').val();
    confi.contrasena=  $('#inputContrasena').val();
    confi.baseDatos=  $('#inputDataBase').val();

    ipcRenderer.send('guardarConfig', confi)
    
}


function leerConfi()
{
    ipcRenderer.send('leerConfi', "")
}

ipcRenderer.on('leerConfiResult', (event, confi) => 
{
    $('#inputIp').val(confi.ip) ;
    $('#inputUsuario').val(confi.usuario)
    $('#inputContrasena').val(confi.contrasena)
    $('#inputDataBase').val(confi.baseDatos)
})