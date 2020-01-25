

const Categorias = require("../models/Categorias");




exports.formNuevoGrupo =  async (req,res,next) => {
    const categorias = await Categorias.findAll();
    res.render("nuevoGrupo", {
        nombrePagina: 'Crea un nuevo Grupo',
        categorias
    });
};






