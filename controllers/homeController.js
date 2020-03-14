
const Grupos = require("../models/Grupos");
const Meetis = require("../models/Meetis");
const Categorias = require("../models/Categorias");
const Usuarios = require("../models/Usuarios");
const {Op} = require("sequelize");
const moment = require('moment');



exports.home = async (req,res,next) => {
    
        //console.log(moment(Date.now()).format('LLLL'));
    const categoriasPromise =  Categorias.findAll();
    const meetisPromise =  Meetis.findAll({
        attributes: ['slug','titulo','fecha','hora'],
        limit: 3,
        where: {
                        fecha: { [Op.gte]: Date.now()  }
                         
                },
                order: [
                        ['fecha', 'ASC']
                ],
                include: [
                        {
                            model: Grupos,
                            attributes: ['imagen'],
                        },
                        {
                            model: Usuarios,
                            attributes: ['nombre','imagen'],
                        }
                    ]
    });
    const [categorias,meetis] = await Promise.all([categoriasPromise,meetisPromise]);
    res.render("home", {
        nombrePagina: 'Inicio',
        categorias,
        meetis,
        moment
    });
};
