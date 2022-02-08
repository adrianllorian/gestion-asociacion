
//MAIN
$(document).ready(function () {
  //Principal
  comprobarToken();
  cerrarSesion();

  //Guardar Usuario
  preparaFormulario();
  botonCrearUsuario();
  ponerContraseñaFormulario();
  botonGenerarContraseña();
});



//Variables

var json = [];


//Funciones

function comprobarToken() {
  if (localStorage.getItem('token') == null) {
    $('#loginModal').modal({ backdrop: 'static', keyboard: false });
    recogerLogin();
  }
  else {
    load();
    $('#pagina').css('display', 'block');

  }
}

function recogerLogin() {
  $('#botonLogin').click(function () { //hacer cliclk al boton de enviar
    var dni = $('#dni').val();
    var contraseña = $('#pass').val();
    json = { "dni": dni, "contraseña": contraseña }; //Creo el json para enviar
    enviarDatosLogin();

  });
}

function enviarDatosLogin() {
  if (this.json != null) {
    $.ajax({
      url: "https://elclientenotienelarazon.com:8443/authentication/login",
      type: "POST",
      data: JSON.stringify(json),
      contentType: "application/json; charset=UTF-8",
      
    }).done(function (data, textStatus, jqXHR) {
      if (data != null) {
        $('#pagina').css('display', 'block');
        localStorage.setItem('token', data.contraseña);
        localStorage.setItem('rol', data.rol);
        $('#loginModal').modal('toggle');
        quitarErrores();
        $('#dni').val('');
        $('#pass').val('');
        load();
        //Aqui se pide al usuario o usuarios dependiendo del rol que tiene


      }

    })
      .fail(function (jqXHR, textStatus, errorThrown) {
        pintarErrores();
        console.log("La solicitud a fallado: " + textStatus + ' son cosas que pasan');

      });

  }

}

function cerrarSesion() {
  $('#cerrarSesion').click(function () {
    localStorage.clear();
    quitarErrores();
    location.reload();
    //$('#pagina').css('display', 'none');
    //$('#loginModal').modal({backdrop: 'static', keyboard: false});
  })
}

/*Funciones para control de errores*/

function pintarErrores() { //Private
  $('#MensajeErrorLogin').html('<p class="text-danger mt-2" id="textoError">DNI o Contraseña inválida</p>');
  $('#dni').css('border-color', 'red');
  $('#pass').css('border-color', 'red');
  recojerClickInput();
}

function quitarErrores() { //Private
  $('#dni').css('border-color', 'rgb(205,212,219)');
  $('#pass').css('border-color', 'rgb(205,212,219)');
  $('#textoError').remove();
}

function recojerClickInput() {
  $('#dni').click(function () {
    quitarErrores()
  })

  $('#pass').click(function () {
    quitarErrores()
  })
}

function load() {
  $.ajax({
    url: "https://elclientenotienelarazon.com:8443/authentication/load",
    type: "GET",
    headers: {
      "Authorization": localStorage.getItem('token')
    },
 

  }).done(function (data, textStatus, jqXHR) {
    if (data != null) {
      pintarIndex(data, jqXHR);
      cargarTablaAportaciones();
    }

  })
    .fail(function (jqXHR, textStatus, errorThrown) {
      pintarErrores();
      console.log("La solicitud a fallado: " + textStatus + ' son cosas que pasan');

    });
    
}

//################################3
//Detectar y Aplicar segun el ROL
//################################
function pintarIndex(data) {
 var numeroSocios= Object.keys(data).length;
  if (localStorage.getItem('rol') == '[ROLE_user]') {//Compruebo que sea usuario el unico usuario
    //Muestro al usuario que llega
    pintarUsuario(data);

    

  } else if (localStorage.getItem('rol') == '[ROLE_admin]') {
    //Muestro una tabla
    $.each(data, function (i, item) {
      $('#cuerpoTablaSocios-Admin').append('<tr id="filaTablaUsuariosAdmin' + data[i].id + '"><td>' + data[i].nombre + '</td>><td>' + data[i].apellidos + '</td>><td><button class="btn btn-primary" id="verUsuario' + data[i].id + '" data-toggle="modal" data-target="#modalVerUsuario"><a>Ver</a><a>&nbsp;</a><i class="fa fa-user"></i></button></td><td><input type="text" maxlength="26" placeholder="Concepto" id="pantallaConcepto' + data[i].id + '" class="mx-2"></td><td><div class="d-flex justify-content-around"><button class="btn btn-danger" id="Consumicion' + data[i].id + '"> - </button><input min="0" max="10000" step="1" placeholder="€" type="number" id="pantallaAportacion' + data[i].id + '" class="mx-2"><button class="btn btn-success" id="Aportacion' + data[i].id + '"> + </button></div></td><td><a id="dinero' + data[i].id + '">' + data[i].totalAnotacion + '</a><a>€</a></td><td><a type="button" id="borrarUsuario' + data[i].id + '"><i class="fa fa-close text-danger borrar"></i></a></td><td><a type="button" id="editarUsuario' + data[i].id + '"><i class="fa fa-edit text-warning editar"></i></a></td></tr>')
      $('#moduloTablaSocios-Admin').css('display', 'block');
      $('#abrirModalCrearUsuario').css('display', 'block');
      $('#TotalNumeroUsuarios').text(numeroSocios);
      $('#cajaTotalUsuarios').css('display','block');
    });

    AportacionSumar();
    AportacionRestar();
    verUsuario();
    mostrarMensajeBorrar();
    mostrarFormularioEditar();
  }

}
//#########################
// Pintar cuando el ROL es USER
//########################
var cacheUsuario;
function pintarUsuario(data){
    $('#moduloTablaUsuario-Usuario').css('display','block');
    $('#NombreListaUsuario').text(data[0].nombre);
    $('#ApellidosListaUsuario').text(data[0].apellidos);
    $('#DNIListaUsuario').text(data[0].dni);
    $('#DomicilioListaUsuario').text(data[0].domicilio);
    $('#MunicipioListaUsuario').text(data[0].municipio);
    $('#ProvinciaListaUsuario').text(data[0].provincia);
    $('#TotalAportacionUsuario').text(data[0].totalAnotacion);
    $('#opcionBuscar').remove();
    $('#buscadorUsuario').remove();
    $('#abrirModalCrearUsuario').remove()
    $('#cajaTotalAcumulacion').css('display', 'block');
    $('#abrirModalCambiarContraseña').css('display','block');
    cacheUsuario = data[0].id;


    var json = { "id":data[0].id}
    $.ajax({
      url: "https://elclientenotienelarazon.com:8443/authentication/verAportacion",
      type: "POST",
      data: JSON.stringify(json),
      contentType: "application/json; charset=UTF-8"
    }).done(function (datas, textStatus, jqXHR) {
      if (datas != null) {
        $.each(datas, function(i, item){
          $('#cuerpoTablaUsuario-Usuario').append('<tr id="filaTablaUsuario-Usuario'+datas[i].id+'"><td><a>'+datas[i].fecha+'</a></td><td><a>'+datas[i].descripcion+'</a></td><td><a>'+datas[i].estado+'</a></td><td><a id="signoAportacion'+datas[i].id+'"></a><a class="aportacionTablaUsuario'+datas[i].id+'">'+datas[i].aportacion+'</a><a class="aportacionTablaUsuario'+datas[i].id+'"> €</a></td></tr>');
          if(datas[i].estado == "Aportacion"){
            $('.aportacionTablaUsuario'+ datas[i].id).addClass('text-success');
            $('#signoAportacion' + datas[i].id).text('+').addClass('text-success');
          }
          else if(datas[i].estado == "Consumicion"){
            $('.aportacionTablaUsuario' + datas[i].id).addClass('text-danger');
            $('#signoAportacion' + datas[i].id).text('-').addClass('text-danger');
          }
        })
        
      }

    })
      .fail(function (jqXHR, textStatus, errorThrown) {
        pintarErrores();
        console.log("La solicitud a fallado: " + textStatus + ' son cosas que pasan');

      });  
}
