
const Grupos = require("../models/Grupos");




exports.mostrarPanel = async (req,res) =>{
    const grupos = await Grupos.findAll({
                where: {
                        usuarioId: req.user.id
                }
        });
    
    res.render("administracion", {
        nombrePagina: 'Panel de administracion',
        grupos,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        cerrarSesion: true,
    });

};