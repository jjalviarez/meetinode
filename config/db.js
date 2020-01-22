const Sequelize = require('sequelize');
//Extrae datos de DB del .env
require('dotenv').config({path: 'variables.env'});


const db = new Sequelize(process.env.BD_URL, {
  /*
  define: {
      timestamps: false
  },
  */
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging : false
});


module.exports = db;