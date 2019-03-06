/**
 * Paralelo.js
 *
 * @description :: The Paralelo table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'paralelo',

    primaryKey: 'id',
    attributes: {
        id: {
            type: 'number',
            autoIncrement: true
        },
        nombre: {
            type: 'string',
            required:false, allowNull:true
        }
    }
};