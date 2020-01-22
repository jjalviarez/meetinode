const Sequelize = require("sequelize");
const passport = require('passport');
const bcrypt = require('bcrypt');
const Usuarios = require("../models/Usuarios");
const enviarEmail = require("../handlers/email");
const crypto = require('crypto');
const Op = Sequelize.Op;


//loguear usuario
exports.autenticarUsuario = passport.authenticate('local', { successRedirect: '/administracion',
                                    failureRedirect: '/iniciar-sesion',
                                    failureFlash: true,
                                    badRequestMessage: 'usuario y pass en clanco'
                                });
                                
                        
//Desloguear usuario
exports.cerrarSesion = (req,res) =>{
    req.logout();
    return res.redirect("/iniciar-sesion");
}


//verifica que estes logueado
exports.usuarioAutenticado = (req,res,next) =>{
    return (req.isAuthenticated()) ?  next() :   res.redirect("/iniciar-sesion");
    
}


/*
//Enviar Token usuario
exports.enviarToken = async (req,res) =>{
    const {email} = req.body;
    const usuario = await Usuario.findOne({email});
    
    if (!usuario) {
        req.flash('error', 'email invalido');
        
        //hay dos formas de hacer esto
        //haces un render y agregar flash a mesagesn 
        // ó
        // haces un redirect y flash la agrega el middleware
        
        //res.render('restablecer', {
        //    mensajes: req.flash(),
        //    nombrePagina: 'Restablecer Contraseña'
        //});
        return res.redirect("/restablecer");
    }
    //usuarios existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira= Date.now()+86400000 ;
    await usuario.save();
    
    const url= 'https://' + req.headers.host + "/restablecer/" + usuario.token;
    
    //Enviar el correo
    await enviarEmail.enviar({
        usuario,
        url, 
        subject: 'Password Reset',
        archivo: 'restablecer-password'
    });
    
    
    req.flash('correcto', 'Se envio un mensaje a tu correo');
    return res.redirect("/iniciar-sesion");
    
    
};


exports.validarToken = async (req,res) =>{
    const usuario = await Usuario.findOne({token: req.params.token, expira: { $gte: Date.now() }});
    
    if(!usuario) {
        req.flash('error', 'No valido');
        return res.redirect("/restablecer");
    }
    
    res.render('resetPassword', {
        nombrePagina: 'Restablecer tu Contraseña'
    });
 
}



exports.validarPassword = async  (req,res,next) => {
    const rules = [
        sanitizeBody('password').escape().run(req),
        sanitizeBody('confirmar').escape().run(req),
        body('password','El password no puede ir vacío').notEmpty().run(req),
        body('confirmar','Confirmar password no puede ir vacío').notEmpty().run(req),
        body('confirmar','El password es diferente').equals(req.body.password).run(req)
    ];
    await Promise.all(rules);
    const errores = validationResult(req);
    if(errores.isEmpty()){
        return next();
    }
    req.flash('error', errores.array().map(error => error.msg));
    return res.redirect("/restablecer/" + req.params.token);
};


exports.actualizarPassword = async (req,res) =>{
    const { password } = req.body;
    const usuario = await Usuario.findOne({token: req.params.token, expira: { $gte: Date.now() }});
    usuario.password = password;
    usuario.token = null;
    usuario.expira= null ;
    await usuario.save();
    req.flash('correcto', 'Contraseña Actualizada');
    return res.redirect("/iniciar-sesion");
};





*/