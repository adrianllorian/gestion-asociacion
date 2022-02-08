$(document).ready(function () {
    recogerInputUsuario();
    recogerInputAportacion();
});


//###################################################################
//   Buscador Usuario
//###################################################################
function recogerInputUsuario(){
    var inputBuscar;
    $('#buscadorUsuario').keyup(function() {
        inputBuscar = $('#buscadorUsuario').val();
        enviarNombre(inputBuscar);
      });
}


function enviarNombre(nombre){
    var json = {"nombre":nombre};
    $.ajax({
        url: "https://elclientenotienelarazon.com:8443/authentication/buscar-por-socio",
        type: "POST",
        data: JSON.stringify(json),
        contentType: "application/json; charset=UTF-8",
        headers: {
          "Authorization": localStorage.getItem('token')
        }
      }).done(function (data, textStatus, jqXHR) {
        if (data != null) {
          var arrayControl=[];
         $('#cuerpoTablaSocios-Admin').find('tr').remove();
          $.each(data, function (i, item) {
            
              if(!arrayControl.includes(data[i].id)){
                arrayControl.push(data[i].id);
                $('#cuerpoTablaSocios-Admin').append('<tr id="filaTablaUsuariosAdmin' + data[i].id + '"><td>' + data[i].nombre + '</td>><td>' + data[i].apellidos + '</td>><td><button class="btn btn-primary" id="verUsuario' + data[i].id + '" data-toggle="modal" data-target="#modalVerUsuario"><a>Ver</a><a>&nbsp;</a><i class="fa fa-user"></i></button></td><td><input type="text" maxlength="26" placeholder="Concepto" id="pantallaConcepto' + data[i].id + '" class="mx-2"></td><td><div class="d-flex justify-content-around"><button class="btn btn-danger" id="Consumicion' + data[i].id + '"> - </button><input min="0" max="10000" step="1" placeholder="€" type="number" id="pantallaAportacion' + data[i].id + '" class="mx-2"><button class="btn btn-success" id="Aportacion' + data[i].id + '"> + </button></div></td><td><a id="dinero' + data[i].id + '">' + data[i].totalAnotacion + '</a><a>€</a></td><td><a type="button" id="borrarUsuario' + data[i].id + '"><i class="fa fa-close text-danger borrar"></i></a></td><td><a type="button" id="editarUsuario' + data[i].id + '"><i class="fa fa-edit text-warning editar"></i></a></td></tr>');
              }
            
             });
        }
    
      })
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.log("La solicitud a fallado: " + textStatus + ' son cosas que pasan');
    
        });
}


//###################################################################
//   Buscador Aportacion
//###################################################################


function recogerInputAportacion(){
  var inputBuscar;
  $('#buscadorAportacion').keyup(function() {
      inputBuscar = $('#buscadorAportacion').val();
      enviarAportaciones(inputBuscar);
    });
}


function enviarAportaciones(nombre){
  var json = {

                "descripcion":nombre,
                "estado":nombre,
                "fecha":nombre,
              };
          
  
  $.ajax({
      url: "https://elclientenotienelarazon.com:8443/authentication/buscador-aportaciones",
      type: "POST",
      data: JSON.stringify(json),
      contentType: "application/json; charset=UTF-8",
      headers: {
        "Authorization": localStorage.getItem('token')
      }
    }).done(function (data, textStatus, jqXHR) {
      if (data != null) {
       $('#cuerpoTablaAportacionesPrincipal').find('tr').remove();
       $.each(data, function (i, item) {
        $('#cuerpoTablaAportacionesPrincipal').append('<tr id="filaTablaAportacionAdmin' + data[i].id + '"><td>' + data[i].fecha + '<td>' + data[i].descripcion + '</td>><td>' + data[i].estado + '</td>><td><a id="signoTablaAdmin'+data[i].id+'"></a><a class="aportacionTablaAportacionAdmin'+data[i].id+'">' + data[i].aportacion + '</a><a class="aportacionTablaAportacionAdmin'+data[i].id+'"> €</a></td>><td><button class="btn btn-primary" id="verUsuario' + data[i].idUsuario + '" data-toggle="modal" data-target="#modalVerUsuario"><a>Ver</a><a>&nbsp;</a><i class="fa fa-user"></i></button></td></tr>');
        if(data[i].estado == "Aportacion"){
          $('#signoTablaAdmin'+ data[i].id).addClass('text-success').text('+');
          $('.aportacionTablaAportacionAdmin'+ data[i].id).addClass('text-success');
          
        }
        else if(data[i].estado =="Consumicion"){
          $('#signoTablaAdmin'+ data[i].id).addClass('text-danger').text('-');
          $('.aportacionTablaAportacionAdmin' + data[i].id).addClass('text-danger');
        }
      });
      
      $('#TotalAportacionUsuario').text(calculoTotal);
      verUsuario();
      }
  
    })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("La solicitud a fallado: " + textStatus + ' son cosas que pasan');
  
      });
}
