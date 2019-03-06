/**
 * CargoController
 *
 * @description :: Server-side logic for managing Cargoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    fatal: function (req, res) {
        var todo = [
            {
                id: 1,
                nombre: "Mañana",
                grupos: [
                    {
                        id: 1,
                        nombre: "QUINTO"
                    }, {
                        id: 2,
                        nombre: "SEXTO"
                    }

                ]
            }

            // ,
            // {
            //     id: 2,
            //     nombre: "Tarde",
            //     grupos: [
            //         {
            //             id: 1,
            //             nombre: "OCTAVO"
            //         }, {
            //             id: 2,
            //             nombre: "SEXTO SECUNDARIA"
            //         }

            //     ]
            // }

        ]

        // todo[0].grupos[0].aula = 'SOTANO B'
        var turno = {
            id: 2,
            nombre: 'Tarde'
        }

        todo[1]= turno
        todo[1].grupos = []
        todo[1].grupos = [{id: 1,nombre: "QUINTO"}, {id: 2,nombre: "SEXTO SECUNDARIA"}]
        todo[1].grupos[0].aulas = ['A', 'B']

        res.send(todo)
    }

};

