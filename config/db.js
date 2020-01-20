const Sequelize = require('sequelize');
//Extrae datos de DB del .env
require('dotenv').config({path: 'variables.env'});

/*
const db = new Sequelize(process.env.BD_URL, {
  define: {
      timestamps: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
    
});

*/

module.exports = new Sequelize('meeti', 'sa', '123456', {
    host: '127.0.0.1',
    port: '5432',
    dialect : 'postgres', 
    pool :{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    // define: {
    //     timestamps : false
    // },
    // logging : false
});


module.exports = db;