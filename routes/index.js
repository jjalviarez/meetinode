const express = require('express');
const route = express.Router();



//Importar el controladores

const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const adminController = require("../controllers/adminController");
const gruposController = require("../controllers/gruposController");
const meetiController = require("../controllers/meetiController");
const meetiControllerFE = require("../controllers/frontend/meetiControllerFE");
const usuarioControllerFE = require("../controllers/frontend/usuarioControllerFE");
const grupoControllerFE = require("../controllers/frontend/grupoControllerFE");








module.exports = () => {


//--------------- Area Publica ----------------------------
     //Ruta de home
    route.get('/', homeController.home );



    //Crear Nueva Cuenta
    route.get('/crear-cuenta',usuariosController.formCrearCuenta);
    route.post('/crear-cuenta',usuariosController.validarregistro,usuariosController.crearCuenta);


    //Iniciar Sesion
    route.get('/iniciar-sesion',usuariosController.forminiciarSesion);
    route.post('/iniciar-sesion',authController.autenticarUsuario);
    route.get('/iniciar-sesion/:token',usuariosController.activarCuenta);
/*
    //Creat Token para cambio de  Contraseña
    route.get('/restablecer', usuariosController.formRestablecerPassword);
    route.post('/restablecer', authController.enviarToken);


    //Realizar Cambio de   Contraseña
    route.get('/restablecer/:token', authController.validarToken);
    route.post('/restablecer/:token', authController.validarPassword,authController.actualizarPassword);
*/
     //Cerrar sesion
    route.get('/logout', authController.usuarioAutenticado, authController.cerrarSesion);

    //Meeti por utl
    route.get('/meeti/:url',meetiControllerFE.meetiPorURL);
    //Asistencia meeti
    route.post('/confirmar-asistencia/:slug',authController.usuarioAutenticado,meetiControllerFE.asistenciaMeeti);
    //mostrar asistentes
    route.get('/asistentes/:slug',meetiControllerFE.meetiAsistentes);
    //mostrar Usuario
    route.get('/usuario/:id',usuarioControllerFE.usuario);
    //mostrar Grupo
    route.get('/grupo/:id',grupoControllerFE.grupo);


//--------------- Area privada----------------------------

    //editar Perfil
    route.get('/editar-perfil',authController.usuarioAutenticado,usuariosController.formEditarPerfil);
    route.post('/editar-perfil',
    authController.usuarioAutenticado,
    //usuariosController.subirImagen,
    usuariosController.validarPerfil,
    usuariosController.actualizarPerfil);
    //Edita imagen perfil
    route.get('/imagen-perfil',authController.usuarioAutenticado,usuariosController.formEditarImagenPerfil);
    route.post('/imagen-perfil',
        authController.usuarioAutenticado,
        usuariosController.subirImagen,
        usuariosController.imagenPerfil
        );



    //sitio de administracion
    route.get('/administracion',authController.usuarioAutenticado,adminController.mostrarPanel);
    
    //Grupos
    //Nuevos Grupos
    route.get('/nuevo-grupo',authController.usuarioAutenticado,gruposController.formNuevoGrupo);
    route.post('/nuevo-grupo',
        authController.usuarioAutenticado,
        gruposController.subirImagen,
        gruposController.crearGrupo
        );
    //Editar Grupo
    route.get('/editar-grupo/:id',authController.usuarioAutenticado,gruposController.formEditarGrupo);
    route.post('/editar-grupo/:id', authController.usuarioAutenticado, gruposController.actualizarGrupo);
    //Edita imagen grupo
    route.get('/editar-imagen-grupo/:id',authController.usuarioAutenticado,gruposController.formEditarImagenGrupo);
    route.post('/editar-imagen-grupo/:id',
        authController.usuarioAutenticado,
        gruposController.subirImagen,
        gruposController.imagenGrupo
        );
    //Eiminar grupo
    route.get('/eliminar-grupo/:id',authController.usuarioAutenticado,gruposController.formEliminarGrupo);
    route.post('/eliminar-grupo/:id', authController.usuarioAutenticado, gruposController.eliminarGrupo);
    
    
    
    
    //Meeti
    //Nuevo Meeti
    route.get('/nuevo-meeti',authController.usuarioAutenticado,meetiController.formNuevoMeeti);
    route.get('/aqui',meetiController.ipMeeti);
    route.post('/nuevo-meeti',
        authController.usuarioAutenticado,
        meetiController.sanitizarMeeti,
        meetiController.crearMeeti
        );
    
    //Editar Meeti
    route.get('/editar-meeti/:id',authController.usuarioAutenticado,meetiController.formEditarMeeti);
    route.post('/editar-meeti/:id',
        authController.usuarioAutenticado,
        meetiController.sanitizarMeeti,
        meetiController.actualizarMeeti);
    //Eiminar Meeti
    route.get('/eliminar-meeti/:id',authController.usuarioAutenticado,meetiController.formEliminarMeeti);
    route.post('/eliminar-meeti/:id', authController.usuarioAutenticado, meetiController.eliminarMeeti);
   
   
   
   
   



/*
    //buscador de vacantes
    route.post('/buscador',  vacantesController.buscarVacante );
  */



    return route;

};
