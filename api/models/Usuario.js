/**
 * Usuario.js
 *
 * @description :: The Usuario table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

const bcrypt = require('bcrypt-nodejs');

module.exports = {
    tableName: 'usuario',

    primaryKey: 'id',
    attributes: {

        // updatedAt: false,
        // createdAt:false,
        id: {
            type: 'number',

            autoIncrement: true,
        },
        idPersona: {
            unique: true,
            model: 'persona'
        },
        username: {
            type: 'string',
        },
        password: {
            type: 'string',
        },
        codigo_qr: {
            type: 'string',
            required:false, allowNull:true
        },
        rol: {
            type: 'string',
        }

    },
    customToJSON: function() {
        return _.omit(this, ['password'])
    },
    beforeCreate: function(user, cb) { 
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if (err) return cb(err);
                user.password = hash;
                return cb();
            });
        });
    }

};