const express = require('express');
const route = express.Router();



//Importar el controladores

const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");








module.exports = () => {
    

     //Ruta de home
    route.get('/', (req, res) => {
        res.render('home');
    } );

    

/*
    //crear Cuenta
    //Crear Nueva Cuenta
    route.get('/crear-cuenta',usuariosController.formCrearCuenta);
    route.post('/crear-cuenta',usuariosController.validarregistro,usuariosController.crearCuenta);
    
    
    //Iniciar Sesion
    route.get('/iniciar-sesion',usuariosController.forminiciarSesion);
    route.post('/iniciar-sesion',authController.autenticarUsuario);
    //route.get('/iniciar-sesion/:token',usuariosController.activarCuenta);
    
    //Creat Token para cambio de  Contraseña 
    route.get('/restablecer', usuariosController.formRestablecerPassword);
    route.post('/restablecer', authController.enviarToken); 

    
    //Realizar Cambio de   Contraseña  
    route.get('/restablecer/:token', authController.validarToken);
    route.post('/restablecer/:token', authController.validarPassword,authController.actualizarPassword);
    
     //Cerrar sesion
    route.get('/logout', authController.usuarioAutenticado, authController.cerrarSesion);
    
    //sitio de administracion
    route.get('/administracion',authController.usuarioAutenticado,authController.mostrarPanel);
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