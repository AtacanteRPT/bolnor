/**
 * Historial_asistencia.js
 *
 * @description :: The Historial_asistencia table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'historial_asistencia',


    attributes: {
        cantidad_faltas: {
            type: 'number',
            required:false, allowNull:true


        },
        cantidad_asistencia: {
            type: 'number',
            required:false, allowNull:true


        },
        idGestionAcademica: {

            required:false, 



            model: 'gestionacademica'
        },
        idPersona: {

            required:false, 


            model: 'persona'
        }
    }
};