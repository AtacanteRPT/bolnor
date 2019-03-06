/**
 * Turno.js
 *
 * @description :: The Turno table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'turno',

    primaryKey: 'id',
    attributes: {
        id: {
            type: 'number',

            autoIncrement: true,


        },
        nombre: {
            type: 'string',
            required:false, allowNull:true


        }
    }
};