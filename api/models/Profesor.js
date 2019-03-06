/**
 * Profesor.js
 *
 * @description :: The Profesor table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'profesor',

    primaryKey: 'id',
    attributes: {
        id: {
            type: 'number',

            autoIncrement: true,


        },
        idPersona: {

            required:false, 

            model: 'persona'
        }
    }
};