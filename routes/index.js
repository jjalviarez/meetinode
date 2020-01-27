const express = require('express');
const route = express.Router();



//Importar el controladores

const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const adminController = require("../controllers/adminController");
const gruposController = require("../controllers/gruposController");








module.exports = () => {


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

     //Cerrar sesion
    route.get('/logout', authController.usuarioAutenticado, authController.cerrarSesion);
*/

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
    
    
/*
    //editar Perfil
    route.get('/editar-perfil',authController.usuarioAutenticado,usuariosController.formEditarPerfil);
    route.post('/editar-perfil',
    authController.usuarioAutenticado,
    usuariosController.subirImagen,
    usuariosController.validarPerfil,
    usuariosController.actualizarPerfil);

    //buscador de vacantes
    route.post('/buscador',  vacantesController.buscarVacante );
  */



    return route;

};
