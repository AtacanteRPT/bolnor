/**
 * AlumnoController.js
 *
 * @description :: Server-side logic for managing subscriptions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    todo2: function(req, res) {
        res.send(" DESDE CONTROLLER ALUMNO ")
    },

    alumno_tutor: function(req, res) {
        var tutores = [];
        console.log(req.param('id'))
        Alumno.findOne({
            idPersona: req.param('id')

        }).exec(function(err, datoAlumno) {

            if (err) {
                return res.serverError(err);
            }

            console.log("datoAlumno:", datoAlumno);
            Tutor_alumno.find({
                where: {
                    idAlumno: datoAlumno.id
                }

            }).exec(function(err, datoTutor_alumno) {
                if (err) {
                    return res.serverError(err);
                }

                async.forEach(datoTutor_alumno, function(auxTutor, cb) {
                    Tutor.findOne({
                        id: auxTutor.idTutor
                    }).populate('idPersona').exec(function(err, datoTutor) {
                        if (err) {
                            return res.serverError(err);
                        }

                        console.log(datoTutor)
                        tutores.push(datoTutor);
                        sails.log('1:', tutores.length)
                        cb();
                    });
                }, function(error) {
                    sails.log('2:', tutores.length)
                    if (error) return res.negotiate(error);
                    return res.send(tutores)
                });
            })
        });
    },

    actualizar: function(req, res) {

        var id = req.param('id')

        var identificacion = req.param('identificacion')
        Persona.update(id).set({
            identificacion: identificacion
        }).exec(function(err, datoPersona) {
            sails.log('ACTUALIZADO : ', datoPersona)
            res.send(datoPersona)
        })
    },
    adicionar_tutor: function(req, res) {

        Alumno.findOne({
            idPersona: req.param('idAlumno')
        }).exec(function(err, datoAlumno) {
            if (err) {
                return res.serverError(err);
            }

            Tutor.findOne({
                idPersona: req.param('idTutor')
            }).exec(function(err, datoTutor) {
                if (err) {
                    return res.serverError(err);
                }

                if (datoTutor) {
                    sails.log("AlumnoController", datoTutor);
                    Tutor_alumno.create({
                        idAlumno: datoAlumno.id,
                        idTutor: datoTutor.id
                    }).exec(function(err, creado) {
                        if (err) {
                            return res.serverError(err);
                        }

                        console.log('******************************')
                            // return res.redirect('/alumno/tutores/' + req.param('idAlumno'));
                        res.send(creado)

                    });
                } else {
                    res.send('NO ADICIONADO')
                }

            })

        });

    },
    adicionar_tutor_2: function(req, res) {

        var tutor1 = req.param("idTutor1")
        var tutor2 = req.param("idTutor2")
        var tutor3 = req.param("idTutor3")

        Alumno.findOne({
            idPersona: req.param('idAlumno')
        }).exec(function(err, datoAlumno) {
            if (err) {
                return res.serverError(err);
            }

            Tutor.findOne({
                idPersona: req.param('idTutor')
            }).exec(function(err, datoTutor) {
                if (err) {
                    return res.serverError(err);
                }

                if (datoTutor) {
                    sails.log("AlumnoController", datoTutor);
                    Tutor_alumno.create({
                        id: 0,
                        idAlumno: datoAlumno.id,
                        idTutor: datoTutor.id
                    }).exec(function(err, creado) {
                        if (err) {
                            return res.serverError(err);
                        }

                        console.log('******************************')
                            // return res.redirect('/alumno/tutores/' + req.param('idAlumno'));
                        res.send(creado)

                    });
                } else {
                    res.send('NO ADICIONADO')
                }

            })

        });

    },

    curso: function(req, res) {

        var curso = {
            idParalelo: req.query.idParalelo,
            idTurno: req.query.idTurno,
            idGrado: req.query.idGrado,
            idGrupo: req.query.idGrupo
        };
        var gestionActual = 2;
        console.log('TODO QUERY', req.query)
        var asistenciasCurso = []

        Curso.findOne(curso).exec(function(err, datoCurso) {

            if (datoCurso != undefined) {
                sails.log("curso encontrado", datoCurso);
                Inscribe.find({
                    idCurso: datoCurso.id,
                    idGestionAcademica: gestionActual
                }).populate('idAlumno').exec(function(err, inscripciones) {

                    var alumnosCurso = [];
                    async.forEach(inscripciones, function(inscripcion, cb) {


                        if (inscripcion.idAlumno != undefined) {
                            Persona.findOne(inscripcion.idAlumno.idPersona).exec((err, datoPersona) => {

                                alumnosCurso.push(datoPersona)
                                cb();
                            });

                        } else {
                            cb();
                        }



                    }, function(error) {

                        //  var auxListaAlumnosCurso =  _.orderBy(alumnosCurso,["paterno","materno","nombre"],["asc","asc","asc"])
                        // sails.log("AUX LISTA ALUMNOS CURSO",auxListaAlumnosCurso)
                        if (error) return res.negotiate(error);
                        sails.log("alumnos por curso length", alumnosCurso.length)
                        return res.send(alumnosCurso)

                    });
                })
            } else {

                sails.log("NO EXITE EL CURSO ", asistenciasCurso.length)
                res.send(asistenciasCurso)
            }

        })

    },

    tutorMax: function(req, res) {
        var max = 0;
        var obej = {}
        Tutor.find().exec(function(err, datoTutores) {


            async.each(datoTutores, function(element, cb) {
                Tutor_alumno.find({
                    idTutor: element.id
                }).exec(function(err, datoTutor_alumno) {

                    if (datoTutor_alumno.length > max) {
                        max = datoTutor_alumno.length
                        obej = element
                    }
                    cb();
                })

            }, function(error) {


                res.json(obej)
            })


        })

    },
    eliminar_alumno: function(req, res) {
        var id = req.param("id")

        Alumno.findOne({ idPersona: id }).exec(function(err, datoAlumno) {
            Inscribe.destroy({ idAlumno: datoAlumno.id }).exec(function(err, eliminadoInscribe) {
                Alumno.destroy(datoAlumno.id).exec(function(err, eliminadoAlumno) {
                    Persona.destroy(id).exec(function(err, eliminadoPersona) {
                        res.send(eliminadoPersona)
                    })
                })
            })
        })
    }

};