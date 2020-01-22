




exports.mostrarPanel = async (req,res) =>{
    //const vacantes = await Vacante.find( {autor: req.user._id} );
    
    res.render("administracion", {
        nombrePagina: 'Panel de administracion',
        //vacantes,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        cerrarSesion: true,
    });

};