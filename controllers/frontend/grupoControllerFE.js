
const Grupos = require("../../models/Grupos");
const Usuarios = require("../../models/Usuarios");
const Meetis = require("../../models/Meetis");
const moment = require('moment');




exports.grupo =  async (req,res,next) => {
        const meetisPromise =  Meetis.findAll({
                where: {
                        grupoId: req.params.id
                },
                order: [
                        ['fecha', 'ASC']
                ]
        });
    const grupoPromise = Grupos.findOne({ where: { id: req.params.id } });
    const [meetis,grupo] = await Promise.all([meetisPromise,grupoPromise]);
    if(!grupo) {
        return next();
    }
    res.render("grupo", {
        nombrePagina: 'Grupo - '+ grupo.nombre,
        meetis,
        grupo,
        moment
    });
};


