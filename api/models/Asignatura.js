/**
 * Asignatura.js
 *
 * @description :: The Asignatura table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'asignatura',
    primaryKey: 'id',
    attributes: {
        id: {
            type: 'number',

            autoIncrement: true,


        },
        sigla: {
            type: 'string',
            required:false, allowNull:true


        },
        nombre: {
            type: 'string',
            required:false, allowNull:true


        }
    }
};