/**
 * Horario.js
 *
 * @description :: The Horario table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'horario',


    attributes: {
        idCurso: {

            required:false, 



            model: 'curso'
        },
        idDia: {

            required:false, 



            model: 'dia'
        },
        idProfesor: {

            required:false, 



            model: 'profesor'
        },
        idAsignatura: {

            required:false, 



            model: 'asignatura'
        },
        idPeriodo: {

            required:false, 


            model: 'periodo'
        },
        idGestionAcademica: {

            required:false, 


            model: 'gestionacademica'
        }

    }

};