
const Grupos = require("../../models/Grupos");
const Comentarios = require("../../models/Comentarios");
const Meetis = require("../../models/Meetis");
const moment = require('moment');
const { body, validationResult, sanitizeBody } = require('express-validator');



exports.agregarComentario =  async (req,res,next) => {
    const nuevoComentario = req.body;
    nuevoComentario.usuarioId = req.user.id;
    nuevoComentario.fecha =  Date.now() ;
    nuevoComentario.meetiId =  req.params.id ;
    
    //console.log(nuevoMeeti);
    try {
        
        await Comentarios.create(nuevoComentario);
        return res.redirect("back");
    } catch (error) {
        const err= error.errors.map(error => error.message);
        req.flash('error',err );
        return res.redirect("back");
    }
};


// Sanitiza Datos del Meeti
exports.sanitizarComentario = async  (req,res,next) => {
    const rules = [
        sanitizeBody('mensaje').escape().run(req),
        body('mensaje','El comentario esta en blanco').notEmpty().run(req)
    ];
    await Promise.all(rules);
    const errores = validationResult(req);
    if(errores.isEmpty()){
        return next();
    }
    req.flash('error', errores.array().map(error => error.msg));
    return res.redirect("back");
    
    
};


exports.eliminarComentario =  async (req,res,next) => {
    const comentario = await Comentarios.findOne({ 
        where: { 
            id: req.params.id 
        },
        include: [
            {
                model: Meetis,
                attributes: ['usuarioId'],
            }
        ]
    });
    if(comentario && (comentario.usuarioId == req.user.id || comentario.meeti.usuarioId == req.user.id )) {
         
        try {
            await comentario.destroy();
            res.status(200);
            res.json({ mensaje: 'Eliminado' });
        } catch (error) {
            const err= error.errors.map(error => error.message);
            res.status(409);
            res.json({mensaje:"Accion no Completada"});
        }
    }
    else {
            res.status(403);
            res.json({mensaje: "Accion no valida"});
    }
};
