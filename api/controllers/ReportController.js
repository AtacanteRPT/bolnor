var fs = require('fs')
var path = require('path')
    // var conversion = require("phantom-html-to-pdf")();

module.exports = {

    asistenciaDia: function(req, res) {

        var dia = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
        var mes = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

        var fechaA = new Date('2/27/2018');
        var hoy = new Date();
        console.log('fecha', fechaA)
        Asistencia.find().populate('idPersona').exec((err, datoAsistencias) => {
            sails.log('datoAsistencias', datoAsistencias[0].fecha)
            datoAsistencias[0].fecha = fechaA.getDate() + ' de ' + mes[fechaA.getMonth()] + ' de ' + fechaA.getFullYear()
            res.view('asistenciaDia', { asistencia: datoAsistencias });
        });
    },

    generarReportePorDia: (req, res) => {

        var html = ''
        conversion({
                // html: "<h1>Hello World</h1>" 
                url: 'http://localhost:1337/report/asistenciaDia'
            }

            ,
            function(err, pdf) {
                var output = fs.createWriteStream(path.join(__dirname, '../.././assets/reportes/output.pdf'))
                console.log(pdf.logs);

                console.log(pdf.numberOfPages);
                // since pdf.stream is a node.js stream you can use it
                // to save the pdf to a file (like in this example) or to
                // respond an http request.
                pdf.stream.pipe(output);
            });
        res.send('NADA')
    },
    generarReportePorMes: (req, res) => {

        var html = ''
        conversion({
                // html: "<h1>Hello World</h1>" 
                url: 'https://es.wikipedia.org/wiki/Wikipedia:Portada'
            }

            ,
            function(err, pdf) {
                var output = fs.createWriteStream(path.join(__dirname, '../.././assets/reportes/output.pdf'))
                console.log(pdf.logs);
                console.log(pdf.numberOfPages);
                // since pdf.stream is a node.js stream you can use it
                // to save the pdf to a file (like in this example) or to
                // respond an http request.
                pdf.stream.pipe(output);
            });
        res.send('NADA')
    },
    mostrar: function(req, res) {

        res.send('NADA otra vez')
    },
    curso: function(req, res) {

        var curso = {
            idParalelo: req.query.idParalelo,
            idTurno: req.query.idTurno,
            idGrado: req.query.idGrado,
            idGrupo: req.query.idGrupo
        };

        console.log('TODO QUERY', req.query)
        var asistenciasCurso = []

        Curso.findOne(curso).exec(function(err, datoCurso) {

            if (datoCurso != undefined) {
                sails.log("curso encontrado", datoCurso);
                Inscribe.find({ idCurso: datoCurso.id }).populate('idAlumno').exec(function(err, inscripciones) {

                    var alumnosCurso = [];
                    
                    async.forEach(inscripciones, function(inscripcion, cb) {

                        // sails.log("inscribe ", inscripcion)
                        var alumno = inscripcion.idAlumno;
                        // sails.log("alumno ", alumno)
                        if (alumno != undefined) {
                            Asistencia.find({
                                idPersona: alumno.idPersona,
                                fecha: { '>': req.query.ini, '<': req.query.fin }

                            }).populate('idPersona').populate('idGestionAcademica').exec(function(err, datosAsistencia) {
                                sails.log("asistnecias  ", datosAsistencia)
                                alumnosCurso = alumnosCurso.concat(datosAsistencia);
                                cb();
                            });
                        } else {
                            cb();
                        }

                    }, function(error) {

                        if (error) return res.negotiate(error);
                        return res.send(alumnosCurso)

                    });
                })
            } else {
                res.send(asistenciasCurso)
            }

        })

    },
    individual: function(req, res) {

        var alumno = req.query

        Asistencia.find({
            idPersona: alumno.id,
            fecha: { '>': alumno.ini, '<': alumno.fin }

        }).exec(function(err, datosAsistencia) {
            res.send(datosAsistencia)
        });

    },
    generarReportePorGestion: (req, res) => {

        var html = ''
        conversion({
                // html: "<h1>Hello World</h1>" 
                url: 'https://es.wikipedia.org/wiki/Wikipedia:Portada'
            }

            ,
            function(err, pdf) {
                var output = fs.createWriteStream(path.join(__dirname, '../.././assets/reportes/output.pdf'))
                console.log(pdf.logs);
                console.log(pdf.numberOfPages);
                // since pdf.stream is a node.js stream you can use it
                // to save the pdf to a file (like in this example) or to
                // respond an http request.
                pdf.stream.pipe(output);
            });
        res.send('NADA')
    },
    mostrar: function(req, res) {

        res.send('NADA otra vez')
    }

};