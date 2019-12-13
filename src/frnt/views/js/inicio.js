const { ipcRenderer } = require('electron');
const $ = require('jquery');
require('popper.js');
require('bootstrap');
require('datatables.net-dt')();
require('datatables.net-responsive-dt')();

//variables
var nodos = [];
var nodosRaiz = [];
var usuarioOk = {};
var time = 5000;
var procesoID;
var supervisor_firm;
var supervisor_firma;
var arrancar_llamadas = "NO";
var numeroRonda = "01";
var segundos = 0;
var minutos = 0;
var horas = 0;
var centesimas = 0;
var bandera = 0;
var cronoval = 0;
var seleccionado_firstd;
var cronometroi;
//var reg_selec = [];

ipcRenderer.send('conexion', '')
ipcRenderer.send('getUsuario', '')
ipcRenderer.send('getAllCampanas', '')
    //ipcRenderer.send('getConsultarAgentes','')
    //ipcRenderer.send('getAllCampanas','')
    /* ipcRenderer.send('getAllEstatus', '')
    ipcRenderer.send('getAllColas', '') */

ipcRenderer.on('errorconexion', (event, data) => {
    alert("error ", data);
})

function onLoad() {
    window.onbeforeunload = function(e) {
        var e = e || window.event;
        if (e) {
            if (arrancarLlamadas == "SI") {
                if (NumeroRonda == "01") {
                    lnzRonda_1();
                } else if (NumeroRonda == "02") {
                    lnzRonda_2();
                } else if (NumeroRonda == "03") {
                    lnzRonda_3();
                }
                return 'Debes detener la campaña antes de salir!';
            }
        }
    }
}

//cacha los resultados de la consulta de usuario e imprime su informacion en pantalla
ipcRenderer.on('getUsuarioResult', (event, datos) => {
    supervisor_firma = datos.usuario.usuarioid;
    //mandar idusuario a consultar supervisores
    ipcRenderer.send('consultarSupervisores', datos.usuario.usuarioid)
    $("#usuario").html(datos.usuario.usuarioid);
    ipcRenderer.send('getUsuarioModulos', datos.usuario.usuarioid)

})

//consultar supervisores
ipcRenderer.on('consultarSupervisoresResult', (event, datos) => {
    console.log(datos);
    supervisor_firm = datos[0].ID;
    if (datos.length > 0) {
        var loop = setInterval(local, time);

        function local() {
            /* ipcRenderer.send('getConsultarAgentes', '', '', datos[0].ID, '', '')
            ipcRenderer.send('getConsultarMetricas', $('#colasComboid').val())
            ipcRenderer.send('conIndicadores', '', '', datos[0].ID, '', '')
            ipcRenderer.send('getindicadoresOut', '') */
        }
        $('#btnConsultas').on('click', function() {
                clearInterval(loop);
            })
            //ipcRenderer.send('agDisponibles_',datos[0].ID)
        $("#supervisorComboid").append("<option value='" + datos[0].ID + "'>" + datos[0].DSC + "</option>")
    } else {
        $("#supervisorComboid").append("<option value='NO APLICA'>NO APLICA</option>")

    }
})

//consultar agentes

ipcRenderer.on('getConsultarAgentesResult', (event, datos) => {
    console.log(datos.in, datos.out);
    let enLlamada = 0;
    let lMayor = 0;
    let enLlamadaO = 0;
    let lMayorO = 0;
    var arr_datos = []

    for (let a = 0; a < datos.in.length; a++) {
        arr_datos.push(datos.in[a])

    }
    for (let b = 0; b < datos.out.length; b++) {
        arr_datos.push(datos.out[b])
    }

    for (var i = 0; i < datos.in.length; i++) {
        if (datos.in[i].segundos > 270) {
            lMayor = lMayor + 1;
        }
        //sacamos informacion para pintar en los indicadores
        if (datos.in[i].sts === "EN LLAMADA") {
            enLlamada = enLlamada + 1;
        }
    }

    for (var i = 0; i < datos.out.length; i++) {
        if (datos.out[i].segundos > 270) {
            lMayorO = lMayorO + 1;
        }
        //sacamos informacion para pintar en los indicadores
        if (datos.out[i].sts === "EN LLAMADA") {
            enLlamadaO = enLlamadaO + 1;
        }

    }

    $("#lenAtencion").text(enLlamada)
    $("#lMayor").text(lMayor)
    console.log(arr_datos.sort(arr_datos.ext))
    llenarGrid(arr_datos);
});

//Indicadores de llamada
ipcRenderer.on('getConsultarMetricasResult', async(event, datos) => {

    if (datos == "NO_OK") {
        mostrarMensaje("", "Ocurrió un error de conexión");
    } else {
        if (datos.contestadas == null || datos.contestadas == "null") {
            $("#lbenivr").text("0");
            $("#lbenEspera").text("0");
            $("#lblrecibidas").text("0");
            $("#lbllContestadas").text("0");
            $("#lbllAbandonadas").text("0");
        } else {
            $("#lbenivr").text(datos.enivr.toString());
            $("#lbenEspera").text(datos.enespera);
            $("#lblrecibidas").text(parseInt(datos.abandonadas) + parseInt(datos.contestadas));
            if (datos.contestadas == "0") {
                var poratendidas = "0%"
            } else {
                var poratendidas = ((parseInt(datos.contestadas) / (parseInt(datos.abandonadas) + parseInt(datos.contestadas))) * 100).toFixed(1) + "%";
            }
            if (datos.abandonadas == "0") {
                var porabandono = "0%"
            } else {
                var porabandono = ((parseInt(datos.abandonadas) / (parseInt(datos.abandonadas) + parseInt(datos.contestadas))) * 100).toFixed(1) + "%";
            }
            $("#lbllContestadas").text(datos.contestadas + " - " + poratendidas);
            $("#lbllAbandonadas").text(datos.abandonadas + " - " + porabandono);
        }
    }
});

//Indicadores
ipcRenderer.on('conIndicadoresResult', async(event, datos) => {
    var operacion = 0;
    var activos = 0;
    var disponibles = 0;
    var solA = 0;
    var sol = 0;
    var res = 0;
    if (datos.in[0].Disponible == null || datos.in[0].Disponible == "null") {
        operacion = 0; // datos.in[0].Operacion
        activos = 0; // datos.in[0].llamada
        disponibles = 0; // datos.in[0].Disponible
        solA = 0; // datos.in[0].solAut
        sol = 0; // datos.in[0].Sol
        res = 0; // datos.in[0].Res
    } else {
        operacion = datos.in[0].Operacion
        activos = datos.in[0].llamada
        disponibles = datos.in[0].Disponible
        solA = datos.in[0].solAut
        sol = datos.in[0].Sol
        res = datos.in[0].Res
    }

    for (let a = 0; a < datos.out.length; a++) {
        if (datos.out[a].sts == "DISPONIBLE") {
            disponibles++;
        } else if (datos.out[a].sts == "EN LLAMADA") {
            activos++;
        } else if (datos.out[a].stsrec == "RES") {
            res++;
        } else if (datos.out[a].stsrec == "SOL") {
            sol++;
        } else if (datos.out[a].stsrec == "SOLAUT") {
            solA++;
        }
    }

    operacion = parseInt(activos) + parseInt(disponibles)

    $("#agOperacion").text(operacion)
    $("#agLlamada").text(activos)
    $("#agDisponibles").text(disponibles)
    $("#solAut").text(solA)
    $("#Sol").text(sol)
    $("#Res").text(res)
});

//Indicadores outbound
ipcRenderer.on('getindicadoresOutResult', async(event, datos) => {
    console.log(datos.universo[0].universo);
    if (datos.universo[0].universo == null || datos.universo[0].universo == "null") {
        $("#lbeluni").text("0")
        $("#lbelreal").text("0")
        $("#lbelsucces").text("0")
        $("#lbelnoexi").text("0")
        $("#lbelrellamar").text("0")
    } else {
        $("#lbeluni").text(datos.universo[0].universo)
        $("#lbelreal").text(datos.realizadas[0].realizadas)
        $("#lbelsucces").text(datos.exitosas[0].exitosas)
        $("#lbelnoexi").text(datos.noExitosas[0].noExitosas)
        $("#lbelrellamar").text(datos.rellamar[0].rellamar)
    }
});



//llena el select #comboPerfil con los perfiles que le corresponden al usuario
ipcRenderer.on('getUsuarioModulosResult', (event, datos) => {
    $("#comboPerfil").html("");
    usuarioOk = datos;
    $("#usuario").html(datos.CNUSERID + " - " + datos.CNUSERDSC);
    datos.AREAS.forEach(area => {
        $("#comboPerfil").append("<option value='" + area.RPFARESID + "-" + area.RPFLINEA + "'>" + area.RPFARESIDC + "</option>")
    });
    var area = {}
    area.RPFARESID = datos.AREAS[0].RPFARESID;
    area.RPFLINEA = datos.AREAS[0].RPFLINEA;
    ipcRenderer.send('getModulosArea', area)
})

//llena el select #comboModulos con los modulos que le corresponden al usuario
ipcRenderer.on('getModulosAreaResult', (event, datos) => {
    $("#comboModulos").html("");
    datos.forEach(modulo => {
        $("#comboModulos").append("<option value='" + modulo.CNESMNID + "-" + modulo.RPFLINEA + "'>" + modulo.CNESMNDSC + "</option>")
    });
    var objModulo = { CNESMNID: datos[0].CNESMNID, RPFLINEA: datos[0].RPFLINEA };
    ipcRenderer.send('getArbol', objModulo)
})

//recibe el valor del #comboModulos y lo envia al ipc/Modulos
function cambioModulo() {
    var modulo = $("#comboModulos").val().split("-");
    var objModulo = { CNESMNID: modulo[0], RPFLINEA: modulo[1] };
    ipcRenderer.send('getArbol', objModulo)
}

//
ipcRenderer.on('getArbolResult', async(event, datos) => {
    nodos = datos;
    await normalizaNodos(datos);
    await generanodosRaiz();
    await dibujarBtnsCont()
})

//llena combo de campañas
ipcRenderer.on('getAllCampanasResult', async(event, datos) => {
    console.log(datos);
    var i = 0;
    $("#allcampanas").html("");

    datos.in.forEach(function(modulo, index) {
        $("#allcampanas").append('<li class="list-group-item d-flex col-12 justify-content-between" id="IndicadoresCol">' +
            '<div class="float-left" style="text-align: initial; color:#fff;">' + modulo.DSC + '</div>' +
            '<button class="btn" id="playcampana" onclick="lnzRonda(' + modulo.ID + ')" style="height: fit-content; width: fit-content;">' +
            '<i id="play' + index + '" class="icon-play3" style="color: #269EE3; font-size: 15px;"></i></button></li>');
    });

    datos.out.forEach(function(modulo, index) {
        $("#allcampanas").append('<li class="list-group-item d-flex col-12 justify-content-between" id="IndicadoresCol">' +
            '<div class="float-left" style="text-align: initial; color:#fff;">' + modulo.DSC + '</div>' +
            '<button class="btn" id="playcampana" onclick="lnzRonda(' + modulo.ID + ')" style="height: fit-content; width: fit-content;">' +
            '<i id="play' + index + '" class="icon-play3" style="color: #269EE3; font-size: 15px;"></i></button></li>');
    });
    /* $("#campanaComboid").html("");
    datos.in.forEach(modulo => {
        $("#campanaComboid").append("<option value='" + modulo.ID + "'>" + modulo.DSC + "</option>")
    });
    datos.out.forEach(modulo => {
        $("#campanaComboid").append("<option value='" + modulo.ID + "'>" + modulo.DSC + "</option>")
    }); */
});

//llena combo de estatus
ipcRenderer.on('getAllEstatusResult', async(event, datos) => {
    $("#estatusComboid").html("");
    console.log(datos.agente);
    datos.agente.forEach(modulo => {
        $("#estatusComboid").append("<option value='" + modulo.ID + "'>" + modulo.DSC + "</option>")
        console.log(modulo.ID)
    });
    datos.receso.forEach(modulo => {
        $("#estatusResComboid").append("<option value='" + modulo.ID + "'>" + modulo.DSC + "</option>")
        console.log(modulo.ID)
    });
});

//recibe el id del usuario y lo manda al ipc
//ipcRenderer.on('getIdUsuarioResult', (event, datos) => {
//   ipcRenderer.send('getAllSupervisores', datos.usuario.usuarioid) 
//})


//llena combo supervisores
//ipcRenderer.on('getAllSupervisoresResult', async(event, datos) => {
//  $("#supervisorComboid").html("");
//datos.forEach(modulo => {
//  $("#supervisorComboid").append("<option value='"+modulo.ID+"'>"+modulo.DSC+"</option>")
//});
//});

//llena combo colas de espera
ipcRenderer.on('getAllColasResult', async(event, datos) => {
    $("#colasComboid").html("");
    datos.forEach(modulo => {
        $("#colasComboid").append("<option value='" + modulo.ID + "'>" + modulo.DSC + "</option>")
    });
    $("#skillComboid").append("<option value='0'>Todos</option>")
});

//recibe el valor del #comboModulos y lo envia al ipc/Modulos
function cambioPerfil() {

    var perfil = $("#comboPerfil").val().split("-");
    var objPerfil = { RPFARESID: perfil[0], RPFLINEA: perfil[1] };
    ipcRenderer.send('getModulosArea', objPerfil)
}

function normalizaNodos(nodos) {
    nodos.splice(0, 1);
    for (var i = 0; i < nodos.length; i++) {
        nodos[i].RPFLINEA = i;
        nodos[i].RPFARESID = 0;
        nodos[i].RPFARES1ID = i;
        nodos[i].RPFTPES1PADREID = getPadreNormalizado(nodos[i], nodos).RPFARES1ID;
    }
}

function getPadreNormalizado(nodo) {
    if (nodo.CNESMN03 == "") {
        var nodoTemp = new Object();
        nodoTemp.RPFLINEA = -1;
        nodoTemp.RPFARESID = 0;
        nodoTemp.RPFARES1ID = -1;
        nodoTemp.RPFTPES1PADREID = -1;
        return nodoTemp;
    }
    var j = 1;
    while (nodo["CNESMN" + rellenaCeros(j, 2)] != "") {
        j++
    }
    for (var i = 0; i < nodos.length; i++) {
        var es = true;
        for (var k = 1; k < j - 1; k++) {
            var cnesk = "CNESMN" + rellenaCeros(k, 2);
            if (nodos[i][cnesk] != nodo[cnesk]) {
                es = false;
                break;
            }
        }
        var cnesk = "CNESMN" + rellenaCeros(j - 1, 2);
        if (nodos[i][cnesk] != "") {
            es = false;
        }
        if (es == true) {
            return nodos[i];
        }
    }
}

function generanodosRaiz() {
    nodosRaiz = [];
    for (var nodo in nodos) {
        var esRaiz = true;
        for (var nodoPrueba in nodos) {
            if (nodos[nodoPrueba].RPFARES1ID == nodos[nodo].RPFTPES1PADREID &&
                nodos[nodoPrueba].RPFARESID == nodos[nodo].RPFARESID) {
                esRaiz = false;
            }
        }
        if (esRaiz == true && tieneHijos(nodos[nodo]) == true) {
            nodosRaiz.push(nodos[nodo]);
        }
    }
}

function tieneHijos(nodoPadre) {
    for (var nodo in nodos) {
        if (nodoPadre.RPFARES1ID == nodos[nodo].RPFTPES1PADREID && nodoPadre.RPFARESID == nodos[nodo].RPFARESID) {
            if (nodos[nodo].CNESMNRUDS != "" || nodos[nodo].CNESMNRUTA != "") {
                return true;
            }
        }
    }
    return false;
}

function rellenaCeros(valor, noCeros) {
    var concat = valor;
    for (; concat.toString().length < noCeros;) {
        concat = "0" + concat.toString();
    }
    return concat;
}

function dibujarBtnsCont() {

    $("#accordionModulos").html("");
    var esPrimero = true;
    nodosRaiz.forEach(nodoRaiz => {

        var show = "show";
        if (!esPrimero) {
            show = "";
        }
        $("#accordionModulos").append(
            '               <div class="card">  ' +
            '               <div class="card-header px-0" id="heading-' + nodoRaiz.RPFLINEA + '">  ' +
            '                 <h2 class="mb-0" style="text-align: left;">  ' +
            '                   <button style="color: #495057;" class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse-' + nodoRaiz.RPFLINEA + '" aria-expanded="true" aria-controls="collapse-' + nodoRaiz.RPFLINEA + '">  ' +
            nodoRaiz.CNESDSOP +
            '                   </button>  ' +
            '                 </h2>  ' +
            '               </div>  ' +
            '             ' +
            '               <div id="collapse-' + nodoRaiz.RPFLINEA + '" class="collapse ' + show + '" aria-labelledby="heading-' + nodoRaiz.RPFLINEA + '" data-parent="#accordionModulos">  ' +
            '                 <div class="card-body p-1">  ' +
            '                 </div>  ' +
            '               </div>  ' +
            '            </div>  '
        );
        esPrimero = false;
        dibujarBtns(nodoRaiz)
    })
}

function dibujarBtns(nodoSeleccionada) {

    var nodosPintar = []
    for (var nodo in nodos) {

        if (nodoSeleccionada.RPFARES1ID == nodos[nodo].RPFTPES1PADREID && nodoSeleccionada.RPFARESID == nodos[nodo].RPFARESID) {
            nodosPintar.push(nodos[nodo]);
        }
    }

    $("#collapse-" + nodoSeleccionada.RPFLINEA).find(".card-body").html("");
    nodosPintar.forEach(nodoPintar => {

        if (nodoPintar.CNESMN1ICONO == "") {
            nodoPintar.CNESMN1ICONO = "file.svg";
        }
        if (nodoPintar.CNESMN1BGCOLO == "") {
            nodoPintar.CNESMN1BGCOLO = "#EEEEF7";
        }
        if (nodoPintar.CNESMN1TEXTCOLOR == "") {
            nodoPintar.CNESMN1TEXTCOLOR = "#000";
        }
        $("#collapse-" + nodoSeleccionada.RPFLINEA).find(".card-body").append(

            "   <button title='" + nodoPintar.CNESDSOP + "' onClick='verAplicacion(" + JSON.stringify(nodoPintar) + ")' " +
            " style='border:solid #DBDBDB 1px; background-color:" + nodoPintar.CNESMN1BGCOLO + ";color: " + nodoPintar.CNESMN1TEXTCOLOR + ";font-size: 13px;text-overflow: ellipsis; white-space: nowrap; " +
            " overflow: hidden; text-align: left; outline: none;' type='button' class='btn btn-dark  btn-lg py-1 mx-0 col-12'>  " +
            "   <img src='img/iconosMenu/" + nodoPintar.CNESMN1ICONO + "' alt='Icon' class='mr-2' style='padding: 5px;height: 40px;width: 40px;'>" +
            nodoPintar.CNESDSOP +
            "   </button>  "
        )


    })

}

function cerrarVentana() {

    if ($("#divOpen").hasClass("d-flex")) {
        $("#divOpen").removeClass("d-flex")
    }
    $("#divOpen").hide();
    $("#webview").remove();
    $("#divMonitor").show();
}

function verAplicacion(nodo) {
    abrirVentana()
    $("#divOpen").html(
        '<webview id="webview" src="' + nodo.CNESMNRUDS + '/' + nodo.CNESMNOBJ + '?CNUSERID=' + usuarioOk.CNUSERID + '" style="display:inline-flex; width:100%; height:100%;"></webview>'
    );
}

function abrirVentana() {
    $("#divOpen").show()
    $("#webview").remove()
    $("#divOpen").addClass("d-flex")
    $("#divMonitor").hide();
}

function modulosToggle() {
    $("#modulosCont").toggle()
}

function cerrarSesion() {
    if (arrancar_llamadas == "SI") {
        mostrarMensaje('', "Deten la ronda de llamadas que esta en progreso para poder salir")
    } else {
        ipcRenderer.send('cerrarSesion_', "")
    }


}


//funcion para consultar al agente
function consultarAgnt() {
    setInterval(function() {
        var campana = $('#campanaComboid').val();
        var estatus = $('#estatusComboid').val();
        var estatusres = $('#estatusResComboid').val();
        var supervisor = $('#supervisorComboid').val();
        var col_espera = $('#colasComboid').val();
        var skill = $('#skillComboid').val();
        ipcRenderer.send('getConsultarAgentes', campana, col_espera, supervisor, estatus, estatusres)
        ipcRenderer.send('getConsultarMetricas', col_espera)
        ipcRenderer.send('conIndicadores', campana, col_espera, supervisor, estatus, estatusres)
        ipcRenderer.send('getindicadoresOut', campana)
        ipcRenderer.send('consultarAgente', campana, arrancar_llamadas, numeroRonda) //consulta los agentes para lanzar las llamadas en rondas de llamada
    }, 5000);
    consultarAgente();
}

//botones de receso funcion al dar click
function recesos(valor) {
    var user_selec = $('#usrSel').val();
    if (user_selec == "") {
        mostrarMensaje('', "Selecciona un agente");

    } else {
        ipcRenderer.send('getConsultarReceso', user_selec, valor, seleccionado_firstd)
    }
}


ipcRenderer.on('getConsultarRecesoResult', (event, datos) => {
    mostrarMensaje(datos.valido, datos.mensaje);
})

//funcion de escucha e interviene llamada, se activa con el onclick en uno de los dos botones. 
function llamadaAcc(valor) {
    var user_selec = $('#usrSel').val();
    var extAgnt = $('#extSel').val();
    var extEscucha = $('#extensiontxtid').val();
    //if-valida si esta seleccionado un agente
    if (user_selec == "") {
        //alert('Selecciona a un agente.')
        mostrarMensaje('', "Selecciona un agente");
    } else {
        //if valida si el supervisor escribio una extension para escuchar la llamada
        if (extEscucha == "") {
            document.getElementById("extensiontxtid").focus();
            document.getElementById("extensiontxtid").title = "Escriba una extensión";
            mostrarMensaje('', "Escriba una extensión");
        } else {
            ipcRenderer.send('accionesLlamadas', extAgnt, extEscucha, valor) //envia los parametros para enlazar al archivo asterisk_cli en el servidor.
        }
    }
}

//cerrar sesion agente

function cerrarSesionAgt() {
    var agnt = $('#usrSel').val();
    if (agnt == "") {
        //alert('Selecciona a un agente.')
        mostrarMensaje('', "Selecciona un agente");
    } else {

        var opcion = confirm("¿Está seguro de cerrar la sesión del agente?");
        if (opcion == true) {
            ipcRenderer.send('cerrarSesionAgt', agnt, seleccionado_firstd)
        } else {}
    }
}
//mostrar modal de configurar video
function configurarVideo() {
    var agnt = $('#usrSel').val();
    if (agnt == "") {
        mostrarMensaje('', "Selecciona un agente por favor");
    } else {
        $('#exampleModal').modal("show");
        ipcRenderer.send('getAgenteVideo', agnt, seleccionado_firstd)
    }
}

ipcRenderer.on('getAgenteVideoResult', async(event, datos) => {
    if (datos.length > 0)
        console.log(datos); {
        if (datos[0].configuraGrabacion == "numLlamadas") {
            document.getElementById("RnumLlamadas").checked = true;
            $("#numLlamadas").val(datos[0].valor);
        } else if (datos[0].configuraGrabacion == "numTiempo") {
            document.getElementById("RnumTiempo").checked = true;
            var tiempo = datos[0].valor.split(':')
            $("#Horas").val(tiempo[0]);
            $("#minutos").val(tiempo[1]);
            $("#segundos").val(tiempo[2]);
        } else if (datos[0].configuraGrabacion == "numDias") {
            document.getElementById("RnumDias").checked = true;
            $("#numDias").val(datos[0].valor);
        } else if (datos[0].configuraGrabacion == "siempre") {
            document.getElementById("Rsiempre").checked = true;
        } else if (datos[0].configuraGrabacion == "no") {
            document.getElementById("Rno").checked = true;
        }
    }
})

function limpiarVideo() {
    document.getElementById("numLLamadas").value = "0";
    document.getElementById("Horas").value = "00";
    document.getElementById("minutos").value = "00";
    document.getElementById("segundos").value = "00";
    document.getElementById("numDias").value = "0";
    document.getElementById("Rno").checked = true;
}

function guardarVideo() {
    var video = {};
    var usr = $('#usrSel').val();
    var ext = $('#extSel').val();
    if (document.getElementById("RnumLlamadas").checked == true) {
        video = { ConfiguraGrabacion: "numLlamadas", Valor: $('#numLLamadas').val() }
    } else if (document.getElementById("RnumDias").checked == true) {
        video = { ConfiguraGrabacion: "numDias", Valor: $('#numDias').val() }
    } else if (document.getElementById("RnumTiempo").checked == true) {
        video = { ConfiguraGrabacion: "numTiempo", Valor: $('#Horas').val() + ":" + $('#minutos').val() + ":" + $('#segundos').val() }
    } else if (document.getElementById("Rsiempre").checked == true) {
        video = { ConfiguraGrabacion: "siempre", Valor: '' }
    } else if (document.getElementById("Rno").checked == true) {
        video = { ConfiguraGrabacion: "no", Valor: '' }
    }

    console.log(video);
    ipcRenderer.send('configurarVideo', video, usr, ext, seleccionado_firstd);
    $('#exampleModal').modal("hide");
    setTimeout(() => {
        mostrarMensaje('', "Configuracion guardada");
    }, 3000);

}


ipcRenderer.on('cerrarSesionAgtResult', (datos) => {
    console.log(datos);
})

function mostrarMensaje(titulo, mensaje) {
    if (mensaje == "Ocurrió un error de conexión") {
        if ($('#alert_principal').hasClass('alert-success')) {
            $('#alert_principal').removeClass('alert-success');
        }
        $('#alert_principal').addClass('alert-danger');
    } else {
        if ($('#alert_principal').hasClass('alert-danger')) {
            $('#alert_principal').removeClass('alert-danger');
        }
        $('#alert_principal').addClass('alert-success');
    }
    $('#alert_principal').text(mensaje);
    $('#alert_principal').show();
    setTimeout(() => {
        $('#alert_principal').hide(2000);
    }, 3000);
}

function llenarGrid(datos) {

    var editFoto = function(datos, type, row) {
        if (type === 'display') {
            if (row.src == "") {
                //return ' <img alt="Agente" src="" class="img-circle" width="40" height="40"></img>';
            } else {
                return ' <img alt="Agente" src="data:image/bmp;base64,' + row.src + '" class="img-circle" width="40" height="40"></img>';
            }
        }
        return this.datos;
    };

    var Estatus = function(datos, type, row) {
        if (type === 'display') {
            if (row.stsrec == "SOL") {
                return "<i class='icon-user-plus' style='color:#fff; font-size: 30px;'></i>";
            } else if (row.stsrec == "SOLAUT") {
                return "<i class='icon-smile' style='color:#fff; font-size: 30px;'></i>";
            } else if (row.stsrec == "RES") {
                return "<i class='icon-clock' style='color:#fff; font-size: 30px;'></i>";
            } else if (datos == "DISPONIBLE") {
                return "<i class='icon-user-check' style='color:#fff; font-size: 30px;'></i>";
            } else if (datos == "EN LLAMADA") {
                return "<i class='icon-phone' style='color:#fff; font-size: 30px;'></i>";
            } else {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    var EstatusLlam = function(datos, type, row) {
        if (type === 'display') {
            if (row.sts == "DISPONIBLE") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "EN LLAMADA") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "RECESO") {
                return "<div>" + row.sts + "</div>";
            } else {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    if (screen.height < 500)
        var height = (screen.height - 120);
    else if (screen.height > 500 && screen.height < 709)
        var height = (screen.height - 150);
    else if (screen.height > 710 && screen.height < 999)
        var height = (screen.height - 230);
    else if (screen.height > 1000)
        var height = (screen.height - 310);
    console.log(screen.height);
    $('#tableagentes').DataTable({
        "info": true,
        "data": datos,
        "pagingType": "simple",
        "searching": false,
        "destroy": true,
        //"responsive": {details: true},
        "responsive": true,
        "select": true,
        "paging": true,
        "autoWidth": true,
        "ordering": false,
        "lengthChange": false,
        "scrollX": false,
        "scrollY": false,
        "lengthMenu": [100],
        "columns": [
            { "data": "area" },
            { "data": "sts", render: Estatus },
            //{ "data": "src"},
            //{ "data": "src",render: editFoto},
            { "data": "nom" },
            { "data": "stsrec", render: EstatusLlam },
            { "data": "fecha" },
            { "data": "hora" },
            { "data": "duracion" },
            { "data": "Telefono" },
            { "data": "nombreCliente" },
            { "data": "idllamada" },
            { "data": "permiso" },
            { "data": "ext" },
            { "data": "id" },
        ],
        "columnDefs": [
            { "orderable": false, "targets": 0, "className": 'dt-body-center' },
            { "orderable": false, "targets": 1, "className": 'dt-body-center' },
            { "orderable": false, "targets": 2, "className": 'dt-body-left', "width": "250px" },
            { "orderable": false, "targets": 3, "className": 'dt-body-center' },
            { "orderable": false, "targets": 4, "className": 'dt-body-center' },
            { "orderable": false, "targets": 5, "className": 'dt-body-center' },
            { "orderable": false, "targets": 6, "className": 'dt-body-center' },
            { "orderable": false, "targets": 7, "className": 'dt-body-right' },
            { "orderable": false, "targets": 8, "className": 'dt-body-left' },
            { "orderable": false, "targets": 9, "className": 'dt-body-right' },
            { "orderable": false, "targets": 10, "className": 'dt-body-left' },
            { "orderable": false, "targets": 11, "className": 'dt-body-right' },
            { "orderable": false, "targets": 12, "className": 'dt-body-left' },
        ],

        "language": {
            select: {
                rows: ""
            },
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ning&uacute;n dato disponible en esta tabla",
            "sInfo": "   _TOTAL_ registros",
            "sInfoEmpty": "  0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }

        },
        rowCallback: function(row, datos) {
            if (datos.sts == "DISPONIBLE") {
                $($(row).find("td")[1]).css("background-color", "#269EE3");
                $($(row).find("td")[3]).css("background-color", "#269EE3");
            } else if (datos.sts == "EN LLAMADA") {
                $($(row).find("td")[1]).css("background-color", "#43B51F");
                $($(row).find("td")[3]).css("background-color", "#43B51F");
            }

            if (parseInt(datos.segundos) > 270) {
                $($(row).find("td")[2]).css("background-color", "#ff0303");
            }
            if (datos.area == "O") {
                $($(row).find("td")[0]).css("background-color", "black");
                $($(row).find("td")[0]).css("color", "white");
            } else {
                $($(row).find("td")[0]).css("background-color", "#5b81a7");
                $($(row).find("td")[0]).css("color", "white");
            }

            if (datos.stsrec == "SOL") {
                $($(row).find("td")[1]).css("background-color", "#B046B8");
            } else if (datos.stsrec == "SOLAUT") {
                $($(row).find("td")[1]).css("background-color", "#4d8855");
            } else if (datos.stsrec == "RES") {
                $($(row).find("td")[1]).css("background-color", "#FF8000");
            }
        }

    });
    //var tabla = $("#tableagentes");
    //this.reg_selec = tabla.DataTable().row( { selected: true } ).data();
}

//funcion de seleccion del agente
$(document).ready(function() {
    var table = $('#tableagentes').DataTable();

    $('#tableagentes tbody').on('click', 'tr', function() {
        seleccionado_firstd = $(this).find("td:eq(0)").text();
        document.getElementById("usrSel").value = $(this).find("td:eq(12)").text();
        document.getElementById("extSel").value = $(this).find("td:eq(11)").text();
        document.getElementById("nombreSel").value = $(this).find("td:eq(2)").text();
        $(this).addClass('selected').siblings().removeClass('selected');
        var value = $(this).find('td:first').html();
    });
});

function lnzRonda_1() {
    cronoval = 1;
    var campana = $('#campanaComboid').val();
    var supervisor = $('#supervisorComboid').val();
    if (campana == '') {
        mostrarMensaje('', 'Selecione una campaña')
    } else {
        if (arrancar_llamadas == "NO") {
            bandera = 0;
            numeroRonda = "01";
            document.getElementById("play1").className = "icon-stop2";
            document.getElementById("play1").style = "color: red; font-size: 15px;";
            var play2 = document.getElementById("ronda2");
            play2.disabled = true;
            var play3 = document.getElementById("ronda3");
            play3.disabled = true;
            //$("#lblRonda1").text("Corriendo ");
            arrancar_llamadas = "SI"
            cronometroi = setInterval(cronometro, 10);
        } else {
            bandera = 1;
            numeroRonda = "01";
            document.getElementById("play1").className = "icon-play3";
            document.getElementById("play1").style = "color: #565656; font-size: 15px;";
            var play2 = document.getElementById("ronda2");
            play2.disabled = false;
            var play3 = document.getElementById("ronda3");
            play3.disabled = false;
            $("#lblRonda1").text("Terminada");
            arrancar_llamadas = "NO"
        }
        ipcRenderer.send("lnzaRondaCampana", campana, arrancar_llamadas, numeroRonda, supervisor_firma);
    }
}

function lnzRonda_2() {
    cronoval = 2;
    var campana = $('#campanaComboid').val();
    var supervisor = $('#supervisorComboid').val();
    if (campana == '') {
        mostrarMensaje('', 'Selecione una campaña')
    } else {
        if (arrancar_llamadas == "NO") {
            bandera = 0;
            numeroRonda = "02";
            document.getElementById("play2").className = "icon-stop2";
            document.getElementById("play2").style = "color: red; font-size: 15px;";
            var play2 = document.getElementById("ronda1");
            play2.disabled = true;
            var play3 = document.getElementById("ronda3");
            play3.disabled = true;
            //$("#lblRonda2").text("Corriendo");
            arrancar_llamadas = "SI"
            clearInterval(cronometroi);
            cronometroi = setInterval(cronometro, 10);
        } else {
            bandera = 1;
            numeroRonda = "02";
            document.getElementById("play2").className = "icon-play3";
            document.getElementById("play2").style = "color: #565656; font-size: 15px;";
            var play2 = document.getElementById("ronda1");
            play2.disabled = false;
            var play3 = document.getElementById("ronda3");
            play3.disabled = false;
            $("#lblRonda2").text("Terminada");
            arrancar_llamadas = "NO"
        }
        ipcRenderer.send("lnzaRondaCampana", campana, arrancar_llamadas, numeroRonda, supervisor_firma);
    }
}

function lnzRonda_3() {
    cronoval = 3;
    var campana = $('#campanaComboid').val();
    if (campana == '') {
        mostrarMensaje('', "Seleccione una campaña")
    } else {
        if (arrancar_llamadas == "NO") {
            bandera = 0;
            numeroRonda = "03";
            document.getElementById("play3").className = "icon-stop2";
            document.getElementById("play3").style = "color: red; font-size: 15px;";
            var play2 = document.getElementById("ronda2");
            play2.disabled = true;
            var play3 = document.getElementById("ronda1");
            play3.disabled = true;
            //$("#lblRonda3").text("Corriendo");
            arrancar_llamadas = "SI"
            clearInterval(cronometroi);
            cronometroi = setInterval(cronometro, 10);
        } else {
            bandera = 1;
            numeroRonda = "03";
            document.getElementById("play3").className = "icon-play3";
            document.getElementById("play3").style = "color: #565656; font-size: 15px;";
            var play2 = document.getElementById("ronda2");
            play2.disabled = false;
            var play3 = document.getElementById("ronda1");
            play3.disabled = false;
            $("#lblRonda3").text("Terminada")
            arrancar_llamadas = "NO"
        }
        ipcRenderer.send("lnzaRondaCampana", campana, arrancar_llamadas, numeroRonda, supervisor_firma);
    }
}

function cronometro() {
    if (bandera == 0) {
        if (centesimas < 99) {
            centesimas++;
            if (centesimas < 10) {
                centesimas = "0" + centesimas
            }
        }
        if (centesimas == 99) {
            centesimas = -1;
        }
        if (centesimas == 0) {
            segundos++;
            if (segundos < 10) {
                segundos = "0" + segundos
            }
        }
        if (segundos == 60) {
            segundos = 0;
        }
        if ((centesimas == 0) && (segundos == 0)) {
            minutos++;
            if (minutos < 10) {
                minutos = "0" + minutos
            }
        }
        if (minutos == 60) {
            minutos = 0;
        }
        if ((centesimas == 0) && (segundos == 0) && (minutos == 0)) {
            horas++;
            if (horas < 10) {
                horas = "0" + horas
            }
        }
        if (segundos == 0) {
            segundos = "00";
        }
        if (minutos == 0) {
            minutos = "00";
        }
        if (horas == 0) {
            horas = "00";
        }
        if (cronoval == 1) {
            document.getElementById("lblRonda1").innerHTML = "Corriendo TIEMPO" + " " + minutos + ":" + segundos;
        } else if (cronoval == 2) {
            document.getElementById("lblRonda2").innerHTML = "Corriendo TIEMPO" + " " + minutos + ":" + segundos;
        } else if (cronoval == 3) {
            document.getElementById("lblRonda3").innerHTML = "Corriendo TIEMPO" + " " + minutos + ":" + segundos;
        }
    } else {
        /*document.getElementById("lblcrono").innerHTML="";
        document.getElementById("lblcrono2").innerHTML="";
        document.getElementById("lblcrono3").innerHTML="";*/
        minutos = 0;
        segundos = 0;
        horas = 0;
        centesimas = 0;
    }
}