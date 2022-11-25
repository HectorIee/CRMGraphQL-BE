const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')

require('dotenv').config({ path: 'variables.env' });

const crearToken = (usuario, secreta, expiresIn) => {
    console.log(usuario);
    const { id, email, nombre, apellido } = usuario;

    return jwt.sign({ id, email, nombre, apellido }, secreta, { expiresIn })
}

///////////////// GET /////////////////
exports.obtenerUsuario = async (ctx) => {
    return ctx.usuario
}

///////////////// CREATE /////////////////
exports.nuevoUsuario = async (input) => {
    const { email, password } = input;

    //Revisar si el usuario ya existe
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) throw new Error('El usuario ya esta registrado');

    //Hashear su password
    const salt = await bcryptjs.genSalt(10);
    input.password = await bcryptjs.hash(password, salt);

    //Guardarlo en la base de datos 

    try {
        //Guardarlo en la BD
        const usuario = new Usuario(input);
        usuario.save();
        return usuario;
    } catch (error) {
        console.log(error)
    }
}

///////////////// VERIFICATE /////////////////
exports.authUsuario = async (input) => {
    const { email, password } = input;

    //Si el usuario existe 
    const existeUsuario = await Usuario.findOne({ email });
    if (!existeUsuario) throw new Error('El usuario no existe')

    //Revisar si el password es correcto
    const CorrectPassword = await bcryptjs.compare(password, existeUsuario.password);
    if (!CorrectPassword) throw new Error('El password es incorrecto');

    //Crear el token
    return {
        token: crearToken(existeUsuario, process.env.SECRETA, '24h')
    }
}

