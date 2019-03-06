// var SerialPort = require('serialport');
// var rest = require('restler');
var moment = require('moment')
    // var baseidentificacion = ''
var actualIdentificacion = '0'
var rest = require('restler');
var async = require('async');
var auxAlumno = {
    identificacion: 0,
    materno: 'materno',
    paterno: 'paterno',
    nombre: 'nombre',
    curso: 'predeterminado',
    turno: 'predeterminado',
    img: "",
    tutores: []
}

require('../../configuracion')

// var express = require('express'),
//   app = express(),
//   http = require('http'),
//   socketIo = require('socket.io');
// var server = http.createServer(app);
// var io = socketIo.listen(server);

// server.listen(1338);
// console.log('Server Sockets: el puerto 1338');

// //  var socketIo = require('socket.io');

// // var io = socketIo.listen(sails.hooks.http.server);

// var port_1 = new SerialPort('COM4', {
//     baudRate: 57600
// });
// var port_2 = new SerialPort('COM7', {
//     baudRate: 57600
// });

// port_1.on('data', function(data) {
//     console.log("mensjae ", data.toString())

// });

var horaActual = ''
var maxHoraLlegada = 9;
var minsLlegada = 0;
var minHoraSalidaT = 17;
var minHoraSalidaM = 9;
var minsSalida = 0;
var moment_time = require("moment-timezone")


module.exports = {

    mostrar: function(req, res) {
        var hoy = new Date();
        var baseidentificacion = req.param('baseidentificacion')
        console.log("CLIENTE : ", req.param("baseidentificacion"))

        var fecha = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate()
        var fecha2 = moment().format("YYYY-MM-DD");

        sails.log("**********FECHA**************", fecha);
        sails.log("**********FECHA 2+++++++++++++++", fecha2);

        // horaActual = moment().format('LTS')
        horaActual = moment_time.tz('America/La_Paz').format('LTS')

        actualIdentificacion = baseidentificacion;
        Persona.findOne({
            identificacion: actualIdentificacion
        }).exec((err, datoPersona) => {
            if (datoPersona == undefined) {
                auxAlumno = {};
                auxAlumno.nombre = 'NO'
                auxAlumno.paterno = 'ENCONTRADO NINGUN'
                auxAlumno.materno = 'USUARIO CON ESTE CODIGO, registre porfavor'
                baseidentificacion = '';
                return res.send(auxAlumno);
            }

            if (datoPersona.rol == "alumno") {

                var listaTutores = [];
                Alumno.findOne({
                    idPersona: datoPersona.id
                }).exec((err, auxALumno) => {
                    Tutor_alumno.find({
                        idAlumno: auxALumno.id
                    }).populate("idTutor").exec((err, auxTutores) => {
                        if (err) {
                            return res.serverError(err);
                        }
                        if (auxTutores.length > 0) {

                            async.each(auxTutores, function(elementoAlumno, cb) {
                                Persona.findOne(elementoAlumno.idTutor.idPersona).exec((err, datoTutor) => {
                                    listaTutores.push(datoTutor)
                                    cb();
                                })

                            }, function(error) {

                                datoPersona.alumnos = listaTutores;
                            })

                        }
                    });
                })


                var query = "SELECT p.nombre as paralelo, t.nombre as turno, g.nombre as grupo, tmpCurso.nombre , tmpCurso.paterno ,tmpCurso.materno,tmpCurso.img, tmpCurso.id as idAlumno ,tmpCurso.idCurso, tmpCurso.idPersona from paralelo p, turno t, grupo g , (SELECT c.idParalelo, c.idTurno,c.idGrupo, tmpInscribe.nombre, tmpInscribe.img, tmpInscribe.paterno,tmpInscribe.materno, tmpInscribe.idPersona, tmpInscribe.id, tmpInscribe.idCurso from curso c , (SELECT i.idCurso, tmpAlumno.nombre, tmpAlumno.paterno,tmpAlumno.materno, tmpAlumno.img, tmpAlumno.id, tmpAlumno.idPersona from inscribe i , (select p.nombre , p.paterno, p.materno , p.img, p.id as idPersona, a.id from persona p, alumno a where p.identificacion = $1 and p.id = a.idPersona) tmpAlumno where i.idAlumno = tmpAlumno.id) tmpInscribe where c.id = tmpInscribe.idCurso)tmpCurso WHERE p.id = tmpCurso.idParalelo and t.id = tmpCurso.idTurno and g.id = tmpCurso.idGrupo"
                    // Persona.query(query, [actualIdentificacion], function (err, consulta) {



                sails.sendNativeQuery(query, [actualIdentificacion], function(err, result) {
                    var consulta = result.rows;
                    sails.log('RESULTADO QUERY', result.rows)
                    if (err) {
                        return res.serverError(err);
                    }

                    var resultado = {}

                    console.log('tamaño console length', consulta.length)
                    if (consulta.length > 0) {
                        resultado = consulta[consulta.length - 1]
                    } else {

                        resultado = datoPersona
                        resultado.curso = 'No inscrito'
                        resultado.turno = 'No inscrito'
                        resultado.paralelo = 'No inscrito'
                        resultado.grupo = ''
                        sails.log('++++++++ ERROE EN CONSULTA +++++ devolviendo persona', resultado);
                    }
                    sails.log("RESULTADO", resultado)

                    Asistencia.findOne({
                        idPersona: resultado.idPersona,
                        fecha: fecha
                    }).exec((err, datoAsistencia) => {
                        console.log('fechaAsistencia', datoAsistencia)

                        if (datoAsistencia == null) {
                            console.log('paso 2 creando nuevo')
                            Asistencia.create({
                                fecha: fecha,
                                estado: 'asistió',
                                hora_llegada: horaActual,
                                hora_salida: horaActual,
                                idGestionAcademica: 1,
                                idPersona: resultado.idPersona
                            }).fetch().exec((err, datoAsistencia) => {
                                if (err) {
                                    return res.serverError(err);
                                }

                                auxAlumno = {
                                    identificacion: actualIdentificacion,
                                    materno: resultado.materno,
                                    paterno: resultado.paterno,
                                    nombre: resultado.nombre,
                                    curso: resultado.grupo + " " + resultado.paralelo,
                                    turno: resultado.turno,
                                    img: resultado.img,
                                    rol: "alumno"
                                }


                                auxAlumno.hora_llegada = moment().format('LTS')
                                auxAlumno.hora_salida = moment().format('LTS') + '(no registrado)'
                                auxAlumno.tutores = listaTutores;

                                rest.postJson(DOMINIO_A2HOSTING + 'persona/notificar_tutor', {
                                    id: datoPersona.id,
                                    mensaje: " Hora Llegada : " + datoAsistencia.hora_salida
                                }).on('complete', function(data3, response3) {
                                    // handle response
                                    sails.log("se enviò una notificaciòn")
                                });
                                console.log("nuevo", auxAlumno)
                                return res.send(auxAlumno);

                            });
                        } else {
                            console.log('paso 4 actualizando salida')
                            sails.log("fecha :", fecha)
                            sails.log("resultado idPersona", resultado.idPersona)
                            Asistencia.update(datoAsistencia.id).set({
                                    hora_salida: horaActual
                                })
                                .fetch().exec((err, datoAsistencia2) => {
                                    if (err) {
                                        return res.serverError(err);
                                    }

                                    console.log('actualizado', datoAsistencia2)

                                    auxAlumno = {
                                        identificacion: actualIdentificacion,
                                        materno: resultado.materno,
                                        paterno: resultado.paterno,
                                        nombre: resultado.nombre,
                                        curso: resultado.grupo + " " + resultado.paralelo,
                                        turno: resultado.turno,
                                        img: resultado.img,
                                        rol: "alumno",
                                        hora_llegada: datoAsistencia2[0].hora_llegada,
                                        hora_salida: datoAsistencia2[0].hora_salida
                                    }
                                    auxAlumno.tutores = listaTutores;


                                    rest.postJson(DOMINIO_A2HOSTING + 'persona/notificar_tutor', {
                                        id: datoPersona.id,
                                        mensaje: " Hora Salida : " + datoAsistencia.hora_salida
                                    }).on('complete', function(data3, response3) {
                                        // handle response
                                        sails.log("se enviò una notificaciòn")
                                    });

                                    res.send(auxAlumno);
                                })

                        }


                    })
                });
            } else if (datoPersona.rol == "tutor") {
                sails.log("DATO PERSONA _ tutor", datoPersona)
                Tutor.findOne({
                    idPersona: datoPersona.id
                }).exec((err, auxTutor) => {
                    Tutor_alumno.find({
                        idTutor: auxTutor.id
                    }).populate("idAlumno").exec((err, auxAlumnos) => {
                        if (err) {
                            return res.serverError(err);
                        }
                        sails.log("+++++++++++++++++auxALumno+++++++++++++++++", auxAlumnos[0])

                        var listaAlumnos = [];
                        if (auxAlumnos.length > 0) {

                            async.each(auxAlumnos, function(elementoAlumno, cb) {
                                Persona.findOne(elementoAlumno.idAlumno.idPersona).exec((err, datoAlumno) => {
                                    listaAlumnos.push(datoAlumno)
                                    cb();
                                })

                            }, function(error) {

                                datoPersona.alumnos = listaAlumnos;
                                res.json(datoPersona)
                            })

                            // rest.postJson(DOMINIO + 'asistencia/mostrar', {
                            //   baseidentificacion: auxPersona.identificacion
                            // }).on('complete', function (data2, response2) {
                            //   // handle response
                            //   res.send(data2)
                            // });

                        } else {
                            res.send(auxAlumno)
                        }
                    });
                })
            } else if (datoPersona.rol == "administrador" || datoPersona.rol == "profesor") {
                Asistencia.findOne({
                    idPersona: datoPersona.id,
                    fecha: fecha
                }).exec((err, datoAsistencia) => {
                    console.log('fechaAsistencia', datoAsistencia)

                    if (datoAsistencia == null) {
                        console.log('paso 2 creando nuevo')
                        Asistencia.create({
                            fecha: fecha,
                            estado: 'asistió',
                            hora_llegada: horaActual,
                            hora_salida: horaActual,
                            idGestionAcademica: 1,
                            idPersona: datoPersona.id
                        }).fetch().exec((err, datoAsistencia) => {
                            if (err) {
                                return res.serverError(err);
                            }

                            auxAlumno = {
                                identificacion: actualIdentificacion,
                                materno: datoPersona.materno,
                                paterno: datoPersona.paterno,
                                nombre: datoPersona.nombre,
                                curso: "",
                                turno: "",
                                img: datoPersona.img,
                                rol: "alumno",
                                tutores: []
                            }


                            auxAlumno.hora_llegada = moment().format('LTS')
                            auxAlumno.hora_salida = moment().format('LTS') + '(no registrado)'

                            // rest.postJson(DOMINIO_A2HOSTING + 'persona/notificar_tutor', {
                            //   id: datoPersona.id,
                            //   mensaje: " Hora Llegada : " + datoAsistencia.hora_salida
                            // }).on('complete', function (data3, response3) {
                            //   // handle response
                            //   sails.log("se enviò una notificaciòn")
                            // });
                            console.log("nuevo", auxAlumno)
                            return res.send(auxAlumno);

                        });
                    } else {
                        console.log('paso 4 actualizando salida')
                        sails.log("fecha :", fecha)
                            // sails.log("resultado idPersona", resultado.idPersona)
                        Asistencia.update(datoAsistencia.id).set({
                                hora_salida: horaActual
                            })
                            .fetch().exec((err, datoAsistencia2) => {
                                if (err) {
                                    return res.serverError(err);
                                }

                                console.log('actualizado', datoAsistencia2)

                                auxAlumno = {
                                    identificacion: actualIdentificacion,
                                    materno: datoPersona.materno,
                                    paterno: datoPersona.paterno,
                                    nombre: datoPersona.nombre,
                                    curso: "",
                                    turno: "",
                                    img: datoPersona.img,
                                    rol: "alumno",
                                    hora_llegada: datoAsistencia2[0].hora_llegada,
                                    hora_salida: datoAsistencia2[0].hora_salida,
                                    tutores: []
                                }


                                // rest.postJson(DOMINIO_A2HOSTING + 'persona/notificar_tutor', {
                                //   id: datoPersona.id,
                                //   mensaje: " Hora Salida : " + datoAsistencia.hora_salida
                                // }).on('complete', function (data3, response3) {
                                //   // handle response
                                //   sails.log("se enviò una notificaciòn")
                                // });

                                res.send(auxAlumno);
                            })

                    }


                })
            }

        })

        // } else {
        //     console.log('actualIdentifiacion', actualIdentificacion);
        //     console.log('baseIdentificacion', baseidentificacion);
        //     console.log('repedito')
        //     res.send(auxAlumno)
        // }

    },
    cambioHora: function(req, res) {

        minHoraSalida = parseInt((req.body.minHoraSalida).substring(0, 2))
        minsSalida = parseInt((req.body.minHoraSalida).substring(3, 5))
        actualIdentificacion = '0'
        console.log('minHoraSalida', minHoraSalida)
        console.log('minsSalida', minsSalida)
        res.json('ajuste horario cambiado')

    },

    historial: function(req, res) {

        // sails.log(HOLA)


        sails.log("user -asistenciaController", req.user)

        var id = req.user.id;

        var tutor = {
            id: req.user.idPersona,
            nombre: req.user.nombre,
            paterno: req.user.paterno,
            materno: req.user.materno,
            alumnos: []
        }

        if (req.user.rol == "alumno") {
            Asistencia.find({
                where: {
                    idPersona: id
                },
                sort: 'fecha ASC'
            }).exec((err, datoAsistencias) => {

                res.send(datoAsistencias)
            });
        } else if (req.user.rol == "tutor") {

            sails.log("DATO PERSONA", datoPersona)

            var tutor = {
                id: req.user.idPersona,
                nombre: req.user.nombre,
                paterno: req.user.paterno,
                materno: req.user.materno,
                alumnos: []
            }
            Tutor.findOne({
                idPersona: id
            }).exec((err, auxTutor) => {

                Tutor_alumno.find({
                    idTutor: auxTutor.id
                }).populate("idAlumno").exec((err, auxAlumnos) => {

                    sails.log("+++++++++++++++++auxALumno+++++++++++++++++", auxAlumnos)
                    if (auxAlumno.length > 0) {

                        async.each(auxAlumnos, function(datoAlumno, cb) {

                            Persona.findOne(datoAlumno.idAlumno.idPersona).exec(function(err, datoPersona) {
                                Asistencia.find({
                                    where: {
                                        idPersona: datoAlumno.idAlumno.idPersona
                                    },
                                    sort: 'fecha ASC'
                                }).exec((err, datoAsistencias) => {
                                    datoPersona.asistencias = datoAsistencias
                                    tutor.alumnos.push(datoPersona)
                                });
                            })
                        }, function(error) {
                            res.send(tutor)
                        });
                    } else {
                        res.send(tutor)
                    }
                });
            })
        }
    },

    historial_alumno: function(req, res) {

        var id = req.user.id;

        Asistencia.find({
            where: {
                idPersona: id
            },
            sort: 'fecha ASC'
        }).exec((err, datoAsistencias) => {

            res.send(datoAsistencias)
        });
    },
    historial_por_tutor: function(req, res) {

        var id = req.user.id;

        var tutor = {
            id: req.user.idPersona,
            nombre: req.user.nombre,
            paterno: req.user.paterno,
            materno: req.user.materno,
            alumnos: []
        }
        Tutor.findOne({
            idPersona: id
        }).exec((err, auxTutor) => {

            Tutor_alumno.find({
                idTutor: auxTutor.id
            }).populate("idAlumno").exec((err, auxAlumnos) => {

                sails.log("+++++++++++++++++auxALumno+++++++++++++++++", auxAlumnos)

                // sails.log("+++++++++++++++++LENGTH+++++++++++++++++", auxAlumno.l)
                if (auxAlumnos.length > 0) {

                    async.each(auxAlumnos, function(datoAlumno, cb) {

                        Persona.findOne(datoAlumno.idAlumno.idPersona).exec(function(err, datoPersona) {
                            sails.log("DATO PERSONA - Alumno", datoPersona)
                            Asistencia.find({
                                where: {
                                    idPersona: datoPersona.id
                                },
                                sort: 'fecha ASC'
                            }).exec((err, datoAsistencias) => {
                                datoPersona.asistencias = datoAsistencias
                                tutor.alumnos.push(datoPersona)
                                cb();
                            });
                        })
                    }, function(error) {
                        res.send(tutor)
                    });
                } else {

                    res.send(tutor)
                }
            });
        })
    },
    historial_docente: function(req, res) {

        var id = req.user.id;

        Asistencia.find({
            where: {
                idPersona: id
            },
            sort: 'fecha ASC'
        }).exec((err, datoAsistencias) => {

            res.send(datoAsistencias)
        });
    },
    historial_administrativo: function(req, res) {

        var id = req.user.id;
        console.log("historial administrativo")
        Asistencia.find({
            where: {
                idPersona: id
            },
            sort: 'fecha ASC'
        }).exec((err, datoAsistencias) => {
            res.send(datoAsistencias)
        });
    }

};

// module.exports = {}