var geoip = require('geoip-lite');

//const Categorias = require("../models/Meeti");
const Grupos = require("../models/Grupos");
const { body, validationResult, sanitizeBody } = require('express-validator');
const multer  = require('multer');
const fs  = require('fs');
const uuidv4 = require('uuid/v4');




exports.formNuevoMeeti =  async (req,res,next) => {
    const ip = req.ip
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
    const ip = req.ip
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
    const grupos = await Grupos.findAll();
    res.render("nuevoMeeti", {
        nombrePagina: 'Crea un nuevo Grupo',
        grupos,
        nuevo : true
    });
};