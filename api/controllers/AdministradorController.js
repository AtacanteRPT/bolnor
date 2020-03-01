/**
 * AdministradorController
 *
 * @description :: Server-side logic for managing Administradors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var async = require('async');
var csvjson = require('csvjson');
var fs = require('fs');
var path = require('path')
var tutor = {};
var codigoFoto = "";
var rest = require('restler');
var qr = require('qr-image');
var stringify = require('csv-stringify');
var unirest = require('unirest');
const bcrypt = require('bcrypt-nodejs');

function recortarNombre(estudiante1) {
    var auxPersona = {};
    var nombreCompletoEstudiante = estudiante1.split(" ");
    auxPersona.nombre = nombreCompletoEstudiante[0]
    auxPersona.paterno = nombreCompletoEstudiante[1]

    if (nombreCompletoEstudiante.length == 3) {
        auxPersona.materno = nombreCompletoEstudiante[2]
    } else if (nombreCompletoEstudiante.length == 4) {
        auxPersona.materno = nombreCompletoEstudiante[2] + " " + nombreCompletoEstudiante[3]
    } else {
        var auxNombre = "";
        for (var index = 2; index < nombreCompletoEstudiante.length; index++) {

            if (index + 1 == nombreCompletoEstudiante.length) {
                auxNombre = auxNombre + nombreCompletoEstudiante[index]
            } else {
                auxNombre = auxNombre + nombreCompletoEstudiante[index] + " "
            }

        }
        auxPersona.materno = auxNombre;
    }
    sails.log("auxpersona: ", auxPersona)
    return auxPersona;
}

function recortarNombre2(estudiante1) {

    var auxPersona = {};
    var nombreCompletoEstudiante = estudiante1.split(" ");

    auxPersona.paterno = nombreCompletoEstudiante[0]
    auxPersona.materno = nombreCompletoEstudiante[1]

    if (nombreCompletoEstudiante.length == 3) {
        auxPersona.nombre = nombreCompletoEstudiante[2]
    } else if (nombreCompletoEstudiante.length == 4) {
        auxPersona.nombre = nombreCompletoEstudiante[2] + " " + nombreCompletoEstudiante[3]
    } else {
        var auxNombre = "";
        for (var index = 2; index < nombreCompletoEstudiante.length; index++) {

            if (index + 1 == nombreCompletoEstudiante.length) {
                auxNombre = auxNombre + nombreCompletoEstudiante[index]
            } else {
                auxNombre = auxNombre + nombreCompletoEstudiante[index] + " "
            }

        }
        auxPersona.nombre = auxNombre;
    }
    sails.log("auxpersona: ", auxPersona)
    return auxPersona;
}


// function adicionar_tutor_alumno(tutor, alumno) {

//     Persona.findOne(recortarNombre(alumno)).exec(function(err, datoAlumno) {
//         if (datoAlumno != undefined) {

//             rest.postJson('http://localhost:1337/alumno/adicionar_tutor', { idTutor: tutor.id, idAlumno: datoAlumno.id }).on('complete', function(data2, response2) {
//                 // handle response
//                 console.log('tutor adicionado', data2)
//                 sails.log("---------------ADICIONADO TUTOR con exito--------------------")
//             });
//         }
//     });

// }
function adicionar_tutor_alumno(tutor, alumno) {

    rest.postJson('http://moswara.com:48000/alumno/adicionar_tutor', {
        idTutor: tutor.id,
        idAlumno: alumno.id
    }).on('complete', function(data2, response2) {
        // handle response
        console.log('tutor adicionado', data2)
        sails.log("---------------ADICIONADO TUTOR con exito--------------------")
    });


}


// function adicionar_tutor_alumno(tutor, alumno) {


//     if (alumno != undefined) {

//         rest.postJson('http://localhost:1337/alumno/adicionar_tutor', { idTutor: tutor.id, idAlumno: alumno.id }).on('complete', function(data2, response2) {
//             // handle response
//             console.log('tutor adicionado', data2)
//             sails.log("---------------ADICIONADO TUTOR con exito--------------------")
//         });
//     }


// }




module.exports = {


    actualizarPassword: function(req, res) {
        Persona.find({
            rol: "tutor"
        }).exec(function(err, datoPersonas) {

            if (err) {
                return res.serverError(err)
            };
            sails.log("LENGTH :", datoPersonas.length)
            datoPersonas.forEach(element => {


                var nuevoPassword = element.identificacion
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(nuevoPassword, salt, null, function(err, hash) {
                        Usuario.update({ idPersona: element.id }).set({
                            username: element.identificacion,
                            password: hash
                        }).exec(function(err, datoUsuario) {
                            console.log("resetado", element)
                        })
                    });

                })

            });
            res.send("BUCLE TERMINADO")

        })
    },

    actualizarPadres: function(req, res) {
        var csvFilePath = '../.././assets/cvs/kinder-prekinder_amerinst_tarde.csv'

        var nuevasPersonas = [];
        var data = fs.readFileSync(path.join(__dirname, csvFilePath), {
            encoding: 'utf8'
        });
        var options = {
            delimiter: ';', // optional
            quote: '"' // optional
        };

        nuevasPersonas = csvjson.toObject(data, options);

        var nro = 10166;

        async.eachSeries(nuevasPersonas, function(persona, callback) {



            if (persona.t2paterno.length == 0) {
                persona.tnombre = "x";
                persona.tpaterno = "x";
                callback(null);
            } else {

                codigoFoto = persona.codigoFoto

                tutor = {
                    nombre: persona.t2nombre,
                    paterno: persona.t2paterno,
                    materno: persona.t2materno + " " + persona.t2materno2,
                    rol: "tutor"
                }

                var auxIdentificacion = nro + tutor.paterno.charAt(0) + tutor.materno.charAt(0) + tutor.nombre.charAt(0)

                Persona.update(tutor, {
                    identificacion: auxIdentificacion
                }).exec(function(err, datoPersona) {
                    sails.log(datoPersona)
                    nro++;
                    callback(null);
                });

                // rest.postJson('http://localhost:1337/api/persona', tutor).on('complete', function(data, response) {
                //     // handle response
                //     console.log('Persona Creada', data)

                //     if (persona.codigoFoto.length > 0) {

                //         Persona.findOne({ identificacion: persona.codigoFoto }).exec(function(err, datoALumno) {

                //             sails.log("personaEncontrada:", datoALumno)
                //             rest.postJson('http://localhost:1337/alumno/adicionar_tutor', { idTutor: data.id, idAlumno: datoALumno.id }).on('complete', function(data2, response2) {
                //                 // handle response
                //                 console.log('tutor adicionado', data2)

                //             });

                //         })
                //     }

                //     nro++;
                //     callback(null);

                // });

            }



        }, function(error) {

            sails.log("-------------------FINAL LISTA -----------------------")


        });
        res.send('NADA')

    },
    adicionarPersonas: function(req, res) {

        var csvFilePath = '../.././assets/cvs/kinder-prekinder_amerinst_tarde.csv'

        var nuevasPersonas = [];
        var data = fs.readFileSync(path.join(__dirname, csvFilePath), {
            encoding: 'utf8'
        });
        var options = {
            delimiter: ';', // optional
            quote: '"' // optional
        };

        nuevasPersonas = csvjson.toObject(data, options);

        var nro = 10166;

        async.eachSeries(nuevasPersonas, function(persona, callback) {



            if (persona.t2paterno.length == 0) {
                persona.tnombre = "x";
                persona.tpaterno = "x";
                callback(null);
            } else {

                codigoFoto = persona.codigoFoto

                tutor = {
                    nombre: persona.t2nombre,
                    paterno: persona.t2paterno,
                    materno: persona.t2materno + " " + persona.t2materno2,
                    rol: "tutor"
                }

                tutor.identificacion = nro + tutor.paterno.charAt(0) + tutor.materno.charAt(0) + tutor.nombre.charAt(0)
                rest.postJson('http://localhost:1337/api/persona', tutor).on('complete', function(data, response) {
                    // handle response
                    console.log('Persona Creada', data)

                    if (persona.codigoFoto.length > 0) {

                        Persona.findOne({
                            identificacion: persona.codigoFoto
                        }).exec(function(err, datoALumno) {

                            sails.log("personaEncontrada:", datoALumno)
                            rest.postJson('http://localhost:1337/alumno/adicionar_tutor', {
                                idTutor: data.id,
                                idAlumno: datoALumno.id
                            }).on('complete', function(data2, response2) {
                                // handle response
                                console.log('tutor adicionado', data2)

                            });

                        })
                    }

                    nro++;
                    callback(null);

                });

            }



        }, function(error) {

            sails.log("-------------------FINAL LISTA -----------------------")


        });
        res.send('NADA')

    },
    adicionarPersonasNestorP: function(req, res) {

        var files = [];

        // files.push('../.././assets/cvs/nestorPeñaranda/primero_Blanco_TM.csv')
        // files.push('../.././assets/cvs/nestorPeñaranda/primero_Bilingue_D.csv')
        // files.push('../.././assets/cvs/nestorPeñaranda/primero_Azul_TM.csv')
        // files.push('../.././assets/cvs/nestorPeñaranda/primero_Rojo_TM.csv')
        // files.push('../.././assets/cvs/nestorPeñaranda/primero_Verde_E.csv')

        // files.push('../.././assets/cvs/nestorPeñaranda/segundo_Azul_TM.csv')
        // files.push('../.././assets/cvs/nestorPeñaranda/segundo_Bilingue_D.csv')
        // files.push('../.././assets/cvs/nestorPeñaranda/segundo_Blanco_TM.csv')
        // files.push('../.././assets/cvs/nestorPeñaranda/segundo_Rojo.csv')
        // files.push('../.././assets/cvs/nestorPeñaranda/segundo_Verde.csv')

        // files.push('../.././assets/cvs/nestorPeñaranda/tercero_Azul_TM.csv')
        // files.push('../.././assets/cvs/nestorPeñaranda/tercero_Bilingue_D.csv')
        // files.push('../.././assets/cvs/nestorPeñaranda/tercero_Blanco_TM.csv')
        // files.push('../.././assets/cvs/nestorPeñaranda/tercero_Rojo.csv')
        // files.push('../.././assets/cvs/nestorPeñaranda/tercero_Verde.csv')

        // files.push('../.././assets/cvs/nestorPeñaranda/prekinder_Rojo.csv')
        // files.push('../.././assets/cvs/nestorPeñaranda/prekinder_Blanco.csv')
        // files.push('../.././assets/cvs/nestorPeñaranda/prekinder_Azul.csv')
        // files.push('../.././assets/cvs/nestorPeñaranda/prekinder_Bilingue.csv')

        // files.push('../.././assets/cvs/nestorPeñaranda/kinder_Rojo.csv')
        // files.push('../.././assets/cvs/nestorPeñaranda/kinder_Blanco.csv')
        // files.push('../.././assets/cvs/nestorPeñaranda/kinder_Azul.csv')
        // files.push('../.././assets/cvs/nestorPeñaranda/kinder_Bilingue.csv')

        // files.push('../.././assets/cvs/amerinst/1_Sec_light_Blue.csv');
        // files.push('../.././assets/cvs/amerinst/1_Sec_Orange.csv');
        // files.push('../.././assets/cvs/amerinst/1_Sec_Yellow.csv');

        // files.push('../.././assets/cvs/amerinst/2_Sec_light_Blue.csv');
        // files.push('../.././assets/cvs/amerinst/2_Sec_Orange.csv');

        // files.push('../.././assets/cvs/amerinst/3_Sec_light_Blue.csv');
        // files.push('../.././assets/cvs/amerinst/3_Sec_Orange.csv');

        // files.push('../.././assets/cvs/amerinst/1_Pri_Brown.csv');
        // files.push('../.././assets/cvs/amerinst/1_Pri_Light_Blue.csv');
        // files.push('../.././assets/cvs/amerinst/1_Pri_Orange.csv');
        // files.push('../.././assets/cvs/amerinst/1_Pri_Purple.csv');
        // files.push('../.././assets/cvs/amerinst/1_Pri_Yellow.csv');

        // files.push('../.././assets/cvs/amerinst/2_Pri_Brown.csv');
        // files.push('../.././assets/cvs/amerinst/2_Pri_Light_Blue.csv');
        // files.push('../.././assets/cvs/amerinst/2_Pri_Orange.csv');
        // files.push('../.././assets/cvs/amerinst/2_Pri_Purple.csv');
        // files.push('../.././assets/cvs/amerinst/2_Pri_Yellow.csv');

        // files.push('../.././assets/cvs/amerinst/3_Pri_Brown.csv');
        // files.push('../.././assets/cvs/amerinst/3_Pri_Light_Blue.csv');
        // files.push('../.././assets/cvs/amerinst/3_Pri_Orange.csv');
        // files.push('../.././assets/cvs/amerinst/3_Pri_Purple.csv');
        // files.push('../.././assets/cvs/amerinst/3_Pri_Yellow.csv');

        // files.push('../.././assets/cvs/amerinst/4_Pri_Light_Blue.csv');
        // files.push('../.././assets/cvs/amerinst/4_Pri_Orange.csv');
        // files.push('../.././assets/cvs/amerinst/4_Pri_Yellow.csv');

        // files.push('../.././assets/cvs/amerinst/5_Pri_Light_Blue.csv');
        // files.push('../.././assets/cvs/amerinst/5_Pri_Orange.csv');
        // files.push('../.././assets/cvs/amerinst/5_Pri_Yellow.csv');

        // files.push('../.././assets/cvs/amerinst/6_Pri_Light_Blue.csv');
        // files.push('../.././assets/cvs/amerinst/6_Pri_Orange.csv');
        // files.push('../.././assets/cvs/amerinst/6_Pri_Yellow.csv');

        files.push('../.././assets/cvs/amerinst/kinder-prekinder_amerinst_tarde_faltantes.csv');

        async.eachSeries(files, function(file, callback) {

            sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")
            sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")
            sails.log(file)
            var nuevasPersonas = [];
            var dato = fs.readFileSync(path.join(__dirname, file), {
                encoding: 'utf8'
            });
            var options = {
                delimiter: ',', // optional
                quote: '"' // optional
            };

            nuevasPersonas = csvjson.toObject(dato, options);

            async.each(nuevasPersonas, function(persona, cb) {
                // nuevasPersonas.forEach(function (persona) {
                if (persona.paterno.length > 0) {

                    persona.rol = "alumno"

                    // identificacion = persona.paterno.charAt(0) + persona.materno.charAt(0) + persona.nombre.charAt(0) + persona.codigoFoto
                    rest.postJson('http://localhost:1337/api/persona', persona).on('complete', function(data, response) {
                        // handle response
                        console.log('Persona Creada', data)
                        if (persona.idCurso.length > 0) {
                            rest.postJson('http://localhost:1337/inscribe/inscribir', {
                                id: data.id,
                                idCurso: persona.idCurso,
                                idGestionAcademica: 1
                            }).on('complete', function(data2, response2) {
                                // handle response
                                console.log('inscrito Creada', data2)

                            });
                            cb();
                        }
                        // Persona.findOne({ identificacion: persona.codigoFoto }).exec(function (err, datoALumno) {

                        //     sails.log("personaEncontrada:", datoALumno)
                        //     rest.postJson('http://localhost:1337/alumno/adicionar_tutor', { idTutor: data.id, idAlumno: datoALumno.id }).on('complete', function (data2, response2) {
                        //         // handle response
                        //         console.log('tutor adicionado', data2)

                        //     });

                        // })

                    });
                } else {
                    cb();
                }


                // }, this);
            }, function(error) {

                sails.log("-------------------FINAL LISTA -----------------------")
                callback(null);
                // return res.send("tutores")
            });

        }, function(error) {

        });
        res.send('NADA')
    },
    // adicionarPersonasAmerinst: function(req, res) {

    //     var files = [];
    //     req.file('files').upload({
    //         // ~10MB
    //         dirname: require('path').resolve(sails.config.appPath, 'assets/cvs/nestorPeñaranda'),
    //         saveAs: function(__newFileStream, cb) {
    //             cb(null, "TM" + __newFileStream.filename);
    //         },
    //         maxBytes: 10000000
    //     }, function whenDone(err, uploadedFiles) {

    //         if (err) {
    //             return res.negotiate(err);
    //         }

    //         // If no files were uploaded, respond with an error.
    //         if (uploadedFiles.length === 0) {
    //             return res.badRequest('No file was uploaded');
    //         }


    //         async.eachSeries(uploadedFiles, function(file, callback) {

    //             sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")

    //             sails.log(file)
    //             sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    //             var nuevasPersonas = [];
    //             var dato = fs.readFileSync(file.fd, {
    //                 encoding: 'utf8'
    //             });
    //             var options = {
    //                 delimiter: ',', // optional
    //                 quote: '"' // optional
    //             };

    //             nuevasPersonas = csvjson.toObject(dato, options);

    //             async.each(nuevasPersonas, function(persona, cb) {

    //                 // nuevasPersonas.forEach(function (persona) {
    //                 if (persona.Estudiante.length > 0) {


    //                     // sails.log("PERRSONA", persona);
    //                     var nombreCompleto = persona.Estudiante.split(" ");

    //                     persona.paterno = nombreCompleto[0]
    //                     persona.materno = nombreCompleto[1]

    //                     if (nombreCompleto.length == 3) {
    //                         persona.nombre = nombreCompleto[2]
    //                     } else if (nombreCompleto.length == 4) {
    //                         persona.nombre = nombreCompleto[2] + " " + nombreCompleto[3]
    //                     } else {
    //                         var auxNombre = "";
    //                         for (var index = 2; index < nombreCompleto.length; index++) {
    //                             auxNombre = auxNombre + " " + nombreCompleto[index]
    //                         }
    //                         persona.nombre = auxNombre;
    //                     }

    //                     persona.idCurso = req.param("idCurso");
    //                     persona.nro = persona.Número;
    //                     persona.codigoFoto = persona.Código

    //                     persona.rol = "alumno"
    //                     sails.log("Persona desde el CSV", persona)
    //                         // identificacion = persona.paterno.charAt(0) + persona.materno.charAt(0) + persona.nombre.charAt(0) + persona.codigoFoto
    //                     rest.postJson('http://localhost:1337/api/persona', persona).on('complete', function(data, response) {
    //                         // handle response
    //                         console.log('Persona Creada', data)
    //                         if (persona.idCurso.length > 0) {
    //                             rest.postJson('http://localhost:1337/inscribe/inscribir', {
    //                                 id: data.id,
    //                                 idCurso: persona.idCurso,
    //                                 idGestionAcademica: 1
    //                             }).on('complete', function(data2, response2) {
    //                                 // handle response
    //                                 console.log('inscrito Creada', data2)

    //                             });

    //                             cb();
    //                         }
    //                         // Persona.findOne({ identificacion: persona.codigoFoto }).exec(function (err, datoALumno) {

    //                         //     sails.log("personaEncontrada:", datoALumno)
    //                         //     rest.postJson('http://localhost:1337/alumno/adicionar_tutor', { idTutor: data.id, idAlumno: datoALumno.id }).on('complete', function (data2, response2) {
    //                         //         // handle response
    //                         //         console.log('tutor adicionado', data2)

    //                         //     });

    //                         // })

    //                     });
    //                 } else 
    //                     cb();
    //                 }

    //                 // }, this);
    //             }, function(error) {

    //                 sails.log("-------------------FINAL LISTA -----------------------")
    //                 callback(null);
    //                 // return res.send("tutores")
    //             });

    //         }, function(error) {
    //             rest.get('http://localhost:1337/administrador/actualizarIdentificaciones').on('complete', function(data2, response2) {
    //                 rest.get('http://localhost:1337/administrador/alumnosCursoQr/' + req.param("idCurso")).on('complete', function(data, response) {
    //                     // handle response
    //                     res.send("TODO A ACABADO")

    //                 });

    //             });
    //         });


    //     });



    // },
    adicionarPersonasDomingoSavio: function(req, res) {

        var files = [];
        req.file('files').upload({
            // ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/cvs/DomingoSavio'),
            saveAs: function(__newFileStream, cb) {
                cb(null, "T" + __newFileStream.filename);
            },
            maxBytes: 10000000
        }, function whenDone(err, uploadedFiles) {

            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }

            var cursoId = 1;
            async.eachSeries(uploadedFiles, function(file, callback) {

                sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")

                sails.log(file)
                sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                var nuevasPersonas = [];
                var dato = fs.readFileSync(file.fd, {
                    encoding: 'utf8'
                });
                var options = {
                    delimiter: ',', // optional
                    quote: '"' // optional
                };

                nuevasPersonas = csvjson.toObject(dato, options);

                async.each(nuevasPersonas, function(persona, cb) {

                    // nuevasPersonas.forEach(function (persona) {
                    if (persona.nombre.length > 0) {


                        // persona.idCurso = req.param("idCurso");
                        // persona.nro = persona.Número;
                        // persona.codigoFoto = persona.Código

                        persona.rol = "alumno"
                        sails.log("Persona desde el CSV", persona)
                        cursoId = persona.idCurso;
                        var identificacion = persona.paterno.charAt(0) + persona.materno.charAt(0) + persona.nombre.charAt(0) + persona.codigoFoto
                        rest.postJson('http://moswara.com:48000/api/persona', persona).on('complete', function(data, response) {
                            // handle response
                            console.log('Persona Creada', data)
                            if (persona.idCurso.length > 0) {

                                rest.postJson('http://moswara.com:48000/inscribe/inscribir', {
                                    id: data.id,
                                    idCurso: persona.idCurso,
                                    idGestionAcademica: 1
                                }).on('complete', function(data2, response2) {
                                    // handle response
                                    console.log('inscrito Creada', data2)

                                });

                            }

                            // if (persona.tutor1.length > 0) {


                            //     var auxTutor1 = recortarNombre(persona.tutor1)
                            //     auxTutor1.rol = "tutor"
                            //     auxTutor1.identificacion = persona.ci_tutor1
                            //     auxTutor1.expedido = persona.extencion1

                            //     rest.postJson('http://localhost:1337/api/persona', auxTutor1).on('complete', function(datoTutor1, response) {

                            //         adicionar_tutor_alumno(datoTutor1, data);
                            //         console.log("TUTOR CREADO O YA EXISTE", datoTutor1)


                            //         if (persona.tutor2.length > 0) {


                            //             var auxTutor2 = recortarNombre(persona.tutor2)
                            //             auxTutor2.rol = "tutor"
                            //             auxTutor2.identificacion = persona.ci_tutor2
                            //             auxTutor2.expedido = persona.extencion2

                            //             rest.postJson('http://localhost:1337/api/persona', auxTutor2).on('complete', function(datoTutor2, response) {

                            //                 adicionar_tutor_alumno(datoTutor2, data);


                            //                 if (persona.tutor3.length > 0) {


                            //                     var auxTutor3 = recortarNombre(persona.tutor3)
                            //                     auxTutor3.rol = "tutor"
                            //                     auxTutor3.identificacion = persona.ci_tutor3
                            //                     auxTutor3.expedido = persona.extencion3

                            //                     rest.postJson('http://localhost:1337/api/persona', auxTutor3).on('complete', function(datoTutor3, response) {

                            //                         adicionar_tutor_alumno(datoTutor3, data);
                            //                         if (persona.tutor4.length > 0) {


                            //                             var auxTutor4 = recortarNombre(persona.tutor4)
                            //                             auxTutor4.rol = "tutor"
                            //                             auxTutor4.identificacion = persona.ci_tutor4
                            //                             auxTutor4.expedido = persona.extencion4

                            //                             rest.postJson('http://localhost:1337/api/persona', auxTutor4).on('complete', function(datoTutor4, response) {

                            //                                 adicionar_tutor_alumno(datoTutor4, data);



                            //                             });
                            //                         }


                            //                     });
                            //                 }

                            //             });
                            //         }
                            //     });
                            // }
                            cb();
                            // Persona.update(data.id, { identificacion: data.id + "-" + identificacion }).exec(function(err, datoALumno) {

                            //     sails.log("personaEncontrada:", datoALumno)
                            //     rest.postJson('http://localhost:1337/alumno/adicionar_tutor', { idTutor: data.id, idAlumno: datoALumno.id }).on('complete', function(data2, response2) {
                            //         // handle response
                            //         console.log('tutor adicionado', data2)

                            //     });

                            // })

                        });
                    } else {
                        cb();
                    }


                    // }, this);
                }, function(error) {

                    sails.log("-------------------FINAL LISTA -----------------------")
                    callback(null);
                    // return res.send("tutores")
                });

            }, function(error) {


                res.send("TODO A ACABADO")



            });


        });



    },
    adicionarPersonasBolNorAutomatico: function(req, res) {

        var files = [];
        req.file('files').upload({
            // ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/cvs/bolnor'),
            saveAs: function(__newFileStream, cb) {
                cb(null, "TT" + __newFileStream.filename);
            },
            maxBytes: 10000000
        }, function whenDone(err, uploadedFiles) {

            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }

            var cursoId = 1;
            async.eachSeries(uploadedFiles, function(file, callback) {

                sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")

                sails.log(file)
                sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                var nuevasPersonas = [];
                var dato = fs.readFileSync(file.fd, {
                    encoding: 'utf8'
                });
                var options = {
                    delimiter: ',', // optional
                    quote: '"' // optional
                };

                nuevasPersonas = csvjson.toObject(dato, options);


                var listaNuevaCurso = [];
                var auxPadre = {
                    nro: "nro",
                    paterno: "paterno",
                    materno: "materno",
                    nombre: "nombre",
                    codigoFoto: "codigoFoto",
                    identificacion: "identificacion",
                    idCurso: "idCurso"
                }


                listaNuevaCurso.push(auxPadre)

                async.each(nuevasPersonas, function(persona, cb) {

                    // nuevasPersonas.forEach(function (persona) {
                    if (persona.nombre.length > 0) {


                        // persona.idCurso = req.param("idCurso");
                        // persona.nro = persona.Número;
                        // persona.codigoFoto = persona.Código

                        persona.rol = "alumno"
                        sails.log("Persona desde el CSV", persona)
                        cursoId = persona.idCurso;
                        var identificacion = persona.paterno.charAt(0) + persona.materno.charAt(0) + persona.nombre.charAt(0)
                        rest.postJson('http://localhost:1337/api/persona', persona).on('complete', function(data, response) {
                            // handle response
                            console.log('Persona Creada', data)
                            if (persona.idCurso.length > 0) {

                                rest.postJson('http://localhost:1337/inscribe/inscribir', {
                                    id: data.id,
                                    idCurso: persona.idCurso,
                                    idGestionAcademica: 1
                                }).on('complete', function(data2, response2) {
                                    // handle response
                                    console.log('inscrito Creada', data2)

                                });

                            }


                            Persona.update(data.id,  {
                                identificacion: data.id + "-" + identificacion
                            }).fetch().exec(function(err, datoAlumno) {

                                var codigoQr = datoAlumno[0].identificacion + '$2020$' + 'BOLIVIANO NORUEGO'
                                var code = qr.image(codigoQr, {
                                    type: 'png'
                                });
                                sails.log("personaEncontrada:", datoAlumno[0])

                                var dir = './assets/codigos/bolnor/turno_tarde/' + file.filename + '/';
                                persona.identificacion = datoAlumno[0].identificacion
                                listaNuevaCurso.push(persona)
                                if (!fs.existsSync(dir)) {
                                    fs.mkdirSync(dir);

                                }

                                var output = fs.createWriteStream(path.join(__dirname, '../../' + dir + datoAlumno[0].nro + '.jpg'))

                                code.pipe(output);


                                cb();
                            })

                        });
                    } else {
                        cb();
                    }


                    // }, this);
                }, function(error) {
                    if (listaNuevaCurso.length > 1) {
                        stringify(listaNuevaCurso, function(err, output) {
                            fs.writeFile("t" + file.filename, output, 'utf8', function(err) {
                                if (err) {
                                    console.log('Some error occured - file either not saved or corrupted file saved.');
                                } else {
                                    console.log('It\'s saved!');
                                }
                            });
                        });
                    }

                    sails.log("-------------------FINAL LISTA -----------------------")
                    callback(null);
                    // return res.send("tutores")
                });

            }, function(error) {




                console.log("++++++ TODO A ACABADO +++++")

            });


        });
        res.send("esperando...")


    },

    adicionarNuevosPersonasBolnor: function(req, res) {

     

          
            var cursoId = 1;
            var csvFilePath = '../.././tt_nuevos_bolnor_2020.csv'


                sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")

                sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                var nuevasPersonas = [];
                var dato = fs.readFileSync(path.join(__dirname, csvFilePath), {
                    encoding: 'utf8'
                });
                var options = {
                    delimiter: ',', // optional
                    quote: '"' // optional
                };

                nuevasPersonas = csvjson.toObject(dato, options);


                var listaNuevaCurso = [];
                var auxPadre = {
                    nro: "nro",
                    paterno: "paterno",
                    materno: "materno",
                    nombre: "nombre",
                    codigoFoto: "codigoFoto",
                    curso:"curso",
                    identificacion: "identificacion",
                    idCurso: "idCurso"
                }


                listaNuevaCurso.push(auxPadre)

                async.eachSeries(nuevasPersonas, function(persona, cb) {

                    // nuevasPersonas.forEach(function (persona) {
                    if (persona.paterno.length > 0) {


                        // persona.idCurso = req.param("idCurso");
                        // persona.nro = persona.Número;
                        // persona.codigoFoto = persona.Código
                        
                        persona.rol = "alumno"
                        persona.img="avatars//"+persona.codigoFoto;
                        var auxNombre = persona.nombre + ' ' + persona.nombre2
                        persona.nombre = auxNombre
                        sails.log("Persona desde el CSV", persona)
                        cursoId = persona.idCurso;
                        var identificacion = persona.paterno.charAt(0) + persona.materno.charAt(0) + persona.nombre.charAt(0)
                        rest.postJson('http://localhost:1337/api/persona', persona).on('complete', function(data, response) {
                            // handle response
                            console.log('Persona Creada', data)
                            if (persona.idCurso.length > 0) {

                                rest.postJson('http://localhost:1337/inscribe/inscribir', {
                                    id: data.id,
                                    idCurso: persona.idCurso,
                                    idGestionAcademica: 2
                                }).on('complete', function(data2, response2) {
                                    // handle response
                                    console.log('inscrito Creada', data2)

                                });

                            }


                            Persona.update(data.id,  {
                                identificacion: data.id + "-" + identificacion
                            }).fetch().exec(function(err, datoAlumno) {
                                console.log('PERSONA ACTUALIZADA',datoAlumno)
                                var codigoQr = datoAlumno[0].identificacion + '$2020$' + 'BOLIVIANO NORUEGO'
                                var code = qr.image(codigoQr, {
                                    type: 'png'
                                });
                                sails.log("personaEncontrada:", datoAlumno[0])

                                var dir = './assets/codigos/bolnor_nuevos/turno_ma/';
                                persona.identificacion = datoAlumno[0].identificacion
                                listaNuevaCurso.push(persona)
                                if (!fs.existsSync(dir)) {
                                    fs.mkdirSync(dir);

                                }

                                var output = fs.createWriteStream(path.join(__dirname, '../../' + dir + datoAlumno[0].nro + '.jpg'))

                                code.pipe(output);


                                cb();
                            })

                        });
                    } else {
                        cb();
                    }


                    // }, this);
                }, function(error) {
                    if (listaNuevaCurso.length > 1) {
                        stringify(listaNuevaCurso, function(err, output) {
                            fs.writeFile("t" + file.filename, output, 'utf8', function(err) {
                                if (err) {
                                    console.log('Some error occured - file either not saved or corrupted file saved.');
                                } else {
                                    console.log('It\'s saved!');
                                }
                            });
                        });
                    }

                    sails.log("-------------------FINAL LISTA -----------------------")
                    callback(null);
                    // return res.send("tutores")
                });


        res.send("esperando...")


    },






    generarCodigosDomingoSavio: function(req, res) {
        Persona.find({
            id: {
                '>=': 4717
            }
        }).exec(function(err, datoAlumnos) {

            var dir = './assets/codigos/domingo_savio/' + "turno_tarde_nuevos" + "/"

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            datoAlumnos.forEach(datoAlumno => {
                sails.log("personaEncontrada:", datoAlumno)

                var codigoQr = datoAlumno.identificacion + '$2018$' + 'Colegio Domingo Savio '
                var code = qr.image(codigoQr, {
                    type: 'png'
                });
                var output = fs.createWriteStream(path.join(__dirname, '../../' + dir + datoAlumno.nro + '.jpg'))
                code.pipe(output);
            });

            res.send("codigos QR")
        })
    },
    adicionarAdminFab: function(req, res) {

        var csvFilePath = '../.././assets/cvs/administrativosFab_2.csv'

        var nuevasPersonas = [];
        var dato = fs.readFileSync(path.join(__dirname, csvFilePath), {
            encoding: 'utf8'
        });
        var options = {
            delimiter: ';', // optional
            quote: '"' // optional
        };

        nuevasPersonas = csvjson.toObject(dato, options);

        async.each(nuevasPersonas, function(persona, cb) {
            var materno = persona.materno + " " + persona.materno2
            if (persona.paterno.length > 0) {
                persona.rol = "administrativo"
                persona.identificacion = persona.cedula;
                persona.materno = materno;
            }

            rest.postJson('http://localhost:1337/api/persona', persona).on('complete', function(data, response) {
                sails.log("CREANDO:", data)
                cb();
            });

        }, function(error) {

            return res.send("tutores")
        });

    },
    generarCodigosQrFab: function(req, res) {
        Persona.find({
            id: {
                '>=': 169
            }
        }).exec(function(err, personas) {

            personas.forEach(function(persona) {
                var codigoQr = persona.identificacion + '$2018$' + 'Unidad Educativa TCNL.RAFAEL PABON FAB'
                var code = qr.image(codigoQr, {
                    type: 'png'
                });
                var output = fs.createWriteStream(path.join(__dirname, '../.././assets/codigos/' + persona.nro + '.jpg'))
                code.pipe(output);
            }, this);
        })
    },
    generarCodigosQrNestor: function(req, res) {
        Persona.find().exec(function(err, persona) {

        })
    },
    generarCodigosQr: function(req, res) {

        // Persona.find().exec((err, personas) => {

        //     var contador = 1 ;

        //     personas.forEach(function (persona) {
        //         var codigoQr = persona.identificacion+'$2018@'+' Unidad Educativa TCNL.RAFAEL PABON FAB'
        //         var code = qr.image(codigoQr, { type: 'svg' });
        //         var output = fs.createWriteStream(path.join(__dirname,'../.././assets/codigos/'+contador+'.svg'))
        //         code.pipe(output);
        //     }, this);
        //     res.send('NADA 2')
        // });

        // Tutor.find().sort('id ASC').exec((err, Tutors) => {
        //     var contador = 1;
        //     Tutors.forEach(function (Tutor) {
        //         var codigoQr = Tutor.identificacion + '$2018$' + 'Instituto Americano'
        //         var code = qr.image(codigoQr, { type: 'svg' });
        //         var output = fs.createWriteStream(path.join(__dirname, '../.././assets/codigos/' + contador + '.svg'))
        //         code.pipe(output);
        //     }, this);
        //     res.send('NADA 2')
        // });

        // var csvFilePath = '../.././assets/cvs/prekinder_amerinst.csv'
        var csvFilePath = '../.././assets/cvs/kinder-prekinder_amerinst_tarde.csv'
        var nuevasPersonas = [];
        var data = fs.readFileSync(path.join(__dirname, csvFilePath), {
            encoding: 'utf8'
        });
        var options = {
            delimiter: ';', // optional
            quote: '"' // optional
        };

        nuevasPersonas = csvjson.toObject(data, options);

        var contador = 10166;
        nuevasPersonas.forEach(function(persona) {

            if (persona.tpaterno.length > 0) {
                var tutor = {
                    nombre: persona.t2nombre,
                    paterno: persona.t2paterno,
                    materno: persona.t2materno + " " + persona.t2materno2
                }

                console.log("Alumno", persona)
                    // persona.identificacion = persona.codigoFoto ==> prekinder amerinst turno tarde
                    // persona.identificacion = persona.paterno.charAt(0) + persona.materno.charAt(0) + persona.nombre.charAt(0) + persona.codigoFoto
                tutor.identificacion = contador + tutor.paterno.charAt(0) + tutor.materno.charAt(0) + tutor.nombre.charAt(0)

                // var codigoQr = persona.identificacion + '$2018@' + ' Unidad Educativa TCNL.RAFAEL PABON FAB'
                var codigoQr = tutor.identificacion + '$2018$' + 'Instituto Americano'
                var code = qr.image(codigoQr, {
                    type: 'png'
                });
                var output = fs.createWriteStream(path.join(__dirname, '../.././assets/codigos/' + persona.nro + '.jpg'))
                console.log("contador : ", persona.nro)
                contador++;
                code.pipe(output);
            } else {
                // persona.identificacion = persona.codigoFoto

            }

            // // var codigoQr = persona.identificacion + '$2018@' + ' Unidad Educativa TCNL.RAFAEL PABON FAB'
            // var codigoQr = persona.identificacion + '$2018$' + 'Instituto Americano'
            // var code = qr.image(codigoQr, { type: 'svg' });
            // var output = fs.createWriteStream(path.join(__dirname, '../.././assets/codigos/' + persona.nro + '.svg'))
            // console.log("contador : " + contador)
            // contador++;
            // code.pipe(output);

        }, this);

        res.send('nada')

    },
    actualizarIdentificaciones: function(req, res) {
        Persona.find().exec(function(err, personas) {

            async.forEach(personas, function(persona, cb) {

                Persona.update(persona.id).set({
                        identificacion: persona.id + "-" + persona.paterno.charAt(0) + persona.materno.charAt(0) + persona.nombre.charAt(0)
                    }

                ).exec(function(err, datoPersona) {
                    cb();
                })
            }, function(error) {

                if (error) return res.negotiate(error);

                return res.send("todo actualizado")
            });

        });
    },
    alumnosCursoQr: function(req, res) {

        var curso = req.param('id')
        Inscribe.find({
            idCurso: curso,
            idGestionAcademica:2
        }).populate('idAlumno').populate('idCurso').exec(function(err, inscripciones) {

            Curso.findOne(curso).populate('idTurno').populate('idGrado').populate('idGrupo').populate('idParalelo').exec(function(err, datoCurso) {
                var alumnosCurso = [];
                async.forEach(inscripciones, function(inscripcion, cb) {

                    Persona.findOne(inscripcion.idAlumno.idPersona).exec(function(err, alumno) {

                        // var codigoQr = alumno.identificacion + '$2018$' + 'Instituto Americano Nestor Peñaranda'
                        var codigoQr = alumno.identificacion + '$2020$' + 'Boliviano Noruego'
                        var code = qr.image(codigoQr, {
                            type: 'png'
                        });

                        var dir = './assets/codigos/bolnor2020/' + datoCurso.idTurno.nombre + "_" + datoCurso.idGrado.nombre + "_" + datoCurso.idGrupo.nombre + "_" + datoCurso.idParalelo.nombre + "/"
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir);

                        }

                        var output = fs.createWriteStream(path.join(__dirname, '../../' + dir + alumno.nro + '.jpg'))

                        code.pipe(output);
                        cb();
                    })
                }, function(error) {

                    if (error) return res.negotiate(error);
                    sails.log("tamaño", inscripciones.length)
                    sails.log("es curso ", inscripciones[0].idCurso)
                    return res.send(alumnosCurso)
                });

            })

        })

    },
    cargarFotos: function(req, res) {

        req.file('avatar').upload({
            // ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/avatars'),
            maxBytes: 20000000
        }, function whenDone(err, uploadedFiles) {

            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }

            var csvFilePath = '../.././assets/cvs/personalFab.csv'

            var nuevasPersonas = [];
            var data = fs.readFileSync(path.join(__dirname, csvFilePath), {
                encoding: 'utf8'
            });
            var options = {
                delimiter: ';', // optional
                quote: '"' // optional
            };

            nuevasPersonas = csvjson.toObject(data, options);

            var contador = 1;
            nuevasPersonas.forEach(function(persona) {

                if (persona.cedula.length > 0) {
                    persona.identificacion = persona.cedula
                } else {
                    persona.identificacion = persona.codigoFoto
                }

                var direccionBase = "http://localhost:1337"
                    // var direccionBase = "http://192.241.152.146:1337"

                uploadedFiles.forEach(function(file, i) {

                    var nombreFoto = file.filename.substring(4, 8);
                    sails.log('NOMBRE FOTO: ', nombreFoto)
                    sails.log('codigo FOTO: ', persona.codigoFoto)
                    if (nombreFoto == persona.codigoFoto) {
                        sails.log('++++++++++++++++++++++++++++++++++')
                        sails.log('IGUALES')

                        sails.log('Persona - Identificacion', "*" + persona.identificacion + "*")
                        var url = direccionBase + "/avatars//" + (uploadedFiles[i].fd).substring(47);
                        Persona.findOne({
                            identificacion: persona.identificacion
                        }).exec(function(err, datoPersona) {
                            if (err) {
                                console.log(err);
                                return res.negotiate(err)
                            };

                            console.log('ID PERSONA : ', datoPersona)

                            Persona.update({
                                id: datoPersona.id
                            }, {
                                img: url
                            }).exec(function(err, per) {

                                if (err) {
                                    console.log(err);
                                    return res.negotiate(err)
                                };

                                console.log('Se adicio Foto a : ', per.identificacion)
                            });
                        });
                    }

                }, this);

            }, this);

            //  var direccionBase = "http://localhost:1337"
            // var direccionBase = "http://192.241.152.146:1337"
            // var url = direccionBase + "/avatars//" + (uploadedFiles[0].fd).substring(47);
            // Persona.update({ id: idPersona }, {
            //     img: url,
            // }).exec(function (err,datoPersona) {

            //     if (err) { console.log(err); return res.negotiate(err) };

            //     return res.send(datoPersona[0]);
            // });
            return res.send(uploadedFiles);
        });

    },
    cargarFotosAmerinst: function(req, res) {
        req.file('avatar').upload({
            // ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/avatars'),
            maxBytes: 1025000000
        }, function whenDone(err, uploadedFiles) {

            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }


            Persona.find({
                id: {
                    '>=': 204
                }
            }).exec(function(err, personas) {

                async.forEach(personas, function(persona, cb) {

                    uploadedFiles.forEach(function(file, i) {
                        // var nombreFoto = parseInt(file.filename.substring(4, 8)) + "";
                        var nombreFoto = file.filename.substring(4, 8) + "";

                        var auxCodigoFoto = "";
                        if (persona.codigoFoto != undefined) {

                            auxCodigoFoto = persona.codigoFoto;
                        } else {
                            auxCodigoFoto = persona.identificacion;
                        }
                        sails.log('NOMBRE FOTO: ', nombreFoto)
                        sails.log('codigo FOTO: ', auxCodigoFoto)


                        if (nombreFoto == auxCodigoFoto) {
                            sails.log('++++++++++++++++++++++++++++++++++')
                            sails.log('IGUALES')

                            sails.log('Persona - Identificacion', "*" + persona.identificacion + "*")
                            var nombreFoto = (uploadedFiles[i].fd).split("\\");
                            sails.log("fotos:", nombreFoto);
                            var url = "avatars//" + nombreFoto[nombreFoto.length - 1]


                            Persona.update(persona.id, {
                                img: url
                            }).exec(function(err, per) {

                                if (err) {
                                    console.log(err);
                                    return res.negotiate(err)
                                };

                                console.log('Se adicio Foto a : ', per.identificacion)
                            });

                        }

                    }, this);

                }, function(error) {

                    if (error) return res.negotiate(error);

                    return res.send("todo actualizado")
                });

            });
        });
    },
    cargarTutoresAmerinst: function(req, res) {

        var files = [];
        req.file('files').upload({
            // ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/cvs/amerinst/padres'),
            saveAs: function(__newFileStream, cb) {
                cb(null, "TT" + __newFileStream.filename);
            },
            maxBytes: 10000000
        }, function whenDone(err, uploadedFiles) {

            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }


            async.eachSeries(uploadedFiles, function(file, callback) {

                    sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")

                    sails.log(file)
                    sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                    var nuevasPersonas = [];
                    var dato = fs.readFileSync(file.fd, {
                        encoding: 'utf8'
                    });
                    var options = {
                        delimiter: ',', // optional
                        quote: '"' // optional
                    };

                    nuevasPersonas = csvjson.toObject(dato, options);

                    async.each(nuevasPersonas, function(persona, cb) {

                            // nuevasPersonas.forEach(function (persona) {
                            var estudiante1 = persona["Student 1"]
                            var estudiante2 = persona["Student 2"]
                            var estudiante3 = persona["Student 3"]

                            var responsable1 = persona["Resp 1"]
                            var responsable2 = persona["Resp 2"]
                            var responsable3 = persona["Resp 3"]

                            var auxTutor = {}

                            if (responsable1.length > 0) {

                                auxTutor = recortarNombre(responsable1)
                                auxTutor.rol = "tutor"
                                auxTutor.nro = persona["Nº"]

                                sails.log("auxpersona - 2: ", auxTutor)

                                rest.postJson('http://localhost:1337/api/persona', auxTutor).on('complete', function(data1, response) {
                                    // handle response

                                    sails.log("/////////////////////////////////////")
                                    if (responsable2.length > 0) {
                                        auxTutor = recortarNombre(responsable2)
                                        auxTutor.rol = "tutor"
                                        auxTutor.nro = persona["Nº"]
                                        rest.postJson('http://localhost:1337/api/persona', auxTutor).on('complete', function(data2, response) {
                                            // handle response
                                            if (responsable3.length > 0) {
                                                auxTutor = recortarNombre(responsable3)
                                                auxTutor.rol = "tutor"
                                                auxTutor.nro = persona["Nº"]
                                                rest.postJson('http://localhost:1337/api/persona', auxTutor).on('complete', function(data3, response) {
                                                    // handle response

                                                    adicionar_tutor_alumno(data1, estudiante1);
                                                    adicionar_tutor_alumno(data2, estudiante1);
                                                    adicionar_tutor_alumno(data3, estudiante1);

                                                    if (estudiante2.length > 0) {
                                                        adicionar_tutor_alumno(data1, estudiante2)
                                                        adicionar_tutor_alumno(data2, estudiante2);
                                                        adicionar_tutor_alumno(data3, estudiante2);
                                                    }
                                                    if (estudiante3.length > 0) {
                                                        adicionar_tutor_alumno(data1, estudiante3)
                                                        adicionar_tutor_alumno(data2, estudiante3);
                                                        adicionar_tutor_alumno(data3, estudiante3);
                                                    }
                                                    cb();

                                                    Persona.update(data3.id).set({
                                                            identificacion: data1.id + "-" + data1.paterno.charAt(0) + data1.materno.charAt(0) + data1.nombre.charAt(0)
                                                        }

                                                    ).exec(function(err, datoPersona) {

                                                    })

                                                });
                                            } else {

                                                adicionar_tutor_alumno(data1, estudiante1);
                                                adicionar_tutor_alumno(data2, estudiante1);

                                                if (estudiante2.length > 0) {
                                                    adicionar_tutor_alumno(data1, estudiante2)
                                                    adicionar_tutor_alumno(data2, estudiante2);
                                                }
                                                if (estudiante3.length > 0) {
                                                    adicionar_tutor_alumno(data1, estudiante3)
                                                    adicionar_tutor_alumno(data2, estudiante3);
                                                }
                                                cb();
                                            }

                                            Persona.update(data2.id).set({
                                                    identificacion: data1.id + "-" + data1.paterno.charAt(0) + data1.materno.charAt(0) + data1.nombre.charAt(0)
                                                }

                                            ).exec(function(err, datoPersona) {

                                            })




                                        });
                                    } else {

                                        adicionar_tutor_alumno(data1, estudiante1);


                                        if (estudiante2.length > 0) {
                                            adicionar_tutor_alumno(data1, estudiante2)

                                        }
                                        if (estudiante3.length > 0) {
                                            adicionar_tutor_alumno(data1, estudiante3)

                                        }
                                        cb();

                                    }


                                    Persona.update(data1.id).set({
                                            identificacion: data1.id + "-" + data1.paterno.charAt(0) + data1.materno.charAt(0) + data1.nombre.charAt(0)
                                        }

                                    ).exec(function(err, datoPersona) {

                                    })

                                    // var codigoQr = alumno.identificacion + '$2018$' + 'Instituto Americano Nestor Peñaranda'
                                    var codigoQr = data1.id + "-" + data1.paterno.charAt(0) + data1.materno.charAt(0) + data1.nombre.charAt(0) + '$2018$' + 'Instituto Americano'
                                    var code = qr.image(codigoQr, {
                                        type: 'png'
                                    });

                                    var dir = './assets/codigos/amerinst_turno_tarde/padres/' + file.filename + "/"
                                    if (!fs.existsSync(dir)) {
                                        fs.mkdirSync(dir);
                                    }
                                    var output = fs.createWriteStream(path.join(__dirname, '../../' + dir + data1.nro + '.jpg'))
                                    code.pipe(output);

                                });
                            } else {
                                cb();
                            }

                            // }, this);
                        },
                        function(error) {

                            sails.log("-------------------FINAL LISTA -----------------------")
                            callback(null);
                            // return res.send("tutores")
                        });

                },
                function(error) {
                    res.send("fin")
                });


        });



    },
    fotosFaltantesNestor: function(req, res) {
        Persona.find({
            codigoFoto: ""
        }).exec(function(err, datosPersona) {


            console.log("faltan un total de ", datosPersona.length)
            res.send(datosPersona)

        })


        // Persona.find({ codigoFoto: undefined }).exec(function(err, datosPersona) {



        //     console.log("faltan un total de ", datosPersona.length)
        //     res.send(datosPersona)

        // })
    },
    actualizarFotosNestor: function(req, res) {

        var files = [];
        req.file('files').upload({
            // ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/cvs/amerinst/padres'),
            saveAs: function(__newFileStream, cb) {
                cb(null, "borrar" + __newFileStream.filename);
            },
            maxBytes: 10000000
        }, function whenDone(err, uploadedFiles) {

            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }


            async.eachSeries(uploadedFiles, function(file, callback) {

                    sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")

                    sails.log(file)
                    sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                    var nuevasPersonas = [];
                    var dato = fs.readFileSync(file.fd, {
                        encoding: 'utf8'
                    });
                    var options = {
                        delimiter: '|', // optional
                        quote: '"' // optional
                    };

                    nuevasPersonas = csvjson.toObject(dato, options);

                    async.each(nuevasPersonas, function(persona, cb) {


                            if (persona.Estudiante.length > 0) {
                                var nombreCompleto = persona.Estudiante.split(" ");
                                persona.paterno = nombreCompleto[0]
                                persona.materno = nombreCompleto[1]
                                if (nombreCompleto.length == 3) {
                                    persona.nombre = nombreCompleto[2]
                                } else if (nombreCompleto.length == 4) {
                                    persona.nombre = nombreCompleto[2] + " " + nombreCompleto[3]
                                } else {
                                    var auxNombre = "";
                                    for (var index = 2; index < nombreCompleto.length; index++) {
                                        auxNombre = auxNombre + " " + nombreCompleto[index]
                                    }
                                    persona.nombre = auxNombre;
                                }

                                Persona.findOne({
                                    paterno: persona.paterno,
                                    materno: persona.materno,
                                    nombre: persona.nombre
                                }).exec(function(err, datoPersona) {
                                    if (datoPersona != undefined) {

                                        if (datoPersona.codigoFoto = "") {

                                            Persona.update(datoPersona.id, {
                                                codigoFoto: persona.Código
                                            }).exec(function(err, actualizado) {
                                                sails.log("ACTUALIZADO", datoPersona)

                                            })
                                        }

                                    }

                                    cb();

                                })
                            } else {
                                cb();
                            }


                            // }, this);
                        },
                        function(error) {

                            sails.log("-------------------FINAL LISTA -----------------------")
                            callback(null);
                            // return res.send("tutores")
                        });

                },
                function(error) {
                    res.send("fin")
                });


        });



    },
    codigosTutoresDomingoSavio2: function(req, res) {},
    cargarTutoresNestorP: function(req, res) {

        var files = [];
        req.file('files').upload({
            // ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/otros/cvs'),
            saveAs: function(__newFileStream, cb) {
                cb(null, "domingo_faltantes_t_" + __newFileStream.filename);
            },
            maxBytes: 10000000
        }, function whenDone(err, uploadedFiles) {

            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }


            async.eachSeries(uploadedFiles, function(file, callback) {

                    sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")

                    sails.log(file)
                    sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                    var nuevasPersonas = [];
                    var dato = fs.readFileSync(file.fd, {
                        encoding: 'utf8'
                    });
                    var options = {
                        delimiter: ',', // optional
                        quote: '"' // optional
                    };

                    var auxPadre = {
                        nombre: "nombre",
                        paterno: "paterno",
                        materno: "materno",
                        identificacion: "identificacion",
                        expedido: "expedido",
                        rol: "rol",
                        num: "num",
                        numero: "numero"

                    }
                    nuevasPersonas = csvjson.toObject(dato, options);

                    var listaNuevaTutores1 = [];
                    var listaNuevaTutores2 = [];
                    var listaNuevaTutores3 = [];
                    var listaNuevaTutores4 = [];

                    listaNuevaTutores1.push(auxPadre)
                    listaNuevaTutores2.push(auxPadre)
                    listaNuevaTutores3.push(auxPadre)
                    listaNuevaTutores4.push(auxPadre)
                    var a = 1,
                        b = 1,
                        c = 1,
                        d = 1;
                    sails.log("nuevaspersonas.length :", nuevasPersonas.length)
                    async.eachSeries(nuevasPersonas, function(persona, cb) {

                            sails.log("PERSONA DEDE CSV : ", persona)
                            var estudiante = {}
                            estudiante.nombre = persona.nombre
                            estudiante.paterno = persona.paterno
                            estudiante.materno = persona.materno
                                // estudiante.nro = persona.nro

                            Persona.findOne(estudiante).exec(function(err, datoEstudiante) {
                                // var datoEstudiante = auxDatoEstudiante[0]
                                if (datoEstudiante != undefined) {
                                    sails.log("datoEstudiante", datoEstudiante)
                                    async.series([
                                        function(callb1) {
                                            if (persona.ci_tutor1.length > 0) {

                                                var tutor1 = recortarNombre(persona.tutor1);
                                                tutor1.identificacion = persona.ci_tutor1
                                                tutor1.expedido = persona.extencion1;
                                                tutor1.rol = "tutor"
                                                tutor1.nro = persona.nro;
                                                tutor1.numero = a++;

                                                Persona.findOne({
                                                        identificacion: tutor1.identificacion
                                                    })
                                                    .exec(function(err, datoTutor1) {

                                                        if (datoTutor1 == undefined) {

                                                            listaNuevaTutores1.push(tutor1)
                                                            rest.postJson('http://moswara.com:48000/api/persona', tutor1).on('complete', function(data1, response2) {
                                                                // handle response
                                                                console.log('tutor adicionado', data1)
                                                                console.log("CREADO -----", data1)
                                                                adicionar_tutor_alumno(data1, datoEstudiante)

                                                            });

                                                        } else {
                                                            console.log("ENCONTRADO ++++++", datoTutor1)
                                                            adicionar_tutor_alumno(datoTutor1, datoEstudiante);
                                                        }
                                                        console.log("@@@@@@@@@@ 1111 @@@@@@@@@@")
                                                        callb1(null);

                                                    });
                                            } else {
                                                callb1(null);
                                            }

                                        },
                                        function(callb2) {
                                            if (persona.ci_tutor2.length > 0) {

                                                var tutor2 = recortarNombre(persona.tutor2);
                                                tutor2.identificacion = persona.ci_tutor2
                                                tutor2.expedido = persona.extencion2;
                                                tutor2.rol = "tutor"
                                                tutor2.nro = persona.nro;
                                                tutor2.numero = b++;

                                                Persona.findOne({
                                                        identificacion: tutor2.identificacion
                                                    })
                                                    .exec(function(err, datoTutor2) {

                                                        if (datoTutor2 == undefined) {
                                                            listaNuevaTutores2.push(tutor2)

                                                            rest.postJson('http://moswara.com:48000/api/persona', tutor2).on('complete', function(data2, response2) {
                                                                // handle response
                                                                console.log('tutor adicionado', data2)
                                                                console.log("CREADO -----", data2)
                                                                adicionar_tutor_alumno(data2, datoEstudiante)

                                                            });

                                                        } else {
                                                            console.log("ENCONTRADO ++++++", datoTutor2)
                                                            adicionar_tutor_alumno(datoTutor2, datoEstudiante);
                                                        }
                                                        console.log("@@@@@@@@@@ 2222 @@@@@@@@@@")
                                                        callb2(null);
                                                    });
                                            } else {
                                                callb2(null);
                                            }

                                        },
                                        function(callb3) {
                                            if (persona.ci_tutor3.length > 0) {

                                                var tutor3 = recortarNombre(persona.tutor3);
                                                tutor3.identificacion = persona.ci_tutor3
                                                tutor3.expedido = persona.extencion3;
                                                tutor3.rol = "tutor"
                                                tutor3.nro = persona.nro;
                                                tutor3.numero = c++;

                                                Persona.findOne({
                                                        identificacion: tutor3.identificacion
                                                    })
                                                    .exec(function(err, datoTutor3) {
                                                        if (datoTutor3 == undefined) {
                                                            listaNuevaTutores3.push(tutor3)
                                                            rest.postJson('http://moswara.com:48000/api/persona', tutor3).on('complete', function(data3, response2) {
                                                                // handle response
                                                                console.log('tutor adicionado', data3)
                                                                console.log("CREADO -----", data3)
                                                                adicionar_tutor_alumno(data3, datoEstudiante)

                                                            });

                                                        } else {
                                                            console.log("ENCONTRADO ++++++", datoTutor3)
                                                            adicionar_tutor_alumno(datoTutor3, datoEstudiante);
                                                        }
                                                        console.log("@@@@@@@@@@ 3333 @@@@@@@@@@")
                                                        callb3(null);
                                                    });
                                            } else {
                                                callb3(null);
                                            }

                                        },
                                        function(callb4) {

                                            if (persona.ci_tutor4.length > 0) {

                                                var tutor4 = recortarNombre(persona.tutor4);
                                                tutor4.identificacion = persona.ci_tutor4
                                                tutor4.expedido = persona.extencion4;
                                                tutor4.rol = "tutor"
                                                tutor4.nro = persona.nro;
                                                tutor4.numero = d++;

                                                Persona.findOne({
                                                        identificacion: tutor4.identificacion
                                                    })
                                                    .exec(function(err, datoTutor4) {
                                                        if (datoTutor4 == undefined) {
                                                            listaNuevaTutores4.push(tutor4)
                                                            rest.postJson('http://moswara.com:48000/api/persona', tutor4).on('complete', function(data4, response2) {
                                                                // handle response
                                                                console.log('tutor adicionado', data4)
                                                                console.log("CREADO -----", data4)
                                                                adicionar_tutor_alumno(data4, datoEstudiante)

                                                            });

                                                        } else {
                                                            console.log("ENCONTRADO ++++++", datoTutor4)
                                                            adicionar_tutor_alumno(datoTutor4, datoEstudiante);

                                                        }
                                                        console.log("@@@@@@@@@@ 4444 @@@@@@@@@@")
                                                        callb4(null);
                                                    });
                                            } else {
                                                callb4(null);
                                            }


                                        }
                                    ], function(err, results) {
                                        // optional callback
                                        sails.log(" LISTA TUTORES ")
                                        cb();
                                    });

                                } else {
                                    cb();
                                }

                            })

                            // }, this);
                        },
                        function(error) {
                            if (listaNuevaTutores1.length > 1) {
                                stringify(listaNuevaTutores1, function(err, output) {
                                    fs.writeFile("d_tutores_1" + file.filename, output, 'utf8', function(err) {
                                        if (err) {
                                            console.log('Some error occured - file either not saved or corrupted file saved.');
                                        } else {
                                            console.log('It\'s saved!');
                                        }
                                    });
                                });
                            }

                            if (listaNuevaTutores2.length > 1) {
                                stringify(listaNuevaTutores2, function(err, output) {
                                    fs.writeFile("d_tutores_2" + file.filename, output, 'utf8', function(err) {
                                        if (err) {
                                            console.log('Some error occured - file either not saved or corrupted file saved.');
                                        } else {
                                            console.log('It\'s saved!');
                                        }
                                    });
                                });
                            }

                            if (listaNuevaTutores3.length > 1) {
                                stringify(listaNuevaTutores3, function(err, output) {
                                    fs.writeFile("d_tutores_3" + file.filename, output, 'utf8', function(err) {
                                        if (err) {
                                            console.log('Some error occured - file either not saved or corrupted file saved.');
                                        } else {
                                            console.log('It\'s saved!');
                                        }
                                    });
                                });
                            }

                            if (listaNuevaTutores4.length > 1) {
                                stringify(listaNuevaTutores4, function(err, output) {
                                    fs.writeFile("d_tutores_4" + file.filename, output, 'utf8', function(err) {
                                        if (err) {
                                            console.log('Some error occured - file either not saved or corrupted file saved.');
                                        } else {
                                            console.log('It\'s saved!');
                                        }
                                    });
                                });
                            }



                            sails.log("-------------------FINAL LISTA -----------------------")
                            callback(null);
                            // return res.send("tutores")
                        });

                },
                function(error) {
                    sails.log("-------------------FINAL TODO -----------------------")

                    // res.send("fin")
                });

            res.send("OTRA ALTERNATIVA")

        });



    },
    codigosDomingo: function(req, res) {

        var files = [];
        req.file('files').upload({
            // ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/otros/cvs'),
            saveAs: function(__newFileStream, cb) {
                cb(null, "TT" + __newFileStream.filename);
            },
            maxBytes: 10000000
        }, function whenDone(err, uploadedFiles) {

            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }


            async.eachSeries(uploadedFiles, function(file, callback) {

                    sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")

                    sails.log(file)
                    sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                    var nuevasPersonas = [];
                    var dato = fs.readFileSync(file.fd, {
                        encoding: 'utf8'
                    });
                    var options = {
                        delimiter: ',', // optional
                        quote: '"' // optional
                    };

                    nuevasPersonas = csvjson.toObject(dato, options);
                    var a = 1


                    var listaPrincipal = [];
                    listaPrincipal.push({

                        nombreTutor: "nombreTutor",
                        cedula: "cedula",
                        estudiante1: "estudiante1",
                        estudiante2: "estudiante2",
                        estudiante3: "estudiante3",
                        estudiante4: "estudiante4",
                        estudiante5: "estudiante5",
                        numeroQr: "numeroQr"
                    })


                    async.eachSeries(nuevasPersonas, function(persona, cb) {


                            var auxLista = {
                                nombreTutor: persona.nombre + " " + persona.paterno + " " + persona.materno,
                                cedula: persona.identificacion
                            }


                            Persona.findOne({
                                identificacion: persona.identificacion,
                                rol: "tutor"

                            }).exec(function(err, datoTutor) {



                                if (err) {
                                    return res.serverError(err);
                                }

                                console.log("DATO TUTOR ENCONTRADO:", datoTutor);

                                if (datoTutor != undefined) {
                                    Tutor.findOne({
                                        idPersona: datoTutor.id
                                    }).exec(function(err, tutorDato) {


                                        Tutor_alumno.find({
                                            where: {
                                                idTutor: tutorDato.id
                                            }

                                        }).exec(function(err, datoTutor_alumno) {
                                            if (err) {
                                                return res.serverError(err);
                                            }

                                            var alumnos = [];

                                            async.forEach(datoTutor_alumno, function(auxAlumno, cb1) {
                                                Alumno.findOne({
                                                    id: auxAlumno.idAlumno
                                                }).populate('idPersona').exec(function(err, datoAlumno) {
                                                    if (err) {
                                                        return res.serverError(err);
                                                    }

                                                    // console.log(datoAlumno)
                                                    alumnos.push(datoAlumno.idPersona);
                                                    cb1();
                                                });

                                            }, function(error) {

                                                if (error) return res.negotiate(error);


                                                sails.log("TAMAÑO alumnos", alumnos.length);

                                                sails.log("alumnos", alumnos);
                                                alumnos.forEach(function(element, i) {

                                                    // auxLista["estudiante" + (i + 1)] = element.nombre + " " + element.paterno + " " + element.materno
                                                    auxLista["estudiante" + (i + 1)] = element.nombre + " " + element.paterno + " " + element.materno

                                                }, this);

                                                auxLista.numeroQr = a;
                                                a++;

                                                sails.log("AUXLISTA.numeroQR", auxLista.numeroQr);
                                                listaPrincipal.push(auxLista);


                                                var codigoQr = persona.identificacion + '$2018$' + 'Colegio Domingo Savio '
                                                var code = qr.image(codigoQr, {
                                                    type: 'png'
                                                });
                                                var dir = './assets/codigos/domingo_savio/padres_turnoTarde/' + file.filename.split(".")[0] + "/"
                                                if (!fs.existsSync(dir)) {
                                                    fs.mkdirSync(dir);
                                                }
                                                var output = fs.createWriteStream(path.join(__dirname, '../../' + dir + auxLista.numeroQr + '.jpg'))

                                                code.pipe(output);


                                                // }, this);
                                                cb();
                                            });

                                        })

                                    })
                                } else {
                                    cb();
                                }




                            });


                        },
                        function(error) {

                            stringify(listaPrincipal, function(err, output) {
                                fs.writeFile(file.filename, output, 'utf8', function(err) {
                                    if (err) {
                                        console.log('Some error occured - file either not saved or corrupted file saved.');
                                    } else {
                                        console.log('It\'s saved!');
                                    }
                                });
                            });
                            sails.log("-------------------FINAL LISTA -----------------------")
                            callback(null);
                            // return res.send("tutores")
                        });

                },
                function(error) {
                    // res.send("fin")

                    sails.log("-------------------FINAL DE TODO -----------------------")
                });

            res.send("OTRA ALTERNATIVA")

        });



    },
    cargarFotosBolnor: function(req, res) {
        req.file('avatar').upload({
            // ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/avatars'),
            saveAs: function(__newFileStream, cb) {
                cb(null, __newFileStream.filename);
            },
            maxBytes: 1025000000
        }, function whenDone(err, uploadedFiles) {

            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }

            uploadedFiles.forEach(function(file, i) {
                var nombreFoto = parseInt(file.filename.substring(4, 8)) + "";
                sails.log("nombre foto", nombreFoto)
                    // var nombreFoto = file.filename.substring(4, 8) + "";

                // sails.log('Persona - Identificacion', "*" + persona.identificacion + "*")
                var urlFoto = (uploadedFiles[i].fd).split(path.sep);
                sails.log("fotos:", urlFoto);
                var url = "avatars/" + urlFoto[urlFoto.length - 1]


                Persona.update({
                    // or: [
                    //     { identificacion: nombreFoto },
                    //     { codigoFoto: nombreFoto }
                    // ]
                    codigoFoto: nombreFoto
                }, {
                    img: url
                }).fetch().exec(function(err, per) {

                    if (err) {
                        console.log(err);
                        return res.negotiate(err)
                    };

                    console.log('Se adicio Foto a : ', per)
                });

                // var auxCodigoFoto = "";
                // if (persona.codigoFoto != undefined) {

                //     auxCodigoFoto = persona.codigoFoto;


                // } else {
                //     auxCodigoFoto = persona.identificacion;
                // }
                // sails.log('NOMBRE FOTO: ', nombreFoto)
                // sails.log('codigo FOTO: ', auxCodigoFoto)

            }, this);

            res.send("FOTO SIENDO ADICIONADA")

        });
    },
    random: (req, res) => {

        Persona.findOne({
            identificacion: '1730'
        }).exec(function(err, datoPersona) {
            if (err) {
                console.log(err);
                return res.negotiate(err)
            };

            console.log('ID PERSONA : ', datoPersona)
            Persona.update({
                id: datoPersona.id
            }, {
                img: 'url'
            }).exec(function(err, per) {

                if (err) {
                    console.log(err);
                    return res.negotiate(err)
                };

                console.log('Se adicio Foto a : ', per.identificacion)

                res.send(per)
            });
        });
    },
    fotosFaltantes: (req, res) => {

        Persona.find().exec((err, datoPersonas) => {

            var personas = [];
            async.each(datoPersonas, function(element, cb) {


                    if (element.rol == "alumno") {
                        var query = "SELECT p.nombre as paralelo, t.nombre as turno, g.nombre as grupo, tmpCurso.nombre , tmpCurso.paterno ,tmpCurso.materno,tmpCurso.img, tmpCurso.id as idAlumno ,tmpCurso.idCurso, tmpCurso.idPersona from paralelo p, turno t, grupo g , (SELECT c.idParalelo, c.idTurno,c.idGrupo, tmpInscribe.nombre, tmpInscribe.img, tmpInscribe.paterno,tmpInscribe.materno, tmpInscribe.idPersona, tmpInscribe.id, tmpInscribe.idCurso from curso c , (SELECT i.idCurso, tmpAlumno.nombre, tmpAlumno.paterno,tmpAlumno.materno, tmpAlumno.img, tmpAlumno.id, tmpAlumno.idPersona from inscribe i , (select p.nombre , p.paterno, p.materno , p.img, p.id as idPersona, a.id from persona p, alumno a where p.identificacion = $1 and p.id = a.idPersona) tmpAlumno where i.idAlumno = tmpAlumno.id) tmpInscribe where c.id = tmpInscribe.idCurso)tmpCurso WHERE p.id = tmpCurso.idParalelo and t.id = tmpCurso.idTurno and g.id = tmpCurso.idGrupo"
                        sails.sendNativeQuery(query, [element.identificacion], function(err, result) {
                            if (err) {
                                return res.serverError(err);
                            }
                            if (result.rows[0] != undefined) {
                                var consulta = result.rows;

                                var auxConsulta = consulta[0].img;
                                if (auxConsulta != null) {
                                    sails.log("IMG", auxConsulta)
                                    if (auxConsulta.length == 0) {
                                        personas.push(consulta[0]);
                                    }
                                } else {
                                    personas.push(consulta[0]);
                                }
                            }
                            cb();
                            // Persona.query(query, [element.identificacion], function (err, consulta) {
                        });
                    } else {
                        cb();
                    }


                },
                function(error) {

                    sails.log("-------------------FINAL LISTA -----------------------")

                    // var estudiantes = []
                    // async.each(personas, function(element, cb) {


                    //     Persona.findOne(element.idPersona).exec((err, datoPersona) => {

                    //         estudiantes.push(datoPersona)
                    //         cb();
                    //     })

                    // }, error => {


                    //     res.send(estudiantes)
                    // });

                    // stringify(personas, function (err, output) {
                    //   fs.writeFile('fotos_faltantes.csv', output, 'utf8', function (err) {
                    //     if (err) {
                    //       console.log('Some error occured - file either not saved or corrupted file saved.');
                    //     } else {
                    //       console.log('It\'s saved!');
                    //     }
                    //   });
                    // });


                    sails.log("LENGTH:", personas.length)
                    res.send(personas)
                        // return res.send("tutores")
                });


        })


    },
    actualizarFoto: function(req, res) {

        var files = [];
        req.file('csv').upload({
            // ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/otros/cvs'),
            saveAs: function(__newFileStream, cb) {
                cb(null, "TT" + __newFileStream.filename);
            },
            maxBytes: 10000000
        }, function whenDone(err, uploadedFiles) {

            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }


            async.eachSeries(uploadedFiles, function(file, callback) {

                    sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")

                    sails.log(file)
                    sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                    var nuevasPersonas = [];
                    var dato = fs.readFileSync(file.fd, {
                        encoding: 'utf8'
                    });
                    var options = {
                        delimiter: ',', // optional
                        quote: '"' // optional
                    };

                    nuevasPersonas = csvjson.toObject(dato, options);
                    async.each(nuevasPersonas, function(persona, cb) {
                            // ¿¿¿¿¿¿¿¿¿¿¿¿¿¿  nuevasPersonas ¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿
                            var alumnosCurso = [];
                            var auxPersona = {}
                            Inscribe.find({
                                idCurso: persona.idCurso
                            }).populate('idAlumno').exec(function(err, inscripciones) {
                                async.eachSeries(inscripciones, function(inscripcion, cb2) {

                                    Persona.findOne(inscripcion.idAlumno.idPersona).exec(function(err, alumno) {
                                        cb2();
                                    })
                                }, function(error) {

                                    if (error) return res.negotiate(error);
                                    sails.log("tamaño", inscripciones.length)
                                    sails.log("es curso ", inscripciones[0].idCurso)
                                    auxPersona = alumnosCurso.find(function(element) {
                                        return element.nro == persona.nro
                                    })



                                });

                            })


                            // ¿¿¿¿¿¿¿¿¿¿¿¿¿¿  nuevasPersonas ¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿

                            // }, this);
                        },
                        function(error) {

                            sails.log("-------------------FINAL LISTA -----------------------")
                            callback(null);
                            // return res.send("tutores")
                        });

                },
                function(error) {
                    sails.log("-------------------FINAL TODO -----------------------")

                    res.send("fin")
                });


        });


    },
    docentes_domingo: function(req, res) {

        var files = [];
        req.file('files').upload({
            // ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/otros/cvs'),
            saveAs: function(__newFileStream, cb) {
                cb(null, "TT" + __newFileStream.filename);
            },
            maxBytes: 10000000
        }, function whenDone(err, uploadedFiles) {

            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }


            async.eachSeries(uploadedFiles, function(file, callback) {

                    sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")

                    sails.log(file)
                    sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                    var nuevasPersonas = [];
                    var dato = fs.readFileSync(file.fd, {
                        encoding: 'utf8'
                    });
                    var options = {
                        delimiter: ',', // optional
                        quote: '"' // optional
                    };

                    nuevasPersonas = csvjson.toObject(dato, options);

                    async.eachSeries(nuevasPersonas, function(persona, cb) {
                            if (persona.nombre.length > 0) {

                                var auxIdentificacion = persona.paterno.charAt(0) + persona.materno.charAt(0) + persona.nombre.charAt(0)

                                if (persona.rol == "profesor") {
                                    rest.postJson('http://moswara.com:48000/api/persona', persona).on('complete', function(data3, response2) {
                                        // handle response
                                        console.log('tutor adicionado', data3)
                                        console.log("CREADO -----", data3)

                                        Persona.update(data3.id).set({
                                            identificacion: data3.id + auxIdentificacion
                                        }).fetch().exec(function(err, personaUpdate) {
                                            sails.log("ACTUALIZADO", personaUpdate)
                                            var codigoQr = personaUpdate[0].identificacion + '$2018$' + 'Colegio Domingo Savio '
                                            var code = qr.image(codigoQr, {
                                                type: 'png'
                                            });
                                            var dir = './assets/codigos/domingo_savio/docentes/' + file.filename.split(".")[0] + "/"
                                            if (!fs.existsSync(dir)) {
                                                fs.mkdirSync(dir);
                                            }
                                            var output = fs.createWriteStream(path.join(__dirname, '../../' + dir + persona.nro + '.jpg'))

                                            code.pipe(output);
                                            cb();
                                        })

                                    });
                                } else {
                                    persona.cargo = persona.asignatura;
                                    rest.postJson('http://moswara.com:48000/api/persona', persona).on('complete', function(data3, response2) {
                                        // handle response
                                        console.log('tutor adicionado', data3)
                                        console.log("CREADO -----", data3)
                                        Persona.update(data3.id).set({
                                            identificacion: data3.id + auxIdentificacion
                                        }).fetch().exec(function(err, personaUpdate) {
                                            sails.log("ACTUALIZADO", personaUpdate)
                                            var codigoQr = personaUpdate[0].identificacion + '$2018$' + 'Colegio Domingo Savio '
                                            var code = qr.image(codigoQr, {
                                                type: 'png'
                                            });
                                            var dir = './assets/codigos/domingo_savio/docentes/' + file.filename.split(".")[0] + "/"
                                            if (!fs.existsSync(dir)) {
                                                fs.mkdirSync(dir);
                                            }
                                            var output = fs.createWriteStream(path.join(__dirname, '../../' + dir + persona.nro + '.jpg'))

                                            code.pipe(output);
                                            cb();
                                        })

                                    });
                                }
                            } else {
                                cb();
                            }


                        },
                        function(error) {


                            sails.log("-------------------FINAL LISTA -----------------------")
                            callback(null);
                            // return res.send("tutores")
                        });

                },
                function(error) {
                    // res.send("fin")

                    sails.log("-------------------FINAL DE TODO -----------------------")
                });

            res.send("OTRA ALTERNATIVA")

        });



    },
    arreglar_fotos: function(req, res) {

        var files = [];
        req.file('avatar').upload({
            // ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/avatars'),
            saveAs: function(__newFileStream, cb) {
                cb(null, "TM" + __newFileStream.filename);
            },
            maxBytes: 10998000000
        }, function whenDone(err, uploadedFiles) {

            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }


            // async.eachSeries(uploadedFiles, function (file, cb) {

            uploadedFiles.forEach(function(file, i) {
                sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")

                sails.log(file)
                sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")


                var nombreFoto = parseInt(file.filename.substring(4, 8)) + "";
                sails.log("NOMBRE FOTO", nombreFoto)

                var urlFoto = (file.fd).split(path.sep);
                sails.log("fotos:", urlFoto);
                var url = "avatars//" + urlFoto[urlFoto.length - 1]

                Persona.update({
                    codigoFoto: nombreFoto
                }).set({
                    img: url
                }).fetch().exec(function(err, datoPersona) {

                    console.log("actualizado", datoPersona)
                    cb();
                })
            });


            // },
            // function (error) {
            //   // res.send("fin")

            //   sails.log("-------------------FINAL DE TODO -----------------------")
            // });

            res.send("OTRA ALTERNATIVA")

        });



    },
    actualizarFotos: function(req, res) {

        var files = [];
        req.file('files').upload({
            // ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/otros/cvs'),
            saveAs: function(__newFileStream, cb) {
                cb(null, "TM" + __newFileStream.filename);
            },
            maxBytes: 10000000
        }, function whenDone(err, uploadedFiles) {

            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }


            async.eachSeries(uploadedFiles, function(file, callback) {

                    sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")

                    sails.log(file)
                    sails.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                    var nuevasPersonas = [];
                    var dato = fs.readFileSync(file.fd, {
                        encoding: 'utf8'
                    });
                    var options = {
                        delimiter: ',', // optional
                        quote: '"' // optional
                    };

                    nuevasPersonas = csvjson.toObject(dato, options);

                    async.eachSeries(nuevasPersonas, function(persona, cb) {

                            // ¿¿¿¿¿¿¿¿¿¿¿¿¿¿  nuevasPersonas ¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿
                            var alumnosCurso = [];
                            var auxPersona = {}
                            Inscribe.find({
                                idCurso: persona.idCurso
                            }).populate('idAlumno').exec(function(err, inscripciones) {
                                async.eachSeries(inscripciones, function(inscripcion, cb2) {

                                    Persona.findOne(inscripcion.idAlumno.idPersona).exec(function(err, alumno) {

                                        if (alumno != undefined) {
                                            if (alumno.img != null) {
                                                if (alumno.img.length == 0) {
                                                    alumnosCurso.push(alumno)
                                                }
                                            } else {
                                                alumnosCurso.push(alumno)
                                            }
                                        }
                                        //  alumnosCurso.push(alumno)
                                        cb2();
                                    })
                                }, function(error) {

                                    if (error) return res.negotiate(error);
                                    // sails.log("tamaño", inscripciones.length)
                                    // sails.log("Persona", alumnosCurso)
                                    auxPersona = alumnosCurso.find(function(element) {
                                        return element.nro == persona.nro
                                    })
                                    sails.log("AUX PERSONA : ", auxPersona)

                                    if (auxPersona != undefined) {

                                        var auxConsulta = auxPersona.img;
                                        if (auxConsulta == null) {
                                            sails.log("persona.foto", persona.foto)

                                            // var auxImg = fs.createReadStream('C:/Users/oso/Desktop/turno mañana/'+persona.idCurso+'/' + persona.foto)
                                            // var imgStats = fs.statSync('C:/Users/oso/Desktop/turno mañana/'+persona.idCurso+'/' + persona.foto)
                                            // sails.log("IMG",auxImg)
                                            unirest.post("http://localhost:1337/persona/avatar/" + auxPersona.id)
                                                .headers({
                                                    'Content-Type': 'multipart/form-data'
                                                        // "Content-Length":imgStats.size
                                                })
                                                .attach('avatar', 'C:/Users/oso/Desktop/turno mañana/' + persona.idCurso + '/' + persona.foto) // Attachment
                                                .end(function(response) {
                                                    console.log(response.body);
                                                });
                                            cb();
                                        } else {
                                            if (auxConsulta.length == 0) {
                                                unirest.post("http://localhost:1337/persona/avatar/" + auxPersona.id)
                                                    .headers({
                                                        'Content-Type': 'multipart/form-data'
                                                            // "Content-Length":9999999

                                                    })
                                                    .attach('avatar', 'C:/Users/oso/Desktop/turno mañana/' + persona.idCurso + '/' + persona.foto) // Attachment
                                                    .end(function(response) {
                                                        console.log(response.body);
                                                    });
                                            }
                                            cb();
                                        }
                                    } else {
                                        cb();
                                    }



                                });

                            })


                            // ¿¿¿¿¿¿¿¿¿¿¿¿¿¿  nuevasPersonas ¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿



                        },
                        function(error) {


                            sails.log("-------------------FINAL LISTA -----------------------")
                            callback(null);
                            // return res.send("tutores")
                        });

                },
                function(error) {
                    // res.send("fin")

                    sails.log("-------------------FINAL DE TODO -----------------------")
                });

            res.send("OTRA ALTERNATIVA")

        });



    },
    updateCreacion: function(req, res) {
        for (let index = 1; index < 1938; index++) {
            Inscribe.update(index).set({
                createdAt: 1539479010800
            }).fetch().exec(function(err, datoPerons) {
                sails.log("INDEX ", index)
            });
        }
        res.send("Todo actualizado")
    },
    eliminarCursos: function(req, res) {
        Inscribe.find({
            idCurso: 31
        }).populate('idAlumno').exec(function(err, inscripciones) {
            var alumnosCurso = [];

            async.forEach(inscripciones, function(inscripcion, cb) {
                Inscribe.destroy(inscripcion.id).exec(function(err, datoInscribe) {
                    console.log("eliminado", datoInscribe)
                })
            }, function(error) {

                if (error) return res.negotiate(error);
                sails.log("tamaño", inscripciones.length)
                sails.log("es curso ", inscripciones[0].idCurso)
                return res.send(alumnosCurso)
            });

        })
    }

};