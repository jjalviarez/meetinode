const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modelo donde vamos a autenticar
//const mongoose = require('mongoose');
//const Usuario = mongoose.model('Usuario');

// local strategy - login con credenciales de ususqrio y pass locales

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            //console.log(email);
            const usuario = false;//await Usuario.findOne({email});
            //el ususario existe  pero el pass es incorrecto
            if(!usuario.verificarPassword(password)){
                return done(null, false, { message: 'Incorrect password.' });
            }
            /*
            if(!usuario.activo) {
                return done(null, false, { message: 'Ceunta no esta activa confirma tu email.' });
            }
            */
            return done(null, usuario);
        } catch(error) {
            //Usuario no existe
            
            return done(null, false, { message: 'Incorrect username.' });
        }
    }
));

passport.serializeUser((user, done) => done (null, user._id));

passport.deserializeUser(async (id, done) => {
 /*const usuario = await Usuario.findById(id).exec();
 return  done(null, usuario);*/
});

module.exports = passport;


