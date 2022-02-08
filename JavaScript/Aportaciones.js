$(document).ready(function () {
    
});
    //##########################
// APORTACIONES
//##########################

function AportacionSumar() {    //Private
    $('button[id^="Aportacion"]').click(function () {
      var preparandoClave = $(this).attr('id').split("Aportacion");
  
      //Prepato el envio de la aportacion
      var idUsuario = preparandoClave[1]; //id Usuario
      var aportacion = $('#pantallaAportacion' + idUsuario).val();
      var descripcion = $('#pantallaConcepto' + idUsuario).val();
      var estado = "Aportacion";
      var data = {
        'idUsuario': idUsuario,
        'descripcion': descripcion,
        'aportacion': aportacion,
        'estado': estado
      };
      if (aportacion > 0) {
        enviarAportacion(data, idUsuario, estado, aportacion);
      }
  
    });
  }
  
  function AportacionRestar() {  //Pivate
    $('button[id^="Consumicion"]').click(function () {
      var preparandoClave = $(this).attr('id').split("Consumicion");
      
      //Preparo el envio de la Aportacion
      var idUsuario = preparandoClave[1]; //id Usuario
      var aportacion = $('#pantallaAportacion' + idUsuario).val();
      var descripcion = $('#pantallaConcepto' + idUsuario).val();
      var estado = "Consumicion";
      var data = {
        'idUsuario': idUsuario,
        'descripcion': descripcion,
        'aportacion': aportacion,
        'estado': estado
      };
      if (aportacion > 0) {
       
  
          console.log(descripcion);
          $('#pantallaConcepto' + idUsuario).css('border-color', 'rgb(205,212,219)');
          enviarAportacion(data, idUsuario, estado, aportacion);
        
        
        
  
      } else {
        alert('Debes de poner una cantidad mayor a 0')
      }
  
    });
  }
  
  function enviarAportacion(data, idUsuario, estado, aportacion) {
  
    $.ajax({
      url: "https://elclientenotienelarazon.com:8443/authentication/guardarAportacion",
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json; charset=UTF-8",
      headers: {
        "Authorization": localStorage.getItem('token')
      }
    }).done(function (data, textStatus, jqXHR) {
      if (data != null) {
        if (data == true) {
          $('#pantallaAportacion' + idUsuario).val('');
          $('#pantallaConcepto' + idUsuario).val('');
          var valor = $('#dinero' + idUsuario).text();
  
          if (estado == 'Aportacion') {
  
            $('#dinero' + idUsuario).text(parseFloat(valor) + parseFloat(aportacion));
          }
          else if (estado == 'Consumicion') {
            $('#dinero' + idUsuario).text(parseFloat(valor) - parseFloat(aportacion));
          }
  
        }
        else if (data == false) {
          alert("La " + estado + " no ha sido guardado")
        }
        else {
          alert("La " + estado + " no ha sido guardado")
        }
  
      }
  
    })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("La solicitud a fallado: " + textStatus + ' son cosas que pasan');
  
      });
  }


//############################
//  Metodos listar aportacion
//############################

function cargarTablaAportaciones(){
    $.ajax({
      url: "https://elclientenotienelarazon.com:8443/authentication/ver-todas-aportaciones",
      type: "GET",
      headers: {
        "Authorization": localStorage.getItem('token')
      },
  
    }).done(function (data, textStatus, jqXHR) {
      if (data != null) {
        pintarTablaAportacion(data)
      }
  
    })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("La solicitud a fallado: " + textStatus + ' son cosas que pasan');
  
      });
  }
  var calculoTotal = 0;
  function pintarTablaAportacion(data){
    if (localStorage.getItem('rol') == '[ROLE_user]') {//Compruebo que sea usuario el unico usuario
      //Muestro al usuario que llega
      
    } else if (localStorage.getItem('rol') == '[ROLE_admin]') {
      //Muestro una tabla
      $.each(data, function (i, item) {
        $('#cuerpoTablaAportacionesPrincipal').append('<tr id="filaTablaAportacionAdmin' + data[i].id + '"><td>' + data[i].fecha + '<td>' + data[i].descripcion + '</td>><td>' + data[i].estado + '</td>><td><a id="signoTablaAdmin'+data[i].id+'"></a><a class="aportacionTablaAportacionAdmin'+data[i].id+'">' + data[i].aportacion + '</a><a class="aportacionTablaAportacionAdmin'+data[i].id+'"> €</a></td>><td><button class="btn btn-primary" id="verUsuario' + data[i].idUsuario + '" data-toggle="modal" data-target="#modalVerUsuario"><a>Ver</a><a>&nbsp;</a><i class="fa fa-user"></i></button></td></tr>');
        if(data[i].estado == "Aportacion"){
          $('#signoTablaAdmin'+ data[i].id).addClass('text-success').text('+');
          $('.aportacionTablaAportacionAdmin'+ data[i].id).addClass('text-success');
          calculoTotal = calculoTotal + parseFloat(data[i].aportacion);
        }
        else if(data[i].estado =="Consumicion"){
          $('#signoTablaAdmin'+ data[i].id).addClass('text-danger').text('-');
          $('.aportacionTablaAportacionAdmin' + data[i].id).addClass('text-danger');
        }
      });
      
      $('#TotalAportacionUsuario').text(calculoTotal);
      verUsuario();
  
    }
  
  }


