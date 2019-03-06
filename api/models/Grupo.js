/**
 * Grupo.js
 *
 * @description :: The Grupo table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'grupo',

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