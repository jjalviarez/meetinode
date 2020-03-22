
const Grupos = require("../models/Grupos");
const Meetis = require("../models/Meetis");
const Categorias = require("../models/Categorias");
const Usuarios = require("../models/Usuarios");
const {Op} = require("sequelize");
const moment = require('moment');
const Sequelize = require('sequelize');


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


exports.resultado = async (req,res,next) => {
    const query = "";
    if(req.query.categoriaId) query = "where : { categoriaId: { [Op.eq]: " + req.query.categoriaId + "}}";   
    
    const meetisPromise = await Meetis.findAll({
        where: {
                    titulo : { [Op.iLike]: '%' + req.query.titulo + '%' },
                    ciudad : { [Op.iLike]: '%' + req.query.ciudad + '%' },
                    pais : { [Op.like]: '%' + req.query.pais + '%' },
                    fecha: { [Op.gte]: Date.now()  }
                         
                },
        order: [
                ['fecha', 'ASC']
        ],
        include: [
                {
                    model: Grupos,
                    query
                },
                {
                    model: Usuarios,
                    
                }
            ],
        order: [
                ['fecha', 'ASC']
        ]
    });
    
    
    const meetisPasadosPromise = await Meetis.findAll({
        where: {
                    titulo : { [Op.iLike]: '%' + req.query.titulo + '%' },
                    ciudad : { [Op.iLike]: '%' + req.query.ciudad + '%' },
                    pais : { [Op.like]: '%' + req.query.pais + '%' },
                    fecha: { [Op.lt]: Date.now()  }
                         
                },
        order: [
                ['fecha', 'ASC']
        ],
        include: [
                {
                    model: Grupos,
                    query
                },
                {
                    model: Usuarios,
                    
                }
            ],
        order: [
                ['fecha', 'DESC']
        ]
        
    });


    const [meetis,meetisPasados] = await Promise.all([meetisPromise,meetisPasadosPromise]);


    res.render("categoria", {
        nombrePagina: 'Busqueda - ',
        meetis,
        meetisPasados,
        moment
    });
    
};
