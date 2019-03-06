/**
 * Pension.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'pension',


    attributes: {
        idAlumno: {

            required:false, 

            model: 'alumno'
        },
        gestion: {
            type: 'string',
            required:false, allowNull:true


        },
        enero: {
            type: 'boolean',
            required:false, allowNull:true


        },
        febrero: {
            type: 'boolean',
            required:false, allowNull:true


        },
        marzo: {
            type: 'boolean',
            required:false, allowNull:true


        },
        abril: {
            type: 'boolean',
            required:false, allowNull:true


        },
        mayo: {
            type: 'boolean',
            required:false, allowNull:true


        },
        junio: {
            type: 'boolean',
            required:false, allowNull:true


        },
        julio: {
            type: 'boolean',
            required:false, allowNull:true


        },
        agosto: {
            type: 'boolean',
            required:false, allowNull:true


        },
        septiembre: {
            type: 'boolean',
            required:false, allowNull:true


        },
        octubre: {
            type: 'boolean',
            required:false, allowNull:true


        },
        noviembre: {
            type: 'boolean',
            required:false, allowNull:true


        },
        diciembre: {
            type: 'boolean',
            required:false, allowNull:true


        }

    }

};