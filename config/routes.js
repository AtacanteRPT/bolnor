/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


    /***************************************************************************
     *                                                                          *
     * More custom routes here...                                               *
     * (See https://sailsjs.com/config/routes for examples.)                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the routes in this file, it   *
     * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
     * not match any of those, it is matched against static assets.             *
     *                                                                          *
     ***************************************************************************/
    // 'GET /': { view: 'pages/homepage' },
    'GET /alumno/tutores/:id': 'AlumnoController.alumno_tutor',

    //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
    //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
    //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

    

    'POST /api/persona': 'PersonaController.crear',
    'GET /persona/traer/:id': 'PersonaController.traer',
    'GET /persona/credencial/:id': 'PersonaController.credencial',
    'GET /usuario/resetearPassword/:id': 'UsuarioController.resetearPassword',
    'GET /persona/eliminar_alumno/:id': 'AlumnoController.eliminar_alumno',


    'GET /persona/buscar/:nombre': 'PersonaController.buscar',
    'GET /persona/buscar_tutor/:nombre': 'PersonaController.buscar_tutor',
    'GET /persona/buscar_alumno/:nombre': 'PersonaController.buscar_alumno',

    

    'POST /login': 'AuthController.login',
    '/logout': 'AuthController.logout',

    'GET /autentificacion': 'AuthController.autentificacion',
    'POST /persona/avatar/:id': 'PersonaController.subir',

    'GET /curso/mostrar_turno/:id': 'CursoController.mostrar_turno',
    'GET /curso/mostrar_turno2/:id': 'CursoController.mostrar_turno2',
    
    'GET /profesor/dicta_asignatura/:id': 'ProfesorController.dicta_asignatura',

    // 'GET /alumno/alumno_tutor/:id': 'AlumnoController.alumno_tutor',

    'GET /pension/pension_por_tutor/:id': 'PensionController.pension_por_tutor'
    

    //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
    //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
    //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


    //  ╔╦╗╦╔═╗╔═╗
    //  ║║║║╚═╗║
    //  ╩ ╩╩╚═╝╚═╝


};