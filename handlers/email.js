const nodemailer = require("nodemailer");
const pug = require("pug");
const util = require("util");
const emailConfig = require("../config/email");

let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
          user: emailConfig.user,
          pass: emailConfig.pass
    }
});
/*
//generar html
const generarHTML = (archivo, opciones = {}) => {
    const html = pug.renderFile(__dirname + '/../views/emails/' + archivo +'.pug',opciones)
    return juice(html);
}
*/
exports.enviar = async (opciones) => {
    //const html = generarHTML(opciones.archivo, opciones) // html body
    //const text = htmlTotext.fromString(html);
    let info = await  transporter.sendMail({
        from: '"uptasknode" <no-reply@uptasknode.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text: opciones.url,
        html: opciones.url
    });
  return info;
};  