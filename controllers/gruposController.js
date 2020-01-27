

const Categorias = require("../models/Categorias");
const Grupos = require("../models/Grupos");
const { body, validationResult, sanitizeBody } = require('express-validator');
const multer  = require('multer');
const uuidv4 = require('uuid/v4');




exports.formNuevoGrupo =  async (req,res,next) => {
    const categorias = await Categorias.findAll();
    res.render("nuevoGrupo", {
        nombrePagina: 'Crea un nuevo Grupo',
        categorias
    });
};


exports.crearGrupo =  async (req,res,next) => {
    const rules = [
        sanitizeBody('nombre').escape().run(req),
        sanitizeBody('descripcion').escape().run(req),
        sanitizeBody('categoriaId').escape().run(req),
        sanitizeBody('url').escape().run(req)
    ];
    await Promise.all(rules);
    
    const nuevoGrupo = req.body;
    nuevoGrupo.usuarioId = req.user.id;
    if(req.file) {
        nuevoGrupo.imagen= req.file.filename;
    }
    //console.log(nuevoGrupo);
    try {
        const grupo = await Grupos.create(nuevoGrupo);
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
            //grupo : nuevoGrupo,
            categorias
        });


    }
};



//Carga de Archivo----------------------------------

//middleware de carga de archivo
exports.subirImagen = (req,res,next) => {
    upload(req, res, async function (error) {
        if (error) {
            if (error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande: Máximo 100kb ');
                } else {
                    req.flash('error', error.message);
                }
            }
            else {
                req.flash('error', error.message);
            }
            const categorias = await Categorias.findAll();
            res.render('nuevoGrupo', {
                mensajes: req.flash(),
                nombrePagina: 'Crea un nuevo Grupo',
                nuevoGruo : req.body,
                categorias
            });
            return ;
        } 
        else {
        return next();
        }
    });
};
//Configuracion del archivo
const configuracionMulter = {
    limits: {
        fileSize : 100000
    },
    fileFilter (req, file, cb) {
        if (file.mimetype.split('/')[0]==='image') {
            cb(null, true);
        }
        else {
            cb(new Error('Formato no Valido'),false);
        }
    },
    storage :  multer.diskStorage({
              destination : (req, file, cb) => {
                cb(null, __dirname + '../../public/uploads/grupos');
              },
              filename : (req, file, cb) => {
                const extnsion = file.mimetype.split('/')[1];
                cb(null,uuidv4() + '.' + extnsion);
              }
    })
    
};
//inicializar multer
const upload = multer(configuracionMulter).single('imagen');




exports.formEditarGrupo =  async (req,res,next) => {
    const categoriasPromise = Categorias.findAll();
    const grupoPromise =  Grupos.findOne({
            where: {
                    id: req.params.id,
                    usuarioId: req.user.id
            }
    });
    const [categorias,grupo] = await Promise.all([categoriasPromise,grupoPromise]);
    if(!grupo) return next();
    res.render('nuevoGrupo', {
            nombrePagina : 'Editar Grupo - ' + grupo.nombre,
            categorias,
            grupo
    });
};


exports.actualizarGrupo =  async (req,res,next) => {
    const rules = [
        sanitizeBody('nombre').escape().run(req),
        sanitizeBody('descripcion').escape().run(req),
        sanitizeBody('categoriaId').escape().run(req),
        sanitizeBody('url').escape().run(req)
    ];
    await Promise.all(rules);
    
    const grupo = await Grupos.findOne({
        where: {
                id: req.params.id,
                usuarioId: req.user.id
        }
    });
    if(!grupo) {
        req.flash('error','Operacion no  Valida')
        res.redirect('/administracion');
    }
    
    grupo.nombre = req.body.nombre;
    grupo.descripcion = req.body.descripcion;
    grupo.categoriaId = req.body.categoriaId;
    grupo.url = req.body.url;
    
    
    
    try {
        await grupo.save();
        req.flash('correcto', 'Se actualizo el grupo Correctamente');
        res.redirect('/administracion');

    } catch (error) {
        const err= error.errors.map(error => error.message);
        req.flash('error',err );
        res.redirect('/editar-grupo/' + req.params.id);


    }
};
