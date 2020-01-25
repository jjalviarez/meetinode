

const Categorias = require("../models/Categorias");
const Grupos = require("../models/Grupos");




exports.formNuevoGrupo =  async (req,res,next) => {
    const categorias = await Categorias.findAll();
    res.render("nuevoGrupo", {
        nombrePagina: 'Crea un nuevo Grupo',
        categorias
    });
};


exports.crearGrupo =  async (req,res,next) => {
    const nuevoGruo = req.body;
    //console.log(nuevoGruo);
    try {
        const grupo = await Grupos.create(nuevoGruo);
        req.flash('correcto', 'Se creo el grupo Correctamente');
        //res.redirect('/grupo/'+ grupo.id);
        res.redirect('/administracion');

    } catch (error) {
        const categorias = await Categorias.findAll();
        const err= error.errors.map(error => error.message);
        req.flash('error',err );
        //console.log(error);
        res.render('nuevoGrupo', {
            mensajes: req.flash(),
            nombrePagina: 'Crea un nuevo Grupo',
            nuevoGruo,
            categorias
        });


    }
};
