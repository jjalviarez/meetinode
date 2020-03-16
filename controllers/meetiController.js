var geoip = require('geoip-lite');

//const Categorias = require("../models/Meeti");
const Grupos = require("../models/Grupos");
const Meetis = require("../models/Meetis");
const { sanitizeBody } = require('express-validator');

const uuidv4 = require('uuid/v4');




exports.formNuevoMeeti =  async (req,res,next) => {
    const ip = req.ip;
    var geo = geoip.lookup(ip);    
    const ubicacion =  geo ? geo : { ll : [ 8.991048919136528, -79.52132348174077 ] };
    const grupos = await Grupos.findAll({ where: { usuarioId: req.user.id }});
    res.render("nuevoMeeti", {
        nombrePagina: 'Crea un nuevo Meeti',
        grupos,
        ubicacion,
        nuevo : true
    });
};


exports.ipMeeti = async (req,res,next) => {
    const ip = req.ip;
    var geo = geoip.lookup(ip);
    const ubicacion =  geo ? geo : { ll : [ 8.8948, -79.523 ], city : 'Panama City' };
     console.log(ubicacion); 
    res.render("aqui", {
        nombrePagina: 'Estas Aqui?',
        ubicacion,
        city: 'Panama City'
    });
        
};

exports.crearMeeti =  async (req,res,next) => {
    const nuevoMeeti = req.body;
    nuevoMeeti.usuarioId = req.user.id;
    if(!nuevoMeeti.cupo) nuevoMeeti.cupo=0;
    nuevoMeeti.ubicacion = { type: 'Point', coordinates: [(nuevoMeeti.lat),(nuevoMeeti.lng)]};
    nuevoMeeti.id =  uuidv4();
    //console.log(nuevoMeeti);
    try {
        
        const meeti = await Meetis.create(nuevoMeeti);
        req.flash('correcto', 'Se Creo el Meeti Correctamente');
        //res.redirect('/meeti/' + meeti.slug);
        res.redirect('/administracion');
    } catch (error) {
        const err= error.errors.map(error => error.message);
        req.flash('error',err );
        //console.log(error);
        const grupos = await Grupos.findAll({ where: { usuarioId: req.user.id }});
        res.render("nuevoMeeti", {
            mensajes: req.flash(),
            nombrePagina: 'Crea un nuevo Meeti',
            grupos,
            meeti: nuevoMeeti,
            nuevo : true
        });
        
    }
    return;
};


// Sanitiza Datos del Meeti
exports.sanitizarMeeti = async  (req,res,next) => {
    const rules = [
        sanitizeBody('titulo').escape().run(req),
        sanitizeBody('invitado').escape().run(req),
        sanitizeBody('cupo').escape().run(req),
        sanitizeBody('fecha').escape().run(req),
        sanitizeBody('hora').escape().run(req),
        sanitizeBody('descripcion').escape().run(req),
        sanitizeBody('direccion').escape().run(req),
        sanitizeBody('ciudad').escape().run(req),
        sanitizeBody('estado').escape().run(req),
        sanitizeBody('pais').escape().run(req),
        sanitizeBody('lat').escape().run(req),
        sanitizeBody('lng').escape().run(req),
        sanitizeBody('grupoId').escape().run(req)
    ];
    await Promise.all(rules);
    return next();
};


//Formulado de edirar meeti
exports.formEditarMeeti =  async (req,res,next) => {
    const gruposPromise = Grupos.findAll({ where: { usuarioId: req.user.id }});
    const meetiPromise = Meetis.findOne({ where: { id: req.params.id, usuarioId: req.user.id }});
    const [meeti,grupos] = await Promise.all([meetiPromise,gruposPromise]);
    if(!meeti || !grupos) {
        req.flash('error','Operacion no  Valida');
        return res.redirect('/administracion');
    }
    //console.log(meeti.ubicacion.coordinates);
    res.render("nuevoMeeti", {
        nombrePagina: 'Editar Meeti - ' + meeti.titulo,
        grupos,
        meeti
    });
    return;
};




//Guarda Cambio de meeti en la Bd
exports.actualizarMeeti =  async (req,res,next) => {
    const meeti = await Meetis.findOne({ where: { id: req.params.id, usuarioId: req.user.id }});
    if(!meeti) {
        req.flash('error','Operacion no  Valida');
        return res.redirect('/administracion');
    }
    const nuevoMeeti = req.body;
    nuevoMeeti.usuarioId = req.user.id;
    if(!nuevoMeeti.cupo) nuevoMeeti.cupo=0;
    nuevoMeeti.ubicacion = { type: 'Point', coordinates: [(nuevoMeeti.lat),(nuevoMeeti.lng)]};
    //console.log(nuevoMeeti);
    try {
        
        const meetiActualizado = await Meetis.update(nuevoMeeti,{ where: { id: req.params.id, usuarioId: req.user.id }});
        req.flash('correcto', 'Actualizo Meeti Correctamente');
        //res.redirect('/meeti/' + meetiActualizado.slug);
        res.redirect('/administracion');
    } catch (error) {
        //console.log(error);
        //return;
        const err= error.errors.map(error => error.message);
        req.flash('error',err );
        const grupos = await Grupos.findAll({ where: { usuarioId: req.user.id }});
        res.render("nuevoMeeti", {
            mensajes: req.flash(),
            nombrePagina: 'Editar Meeti - ' + meeti.titulo,
            grupos,
            meeti: nuevoMeeti,
        });
        
    }
    return;
};



//Formulario Eliminar meeti
exports.formEliminarMeeti =  async (req,res,next) => {
    const meeti = await Meetis.findOne({
            where: {
                    id: req.params.id,
                    usuarioId: req.user.id
            }
    });
    if(!meeti) {
        req.flash('error','Operacion no  Valida')
        return res.redirect('/administracion');
    }
    res.render('form-eliminar', {
            nombrePagina : 'Eliminar Meeti: ' + meeti.titulo
    });
};

//Elimina meeti
exports.eliminarMeeti =  async (req,res,next) => {
    const meeti = await Meetis.findOne({
        where: {
                id: req.params.id,
                usuarioId: req.user.id
        }
    });
    if(!meeti) {
        req.flash('error','Operacion no  Valida')
        return res.redirect('/administracion');
    }
    try {
        await meeti.destroy();
        
        req.flash('correcto', 'El meeti fue eliminado');
        return res.redirect('/administracion');

    } catch (error) {
        const err= error.errors.map(error => error.message);
        req.flash('error',err );
        return res.redirect('/administracion');
    }
};



















