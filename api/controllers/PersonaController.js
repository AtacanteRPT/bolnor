/**
 * PersonaController.js
 *
 * @description :: Server-side logic for managing subscriptions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var OneSignal = require('onesignal-node');
var path = require('path')

// var generatePassword = require('password-generator');
var user = [{
    id: 1,
    nombre: "Blanco"
  },
  {
    id: 2,
    nombre: "Verde"
  }

]

// id int AUTO_INCREMENT not null,
// email varchar(100),
// nombre varchar(100) not null,
// paterno varchar(100) not null,
// materno varchar(100) not null,
// telefono int,
// celular int,
// fechaNacimiento date,
// fechaAlta date,
// sexo varchar(20),
// primary key (id)
module.exports = {


  todo: function (req, res) {

    // Persona.find().exec(function (err, datosPersona) {


    //     datosPersona.forEach(element => {

    //         if (element.rol = "tutor") {
    //             Persona.update(element.id).set({ cedula: element.identificacion }).exec(function (err, dato) {

    //             })
    //         }
    //     });

    //     res.send("actualizando")
    // })
  },
  actualizarCedula: function (req, res) {

    Persona.find({
      rol: "tutor"
    }).exec(function (err, datoPersonas) {

      datoPersonas.forEach(element => {
        Persona.update(element.id).set({
          cedula: element.identificacion
        }).exec(function (err, datoActualizado) {

        });
      });
      res.send("actualizado")
    })

  },
  crear: function (req, res) {
    sails.log("BODY", req.body)

    var nuevaPersona = {
      identificacion: req.param('identificacion'),
      nombre: req.param('nombre'),
      email: req.param('email'),
      paterno: req.param('paterno'),
      materno: req.param('materno'),
      telefono: req.param('telefono'),
      celular: req.param('celular'),
      fechaNacimiento: req.param('fechaNacimiento'),
      cedula: req.param('cedula'),
      expedido: req.param('expedido'),
      sexo: req.param('sexo'),
      rol: req.param('rol'),
      nro: req.param('nro'),
      codigoFoto: req.param('codigoFoto')
    }
    // sails.log("NUEVA PERSONA", nuevaPersona)
    var rol = req.param('rol');
    Persona.create(nuevaPersona).fetch().exec(function (err, datoPersona) {
      if (err) {
        return res.serverError(err)
      };

      sails.log("CONTROLLER PERSONA  PERSONA : ", datoPersona);
      // console.log('persons : ' + datoPersona.nombre)
      switch (rol) {
        case 'alumno':
          Alumno.create({
            idPersona: datoPersona.id
          }).exec(function (err, creado) {
            if (err) {
              return res.serverError(err);
            }

            usuario = {

              username: datoPersona.id + datoPersona.nombre,
              password: datoPersona.id + datoPersona.nombre,
              codigo_qr: datoPersona.nombre + " " + datoPersona.paterno + " " + datoPersona.materno,
              rol: rol,
              idPersona: datoPersona.id
            }

            Usuario.create(usuario).exec(function (err, creado) {
              if (err) {
                return res.serverError(err);
              }
              res.send(datoPersona);
            })
          })
          break;
        case 'profesor':
          Profesor.create({
            idPersona: datoPersona.id
          }).exec(function (err, creado) {
            if (err) {
              return res.serverError(err);
            }
            usuario = {

              username: datoPersona.id + datoPersona.nombre,
              password: datoPersona.id + datoPersona.nombre,
              codigo_qr: datoPersona.nombre + " " + datoPersona.paterno + " " + datoPersona.materno,
              rol: rol,
              idPersona: datoPersona.id
            }

            Usuario.create(usuario).exec(function (err, creado) {
              if (err) {
                return res.serverError(err);
              }
              res.send(datoPersona);
            })
          })
          break;
        case 'tutor':
          Tutor.create({
            idPersona: datoPersona.id
          }).exec(function (err, creado) {
            if (err) {
              return res.serverError(err);
            }

            usuario = {

              username: datoPersona.id + datoPersona.nombre,
              password: datoPersona.id + datoPersona.nombre,
              codigo_qr: datoPersona.nombre + " " + datoPersona.paterno + " " + datoPersona.materno,
              rol: rol,
              idPersona: datoPersona.id
            }

            Usuario.create(usuario).exec(function (err, creado) {
              if (err) {
                return res.serverError(err);
              }
              res.send(datoPersona);
            })
          })
          break;
        case 'administrador':
          Administrador.create({
            idPersona: datoPersona.id,
            cargo: req.param('cargo')
          }).exec(function (err, creado) {
            if (err) {
              return res.serverError(err);
            }
            usuario = {

              username: datoPersona.id + datoPersona.nombre,
              password: datoPersona.id + datoPersona.nombre,
              codigo_qr: datoPersona.nombre + " " + datoPersona.paterno + " " + datoPersona.materno,
              rol: rol,
              idPersona: datoPersona.id
            }

            Usuario.create(usuario).exec(function (err, creado) {
              if (err) {
                return res.serverError(err);
              }
              res.send(datoPersona);
            })
          })
          break;
        default:
          res.send({
            mensaje: "no fue asignado ningun rol"
          })
          break;
      }

      // usuario = {
      //    
      //     username: datoPersona.id + datoPersona.nombre,
      //     password: datoPersona.id + datoPersona.nombre,
      //     codigo_qr: datoPersona.nombre + " " + datoPersona.paterno + " " + datoPersona.materno,
      //     rol: rol,
      //     idPersona: datoPersona.id
      // }

      // Usuario.create(usuario).exec(function(err, creado) {
      //     if (err) { return res.serverError(err); }
      //     res.send(datoPersona);
      // })


    });

  },
  traer: function (req, res) {
    var Id = req.param('id');

    Persona.findOne({
      id: Id
    }).exec(function (err, datoPersona) {
      if (err) {
        return res.serverError(err);
      }

      Usuario.findOne({
        idPersona: datoPersona.id
      }).exec(function (err, datoUsuario) {
        if (err) {
          return res.serverError(err);
        }

        var todoPersona = {
          persona: datoPersona,
          usuario: datoUsuario
        }

        res.send(todoPersona)
      });

    });
  },
  subir: function (req, res) {

    var idPersona = req.param('id');
    req.file('avatar').upload({
      // ~10MB
      dirname: require('path').resolve(sails.config.appPath, 'assets/avatars'),
      maxBytes: 10000000
    }, function whenDone(err, uploadedFiles) {

      sails.log("UPLOAD : ", uploadedFiles)

      if (err) {
        return res.negotiate(err);
      }

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0) {
        return res.badRequest('No file was uploaded');
      }

      // console.log(sails.config.appUrl)

      // var direccionBase = "http://localhost:1337"
      // // var direccionBase = "http://192.241.152.146:1337"
      // var url = direccionBase + "/avatars//" + (uploadedFiles[0].fd).substring(47);

      console.log("SEPARATE", path.sep)
      var urlFoto = (uploadedFiles[0].fd).split(path.sep);
      sails.log("fotos:", urlFoto);
      var url = "avatars//" + urlFoto[urlFoto.length - 1]


      Persona.update({
        id: idPersona
      }, {
        img: url,
      }).fetch().exec(function (err, datoPersona) {

        if (err) {
          console.log(err);
          return res.negotiate(err)
        };

        return res.send(datoPersona[0]);
      });

    });

  },
  informacion: function (req, res) {
    var codigoqr = req.param('codigoqr');
    var identificacion = codigoqr.split("$");
    console.log("idntificacion", identificacion[0])
    Persona.findOne({
      identificacion: identificacion[0]
    }).exec(function (err, datoPersona) {
      if (err) {
        return res.serverError(err);
      }
      res.send(datoPersona);
    });
  },
  notificar: (req, res) => {


    var id = req.param("id")
    var mensaje = req.param("mensaje")


    Dispositivo.find({
      idPersona: id
    }).populate("idPersona").exec(function (err, datosDispositivos) {

      var myClient = new OneSignal.Client({
        userAuthKey: 'MGI1ODliM2QtYmU2NC00ZjgzLWIwM2EtOWYxNjI0NmI3MTVj',
        // note that "app" must have "appAuthKey" and "appId" keys    
        app: {
          appAuthKey: 'ZmEzNzdmNjktMzQ0Ny00Y2IxLTk2YTMtNWU3MGYwNWFjNzUz',
          appId: 'e338a31b-4667-471e-9a1a-4aa0c3cf6d5f'
        }
      });

      //             userAuthKey:'MGI1ODliM2QtYmU2NC00ZjgzLWIwM2EtOWYxNjI0NmI3MTVj',
      // app:{appAuthKey:'ZmEzNzdmNjktMzQ0Ny00Y2IxLTk2YTMtNWU3MGYwNWFjNzUz' , appId:'e338a31b-4667-471e-9a1a-4aa0c3cf6d5f'}

      sails.log("DISPOSITIVOS", datosDispositivos)

      if (datosDispositivos.length > 0) {

        var listaDispositivos = []
        datosDispositivos.forEach(element => {
          listaDispositivos.push(element.idDispositivo)
        });
        sails.log("dispositivos", listaDispositivos)
        var firstNotification = new OneSignal.Notification({
          contents: {
            en: "Marcò " + datosDispositivos[0].idPersona.nombre + datosDispositivos[0].idPersona.paterno + datosDispositivos[0].idPersona.materno,
            tr: "Test mesajı"
          },

          include_player_ids: listaDispositivos
        });

        firstNotification.postBody["contents"] = {
          "en": mensaje
        };
        firstNotification.postBody["data"] = {
          "abc": "123",
          "foo": "bar"
        };
        firstNotification.postBody["headings"] = {
          "en": datosDispositivos[0].idPersona.nombre + datosDispositivos[0].idPersona.paterno + datosDispositivos[0].idPersona.materno
        };

        // Add a new target after creating initial notification body  
        // firstNotification.postBody["include_player_ids"].push["3aa608f2-c6a1-11e3-851d-000c2940e62c"]

        myClient.sendNotification(firstNotification, function (err, httpResponse, data) {
          if (err) {
            console.log('Something went wrong...');
          } else {
            console.log(data);
          }
          res.send({
            mensaje: "notificaciòn enviada"
          })
        });
      } else {
        res.send({
          mensaje: "no se encontraros dispositivos para este usuario"
        })
      }


    })


  },

  notificar_tutor: (req, res) => {


    var id = req.param("id")
    var mensaje = req.param("mensaje")




    var myClient = new OneSignal.Client({
      userAuthKey: 'MGI1ODliM2QtYmU2NC00ZjgzLWIwM2EtOWYxNjI0NmI3MTVj',
      // note that "app" must have "appAuthKey" and "appId" keys    
      app: {
        appAuthKey: 'ZmEzNzdmNjktMzQ0Ny00Y2IxLTk2YTMtNWU3MGYwNWFjNzUz',
        appId: 'e338a31b-4667-471e-9a1a-4aa0c3cf6d5f'
      }
    });
    Alumno.findOne({
      idPersona: id
    }).populate("idPersona").exec(function (err, datoAlumno) {
      if (err) {
        return res.serverError(err)
      };
      Tutor_alumno.find({
        idAlumno: datoAlumno.id
      }).populate("idTutor").exec(function (err, datosTutorAlumno) {
        if (err) {
          return res.serverError(err)
        };
        datosTutorAlumno.forEach(auxTutor => {

          Dispositivo.find({
            idPersona: auxTutor.idTutor.idPersona
          }).populate("idPersona").exec(function (err, datosDispositivos) {

            //             userAuthKey:'MGI1ODliM2QtYmU2NC00ZjgzLWIwM2EtOWYxNjI0NmI3MTVj',
            // app:{appAuthKey:'ZmEzNzdmNjktMzQ0Ny00Y2IxLTk2YTMtNWU3MGYwNWFjNzUz' , appId:'e338a31b-4667-471e-9a1a-4aa0c3cf6d5f'}

            sails.log("DISPOSITIVOS", datosDispositivos)

            if (datosDispositivos.length > 0) {

              var listaDispositivos = []
              datosDispositivos.forEach(element => {
                listaDispositivos.push(element.idDispositivo)
              });
              sails.log("dispositivos", listaDispositivos)
              var firstNotification = new OneSignal.Notification({
                contents: {
                  en: datosDispositivos[0].idPersona.nombre + datosDispositivos[0].idPersona.paterno + datosDispositivos[0].idPersona.materno,
                  tr: "Test mesajı"
                },

                include_player_ids: listaDispositivos
              });

              firstNotification.postBody["contents"] = {
                "en": datoAlumno.idPersona.nombre + " " + datoAlumno.idPersona.paterno + " " + datoAlumno.idPersona.materno
              };
              firstNotification.postBody["data"] = {
                "abc": "123",
                "foo": "bar"
              };
              firstNotification.postBody["headings"] = {
                "en": mensaje
              };

              // Add a new target after creating initial notification body  
              // firstNotification.postBody["include_player_ids"].push["3aa608f2-c6a1-11e3-851d-000c2940e62c"]

              myClient.sendNotification(firstNotification, function (err, httpResponse, data) {
                if (err) {
                  console.log('Something went wrong...');
                } else {
                  console.log(data);
                }

              });
            } else {
              // res.send({
              //   mensaje: "no se encontraros dispositivos para este usuario"
              // })
            }


          })

        });

        res.send({
          mensaje: "notificaciòn enviada"
        })

      })
    })





  },
  buscar: function (req, res) {

    var auxNombre = req.param("nombre").split(" ")
    sails.log("numero", parseInt(auxNombre[0], 10) + 10)

    // if (isNaN(parseInt(auxNombre[0], 10))) {

    sails.log("NAN en auxNombre")
    if (auxNombre.length == 2) {
      Persona.find({
        and: [{
            nombre: {
              'contains': auxNombre[0]
            }
          },
          {
            paterno: {
              'contains': auxNombre[1]
            }
          }

        ]
      }).exec(function (err, datoPersona) {

        sails.log("Usuario buscado : ", datoPersona)
        res.send(datoPersona)

      })
    } else if (auxNombre.length == 3) {
      Persona.find({
        and: [{
            nombre: {
              'contains': auxNombre[0]
            }
          },
          {
            paterno: {
              'contains': auxNombre[1]
            }
          },
          {
            materno: {
              'contains': auxNombre[2]
            }
          }
          // ,
          // {
          //     cedula: {
          //         'contains': auxNombre[0]
          //     }
          // }
        ]
      }).exec(function (err, datoPersona) {

        sails.log("Usuario buscado : ", datoPersona)
        res.send(datoPersona)

      })
    } else {
      Persona.find({
        or: [{
            nombre: {
              'contains': auxNombre[0]
            }
          },
          {
            paterno: {
              'contains': auxNombre[0]
            }
          },
          {
            materno: {
              'contains': auxNombre[0]
            }
          },
          {
            identificacion: {
              'contains': auxNombre[0]
            }
          }

        ]
      }).populate("usuario").exec(function (err, datoPersona) {

        sails.log("Usuario buscado : ", datoPersona)


        res.send(datoPersona)

      })
    }


    // } else {

    //     sails.log('BUSCANDO NUMERO : ' + (parseInt(auxNombre[0], 10) + 10))
    //     Persona.find(
    //         {
    //             cedula: { startsWith: parseFloat(auxNombre[0], 10) }

    //         }).exec(function (err, datoPersona) {

    //             sails.log("Usuario buscado : ", datoPersona)
    //             res.send(datoPersona)

    //         })
    // }


  },
  credencial: function (req, res) {

    Usuario.findOne({
      idPersona: req.param("id")
    }).exec(function (err, datoUsuario) {
      res.send(datoUsuario)
    })
  },
  buscar_tutor: function (req, res) {

    var auxNombre = req.param("nombre").split(" ")
    sails.log("numero", parseInt(auxNombre[0], 10) + 10)

    // if (isNaN(parseInt(auxNombre[0], 10))) {

    sails.log("NAN en auxNombre")
    if (auxNombre.length == 2) {
      Persona.find({
        and: [{
            nombre: {
              'contains': auxNombre[0]
            }
          },
          {
            paterno: {
              'contains': auxNombre[1]
            }
          },
          {
            rol: "tutor"
          }


        ]
      }).exec(function (err, datoPersona) {

        sails.log("Usuario buscado : ", datoPersona)
        res.send(datoPersona)

      })
    } else if (auxNombre.length == 3) {
      Persona.find({
        and: [{
            nombre: {
              'contains': auxNombre[0]
            }
          },
          {
            paterno: {
              'contains': auxNombre[1]
            }
          },
          {
            materno: {
              'contains': auxNombre[2]
            }
          },
          {
            rol: "tutor"
          }
          // ,
          // {
          //     cedula: {
          //         'contains': auxNombre[0]
          //     }
          // }
        ]
      }).exec(function (err, datoPersona) {

        sails.log("Usuario buscado : ", datoPersona)
        res.send(datoPersona)

      })
    } else {
      Persona.find({
        rol: "tutor",
        or: [{
            nombre: {
              'contains': auxNombre[0]
            }
          },
          {
            paterno: {
              'contains': auxNombre[0]
            }
          },
          {
            materno: {
              'contains': auxNombre[0]
            }
          },
          {
            identificacion: {
              'contains': auxNombre[0]
            }
          }

        ]
      }).exec(function (err, datoPersona) {

        sails.log("Usuario buscado : ", datoPersona)
        res.send(datoPersona)

      })
    }

    // } else {

    //     sails.log('BUSCANDO NUMERO : ' + (parseInt(auxNombre[0], 10) + 10))
    //     Persona.find(
    //         {
    //             cedula: { startsWith: parseFloat(auxNombre[0], 10) }

    //         }).exec(function (err, datoPersona) {

    //             sails.log("Usuario buscado : ", datoPersona)
    //             res.send(datoPersona)

    //         })
    // }


  },
  buscar_alumno: function (req, res) {

    var auxNombre = req.param("nombre").split(" ")
    sails.log("AUX NOMBRE : ", auxNombre)
    // if (isNaN(parseInt(auxNombre[0], 10))) {
    var listaaux = [];
    listaaux.f
    if (auxNombre.length == 2) {

      sails.log("222222222222222222222222222222222")

      Persona.find({

        rol: "alumno",
        or: [{
            nombre: {
              'contains': auxNombre[0] + " " + auxNombre[1]
            }
          },

          {
            and: [{
                nombre: {
                  'contains': auxNombre[0]
                }
              },
              {
                paterno: {
                  'contains': auxNombre[1]
                }
              }
            ]
          }

        ]
      }).exec(function (err, datoPersona) {

        sails.log("Usuario buscado : ", datoPersona)
        res.send(datoPersona)

      })
    } else if (auxNombre.length == 3) {
      Persona.find({
        rol: "alumno",

        or: [{
            nombre: {
              'contains': auxNombre[0] + " " + auxNombre[1] + " " + auxNombre[2]
            }
          },
          {
            paterno: {
              'contains': auxNombre[1]
            }
          },
          {
            paterno: {
              'contains': auxNombre[2]
            }
          },
          {
            materno: {
              'contains': auxNombre[1]
            }
          },
          {
            materno: {
              'contains': auxNombre[2]
            }
          }
        ]
      }).exec(function (err, datoPersona) {

        sails.log("Usuario buscado : ", datoPersona)
        res.send(datoPersona)

      })
    } else {
      Persona.find({
        rol: "alumno",
        or: [{
            nombre: {
              'contains': auxNombre[0]
            }
          },
          {
            paterno: {
              'contains': auxNombre[0]
            }
          },
          {
            materno: {
              'contains': auxNombre[0]
            }
          },
          {
            identificacion: {
              'contains': auxNombre[0]
            }
          }

        ]
      }).exec(function (err, datoPersona) {

        var n = _.filter(datoPersona, function (obj) {

          return obj.materno == "Guerra";

        });


        // sails.log("Usuario buscado : ", datoPersona)
        res.send(n)

      })
    }

  },
  listar: function (req, res) {
    
  }

};
