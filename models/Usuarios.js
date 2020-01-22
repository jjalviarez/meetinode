const Sequelize = require("sequelize");
const db = require("../config/db");
const bcrypt = require('bcrypt');


const Usuarios = db.define('usuarios', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre : Sequelize.STRING(60),
    imagen : Sequelize.STRING(60),
    email : {
        type : Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg : 'Agregar Email Valido'
            },
            notEmpty: {
                msg: 'El Email no puede ir vacio'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario Registrado'
        }
    },
    password : {
        type : Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El Password no puede ir vacio'
            }
        }
    },
    activo: {
        type : Sequelize.INTEGER,
        defaultValue: 0
    },
    token:  Sequelize.STRING,
    expiracion: Sequelize.DATE
}, {
    hooks: {
        beforeCreate (usuario) {
            usuario.password= bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});
//Usuarios.hasMany(Proyectos, { onDelete: 'cascade', hooks: true });

Usuarios.prototype.verificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = Usuarios;