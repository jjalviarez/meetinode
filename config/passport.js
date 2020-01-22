const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modelo donde vamos a autenticar
const Usuarios = require("../models/Usuarios");

// local strategy - login con credenciales de ususqrio y pass locales

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            //console.log(email);
            const usuario = await Usuarios.findOne({where: {email}});
            //el ususario existe  pero el pass es incorrecto
            if(!usuario.verificarPassword(password)){
                return done(null, false, { message: 'Incorrect password.' });
            }
            if(!usuario.activo) {
                return done(null, false, { message: 'Cuenta no esta activa confirma tu email.' });
            }
            
            return done(null, usuario);
        } catch(error) {
            //Ucuario no existe
            
            return done(null, false, { message: 'Incorrect username.' });
        }
    }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;


