/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const passport = require('passport');
module.exports = {
    login: function (req, res) {
        passport.authenticate('local', function (err, user, info) {
            if ((err) || (!user)) {
                return res.send({
                    message: info.message,
                    user
                });
            }

            req.logIn(user, function (err) {
                if (err) res.send(err);
                return res.send({
                    message: info.message,
                    user
                });
            });
        })(req, res);
    },
    salir: function (req, res) {
        req.logout();
        res.send({mensaje:"asi de la cuenta satisfactoriamente"});
    },
    autentificacion:function(req, res){
        var usuario={
            usuario:req.user,
            autentificacion:req.isAuthenticated()
        }
        res.send(usuario)
    }

};