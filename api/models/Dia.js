/**
 * Dia.js
 *
 * @description :: The Dia table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'dia',
    primaryKey: 'id',

    attributes: {
        id: {
            type: 'number',
            required: true
        },
        nombre: {
            type: 'string',
            required:false, allowNull:true

        }
    }
};