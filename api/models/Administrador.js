/**
 * Administrador.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    tableName: 'administrador',
    primaryKey: 'id',
    attributes: {
        id: {
            type: 'number',

            autoIncrement: true
        },
        idPersona: {
            required:false, 
            model: 'persona'
        },
        cargo: {
            type: 'string',
            required: false
        }

    }

};