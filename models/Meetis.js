const Sequelize = require("sequelize");
const db = require("../config/db");
const uuidv4 = require('uuid/v4');
const slug = require('slug');
const shortid = require('shortid');

const Grupos = require("../models/Grupos");
const Usuarios = require("../models/Usuarios");


const Meetis = db.define('meetis', {
    id : {
        type : Sequelize.UUID,
        primaryKey: true,
        allowNull: false
    },
    titulo : {
        type : Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega un titulo'
            }
        }
    },
    slug : Sequelize.STRING,
    invitado : Sequelize.STRING,
    cupo: {
        type : Sequelize.INTEGER,
        defaultValue: 0
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
    fecha : {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Coloca una Fecha'
            }
        }
    },
    hora : {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Coloca una hora'
            }
        }
    },
    direccion : {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Coloca una direccion'
            }
        }
    },
    ciudad : {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Coloca una ciudad'
            }
        }
    },
    estado : {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Coloca una estado'
            }
        }
    },
    pais : {
        type : Sequelize.STRING, 
        allowNull : false,
        validate : {
            notEmpty : {
                msg : 'Agrega un país'
            }
        }
    },
    ubicacion : {
        type: Sequelize.GEOMETRY('POINT')
    },
    interesados : {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
    }
}, {
    hooks: {
        async beforeCreate (meeti) {
            const url = slug(meeti.titulo).toLowerCase();
            meeti.slug = url + '-' + shortid.generate();
        }
    }
});
Meetis.belongsTo(Grupos);
Meetis.belongsTo(Usuarios);


module.exports = Meetis;