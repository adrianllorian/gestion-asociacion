$(document).ready(function () {
    validarNombre();
    validarApellido();
    validarTelefono();
    validarDomicilio();
    validarMunicipio();
    validarProvincia();
    validarDNI();
});

function validarNombre(){
    $("#NombreCrearUsuario").bind('keypress', function(event) {
        var regex = new RegExp("^[a-zA-Z ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
          event.preventDefault();
          return false;
        }
      });
}

function validarApellido(){
    $("#ApellidoCrearUsuario").bind('keypress', function(event) {
        var regex = new RegExp("^[a-zA-Z ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
          event.preventDefault();
          return false;
        }
      });
}

function validarTelefono(){
    $("#TelefonoCrearUsuario").bind('keypress', function(event) {
        var regex = new RegExp("^[0-9+]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
          event.preventDefault();
          return false;
        }
      });

}


function validarDomicilio(){
    $("#DomicilioCrearUsuario").bind('keypress', function(event) {
        var regex = new RegExp("^[a-zA-Z ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
          event.preventDefault();
          return false;
        }
      });
}

function validarMunicipio(){
    $("#MunicipioCrearUsuario").bind('keypress', function(event) {
        var regex = new RegExp("^[a-zA-Z ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
          event.preventDefault();
          return false;
        }
      });
}

function validarProvincia(){
    $("#ProvinciaCrearUsuario").bind('keypress', function(event) {
        var regex = new RegExp("^[a-zA-Z ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
          event.preventDefault();
          return false;
        }
      });
}

function validarDNI(){
    $("#DniCrearUsuario").bind('keypress', function(event) {
        var regex = new RegExp("^[0-9]{0,8}[a-zA-Z]{0,1}");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
          event.preventDefault();
          return false;
        }
      });
}


