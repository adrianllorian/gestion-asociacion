$(document).ready(function () {

    ponerContraseñaFormulario();
    botonGenerarContraseña();
     preparaFormulario();
//##########################
// VER USUARIO  
//##########################
});

var IdUsuarioParaVer;
function verUsuario() { //Private
  $('button[id^="verUsuario"]').click(function () {
    var preparandoClave = $(this).attr('id').split("verUsuario");
    var idUsuario = preparandoClave[1]; //id Usuario
    IdUsuarioParaVer = { "id": idUsuario };
    
    $.ajax({
      url: "https://elclientenotienelarazon.com:8443/authentication/ver-socio",
      type: "POST",
      data: JSON.stringify(IdUsuarioParaVer),
      contentType: "application/json; charset=UTF-8",
      headers: {
        "Authorization": localStorage.getItem('token')
      }
    }).done(function (data, textStatus, jqXHR) {
      if (data != null) {
       
        var json = { "id": data.id };
        $('#verUsuarioDni').text(data.dni);
        $('#verUsuarioNombre').text(data.nombre);
        $('#verUsuarioApellidos').text(data.apellidos);
        $('#verUsuarioTelefono').text(data.telefono);
        $('#verUsuarioDomicilio').text(data.domicilio);
        $('#verUsuarioMunicipio').text(data.municipio);
        $('#verUsuarioProvincia').text(data.provincia);
        $('#verUsuarioRol').text(data.rol);
       $('#verUsuarioTotalAportacionUsuario').text(data.totalAnotacion);
      mostrarAportacionPorUsuario();
      descargarFoto()
      }


    })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("La solicitud a fallado: " + textStatus + ' son cosas que pasan');

      });

  });
}

function mostrarAportacionPorUsuario() {
  $.ajax({
    url: "https://elclientenotienelarazon.com:8443/authentication/verAportacion",
    type: "POST",
    data: JSON.stringify(IdUsuarioParaVer),
    contentType: "application/json; charset=UTF-8",
    headers: {
      "Authorization": localStorage.getItem('token')
    }
  }).done(function (data, textStatus, jqXHR) {
    if (data != null) {
      $('#cuerpo-anotacion').find('tr').remove();
      $.each(data, function (i, item) {
        $('#cuerpo-anotacion').append('<tr><td>'+data[i].fecha+'</td><td class="align-middle">' + data[i].descripcion + '</td><td id="aportacion" class="align-middle"><a id="signoAportacionTabla'+ data[i].id +'"></a><a class="aportacionTabla'+ data[i].id +'">' + data[i].aportacion + '</a><a class="aportacionTabla'+ data[i].id +'">€</a></td></tr>');
        if(data[i].estado == "Aportacion"){
          $('#signoAportacionTabla'+ data[i].id).text('+').addClass('text-success');
          $('.aportacionTabla'+ data[i].id).addClass('text-success')
        }
        else if(data[i].estado == "Consumicion"){
          $('#signoAportacionTabla'+ data[i].id).text('-').addClass('text-danger')
          $('.aportacionTabla'+ data[i].id).addClass('text-danger')

        }
      });
    }

  })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log("La solicitud a fallado: " + textStatus + ' son cosas que pasan');

    });
}

//###############################
//       Funciones CARGAR Fotos Usuario
//###############################

function descargarFoto(){
  $.ajax({
    url: "https://elclientenotienelarazon.com:8443/authentication/extraerFotosUsuario",
    type: "POST",
    data: JSON.stringify(IdUsuarioParaVer),
    contentType: "application/json; charset=UTF-8",
    headers: {
      "Authorization": localStorage.getItem('token')
    }
  }).done(function (data, textStatus, jqXHR) {
    if (data != null) {
      var cadenaDelantera = 'data:image/jpg;base64,' + data.fotoDelantera;
      $('#fotoDelantera').attr('src', cadenaDelantera);
      var cadenaTrasera = 'data:image/jpg;base64,' + data.fotoTrasera;
      $('#fotoTrasera').attr('src', cadenaTrasera);
    }
    else{
      console.log("No llegan las fotos")
    }

  })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log("La solicitud a fallado: " + textStatus + ' son cosas que pasan');

    });
}


//################################
//       Funciones BORRAR Usuario
//##############################

var idUsuarioCache;

function mostrarMensajeBorrar() {
  botonesModelBorrar();
  $('a[id^="borrarUsuario"]').click(function () {
    var preparandoClave = $(this).attr('id').split("borrarUsuario");
    idUsuarioCache = preparandoClave[1]; //id Usuario
    $('#modalConfirmarBorrar').modal({ backdrop: 'static', keyboard: false });
  });
}


function botonesModelBorrar() {


  $('#cancelarBorrarUsuario').click(function () {
    $('#modalConfirmarBorrar').modal('toggle');
  });

  $('#confirmarBorrarUsuario').click(function () {


    var json = { "id": idUsuarioCache };

    $.ajax({
      url: "https://elclientenotienelarazon.com:8443/authentication/borrar-socio",
      type: "POST",
      data: JSON.stringify(json),
      contentType: "application/json; charset=UTF-8",
      headers: {
        "Authorization": localStorage.getItem('token')
      }
    }).done(function (data, textStatus, jqXHR) {
      if (data != null) {
        $('#modalConfirmarBorrar').modal('toggle');
        $('#filaTablaUsuariosAdmin' + idUsuarioCache).remove();
      }
      else {
        console.log("La solicitud no se ha confirmado: " + textStatus + ' son cosas que pasan');

      }

    })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("La solicitud a fallado: " + textStatus + ' son cosas que pasan');

      });
  });

}



//#####################################
//    Funciones EDITAR Usuario
//#####################################

var idUsuarioCacheEditar;
var aportacionCahe;

function mostrarFormularioEditar() {
  $('a[id^="editarUsuario"]').click(function () {
    var preparandoClave = $(this).attr('id').split("editarUsuario");
    idUsuarioCacheEditar = preparandoClave[1]; //id Usuario
    console.log('EL id de usuario a EDITAR que se envia es ' + idUsuarioCacheEditar);
    $('#modalAddUsuario').modal({ backdrop: 'static', keyboard: false });

    var json = { "id": idUsuarioCacheEditar };

    $.ajax({
      url: "https://elclientenotienelarazon.com:8443/authentication/ver-socio",
      type: "POST",
      data: JSON.stringify(json),
      contentType: "application/json; charset=UTF-8",
      headers: {
        "Authorization": localStorage.getItem('token')
      }
    }).done(function (data, textStatus, jqXHR) {
      if (data != null) {
        $('#DniCrearUsuario').val(data.dni);
        $('#NombreCrearUsuario').val(data.nombre);
        $('#ApellidoCrearUsuario').val(data.apellidos);
        $('#TelefonoCrearUsuario').val(data.telefono);
        $('#DomicilioCrearUsuario').val(data.domicilio);
        $('#MunicipioCrearUsuario').val(data.municipio);
        $('#ProvinciaCrearUsuario').val(data.provincia);
        aportacionCahe = data.totalAnotacion;
        if (data.rol == 'admin') {
          $("#UsuarioCheck").prop('checked', false);
          $("#AdminCheck").prop('checked', true);
        }

        else {
          $("#UsuarioCheck").prop('checked', true);
          $("#AdminCheck").prop('checked', false);
        }

        $('#tituloFormularioUsuario').text('Editar Usuario');
        $('#botonCrearUsuario').css('display', 'none');
        $('#editarCrearUsuario').css('display', 'block');
        $('#cajaContraseñaFormulario').css('display', 'none');
        botonGuardarEditarUsuario();
      }


    })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("La solicitud a fallado: " + textStatus + ' son cosas que pasan');

      });

  });
}


function botonGuardarEditarUsuario() {
  $('#editarCrearUsuario').click(function () {
    var nombre = $('#NombreCrearUsuario').val();
    var apellidos = $('#ApellidoCrearUsuario').val();
    var telefono = $('#TelefonoCrearUsuario').val();
    var domicilio = $('#DomicilioCrearUsuario').val();
    var municipio = $('#MunicipioCrearUsuario').val();
    var provincia = $('#ProvinciaCrearUsuario').val();
    var contraseña = $('#ContraseñaCrearUsuario').val();
    var dni = $('#DniCrearUsuario').val();
    var rol = $('input:radio[name=permisos]:checked').val();

    var json = {
      "id": idUsuarioCacheEditar,
      "nombre": nombre,
      "apellidos": apellidos,
      "telefono": telefono,
      "domicilio": domicilio,
      "municipio": municipio,
      "provincia": provincia,
      "contraseña": contraseña,
      "rol": rol,
      "dni": dni
    }
    console.log(json);
    if (idUsuarioCacheEditar != null && nombre != null && apellidos != '' && telefono != '' && domicilio != '' && municipio != '' && provincia != '' && rol != '') {

      enviarUsuarioEditar(json);
      $('#datosVaciosformulario').css('display', 'none');
    }
    else {
      console.log('No envia hay datos vacios')
      $('#datosVaciosformulario').css('display', 'block');
    }



  });
}

function enviarUsuarioEditar(json) {
  $.ajax({
    url: "https://elclientenotienelarazon.com:8443/authentication/guardar-socio",
    type: "POST",
    data: JSON.stringify(json),
    contentType: "application/json; charset=UTF-8",
    headers: {
      "Authorization": localStorage.getItem('token')
    }
  }).done(function (data, textStatus, jqXHR) {
    if (data != null) {

      if (data == true) {


        $('#modalAddUsuario').modal('toggle');
        $('#filaTablaUsuariosAdmin' + idUsuarioCacheEditar).find('td').remove();
        $('#filaTablaUsuariosAdmin' + idUsuarioCacheEditar).append('<td>' + json.fotoDNI + '</td><td>' + json.nombre + '</td><td>' + json.apellidos + '</td><td><button class="btn btn-primary" id="verUsuario' + json.id + '" data-toggle="modal" data-target="#modalVerUsuario"><a>Ver</a><a>&nbsp;</a><i class="fa fa-user"></i></button></td><td><input type="text" maxlength="26" placeholder="Concepto" id="pantallaConcepto' + json.id + '" class="mx-2"></td><td><div class="d-flex justify-content-around"><button class="btn btn-danger" id="Consumicion' + json.id + '"> - </button><input min="0" max="10000" step="1" placeholder="€" type="number" id="pantallaAportacion' + json.id + '" class="mx-2"><button class="btn btn-success" id="Aportacion' + json.id + '"> + </button></div></td><td><a id="dinero' + json.id + '">' + aportacionCahe + '</a><a>€</a></td><td><a type="button"><i id="borrarUsuario' + json.id + '" class="fa fa-close text-danger borrar"></i></a></td><td><a type="button" id="editarUsuario' + json.id + '"><i class="fa fa-edit text-warning editar"></i></a></td></tr>');
        $('#modalAddUsuario').modal('toggle');
        AportacionSumar();
        AportacionRestar();
        verUsuario();
        mostrarMensajeBorrar();
        mostrarFormularioEditar();
      }
      else {
        alert("El Usuario NO ha sido guardado");
      }

    }

  })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log("La solicitud a fallado: " + textStatus + ' son cosas que pasan');

    });

}


//#######################################
//        Guardar Usuario
//#######################################


function preparaFormulario() {  
    $('#abrirModalCrearUsuario').click(function(){
        $('#tituloFormularioUsuario').text('Agregar Usuario');
        $('#botonCrearUsuario').css('display', 'block');
        $('#editarCrearUsuario').css('display', 'none');
        $('#cajaContraseñaFormulario').css('display','block');
        $('#NombreCrearUsuario').val('');
        $('#ApellidoCrearUsuario').val('');
        $('#TelefonoCrearUsuario').val('');
        $('#DomicilioCrearUsuario').val('');
        $('#MunicipioCrearUsuario').val('');
        $('#ProvinciaCrearUsuario').val('');
        $('#DniCrearUsuario').val('');
        $("#UsuarioCheck").prop('checked', true);
        $("#AdminCheck").prop('checked', false);
        $('#delante').attr("src","Imagenes/transparecia.png");
        $('#atras').attr("src","Imagenes/transparecia.png");
    });
  
  }
  
  var fotoDNIDelantera;
  var fotoDNITrasera;
  
  function botonCrearUsuario(){
    $('#botonCrearUsuario').click(function(){
       
        var nombre = $('#NombreCrearUsuario').val();
        var apellidos = $('#ApellidoCrearUsuario').val();
        var telefono = $('#TelefonoCrearUsuario').val();
        var domicilio = $('#DomicilioCrearUsuario').val();
        var municipio = $('#MunicipioCrearUsuario').val();
        var provincia = $('#ProvinciaCrearUsuario').val();
        var contraseña = $('#ContraseñaCrearUsuario').val();
        var dni = $('#DniCrearUsuario').val();
        var rol = $('input:radio[name=permisos]:checked').val();
        var inputDelantera =  document.getElementById("inputFotoDniDelantera");
        fotoDNIDelantera = inputDelantera.files[0];
        var inputTrasera =  document.getElementById("inputFotoDniTrasera");
        fotoDNITrasera = inputTrasera.files[0]
  
        var json= {
            "nombre": nombre,
            "apellidos": apellidos,
            "telefono": telefono,
            "domicilio": domicilio,
            "municipio": municipio,
            "provincia": provincia,
            "contraseña": contraseña,
            "rol":rol,
            "dni":dni,
            
        }
        if(nombre!= null && apellidos!= '' && telefono!= '' && domicilio!= '' && municipio!= '' && provincia!= '' && contraseña!= '' && rol!= '' && $('#inputFotoDniDelantera').val() !='' && $('#inputFotoDniTrasera').val() !=''){
            
            enviarUsuario(json)
           
            $('#datosVaciosformulario').css('display', 'none');
        }
        else{
            console.log('No envia hay datos vacios')
            $('#datosVaciosformulario').css('display', 'block');
        }
       
    });
  }
  
  function enviarUsuario(json){
    
    var dataForm = new FormData();
    dataForm.append('imagenDelantera',fotoDNIDelantera);
    dataForm.append('imagenTrasera',fotoDNITrasera);
    dataForm.append('socio',JSON.stringify(json));
    $.ajax({
        url: "https://elclientenotienelarazon.com:8443/authentication/guardar-usuario-con-foto",
        type: "POST",
        data: dataForm,
        contentType:false,
        processData: false,
        //contentType: "application/json; charset=UTF-8",
        //contentType:"multipart/form-data",
        //proccessData: false,
        //cache: false,
        headers: {
          "Authorization": localStorage.getItem('token')
        }
      }).done(function (data, textStatus, jqXHR) {
        
        $('#modalAddUsuario').modal('toggle');
        $('#cuerpoTablaSocios-Admin').find('tr').remove();
        //$('#cuerpoTablaSocios-Admin').append('<tr id="filaTablaUsuariosAdmin'+data.id+'"><td>' + data.fotoDNI + '</td>><td>' + data.nombre + '</td>><td>' + data.apellidos + '</td>><td><button class="btn btn-primary" id="verUsuario'+ data.id + '" data-toggle="modal" data-target="#modalVerUsuario">Ver</button></td><td><input type="text" maxlength="26" placeholder="Concepto" id="pantallaConcepto' + data.id + '" class="mx-2"></td><td><div class="d-flex justify-content-around"><button class="btn btn-danger" id="Consumicion' + data.id + '"> - </button><input min="0" max="10000" step="1" placeholder="€" type="number" id="pantallaAportacion' + data.id + '" class="mx-2"><button class="btn btn-success" id="Aportacion' + data.id + '"> + </button></div></td><td><a id="dinero' + data.id  +'">' + data.totalAnotacion + '</a><a>€</a></td><td><a type="button"><i id="borrarUsuario'+data.id +'" class="fa fa-close text-danger borrar"></i></a></td><td><a type="button" id="editarUsuario'+data.id +'"><i class="fa fa-edit text-warning editar"></i></a></td></tr>')       
        load();
    
      })
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.log("La solicitud a fallado: " + textStatus + ' son cosas que pasan');
    
        });
  }
  
  function ponerContraseñaFormulario(){
    $('#abrirModalCrearUsuario').click(function(){
        var con= crearContraseña();
        $('#ContraseñaCrearUsuario').prop('disabled', false);
        $('#ContraseñaCrearUsuario').val(con);
        $('#ContraseñaCrearUsuario').prop('disabled', true);
    })
    }
  
    function botonGenerarContraseña(){
        $('#generarContrasena').click(function(){
            var con= crearContraseña(); 
            $('#ContraseñaCrearUsuario').prop('disabled', false);
            $('#ContraseñaCrearUsuario').val(con);
            $('#ContraseñaCrearUsuario').prop('disabled', true);
        })
    }
  
  
  function crearContraseña(){
    var letras=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','p','q','r','s','t','u','v','w','x','y','z'];
    var clave="";
    var theRandomNumber;
    for(var i=0; i<3; i++){
        clave= clave + letras[ Math.floor(Math.random() * letras.length)];
    }
    return clave;
  }
  
  function enviarFoto(){
    var dataForm = new FormData();
    dataForm.append('imagenDelantera',fotoDNIDelantera);
    dataForm.append('socio',JSON.stringify(Pruebajson));
    $.ajax({
        url: "https://elclientenotienelarazon.com:8443/authentication/guardar-usuario-con-foto",
        type: "POST",
        data: dataForm,
        contentType:false,
        processData: false,
        //contentType: "application/json; charset=UTF-8",
        //contentType:"multipart/form-data",
        //proccessData: false,
        //cache: false,
        headers: {
          "Authorization": localStorage.getItem('token')
        }
      }).done(function (data, textStatus, jqXHR) {
        
        $('#modalAddUsuario').modal('toggle');
        enviarFoto();
        $('#cuerpoTablaSocios-Admin').find('tr').remove();
        //$('#cuerpoTablaSocios-Admin').append('<tr id="filaTablaUsuariosAdmin'+data.id+'"><td>' + data.fotoDNI + '</td>><td>' + data.nombre + '</td>><td>' + data.apellidos + '</td>><td><button class="btn btn-primary" id="verUsuario'+ data.id + '" data-toggle="modal" data-target="#modalVerUsuario">Ver</button></td><td><input type="text" maxlength="26" placeholder="Concepto" id="pantallaConcepto' + data.id + '" class="mx-2"></td><td><div class="d-flex justify-content-around"><button class="btn btn-danger" id="Consumicion' + data.id + '"> - </button><input min="0" max="10000" step="1" placeholder="€" type="number" id="pantallaAportacion' + data.id + '" class="mx-2"><button class="btn btn-success" id="Aportacion' + data.id + '"> + </button></div></td><td><a id="dinero' + data.id  +'">' + data.totalAnotacion + '</a><a>€</a></td><td><a type="button"><i id="borrarUsuario'+data.id +'" class="fa fa-close text-danger borrar"></i></a></td><td><a type="button" id="editarUsuario'+data.id +'"><i class="fa fa-edit text-warning editar"></i></a></td></tr>')       
        load();
    
      })
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.log("La solicitud a fallado: " + textStatus + ' son cosas que pasan');
    
        });
  }

