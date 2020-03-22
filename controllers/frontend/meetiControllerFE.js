

const Comentarios = require("../../models/Comentarios");
const Grupos = require("../../models/Grupos");
const Meetis = require("../../models/Meetis");
const Usuarios = require("../../models/Usuarios");
const Categorias = require("../../models/Categorias");
const Sequelize = require('sequelize');
const moment = require('moment');
const {Op} = require("sequelize");
var geoip = require('geoip-lite');





exports.meetiPorURL =  async (req,res,next) => {
    const meeti = await Meetis.findOne({
        where: { 
            slug: req.params.url 
            
        },
        include: [
            {
                model: Grupos
            },
            {
                model: Usuarios,
                attributes: ['id','nombre','imagen'],
            }
        ]
    });
    
    if(!meeti) {
        return next();
    }
    
    //meetis cercanos
    //El punto
    const ubicacion = Sequelize.literal(`ST_GeoFromTex('POINT(${meeti.ubicacion.coordinates[0]} ${meeti.ubicacion.coordinates[1]})')`);
    //Las distancia
    const distancia = Sequelize.fn('ST_Distance_Sphere', Sequelize.col('ubicacion'), ubicacion);
    //quey
    const cercanos =  await Meetis.findAll({ 
        order: distancia,
        where: Sequelize.where(distancia, { [Op.lte]: 40000  }),  //40 kilometros
        limit: 3,
        include: [
            {
                model: Grupos
            },
            {
                model: Usuarios,
                attributes: ['id','nombre','imagen'],
            }
        ]
    });
    
    
    console.log(cercanos); 
    
    const comentarios = await Comentarios.findAll({ 
        where: { 
            meetiId: meeti.id 
        },
        include: [
            {
                model: Usuarios,
                attributes: ['id','nombre','imagen'],
            }
        ],
        order: [
                ['fecha', 'DESC']
        ]
    });
    res.render("meeti", {
        nombrePagina: 'Meeti',
        meeti,
        comentarios,
        moment
    });
};



exports.meetiAsistentes =  async (req,res,next) => {
    const meeti = await Meetis.findOne({
        where: { slug: req.params.slug },
                attributes: ['titulo', 'interesados']
    });
    const usuarios = await Usuarios.findAll({
        where: { id: meeti.interesados },
       attributes: ['nombre','imagen']
    });
    if(!meeti) {
        return next();
    }
    res.render("meetiAsistentes", {
        nombrePagina: 'Asistentes - '+  meeti.titulo,
        usuarios
    });
};






exports.asistenciaMeeti =  async (req,res,next) => {
    if( req.body.accion ) {
        Meetis.update(
             {'interesados': Sequelize.fn('array_append', Sequelize.col('interesados'), req.user.id)},
             {'where': {'slug': req.params.slug}}
        );
        res.json({ invitacion: 'Agregada' });
    }
    else {
        Meetis.update(
             {'interesados': Sequelize.fn('array_remove', Sequelize.col('interesados'), req.user.id)},
             {'where': {'slug': req.params.slug}}
        );
        res.json({ invitacion: 'Eliminada' });
    }
    
};




exports.meetiPorCategoria =  async (req,res,next) => {
    
    const categoriaPromise = Categorias.findOne({where: { id: req.params.id }  });
    
    const meetisPromise = Meetis.findAll({
        where: {
            fecha: { [Op.gte]: Date.now()  }
        },
        include: [
            {
                model: Grupos,
                where : {categoriaId : req.params.id }
            },
            {
                model: Usuarios,
                attributes: ['id','nombre','imagen'],
            }
        ],
        order: [
                ['fecha', 'ASC']
        ]
    });    
    const meetisPasadosPromise = Meetis.findAll({
        where: {
            fecha: { [Op.lt]: Date.now()  }
        },
        include: [
            {
                model: Grupos,
                where : {categoriaId : req.params.id }
            },
            {
                model: Usuarios,
                attributes: ['id','nombre','imagen'],
            }
        ],
        order: [
                ['fecha', 'DESC']
        ]
    });
    
    const [meetis,meetisPasados,categoria] = await Promise.all([meetisPromise,meetisPasadosPromise,categoriaPromise]);
    if(!categoria) {
        return next();
    }
    res.render("categoria", {
        nombrePagina: 'Categoria - ' + categoria.nombre ,
        meetis,
        meetisPasados,
        categoria,
        moment
    });
};






exports.mapaMeeti = async (req,res) =>{
    
        const ip = req.ip;
    var geo = geoip.lookup(ip);    
    const ubicacion =  geo ? geo : { ll : [ 8.991048919136528, -79.52132348174077 ] };
    
    const meetisPromise =  Meetis.findAll({
                where: {
                        fecha: { [Op.gte]: Date.now()  }
                         
                },
                order: [
                        ['fecha', 'ASC']
                ]
        });
    const meetisPasadosPromise = await Meetis.findAll({
                where: {
                        fecha: { [Op.lt]: Date.now()  }
                         
                },
                order: [
                        ['fecha', 'DESC']
                ]
        });
    const [meetis,meetisPasados] = await Promise.all([meetisPromise,meetisPasadosPromise]);
    /*
    meetis.forEach(meeti =>{
        console.log('------------------');
        console.log(meeti);
    });
    */
    //console.log(meetis);
    res.render("mapaMeeti", {
        nombrePagina: 'Mapa de Meetis',
        meetis,
        meetisPasados,
        ubicacion,
        moment
    });

};













