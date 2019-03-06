/**
 * ProfesorController.js
 *
 * @description :: Server-side logic for managing subscriptions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    adicionar_asignatura: function (req, res) {

        var idProfesor = req.param('idProfesor')
        var idAsignatura = req.param('idAsignatura')

        Profesor.findOne({ idPersona: idProfesor }).exec((err, datoProfesor) => {
            if (err) { return res.serverError(err); }

            Dicta_clases.create({ idProfesor: datoProfesor.id, idAsignatura: idAsignatura }).fetch().exec((err, datoDictaClases) => {
                if (err) { return res.serverError(err); }

                res.send(datoDictaClases)
            });
        })

    },
    quitar_asignatura: function (req, res) {
        var idProfesor = req.param('idProfesor')
        var idAsignatura = req.param('idAsignatura')

        Profesor.findOne({
            idPersona: idProfesor

        }).exec(function (err, datoProfesor) {
            Dicta_clases.destroy({ idProfesor: datoProfesor.id, idAsignatura: idAsignatura }).exec((err, respuesta) => {
                if (err) {
                    return res.negotiate(err);
                }

                return res.json("se quitó la materia con éxito");
            })
        })

    }

    ,
    dicta_asignatura: function (req, res) {
        var asignaturas = [];
        console.log(req.param('id'))
        Profesor.findOne({
            idPersona: req.param('id')

        }).exec(function (err, datoProfesor) {

            if (err) { return res.serverError(err); }

            Dicta_clases.find({
                where: { idProfesor: datoProfesor.id }

            }).exec(function (err, datoDictaClases) {
                if (err) { return res.serverError(err); }

                async.forEach(datoDictaClases, function (auxClases, cb) {
                    Asignatura.findOne({ id: auxClases.idAsignatura }).exec(function (err, datoAsignatura) {
                        if (err) { return res.serverError(err); }

                        asignaturas.push(datoAsignatura);
                        cb();
                    });

                }, function (error) {

                    if (error) return res.negotiate(error);

                    return res.send(asignaturas)
                });

            })

        });
    }

};