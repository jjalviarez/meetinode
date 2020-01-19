//conexion con la BD

require("./config/db");


const express = require('express');
const path = require('path');
const route = require('./routes');
require('dotenv').config({path: 'variables.env'});
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const createError = require('http-errors');
const passport = require('./config/passport');


//crear un app en express
const app = express();

//Se habilita el bodyParser para los req de datos
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());



//Carpeta de archivos estaticos
// static files
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
//agregra la caprteta de las vistas 
app.set('views',path.join(__dirname, './views'));
//habilitar flash Menssages
app.use(flash());


//hablilitar ejs (Templete Engine son como 20 que hay)
 app.set('view engine', 'ejs');



//habilitar cookieParser
app.use(cookieParser());

//habilitar session
app.use(session({
  secret: process.env.SECRETO,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: true
}))

//Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

//declaraciones de los middleware
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    //res.locals.usuario = {...req.user} || null;
    next(); 
});
 

app.use('/',route());


app.use( (req, res,next) => {
   next(createError(404, 'Pagina No Encontrada :('));
});

app.use( (error,req, res, next) => {
   res.locals.mensaje = error.message;
   const status = error.status || 500;
   res.locals.status = status;
   res.status(status);
   res.send(error.message);
});





const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || '8080';
app.listen(port, host, function () {
  console.log('Server running at http://' + host + ':' + port + '/'); 
});






