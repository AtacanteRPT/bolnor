/**
 * GestionacademicaController.js
 *
 * @description :: Server-side logic for managing subscriptions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  gestionActual: function (req, res) {
    Gestionacademica.findOne(1).exec(function (err, datoGestion) {
      if (err) {return res.serverError(err)};
      res.send(datoGestion)
    })
  }

};
