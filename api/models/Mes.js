/**
 * Mes.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'mes',
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