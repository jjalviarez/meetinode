const Sequelize = require("sequelize");
const db = require("../config/db");
const Meetis = require("../models/Meetis");
const Usuarios = require("../models/Usuarios");


const Comentarios = db.define('comentarios', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    mensaje : Sequelize.TEXT,
    fecha: Sequelize.DATE
});
Comentarios.belongsTo(Meetis);
Comentarios.belongsTo(Usuarios);

module.exports = Comentarios;