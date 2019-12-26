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
var campanas = [];
var campanasejec = [];
var ispaused = false;

ipcRenderer.send('conexion', '')
ipcRenderer.send('getUsuario', '')
ipcRenderer.send('getAllCampanas', '')
setInterval(function() {
    ipcRenderer.send('getAllCampanas', '')
}, 5000);

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
})

//consultar agentes

ipcRenderer.on('getConsultarAgentesResult', (event, datos) => {
    var arr_datos = []
    for (let b = 0; b < datos.out.length; b++) {
        arr_datos.push(datos.out[b]);
    }
    mostraragentescmp(arr_datos);
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

ipcRenderer.on('getduracioncampanaResult', async(event, datos) => {
    /*  console.log(datos.duracion); */
    let selectlabel = 'duracioncmp' + datos.ID;
    if (datos.duracion !== '') {
        $('#' + selectlabel).html(datos.duracion);
    } else {
        $('#' + selectlabel).html('');
    }
})

//llena combo de campañas
ipcRenderer.on('getAllCampanasResult', async(event, datos) => {
    /*  console.log(datos); */
    if (datos.length > 0) {
        campanas = [];
        campanasejec = [];
        for (let b = 0; b < datos.length; b++) {
            if (datos[b].fechahoraultprim !== '' && datos[b].fechahoraultprimdet === '') {
                ipcRenderer.send('getduracioncampana', datos[b].ID, 'btfechahoraprimronda');
                campanasejec.push(datos[b]);
            } else if (datos[b].fechahoraultseg !== '' && datos[b].fechahoraultsegdet === '') {
                ipcRenderer.send('getduracioncampana', datos[b].ID, 'btfechahorasegronda');
                campanasejec.push(datos[b]);
            } else if (datos[b].fechahoraultter !== '' && datos[b].fechahoraultterdet === '') {
                ipcRenderer.send('getduracioncampana', datos[b].ID, 'btfechahoraterronda');
                campanasejec.push(datos[b]);
            } else {
                campanas.push(datos[b]);
            }
        }
        if (!ispaused) {
            llenarcampanas(campanas);
        }
        llenarcampanasejec(campanasejec);
        if (campanasejec.length > 0) {
            for (let i = 0; i < campanasejec.length; i++) {
                ipcRenderer.send('consultarAgente', campanasejec[i].ID, "SI", "01");
            }
        }
    } else {
        tablavacia();
    }
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

//funcion de seleccion del agente
$(document).ready(function() {
    tablavacia();
});

function tablavacia() {
    if (!$.trim($('#campanasactivas').html()).length) {
        $('#campanasactivas').append('<li class="list-group-item d-flex col-12 justify-content-center vacia" id="IndicadoresCol">' +
            '<div style="text-align: center; color:#fff;">' +
            '<label>No hay campañas activas</label>' +
            '</div>' +
            '</li>')
        $('#loader').css('display', 'none');
    } else {
        $('#loader').css('display', 'block');
    }
    if (!$.trim($('#allcampanas').html()).length) {
        $('#allcampanas').append('<li class="list-group-item d-flex col-12 justify-content-center vacia" id="IndicadoresCol">' +
            '<div style="text-align: center; color:#fff;">' +
            '<label>No hay campañas inactivas</label>' +
            '</div>' +
            '</li>')
    }

}

function llenarcampanasejec(datos) {
    $("#campanasactivas").html("");
    datos.forEach(function(modulo, index) {
        let idcampana = modulo.ID.toString();
        let dscCampana = modulo.DSC.toString();
        let universo = modulo.UNI.toString();
        $("#campanasactivas").append('<li class="list-group-item d-flex col-12 justify-content-between" id="IndicadoresCol">' +
            '<div class="float-left col-10 my-auto" style="text-align: initial; color:#fff;"><label style="font-size:x-large;" title="Nombre de la campaña.">' +
            '<b>' + dscCampana + '</b></label> <br>' +
            '<label class="my-auto py-auto" title="Número de contactos de la campaña.">Universo: ' + universo + '</label>' +
            '<label class="ml-3 py-auto" title="Último usuario que lanzó la campaña.">Usuario: ' + modulo.ultusuario + '</label>' +
            '<label class="ml-3 py-auto" title="Fecha y hora de la última vez que fue lanzada la campaña.">Fecha: ' + modulo.fechahoraultprim.toString() + '</label>' +
            '<label class="ml-3 py-auto" title="Duración de la campaña desde que fue lanzada.">Duración: <label id="duracioncmp' + idcampana + '"></label></label>' +
            '</div>' +
            '<div class="float-right my-auto style="text-align:right;">' +
            '<button class="btn my-auto" id="playcampana" onclick="detenerRonda(\'detenercmp' + idcampana + '\', playobd' + idcampana + ')"' +
            'style="height: fit-content; width: fit-content;" title="Detener llamadas de la campaña.">' +
            '<i id="playobd' + idcampana + '" class="icon-stop2" style="color: red; font-size: 15px;"></i></button>' +
            '<button class="btn my-auto" id="veragtscmpbtn' + idcampana + '" onclick="veragtscmp(veragtscmpbtn' + idcampana + ')" ' +
            'style="height: fit-content; width: fit-content;" title="Ver agentes asignados a la campaña.">' +
            '<i id="agts' + idcampana + '" class="icon-users" style="color: #ffff; font-size: 15px;"></i></button>' +
            '</div>' +
            '</li>');
    });
    tablavacia();
}

function llenarcampanas(datos) {
    $("#allcampanas").html("");
    datos.forEach(function(modulo, index) {
        let idcampana = modulo.ID.toString();
        let dscCampana = modulo.DSC.toString();
        let universo = modulo.UNI.toString();
        $("#allcampanas").append('<li class="list-group-item d-flex col-12 justify-content-between" id="IndicadoresCol">' +
            '<div class="float-left col-10 my-auto" style="text-align: initial; color:#fff;"><label style="font-size:x-large;" title="Nombre de la campaña.">' +
            '<b>' + dscCampana + '</b></label> <br>' +
            '<label class="my-auto py-auto" title="Número de contactos de la campaña.">Universo: ' + universo + '</label>' +
            '<label class="ml-3 py-auto" title="Último usuario que lanzó la campaña.">Usuario: ' + modulo.ultusuario + '</label>' +
            '<label class="ml-3 py-auto" title="Fecha y hora de la última vez que fue lanzada la campaña.">Fecha: ' + modulo.fechahoraultprim.toString() + '</label>' +
            '<label class="ml-3 py-auto" style="display:none;" title="Duración de la campaña desde que fue lanzada.">Duración: <label id="duracioncmp' + idcampana + '"></label></label>' +
            '</div>' +
            '<div class="float-right my-auto style="text-align:right;">' +
            '<button class="btn my-auto" id="playcampana" onclick="lnzRonda(\'lanzarcmp' + idcampana + '\', playobd' + idcampana + ')"' +
            'style="height: fit-content; width: fit-content;" title="Lanzar llamadas de la campaña.">' +
            '<i id="playobd' + idcampana + '" class="icon-play3" style="color: #ffff; font-size: 15px;"></i></button>' +
            '<button class="btn my-auto" id="veragtscmpbtn' + idcampana + '" onclick="veragtscmp(veragtscmpbtn' + idcampana + ')" ' +
            'style="height: fit-content; width: fit-content;" title="Ver agentes asignados a la campaña.">' +
            '<i id="agts' + index + '" class="icon-users" style="color: #ffff; font-size: 15px;"></i></button>' +
            '</div>' +
            '</li>');
    });
}

function buscarcmp() {
    var filter = "DSC";
    var keyword = $('#searcher').val();

    if (keyword === "") {
        ispaused = false;
        llenarcampanas(campanas);
    } else {
        ispaused = true;
        var filteredData = campanas.filter(function(obj) {
            return obj[filter].toLowerCase().includes(keyword.toLowerCase());
        });
        if (filteredData.length == 0) {
            $("#allcampanas").html("");
            tablavacia();
        } else {
            llenarcampanas(filteredData);
        }
    }
}

function veragtscmp(campana) {
    let idcampana = campana.id.replace('veragtscmpbtn', '');
    let div = campana.parentNode.parentNode;
    let nomcampana = div.childNodes[0].childNodes[0].innerHTML;
    ipcRenderer.send('getConsultarAgentes', idcampana, '', '', '');
    $('#agtcmp').modal('toggle');
    setTimeout(function() {
        $('#titulo_modal').html(nomcampana);
    }, 150);
}

function mostraragentescmp(datos) {
    $("#agtscampanas").html("");

    if (datos.length != 0) {
        datos.forEach(function(agente, index) {
            $("#agtscampanas").append("<li style='text-align: initial; padding-left: 2%;'><p class='pt-2'><b>Agente: </b>" + agente.nom + "</p>" +
                "<p><b>Estatus: </b>" + agente.sts + "</p>" +
                "<hr></li>");
        });
    } else {
        $("#agtscampanas").append("<li style='text-align: initial; padding-left: 2%;'><p>No hay agentes disponibles</p></li>");
    }
}

function lnzRonda(campana, idelement) {
    cronoval = 1;
    bandera = 0;
    numeroRonda = "01";
    arrancar_llamadas = "SI"
    let camp = campana.replace('lanzarcmp', '');
    var row = idelement.parentNode.parentNode.parentNode;
    row.parentNode.removeChild(row);
    let cmp = row.childNodes[0].childNodes[0].data;
    for (var i = 0; i < campanas.length; i++) {
        if (campanas[i].DSC === cmp) {
            campanasejec.push(campanas[i]);
            campanas.splice(i, 1);
        }
    }
    row.childNodes[1].childNodes[0].setAttribute("onClick", "detenerRonda(detenercmp" + campana + ", " + idelement.id + ")");
    row.childNodes[1].childNodes[0].setAttribute("title", "Detener llamadas de la campaña.");
    row.childNodes[1].childNodes[0].childNodes[0].className = "icon-stop2";
    row.childNodes[1].childNodes[0].childNodes[0].style = "color: red; font-size: 15px;";
    if ($('#campanasactivas').find('li.vacia').length != 0) {
        $('#campanasactivas').empty();
    }
    $("#campanasactivas").append(row);
    tablavacia();
    ipcRenderer.send("lnzaRondaCampana", camp, arrancar_llamadas, numeroRonda, supervisor_firma);
    ipcRenderer.send('consultarAgente', camp, arrancar_llamadas, numeroRonda); //consulta los agentes para lanzar las llamadas en rondas de llamada
}

function detenerRonda(campana, idelement) {
    cronoval = 1;
    bandera = 1;
    numeroRonda = "01";
    let camp = campana.replace('detenercmp', '');
    arrancar_llamadas = "NO"
    var row = idelement.parentNode.parentNode.parentNode;
    row.parentNode.removeChild(row);
    let cmp = row.childNodes[0].childNodes[0].data;
    for (var i = 0; i < campanasejec.length; i++) {
        if (campanasejec[i].DSC === cmp) {
            campanas.push(campanasejec[i]);
            campanasejec.splice(i, 1);
        }
    }
    row.childNodes[1].childNodes[0].setAttribute("onClick", "lnzRonda(lanzarcmp" + campana + ", " + idelement.id + ")");
    row.childNodes[1].childNodes[0].setAttribute("title", "Lanzar llamadas de la campaña.");
    row.childNodes[1].childNodes[0].childNodes[0].className = "icon-play3";
    row.childNodes[1].childNodes[0].childNodes[0].style = "color: #ffff; font-size: 15px;";
    if ($('#allcampanas').find('li.vacia').length != 0) {
        $('#allcampanas').empty();
    }
    $("#allcampanas").append(row);
    tablavacia();
    ipcRenderer.send("lnzaRondaCampana", camp, arrancar_llamadas, numeroRonda, supervisor_firma);
    ipcRenderer.send('consultarAgente', camp, arrancar_llamadas, numeroRonda); //consulta los agentes para lanzar las llamadas en rondas de llamada
}


function cerrarVentana() {

    if ($("#divOpen").hasClass("d-flex")) {
        $("#divOpen").removeClass("d-flex")
    }
    $("#divOpen").hide();
    $("#webview").remove();
    $("#divMonitor").show();
}


function cronometro(id1, id2) {
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
            //document.getElementById(id1).innerHTML = "Corriendo TIEMPO" + " " + minutos + ":" + segundos;
        }
    } else {
        //document.getElementById(id2).innerHTML = "";
        /* document.getElementById("lblcrono2").innerHTML="";
        document.getElementById("lblcrono3").innerHTML=""; */
        minutos = 0;
        segundos = 0;
        horas = 0;
        centesimas = 0;
    }
}