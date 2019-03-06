/**
 * InscribeController.js
 *
 * @description :: Server-side logic for managing subscriptions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    inscribir: function(req, res) {
        // console.log("entrando por lo menos ala consulta")
        var id = req.param('id')
        var idCurso = req.param('idCurso')
        var idGestionAcademica = req.param('idGestionAcademica')
        Alumno.findOne().where({ idPersona: id }).exec((err, datoPersona) => {
            if (err) { return res.serverError(err); }

            // console.log("entrando en la consulta")
            if (datoPersona != undefined) {
                Inscribe.create({ idAlumno: datoPersona.id, idCurso: idCurso, idGestionAcademica: idGestionAcademica }).fetch().exec((err, datoInscribe) => {
                    res.send(datoInscribe)
                });
            } else {
                res.send("NO SE ENCONTRO ALUMNO")
            }


        })

    },
    eliminar_inscripcion: function(req, res) {

        var id = req.param('id')
        var idCurso = req.param('idCurso')
        var idGestionAcademica = req.param('idGestionAcademica')

        sails.log("entrando a la consulta")
        Alumno.findOne({ idPersona: id }).exec((err, datoPersona) => {
            if (err) { return res.serverError(err); }

            Inscribe.destroy({ idAlumno: datoPersona.id, idCurso: idCurso, idGestionAcademica: idGestionAcademica }).exec((err, datoInscribe) => {

                if (err) { return res.serverError(err); }

                sails.log("devolviendo lo ultimo")
                res.send(datoInscribe[0])
            })

        })

    }

};