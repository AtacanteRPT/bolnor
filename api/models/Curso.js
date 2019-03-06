/**
 * Turno_paralelo_grado_grupo.js
 *
 * @description :: The Turno_paralelo_grado_grupo table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'curso',

  attributes: {
    // updatedAt: false,
    // createdAt:false,
    idParalelo: {

      required: false,



      model: 'paralelo'
    },
    idTurno: {

      required: false,



      model: 'turno'
    },
    idGrado: {

      required: false,



      model: 'grado'
    },
    idGrupo: {

      required: false,



      model: 'grupo'
    }
  }
};
