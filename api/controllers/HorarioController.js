/**
 * HorarioController.js
 *
 * @description :: Server-side logic for managing subscriptions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    adicionarHorario: function (req, res) {

        Profesor.findOne({ idPersona: req.param('idProfesor') }).exec((err, datoHorario) => {

            if (err) { return res.serverError(err); }

            var nuevoHorario = {
                idCurso: req.param('idCurso'),
                idDia: req.param('idDia'),
                idProfesor: datoHorario.id,
                idAsignatura: req.param('idAsignatura'),
                idPeriodo: req.param('idPeriodo'),
                idGestionAcademica: 1
            }

            Horario.create(nuevoHorario).exec((err, datoHorario) => {
                if (err) { return res.serverError(err); }

                res.send(datoHorario);
            })
        })

    }

};