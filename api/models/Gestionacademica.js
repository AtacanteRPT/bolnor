/**
 * Gestionacademica.js
 *
 * @description :: The Gestionacademica table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'gestionacademica',

    primaryKey: 'id',
    attributes: {
        id: {
            type: 'number',
            autoIncrement: true,

        },
        tipo: {
            type: 'string',
            required: false,
            allowNull: true


        },
        fecha_inicio: {
            type: 'ref',
            columnType: 'date',
            required: false,

        },
        fecha_fin: {
            type: 'ref',
            columnType: 'date',
            required: false,

        },
        gestion: {
            type: 'number',
            required: false

        },
        horaEntrada: {
            type: 'string',
            required: false,
            allowNull: true

        },
        horaSalida: {
            type: 'string',
            required: false,
            allowNull: true

        },
    }

};