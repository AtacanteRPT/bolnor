/**
 * MesController
 *
 * @description :: Server-side logic for managing Mes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

require('../../configuracion')
module.exports = {

    global : function(req,res){
        // console.log("GLOBAL:",OSO )
        res.send("oso")
    },
    probar: function (req, res) {
        Pension.create(
            { 
                id: 0, 
                idAlumno: 1,
                enero: true,
                febrero:true,
                marzo:false,
                abril:false,
                mayo:false,
                junio:false,
                julio:false,
                agosto:false,
                septiembre:false,
                octubre:false,
                noviembre:false,
                diciembre:false

            }

            ).exec(function (err, creado) { 
                if (err) { return res.serverError(err); }

                res.send(creado)
            })

    }

};

