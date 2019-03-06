/**
 * Persona.js
 *
 * @description :: The Persona table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'persona',
  primaryKey: 'id',
  attributes: {

    // updatedAt: false,
    // createdAt: false,
    id: {
      type: 'number',
      autoIncrement: true,
    },
    email: {
      type: 'string',
      required: false,
      allowNull: true
    },
    dispositivo: {
      type: 'string',
      required: false,
      allowNull: true
    },
    identificacion: {
      type: 'string',
      required: false,
      allowNull: true
    },
    nombre: {
      type: 'string',
      required: false,
      allowNull: true
    },
    img: {
      type: 'string',
      required: false,
      allowNull: true

    },
    paterno: {
      type: 'string',
      required: false,
      allowNull: true

    },
    materno: {
      type: 'string',
      required: false,
      allowNull: true

    },
    telefono: {
      type: 'number',
      required: false,
      allowNull: true
    },
    celular: {
      type: 'number',
      required: false,
      allowNull: true

    },
    cedula: {
      type: 'string',
      required: false,
      // unique: true,
      allowNull: true
    },
    expedido: {
      type: 'string',
      required: false,
      allowNull: true
    },
    fechaNacimiento: {
      type: 'string',
      columnType: 'date',
      required: false,
      allowNull: true

    },
    fechaAlta: {
      type: 'string',
      columnType: 'date',
      required: false,
      allowNull: true

    },
    sexo: {
      type: 'string',
      required: false,
      allowNull: true


    },
    nro: {
      type: 'string',
      required: false,
      allowNull: true

    },
    codigoFoto: {
      type: 'string',
      required: false,
      allowNull: true

    },
    rol: {
      type: 'string'
    },

    usuario: {
      collection: 'usuario',
      via: 'idPersona'
    }

  }

};
