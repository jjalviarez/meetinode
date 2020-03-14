
const Grupos = require("../../models/Grupos");
const Usuarios = require("../../models/Usuarios");






exports.usuario =  async (req,res,next) => {
    const usuarioPromise = Usuarios.findOne({
        where: { id: req.params.id },
        attributes: ['nombre','imagen','descripcion']
    });
    const gruposPromise = Grupos.findAll({ where: { usuarioId: req.params.id }});
    const [usuario,grupos] = await Promise.all([usuarioPromise,gruposPromise]);
    if(!usuario) {
        return next();
    }
    res.render("usuario", {
        nombrePagina: 'Usuario - '+ usuario.nombre,
        usuario,
        grupos
    });
};


