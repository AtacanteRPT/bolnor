/**
 * Tutor.js
 *
 * @description :: The Tutor table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'tutor',

    primaryKey: 'id',

    attributes: {
        // updatedAt: false,
        // createdAt: false,
        id: {
            type: 'number',

            autoIncrement: true,


        },
        idPersona: {

            required: false,

            model: 'persona'
        }

    }

};