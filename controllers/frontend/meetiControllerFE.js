

const Grupos = require("../../models/Grupos");
const Meetis = require("../../models/Meetis");
const Usuarios = require("../../models/Usuarios");
const Sequelize = require('sequelize');
const moment = require('moment');






exports.meetiPorURL =  async (req,res,next) => {
    const meeti = await Meetis.findOne({
        where: { slug: req.params.url },
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
    res.render("meeti", {
        nombrePagina: 'Meeti',
        meeti,
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





















