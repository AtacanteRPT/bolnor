// import { defaultFormatUtc } from "moment";

/**
 * UsuarioController.js
 *
 * @description :: Server-side logic for managing subscriptions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

const bcrypt = require('bcrypt-nodejs');
var moment = require('moment')

module.exports = {

    cambiarPassword: function(req, res) {
        var actualPassword = req.param("actualPassword"),
            nuevoPassword = req.param("nuevoPassword")
        Usuario.findOne({
            idPersona: req.user.id
        }).exec(function(err, user) {

            console.log("PASSWORD", user.password)
            bcrypt.compare(actualPassword, user.password, function(err, datoPass) {
                if (!datoPass) {
                    res.status(403)
                    return res.json({
                        mensaje: "password actual incorrecto "
                    })
                }
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(nuevoPassword, salt, null, function(err, hash) {
                        Usuario.update(
                            user.id
                        ).set({
                            password: hash
                        }).exec(function(err, datoUsuario) {
                            if (err) {
                                return res.serverError(err);
                            }
                            res.json({
                                mensaje: 'cambio de password exitoso'
                            })
                        })
                    });
                });
                // sails.log("Passport.js - userDetails", userDetails)
            });
        });

    },
    resetearPassword: function(req, res) {
        var id = req.param("id")
        var nuevoPassword = "";
        Usuario.findOne({
            idPersona: id
        }).exec(function(err, datoUsuario) {
            nuevoPassword = datoUsuario.username
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(nuevoPassword, salt, null, function(err, hash) {
                    Usuario.update(datoUsuario.id).set({
                        password: hash
                    }).exec(function(err, datoUsuario) {
                        res.json({
                            mensaje: 'se a reseteado el password'
                        })
                    })
                });
            });
        })
    },

    actualizarUsuarios: function(req, res) {

        Usuario.find().populate('idPersona').exec(function(err, datoUsuarios) {
            datoUsuarios.forEach(function(usuario) {
                Usuario.update(usuario.id).set({ username: usuario.idPersona.identificacion }).then(dato => {
                    console.log('USUARIO', usuario)
                }).catch(err => {
                    return res.serverError(err);
                })
            }, this);
        })
    },
    actualizarPasswords: function(req, res) {
        var nuevoPassword = "";
        Usuario.find().exec(function(err, datoUsuarios) {
            async.eachSeries(datoUsuarios, function(usuario, cb) {
                console.log("usuario:", usuario)
                nuevoPassword = usuario.username
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(usuario.username, salt, null, function(err, hash) {
                        Usuario.update(usuario.id).set({
                            password: hash
                        }).exec(function(err, datoUsuario) {
                            console.log("FIN*****", usuario)
                            cb();
                        })
                    });
                });
            }, function(error) {

                sails.log("-------------------FINAL LISTA -----------------------")


            });

        })

        res.json({
            mensaje: 'se a reseteado el password'
        })
    },


    otro: function(req, res) {
        var horaActual = moment().format('LTS')

        Asistencia.update({
                idPersona: 1
            }).set({
                hora_salida: horaActual
            })
            .fecth().exec((err, datoAsistencia2) => {
                console.log('actualizado', datoAsistencia2)

                auxAlumno = {
                    identificacion: actualIdentificacion,
                    materno: resultado.materno,
                    paterno: resultado.paterno,
                    nombre: resultado.nombre,
                    curso: resultado.grupo + " " + resultado.paralelo,
                    turno: resultado.turno,
                    img: resultado.img,
                    hora_llegada: datoAsistencia2[0].hora_llegada,
                    hora_salida: datoAsistencia2[0].hora_salida
                }

                // rest.postJson(DOMINIO + 'persona/notificar', { id: datoPersona.id, mensaje: " Hora Salida : " + datoAsistencia.hora_salida }).on('complete', function (data3, response3) {
                //     // handle response
                //     sails.log("se enviò una notificaciòn")
                // });

                res.send(auxAlumno);
            })
    }


}