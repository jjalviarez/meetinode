
const multer  = require('multer');
const shortid = require('shortid');
const uuidv1 = require('uuid/v1');
const { body, validationResult, sanitizeBody } = require('express-validator');
const Usuarios = require("../models/Usuarios");
const crypto = require('crypto');
const enviarEmail = require("../handlers/email");
const fs  = require('fs');




exports.formCrearCuenta = (req,res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta',
        nuevo : true
    });
};





exports.crearCuenta = async (req,res,next) => {
    const {nombre, email, password } = req.body;
    
    try {
        
        const token = crypto.randomBytes(20).toString('hex');
        await Usuarios.create({nombre,email,password,token});
        
        //Enviar correo
        
        const url= 'https://' + req.headers.host + "/iniciar-sesion/" + token;
        
        //Enviar el correo
        await enviarEmail.enviar({
            usuario: {email},
            url, 
            subject: 'Activar usuario',
            archivo: 'confirmar-cuenta'
        });
        
        
        req.flash('correcto', 'Se envio un mensaje a tu correo Para Activar Tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        const err= error.errors.map(error => error.message);
        req.flash('error',err );
        //console.log(error);
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta',
            nuevo : true
        });
        
        
    }
};


exports.validarregistro = async  (req,res,next) => {
    const rules = [
        sanitizeBody('nombre').escape().run(req),
        sanitizeBody('email').escape().run(req),
        body('nombre','El nombre es Obligatorio').notEmpty().run(req),
        body('email','El email debe ser valido').isEmail().run(req),
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
    res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta',
            nuevo : true
    });
    return ;
};



exports.forminiciarSesion = (req,res) => {
    
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesion'
    });
};




/*
exports.formRestablecerPassword = (req,res) => {
    res.render('restablecer', {
        nombrePagina: 'Restablecer Contraseña',
        tagline: 'ingresa  tu correo'
    });
};
*/




exports.activarCuenta = async (req,res) =>{
    
    const usuario =  await Usuarios.findOne({
                where: {
                        token: req.params.token
                }
    });
    
    if(!usuario) {
        req.flash('error', 'No existe esa Ceunta');
        return res.redirect("/crear-cuenta");
    }
    else {
        usuario.activo= 1;
        usuario.token = null;
        await usuario.save();
        req.flash('correcto', 'Ceunta Activada');
        return res.redirect("/iniciar-sesion");
    }
    
};







exports.formEditarPerfil = async (req,res,next) => {
    const usuario = await Usuarios.findByPk(req.user.id);
    res.render("editarCuenta", {
        nombrePagina: 'Editar Usuario: ' + usuario.nombre,
        usuario
    });
};



exports.actualizarPerfil = async (req,res,next) => {
    const {email, password, nombre, passwordOld, descripcion} = req.body;
    const usuario = await Usuarios.findByPk(req.user.id);
    if (password) {
        if(usuario.verificarPassword(passwordOld)){
            usuario.password = usuario.hashPassword(password);
        }
        else {
            req.flash('error', 'Password invalido');
            return res.redirect("/editar-perfil");
        }
    }
    usuario.nombre = nombre;
    usuario.email = email;
    usuario.descripcion = descripcion;
    await usuario.save();
    req.flash('correcto', 'Cambios Guardados Correctamente');
    res.redirect("/administracion");
};



exports.validarPerfil = async  (req,res,next) => {
    const rules = [
        sanitizeBody('nombre').escape().run(req),
        sanitizeBody('email').escape().run(req),
        sanitizeBody('password').escape().run(req),
        sanitizeBody('descripcion').escape().run(req),
        sanitizeBody('confirmar').escape().run(req),
        sanitizeBody('passwordOld').escape().run(req),
        body('nombre','El nombre es Obligatorio').notEmpty().run(req),
        body('email','El email debe ser valido').isEmail().run(req),
        body('confirmar','El password es diferente').equals(req.body.password).run(req)
    ];
    await Promise.all(rules);
    const errores = validationResult(req);
    //console.log(errores);
    //res.send(errores);
    if(errores.isEmpty()){
        return next();
    }
    req.flash('error', errores.array().map(error => error.msg));
    res.redirect("/editar-perfil");
    return;
};


//Edidar la imagen de un grupo
exports.formEditarImagenPerfil =  async (req,res,next) => {
    const usuario = await Usuarios.findByPk(req.user.id);
    if(!usuario) return next();
    res.render('imagenPerfil', {
            nombrePagina : 'Editar Imagen - ' + usuario.nombre,
            imagen : usuario.imagen
    });
};






//Guarda Imagen de grupo
exports.imagenPerfil =  async (req,res,next) => {
    const usuario = await Usuarios.findByPk(req.user.id);
    if(!usuario) {
        req.flash('error','Operacion no  Valida')
        return res.redirect("/iniciar-sesion");
    }
    
    if(req.file) {
        var imagenAnterior = usuario.imagen;
        usuario.imagen= req.file.filename;
    }
    else {
        return res.redirect('/administracion');
    }
    
    
    try {
        await usuario.save();
        //De existir un archivo anterior lo elimina
        if(imagenAnterior) {
            imagenAnterior= __dirname + '/../public/uploads/perfil/' + imagenAnterior;
            fs.unlink(imagenAnterior, (err) => {
                if (err) console.log(err);
            });
        }
        
        req.flash('correcto', 'Se actualizo el Imagen Correctamente');
        return res.redirect('/administracion');

    } catch (error) {
        const err= error.errors.map(error => error.message);
        req.flash('error',err );
        return res.redirect("/imagen-perfil");
    }
};



//Carga de Archivo----------------------------------

//middleware de carga de archivo
exports.subirImagen = (req,res,next) => {
    upload(req, res, function (error) {
        if (error) {
            if (error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande: Máximo 100kb ');
                } else {
                    req.flash('error', error.message);
                }
            }
            else {
                req.flash('error', error.message);
            }
            res.redirect("/imagen-perfil");
            return ;
        } 
        else {
        return next();
        }
    });
};
//Configuracion del archivo
const configuracionMulter = {
    limits: {
        fileSize : 100000
    },
    fileFilter (req, file, cb) {
        if (file.mimetype.split('/')[0]==='image') {
            cb(null, true);
        }
        else {
            cb(new Error('Formato no Valido'));
        }
    },
    storage :  multer.diskStorage({
              destination : (req, file, cb) => {
                cb(null, __dirname + '../../public/uploads/perfil');
              },
              filename : (req, file, cb) => {
                const extnsion = file.mimetype.split('/')[1];
                cb(null,uuidv1() + '.' + extnsion);
              }
    })
    
};
//inicializar multer
const upload = multer(configuracionMulter).single('imagen');

