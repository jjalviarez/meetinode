





exports.home = async (req,res,next) => {
    res.render("home", {
        nombrePagina: 'Inicio',
    });
};
