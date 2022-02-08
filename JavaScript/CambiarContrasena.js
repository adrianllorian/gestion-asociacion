$(document).ready(function () {
});

//##########################
// Cambiar Contraseña
//##########################

$('#confirmarCambiarContraseña').click(function(){
    var inputCambiarContrasena = $('#CambiarContrasena').val();
    if(inputCambiarContrasena != ''){
      var json={
        "id":cacheUsuario,
        "contraseña":inputCambiarContrasena
      }
      $.ajax({
        url: "https://elclientenotienelarazon.com:8443/authentication/cambiar-contrasena",
        type: "POST",
        data: JSON.stringify(json),
        contentType: "application/json; charset=UTF-8",
        headers: {
          "Authorization": localStorage.getItem('token')
        }
      }).done(function (data, textStatus, jqXHR) { 
        if (data != null) {
          if (data == true) {
           $('#cajaFooter').fadeOut().delay(3000).fadeIn(250)
           $('#modalCambiarContraseña').modal('toggle'); 
           $('#cajaAlertaContrasenaUsuarioCorrecto').fadeIn(250).delay(3000).fadeOut(250);
           $('#cajaFooter')
          }
          else if (data == false) {
            alert("La contraseña no ha sido guardado")
          }
          else {
            alert("La contraseña no ha sido guardado")
          }
    
        }
    
      })
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.log("La solicitud a fallado: " + textStatus + ' son cosas que pasan');
    
        });
    }
  });
