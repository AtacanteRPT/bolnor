/**
 * Dicta_clases.js
 *
 * @description :: The Dicta_clases table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'dicta_clases',


    attributes: {
        idProfesor: {

            required:false, 

            model: 'profesor'
        },
        idAsignatura: {

            required:false, 

            model: 'asignatura'
        }

    }

};