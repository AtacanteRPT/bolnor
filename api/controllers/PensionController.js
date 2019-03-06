/**
 * PensionController
 *
 * @description :: Server-side logic for managing Pensions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    pension_por_tutor: (req, res) => {

        // var meses = 'enero,febrero,marzo,abril,mayo,junio,julio,agosto,septiembre,octubre,noviembre,diciembre'
        var tutor_alumnos = {};

        var alumnos = [];
        var idTutor = req.param('id');
        var gestion = new Date().getFullYear();
        // var gestion = req.param('gestion');
        Tutor.findOne({ idPersona: idTutor }).populate('idPersona').exec(function (err, datoTutor) {
            if (err) { return res.serverError(err); }

            tutor_alumnos = datoTutor;

            Tutor_alumno.find({ idTutor: datoTutor.id }).exec((err, datoEstudiantes) => {
                if (err) { return res.serverError(err); }

                tutor_alumnos.estudiantes = [];
                async.forEach(datoEstudiantes, function (auxAlumno, cb) {
                    Alumno.findOne({ id: auxAlumno.idAlumno }).populate('idPersona').exec(function (err, datoAlumno) {
                        if (err) { return res.serverError(err); }

                        Pension.findOne({ idAlumno: datoAlumno.id, gestion: gestion }).exec((err, datoPension) => {

                            var mensualidad= [];
                            mensualidad.push({mes:'enero', pago: datoPension.enero})
                            mensualidad.push({mes:'febrero', pago: datoPension.febrero})
                            mensualidad.push({mes:'marzo', pago: datoPension.marzo})
                            mensualidad.push({mes:'abril', pago: datoPension.abril})
                            mensualidad.push({mes:'mayo', pago: datoPension.mayo})
                            mensualidad.push({mes:'junio', pago: datoPension.junio})
                            mensualidad.push({mes:'julio', pago: datoPension.julio})
                            mensualidad.push({mes:'agosto', pago: datoPension.agosto})
                            mensualidad.push({mes:'septiembre', pago: datoPension.septiembre})
                            mensualidad.push({mes:'octubre', pago: datoPension.octubre})
                            mensualidad.push({mes:'noviembre', pago: datoPension.noviembre})
                            mensualidad.push({mes:'diciembre', pago: datoPension.diciembre})
                            mensualidad.push();
                            datoAlumno.pension = {};

                            datoAlumno.pension = datoPension.id; 
                            datoAlumno.mensualidades = mensualidad;
                            tutor_alumnos.estudiantes.push(datoAlumno);
                            cb();
                        });
                        // console.log(datoAlumno)
                        // alumnos.push(datoAlumno);
                        // sails.log('1:', alumnos.length)
                    });

                }, function (error) {
                    sails.log('2:', alumnos.length)
                    if (error) return res.negotiate(error);

                    return res.send(tutor_alumnos)
                });

            });
        });
    }

};

