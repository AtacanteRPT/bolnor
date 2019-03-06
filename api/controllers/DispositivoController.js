/**
 * DispositivoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 

module.exports = {


    eliminar: function (req, res) {

        Dispositivo.destroy({ idDispositivo: req.param("idDispositivo") }).exec(function (err, result) {
            res.send(result)
        })
    },
    adicionar: function (req, res) {

        sails.log("######### ################", req.param("idDispositivo"))
        Dispositivo.create({ idDispositivo: req.param("idDispositivo"), idPersona: req.user.id }).fetch().exec(function (err, result) {
            if (err) { return res.serverError(err); }
            res.send(result)
        })
    },
    sql: function (req, res) {

        var actualIdentificacion = '2513-FJJ'
        var query = "SELECT p.nombre as paralelo, t.nombre as turno, g.nombre as grupo, tmpCurso.nombre , tmpCurso.paterno ,tmpCurso.materno,tmpCurso.img, tmpCurso.id as idAlumno ,tmpCurso.idCurso, tmpCurso.idPersona from paralelo p, turno t, grupo g , (SELECT c.idParalelo, c.idTurno,c.idGrupo, tmpInscribe.nombre, tmpInscribe.img, tmpInscribe.paterno,tmpInscribe.materno, tmpInscribe.idPersona, tmpInscribe.id, tmpInscribe.idCurso from curso c , (SELECT i.idCurso, tmpAlumno.nombre, tmpAlumno.paterno,tmpAlumno.materno, tmpAlumno.img, tmpAlumno.id, tmpAlumno.idPersona from inscribe i , (select p.nombre , p.paterno, p.materno , p.img, p.id as idPersona, a.id from persona p, alumno a where p.identificacion = $1 and p.id = a.idPersona) tmpAlumno where i.idAlumno = tmpAlumno.id) tmpInscribe where c.id = tmpInscribe.idCurso)tmpCurso WHERE p.id = tmpCurso.idParalelo and t.id = tmpCurso.idTurno and g.id = tmpCurso.idGrupo"
        sails.sendNativeQuery(query, [actualIdentificacion], function (err, consulta) {

            res.send(consulta)
        });

    },

        mostrar: function (req, res) {
        var baseidentificacion = '2513-FJJ'
        console.log("CLIENTE : ", '2513-FJJ')

        var fecha = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate()

        sails.log("**********FECHA**************", fecha);
        horaActual = moment().format('LTS')
        if (hoy.getHours() >= maxHoraLlegada && hoy.getMinutes() >= minsSalida && sw == 0) {
            actualIdentificacion = '0';
            sw = 1;
        }

        if (baseidentificacion != actualIdentificacion) {
            if (actualIdentificacion == '0') { sw == 1 }

            actualIdentificacion = baseidentificacion;
            Persona.findOne({ identificacion: actualIdentificacion }).exec((err, datoPersona) => {
                if (datoPersona == undefined) {
                    auxAlumno.nombre = 'NO'
                    auxAlumno.paterno = 'ENCONTRADO NINGUN'
                    auxAlumno.materno = 'USUARIO CON ESTE CODIGO, registre porfavor'

                    baseidentificacion = '';
                    return res.send(auxAlumno);
                }

                if (datoPersona.rol == "alumno") {


                    var query = "SELECT p.nombre as paralelo, t.nombre as turno, g.nombre as grupo, tmpCurso.nombre , tmpCurso.paterno ,tmpCurso.materno,tmpCurso.img, tmpCurso.id as idAlumno ,tmpCurso.idCurso, tmpCurso.idPersona from paralelo p, turno t, grupo g , (SELECT c.idParalelo, c.idTurno,c.idGrupo, tmpInscribe.nombre, tmpInscribe.img, tmpInscribe.paterno,tmpInscribe.materno, tmpInscribe.idPersona, tmpInscribe.id, tmpInscribe.idCurso from curso c , (SELECT i.idCurso, tmpAlumno.nombre, tmpAlumno.paterno,tmpAlumno.materno, tmpAlumno.img, tmpAlumno.id, tmpAlumno.idPersona from inscribe i , (select p.nombre , p.paterno, p.materno , p.img, p.id as idPersona, a.id from persona p, alumno a where p.identificacion = $1 and p.id = a.idPersona) tmpAlumno where i.idAlumno = tmpAlumno.id) tmpInscribe where c.id = tmpInscribe.idCurso)tmpCurso WHERE p.id = tmpCurso.idParalelo and t.id = tmpCurso.idTurno and g.id = tmpCurso.idGrupo"
                    // Persona.query(query, [actualIdentificacion], function (err, consulta) {

                    sails.sendNativeQuery(query, [actualIdentificacion], function (err, result) {
                        var consulta = result.rows;

                        if (err) { return res.serverError(err); }

                        var resultado = {}

                        console.log('tamaño console length', consulta.length)
                        if (consulta.length == 1) {
                            resultado = consulta[0]
                        } else {

                            resultado = datoPersona
                            resultado.curso = 'No inscrito'
                            resultado.turno = 'No inscrito'
                            resultado.paralelo = 'No inscrito'
                            resultado.grupo = ''
                            sails.log('++++++++ ERROE EN CONSULTA +++++ devolviendo persona', resultado);
                        }
                        sails.log("RESULTADO", consulta)

                        Asistencia.findOne({ idPersona: resultado.idPersona, fecha: fecha }).exec((err, datoAsistencia) => {
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
                                }

                                ).exec((err, datoAsistencia) => {
                                    if (err) { return res.serverError(err); }

                                    auxAlumno = {
                                        identificacion: actualIdentificacion,
                                        materno: resultado.materno,
                                        paterno: resultado.paterno,
                                        nombre: resultado.nombre,
                                        curso: resultado.grupo + " " + resultado.paralelo,
                                        turno: resultado.turno,
                                        img: resultado.img
                                    }

                                    rest.postJson(DOMINIO + 'persona/notificar', { id: datoPersona.id, mensaje: " Hora Llegada : " + datoAsistencia.hora_llegada }).on('complete', function (data3, response3) {
                                        // handle response
                                        sails.log("se enviò una notificaciòn")

                                    });

                                    if (resultado.turno == "Tarde") {

                                        if (hoy.getHours() >= minHoraSalidaT && hoy.getMinutes() >= minsSalida) {

                                            auxAlumno.hora_llegada = moment().format('LTS') + ' no marco entrada'
                                            auxAlumno.hora_salida = moment().format('LTS')
                                        } else {

                                            auxAlumno.hora_llegada = moment().format('LTS')
                                            auxAlumno.hora_salida = moment().format('LTS') + '(no registrado)'
                                        }
                                    } else {

                                        if (hoy.getHours() >= minHoraSalidaM && hoy.getMinutes() >= minsSalida) {

                                            auxAlumno.hora_llegada = moment().format('LTS') + ' no marco entrada'
                                            auxAlumno.hora_salida = moment().format('LTS')

                                        } else {
                                            auxAlumno.hora_llegada = moment().format('LTS')
                                            auxAlumno.hora_salida = moment().format('LTS') + '(no registrado)'

                                        }
                                    }


                                    console.log("nuevo", auxAlumno)
                                    return res.send(auxAlumno);

                                });
                            } else if (resultado.turno == "Tarde" && hoy.getHours() >= minHoraSalidaT && hoy.getMinutes() >= minsSalida && datoAsistencia != null) {
                                console.log('paso 4 actualizando salida')

                                Asistencia.update({ idPersona: resultado.idPersona, fecha: fecha }, {
                                    hora_salida: horaActual
                                }).exec((err, datoAsistencia) => {
                                    console.log('actualizado', datoAsistencia)

                                    auxAlumno = {
                                        identificacion: actualIdentificacion,
                                        materno: resultado.materno,
                                        paterno: resultado.paterno,
                                        nombre: resultado.nombre,
                                        curso: resultado.grupo + " " + resultado.paralelo,
                                        turno: resultado.turno,
                                        img: resultado.img,
                                        hora_llegada: datoAsistencia[0].hora_llegada,
                                        hora_salida: datoAsistencia[0].hora_salida
                                    }

                                    rest.postJson(DOMINIO + 'persona/notificar', { id: datoPersona.id, mensaje: " Hora Salida : " + datoAsistencia.hora_salida }).on('complete', function (data3, response3) {
                                        // handle response
                                        sails.log("se enviò una notificaciòn")
                                    });

                                    res.send(auxAlumno);
                                })

                            } else if (hoy.getHours() >= minHoraSalidaM && hoy.getMinutes() >= minsSalida && datoAsistencia != null) {
                                console.log('paso 4 actualizando salida')

                                Asistencia.update({ idPersona: resultado.idPersona, fecha: fecha }, {
                                    hora_salida: horaActual
                                }).exec((err, datoAsistencia) => {
                                    console.log('actualizado', datoAsistencia)

                                    auxAlumno = {
                                        identificacion: actualIdentificacion,
                                        materno: resultado.materno,
                                        paterno: resultado.paterno,
                                        nombre: resultado.nombre,
                                        curso: resultado.grupo + " " + resultado.paralelo,
                                        turno: resultado.turno,
                                        img: resultado.img,
                                        hora_llegada: datoAsistencia[0].hora_llegada,
                                        hora_salida: datoAsistencia[0].hora_salida
                                    }

                                    rest.postJson(DOMINIO + 'persona/notificar', { id: datoPersona.id, mensaje: " Hora Salida : " + datoAsistencia.hora_salida }).on('complete', function (data3, response3) {
                                        // handle response
                                        sails.log("se enviò una notificaciòn")
                                    });


                                    res.send(auxAlumno);
                                })

                            } else if (datoAsistencia != null) {
                                console.log('mostrando sin cambios')
                                auxAlumno = {
                                    identificacion: actualIdentificacion,
                                    materno: resultado.materno,
                                    paterno: resultado.paterno,
                                    nombre: resultado.nombre,
                                    curso: resultado.grupo + " " + resultado.paralelo,
                                    turno: resultado.turno,
                                    img: resultado.img,
                                    hora_llegada: datoAsistencia.hora_llegada,
                                    hora_salida: moment().format('LTS') + ' (momentanea)'
                                }

                                res.send(auxAlumno)
                            }

                        })
                    });
                } else if (datoPersona.rol == "tutor") {
                    sails.log("DATO PERSONA", datoPersona)
                    Tutor.findOne({ idPersona: datoPersona.id }).exec((err, auxTutor) => {
                        Tutor_alumno.findOne({ idTutor: auxTutor.id }).populate("idAlumno").exec((err, auxAlumno) => {
                            sails.log("+++++++++++++++++auxALumno+++++++++++++++++", auxAlumno)
                            if (auxAlumno) {

                                Persona.findOne(auxAlumno.idAlumno.idPersona).exec((err, auxPersona) => {

                                    rest.postJson(DOMINIO + 'asistencia/mostrar', { baseidentificacion: auxPersona.identificacion }).on('complete', function (data2, response2) {
                                        // handle response
                                        res.send(data2)

                                    });

                                })
                            } else {
                                res.send(auxAlumno)
                            }
                        });
                    })
                }

            })

        } else {
            console.log('actualIdentifiacion', actualIdentificacion);
            console.log('baseIdentificacion', baseidentificacion);
            console.log('repedito')
            res.send(auxAlumno)
        }

    },

};

