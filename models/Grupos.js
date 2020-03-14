const Sequelize = require("sequelize");
const uuidv4 = require('uuid/v4');
const db = require("../config/db");
const Categorias = require("../models/Categorias");
const Usuarios = require("../models/Usuarios");


const Grupos = db.define('grupos', {
    id : {
        type : Sequelize.UUID,
        primaryKey: true,
        allowNull: false
    },
    nombre : {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre del grupo no puede ir vacio'
            }
        }
    },
    descripcion : {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Coloca una descripcion'
            }
        }
    },
    url : Sequelize.TEXT,
    imagen : Sequelize.TEXT,

});
Grupos.belongsTo(Categorias);
Grupos.belongsTo(Usuarios);


module.exports = Grupos;
