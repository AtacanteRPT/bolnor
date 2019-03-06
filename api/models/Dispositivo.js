/**
 * Dispositivo.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'dispositivo',
  primaryKey: 'id',


  attributes: {
    id: {
      type: 'number',
      autoIncrement: true,
    },
    idDispositivo: {
      type: 'string',
      required: false
    },
    idPersona: {
      required:false, 
      model: 'persona'
    }
  }

};

