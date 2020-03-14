
const Grupos = require("../models/Grupos");
const Meetis = require("../models/Meetis");
const moment = require('moment');

const {Op} = require("sequelize");


exports.mostrarPanel = async (req,res) =>{
    //console.log(moment(Date.now()).format('LLLL'));
    const gruposPromise =  Grupos.findAll({
                where: {
                        usuarioId: req.user.id
                }
        });
    const meetisPromise =  Meetis.findAll({
                where: {
                        usuarioId: req.user.id,
                        //fecha: { [Op.gte]: moment(new Date()).format('YYYY-MM-DD')  }
                        fecha: { [Op.gte]: Date.now()  }
                         
                },
                order: [
                        ['fecha', 'ASC']
                ]
        });
    const meetisPasadosPromise = await Meetis.findAll({
                where: {
                        usuarioId: req.user.id,
                        //fecha: { [Op.gte]: moment(new Date()).format('YYYY-MM-DD')  }
                        fecha: { [Op.lt]: Date.now()  }
                         
                },
                order: [
                        ['fecha', 'DESC']
                ]
        });
    const [grupos,meetis,meetisPasados] = await Promise.all([gruposPromise,meetisPromise,meetisPasadosPromise]);
    /*
    meetis.forEach(meeti =>{
        console.log('------------------');
        console.log(meeti);
    });
    */
    //console.log(meetis);
    res.render("administracion", {
        nombrePagina: 'Panel de administracion',
        grupos,
        meetis,
        meetisPasados,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        cerrarSesion: true,
        moment
    });

};