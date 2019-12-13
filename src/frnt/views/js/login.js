const { ipcRenderer } = require('electron');

const $ = require('jquery');


// lee el valor del campo usuario en el log in y lo busca en la base de datos
function consultarNombre(){

  if($("#inputUsuario").val() != ""){

    $(".loader").show()
    $(".alert").remove();
    ipcRenderer.send('consultarNombre',  $("#inputUsuario").val()) //envia la orden para realizar la consulta pasa el valor del input usuario como parametro
    $("#nombreUsuario").html("")

  }


}

//se cacha el resultado obtenido de la consulta en la base de datos 
ipcRenderer.on('consultarNombreResult', (event, usuario) => {


    if(usuario != null){

      $("#nombreUsuario").html( usuario.SSUSRDSC) //retorna el tipo de usuario (maestro, agente, etc...) y lo imprime en la vista del login
     
    }else{

      $(".alert").remove();
      $("#inputUsuario").before(
        
        '<div class="alert alert-danger" role="alert" style="background: transparent; border: none;">'+
        'Usuario no encontrado'+
        '</div>'
  
      );
    }
    $(".loader").hide()


})

function cancelar(){

    ipcRenderer.send('cerrarVentana', "")

}
//valida las credenciales del usuario
function login(){

  
  let datos = {};
  datos.usuarioid = $("#inputUsuario").val();
  datos.pssw = $("#inputContrasena").val();

  if(datos.usuarioid != ""){
    $(".loader").show()
    $("#btnLogin").hide()
    ipcRenderer.send('validarUsuario', datos)
  }

}

var inputcontra = document.getElementById("inputContrasena");
inputcontra.addEventListener("keyup",function(event) {
  if (event.keyCode == 13) {
    event.preventDefault();
    login();
  }
})

//envia la instruccion de abrir la pantalla de configuracion
function abrirConf(){
    ipcRenderer.send('abrirPantallaConf', "");
}

function abrirConfMarcador(){
  ipcRenderer.send('abrirConfMarcador', "");
}



//cacha el resultado de si las credenciales del usuario son validas 
ipcRenderer.on('validarUsuarioResult', (event, datos) => {

  if(datos.valido){
    /*
    $(".alert").remove();
    $("#textoInicio").after(

      '<div class="alert alert-primary" role="alert">'+
      datos.mensaje +
      '</div>'

    );
    */
    let datos = {};
    datos.usuarioid = $("#inputUsuario").val();
    datos.pssw = $("#inputContrasena").val();
    ipcRenderer.send('setUsuario', datos)
   

  }else
  {

    $(".alert").remove();
    $("#inputUsuario").before(
      
      '<div class="alert alert-danger" role="alert" style="background: transparent; border: none;">'+
      datos.mensaje +
      '</div>'

    );
    $(".loader").hide()
    $("#btnLogin").show()

  }

})

