

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
var expressLayouts = require('express-ejs-layouts');
const SessionStore = require('express-session-sequelize')(session.Store);




//conexion con la BD
const db = require("./config/db");
//Modelos
require("./models/Usuarios");
require("./models/Categorias");
require("./models/Grupos");

db.sync()
    //.then(()=> console.log('DB conectada'))
    .catch((error)=>console.log(error));




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


//hablilitar ejs (Templete Engine son como 20 que hay)
app.use(expressLayouts);
app.set('view engine', 'ejs');


//habilitar cookieParser
app.use(cookieParser(process.env.SECRETO));

//habilitar flash Menssages
app.use(flash());


//habilitar session
app.use(session({
  secret: process.env.SECRETO,
  key: process.env.KEY,
  store: new SessionStore({ db }),
  resave: false,
  saveUninitialized: false
}))

//Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

//declaraciones de los middleware
app.use((req, res, next) => {
    //console.log(req.headers.host);
    const fecha = new Date();
    res.locals.year  = fecha.getFullYear();
    //res.locals.usuario = {...req.user} || null;
    res.locals.mensajes = req.flash();
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
