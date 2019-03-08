/**
 * Turno_paralelo_grado_grupoController.js
 *
 * @description :: Server-side logic for managing subscriptions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


var rest = require('restler');
require('../../configuracion')

module.exports = {



    hola: function(req, res) {
        Curso.find().populate("idTurno").exec((err, datoCursos) => {
            if (err) { return res.serverError(err); }
            res.send(datoCursos)
        })
    }

    ,
    todos: (req, res) => {
        var todosLosCursos = []

        Curso.find().exec((err, datoCursos) => {
            if (err) { return res.serverError(err); }

            Turno.find().exec((err, datoTurnos) => {
                if (err) { return res.serverError(err); }

                // async.forEach(datoTurnos, function (datoTurno, cb) {
                //     Curso.find({ idTurno: datoTurno.id }).exec(function (err, datoCursos) {
                //         if (err) { return res.serverError(err); }

                //         Grado.find().exec((err,datoGrado)=>{

                //         })

                //         datoTurno.grados = grados
                //         todosLosCursos.push(datoTurno)

                //         cb();
                //     });

                // }, function (error) {

                //     if (error) return res.negotiate(error);

                //     return res.send(todosLosCursos)
                // });

                Grado.find().exec((err, datoGrados) => {
                    if (err) { return res.serverError(err); }

                    Grupo.find().exec((err, datoGrupos) => {
                        if (err) { return res.serverError(err); }

                        Paralelo.find().exec((err, datoParalelos) => {
                            if (err) { return res.serverError(err); }

                            var todo = [];
                            var turno = {};

                            datoTurnos.forEach(function(turno, indexT) {

                                var auxTurno = {};
                                // sails.log('turno : ', datoTurnos[indexT])
                                var auxCursos = [];
                                datoCursos.forEach(function(curso) {

                                    if (curso.idTurno == turno.id) {
                                        auxCursos.push(curso)
                                    }

                                }, this);
                                sails.log('tamaño Cursos', auxCursos.length)
                                    // sails.log('auxCurso', auxCursos)

                                var auxGrados = [];
                                datoGrados.forEach(function(grado) {
                                    auxCursos.some(function(curso) {
                                        if (curso.idGrado == grado.id) {
                                            auxGrados.push(grado)
                                            return true;
                                        }

                                    }, this);

                                }, this);

                                auxTurno = turno;
                                auxTurno.grados = []
                                    // sails.log('indexT_1', indexT);
                                    // sails.log('auxGradosLength', auxGrados.length);
                                    // sails.log('auxGrados', auxGrados);
                                auxTurno.grados = auxGrados;
                                // todo[indexT] = auxTurno;
                                // todo[indexT].grados = auxGrados;
                                sails.log('auxTurno : ', auxTurno)
                                    // todo.push(datoTurnos[indexT])
                                    // todo.splice(indexT, 0, turno);

                                // if (indexT == 1) {
                                //     todo[1].grados[1].oso = "ricardo"
                                //     res.send(todo)
                                // }

                                // sails.log('todo', todo)
                                // todo[indexT].grados = []
                                auxGrados.forEach(function(grado, indexG) {
                                    // sails.log('grados index', indexG)
                                    var auxGrupo = {};
                                    var auxGrupos = [];
                                    datoGrupos.forEach(function(grupo) {
                                        auxCursos.some(function(curso) {
                                            if (grado.id == curso.idGrado && grupo.id == curso.idGrupo) {
                                                // sails.log('grupo', grupo)
                                                auxGrupos.push(grupo)
                                                return true;
                                            }

                                        }, this);
                                    }, this);

                                    auxGrupo = grado;
                                    // sails.log('auxGrupos', auxGrupos)
                                    auxGrupo.grupos = auxGrupos;
                                    //  sails.log('grado.grupos', grado.grupos)
                                    //  sails.log('gardo1', grado)

                                    sails.log('indexT_1', indexT);
                                    sails.log('indexG :', indexG);
                                    // todo[indexT].grados.push(grado)

                                    // todo[indexT].grados.splice(indexG, 0, "Lene");

                                    auxTurno.grados[indexG].grupos = [];
                                    auxTurno.grados[indexG].grupos = auxGrupos;
                                    // console.log('grupos++ ', todo[indexT].grados[indexG].grupos)

                                    // sails.log('TODO : ',todo[indexT].grados[indexG])
                                    // todo[indexT].grados[indexG].grupos = [];
                                    //    sails.log('todo', todo)
                                    // sails.log('gardo2', grado)

                                    // auxGrupos.forEach(function (grupo, indexGr) {
                                    //     sails.log('grupo index', indexGr)
                                    //     var auxParalelos = [];
                                    //     datoParalelos.forEach(function (paralelo) {
                                    //         auxCursos.some(function (curso) {
                                    //             if (grupo.id == curso.idGrupo && grado.id == curso.idGrado && paralelo.id == curso.idParalelo) {
                                    //                 sails.log('paralelo: ', paralelo);
                                    //                 auxParalelos.push(paralelo)
                                    //                 return true;
                                    //             }

                                    //         }, this);
                                    //     }, this);

                                    //     grupo.paralelos = auxParalelos;
                                    //     // sails.log('paralelos', grupo.paralelos.length)
                                    //     // sails.log('indexT_3', indexT);
                                    //     todo[indexT].grados[indexG].grupos[indexGr].paralelos = [];
                                    //     todo[indexT].grados[indexG].grupos[indexGr].paralelos = auxParalelos;
                                    //     auxParalelos = [];

                                    // }, this);

                                }, this);

                                todo.push(auxTurno)
                                auxTurno = {};
                                turno = null;

                                sails.log('****************')

                            }, this);

                            console.log('llego aqui')
                            res.send(todo)
                        })
                    })
                })

            })
        })

    },

    mostrar_turno2: (req, res) => {
        var todosLosCursos = []

        Curso.find().exec((err, datoCursos) => {
            if (err) { return res.serverError(err); }
            sails.log("TOTAL CURSO :: ", datoCursos.length)

            Turno.findOne(req.param('id')).exec((err, turno) => {
                if (err) { return res.serverError(err); }

                Grado.find().exec((err, datoGrados) => {
                    if (err) { return res.serverError(err); }

                    Grupo.find().exec((err, datoGrupos) => {
                        if (err) { return res.serverError(err); }

                        Paralelo.find().exec((err, datoParalelos) => {
                            if (err) { return res.serverError(err); }

                            var auxCursos = [];
                            var auxTurno = {};

                            datoCursos.forEach(function(curso) {

                                if (curso.idTurno == turno.id) {
                                    auxCursos.push(curso)
                                }

                            }, this);
                            sails.log('tamaño Cursos', auxCursos.length)
                                // sails.log('auxCurso', auxCursos)

                            var auxGrados = [];
                            datoGrados.forEach(function(grado) {
                                auxCursos.some(function(curso) {
                                    if (curso.idGrado == grado.id) {
                                        auxGrados.push(grado)
                                        return true;
                                    }

                                }, this);

                            }, this);

                            turno.grados = []
                            turno.grados = auxGrados;
                            auxGrados.forEach(function(grado, indexG) {
                                // sails.log('grados index', indexG)
                                var auxGrupos = [];
                                datoGrupos.forEach(function(grupo) {
                                    auxCursos.some(function(curso) {
                                        if (grado.id == curso.idGrado && grupo.id == curso.idGrupo) {
                                            // sails.log('grupo', grupo)

                                            auxGrupos.push(grupo)
                                            return true;
                                        }

                                    }, this);
                                }, this);
                                grado.grupos = auxGrupos;
                                turno.grados[indexG].grupos = [];
                                turno.grados[indexG].grupos = auxGrupos;

                                // auxGrupos.forEach(function(grupo, indexGr) {
                                //     sails.log('grupo index', indexGr)
                                //     var auxParalelos = [];
                                //     datoParalelos.forEach(function(paralelo) {
                                //         auxCursos.some(function(curso) {
                                //             if (grupo.id == curso.idGrupo && grado.id == curso.idGrado && paralelo.id == curso.idParalelo) {
                                //                 sails.log('paralelo: ', paralelo);
                                //                 paralelo.idCurso = curso.id;
                                //                 auxParalelos.push(paralelo)
                                //                 return true;
                                //             }

                                //         }, this);
                                //     }, this);

                                //     grupo.paralelos = auxParalelos;
                                //     // sails.log('paralelos', grupo.paralelos.length)
                                //     // sails.log('indexT_3', indexT);

                                //     var auxParalelo = auxParalelos;

                                //     // turno.grados[indexG].grupos[indexGr].paralelos = [];
                                //     turno.grados[indexG].grupos[indexGr].paralelos = auxParalelos;

                                // }, this);

                            }, this);

                            sails.log('****************')

                            console.log('llego aqui')
                            res.send(turno)
                        })
                    })
                })

            })
        })

    },

    paralelos: (req, res) => {

        var curso = {
            idTurno: req.query.idTurno,
            idGrado: req.query.idGrado,
            idGrupo: req.query.idGrupo
        };


        Curso.find(curso).populate("idParalelo").exec((err, datoCursos) => {
            if (err) { return res.serverError(err); }

            if (datoCursos != null) {
                var paralelos = []

                async.each(datoCursos, function(curso, cb, i) {
                    var auxCurso = curso.idParalelo
                    auxCurso.idCurso = curso.id
                    paralelos.push(auxCurso)
                    cb();

                }, function(error) {

                    res.json(paralelos)
                });
            } else {
                res.json("curso no encontrado")
            }
        })
    },

    mostrar_turno3: (req, res) => {


        Curso.find().exec((err, datoCursos) => {
            if (err) { return res.serverError(err); }

            Turno.findOne(req.param('id')).exec((err, turno) => {
                if (err) { return res.serverError(err); }

                Grado.find().exec((err, datoGrados) => {
                    if (err) { return res.serverError(err); }

                    Grupo.find().exec((err, datoGrupos) => {
                        if (err) { return res.serverError(err); }

                        Paralelo.find().exec((err, datoParalelos) => {
                            if (err) { return res.serverError(err); }

                            var auxCursos = [];
                            var auxTurno = {};






                            res.send(turno)
                        })
                    })
                })

            })
        })


    },

    mostrar_turno: (req, res) => {

        var auxLista = {}

        var idTurno = req.param("id")

        rest.get(DOMINIO_A2HOSTING + 'curso/mostrar_turno2/' + idTurno).on('complete', function(result) {
                sails.log(result.grados[2])
                auxLista = result;
                var auxGrados = []
                async.each(result.grados, function(grado, cb) {

                    var auxGrupos = []
                    async.each(grado.grupos, function(grupo, cb2) {


                        var consultaCurso = {
                            idTurno: idTurno,
                            idGrado: grado.id,
                            idGrupo: grupo.id
                        };

                        Curso.find(consultaCurso).populate("idParalelo").populate("idGrupo").exec((err, datoCursos) => {
                            if (err) { return res.serverError(err); }

                            sails.log("Nombre :", datoCursos)
                            if (datoCursos.length > 0) {
                                sails.log("Distinto de nulo :", datoCursos.length)
                                var paralelos = []

                                async.each(datoCursos, function(curso, cb3) {
                                    var auxCurso = curso.idParalelo
                                    auxCurso.idCurso = curso.id
                                    sails.log("***CURSO**** :", auxCurso)
                                    paralelos.push(auxCurso)
                                    cb3();

                                }, function(error) {
                                    grupo.paralelos = paralelos;
                                    auxGrupos.push(grupo)
                                    cb2();
                                });
                            } else {
                                res.json("curso no encontrado")
                            }
                        })

                    }, function(error) {

                        var auxGrado = {
                            id: grado.id,
                            nombre: grado.nombre,
                            grupos: auxGrupos
                        }

                        auxGrados.push(auxGrado);

                        cb();


                    })

                }, function(error) {

                    var nuevaLista = {
                        id: result.id,
                        nombre: result.nombre,
                        grados: auxGrados
                    }

                    res.json(nuevaLista)
                })

            })
            // res.json("nada")

    },

    completo: function(req, res) {

        Curso.find({ where: {} }).exec((err, datoCursos) => {
            if (err) { return res.serverError(err); }

        })

    },
    migrarCurso: function(req, res) {

        var idCurso2018 = req.param('antes');
        var idCurso2019 = req.param('despues');
        Inscribe.find({ idCurso: idCurso2018, idGestionAcademica: 1 }).exec((err, datoInscripciones) => {
            if (err) { return res.serverError(err); }
            async.each(datoInscripciones, function(inscripcion, cb) {

                Inscribe.create({ idGestionAcademica: 2, idCurso: idCurso2019, idAlumno: inscripcion.idAlumno }).fetch().exec(function(err, datoInscripcion) {
                    console.log("CURSO ACTUALIZADO", datoInscripcion)
                    cb()
                });

            }, function(error) {

                sails.log("-------------------FINAL LISTA -----------------------")
                return res.send("Todo CAMBIO EL CURSO")
            });

        });


    }

};