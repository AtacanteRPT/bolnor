const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt-nodejs');

passport.serializeUser(function (user, cb) {
    // Persona.findOne(user.id).exec((err, datoPersona) => {
    //     if (datoPersona == null) {

    //         cb(err, user);
    //     } else {

            cb(null, user.id);
    //     }
    //     // let userDetails = {
    //     //     email: user.email,
    //     //     username: user.username,
    //     //     id: user.idPersona,
    //     //     rol: user.rol
    //     // };
    //     // return cb(null, userDetails, { message: 'Acceso satisfactoriamente' });

    // })
});
passport.deserializeUser(function (id, cb) {
    // Usuario.findOne({ id }, function (err, user) {

    Persona.findOne(id).exec((err, datoPersona) => {
        if (datoPersona == null) {

            cb(err, datoPersona);
        } else {

            Usuario.findOne({idPersona:id}).exec(function(err,datoUsuario){
                datoPersona.usuario= datoPersona;
            })

            cb(err, datoPersona);
        }
        // let userDetails = {
        //     email: user.email,
        //     username: user.username,
        //     id: user.idPersona,
        //     rol: user.rol
        // };
        // return cb(null, userDetails, { message: 'Acceso satisfactoriamente' });

    })
    // });
});
passport.use(new LocalStrategy({
    usernameField: 'username',
    passportField: 'password'
}, function (username, password, cb) {
    Usuario.findOne({ username: username }, function (err, user) {
        if (err) return cb(err);
        if (!user) return cb(null, false, { message: 'Usuario No encontrado' });
        bcrypt.compare(password, user.password, function (err, res) {
            if (!res) return cb(null, false, { message: 'Password invalido' });

            Persona.findOne(user.idPersona).exec((err, datoPersona) => {
                // let userDetails = {
                //     email: user.email,
                //     username: user.username,
                //     id: user.idPersona,
                //     rol: user.rol
                // };
                datoPersona.usuario = user

                return cb(null, datoPersona, { message: 'Acceso satisfactoriamente' });
            })

            // sails.log("Passport.js - userDetails", userDetails)

        });
    });
}));