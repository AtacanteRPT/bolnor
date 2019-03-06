/**
 * Inscribe.js
 *
 * @description :: The Inscribe table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'inscribe',


    attributes: {
        idCurso: {

            required:false, 

            model: 'curso'
        },
        idGestionAcademica: {

            required:false, 

            model: 'gestionacademica'
        },
        idAlumno: {

            required:false, 

            model: 'alumno'
        }

    }

};