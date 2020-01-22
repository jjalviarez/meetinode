const nodemailer = require("nodemailer");
const util = require("util");
const fs = require("fs");
const ejs = require("ejs");
const emailConfig = require("../config/email");

let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
          user: emailConfig.user,
          pass: emailConfig.pass
    }
});

//generar html
const generarHTML = (opciones = {}) => {
    const archivo = __dirname + '/../views/emails/' + opciones.archivo +'.ejs';
    const compilado = ejs.compile(fs.readFileSync(archivo,'utf8'));
    return compilado({url: opciones.url});
};

exports.enviar = async (opciones) => {
    const html = generarHTML(opciones);
    //const text = htmlTotext.fromString(html);
    let info = await  transporter.sendMail({
        from: '"Meeti" <no-reply@meeti.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text: 'Ingresa aqui para activar tu cuenta de Meeti: ' + opciones.url ,
        html
    });
  return info;
};  