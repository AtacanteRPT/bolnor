/**
 * Grado.js
 *
 * @description :: The Grado table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'grado',

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