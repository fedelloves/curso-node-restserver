const { response } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
        // Verificar si el correo existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario) {
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos - correo'
            })
        }

        // Verificar si el usuario esta activo
        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos - estado: false'
            })
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos - password'
            })
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error, comuniquese con el administrador'
        })
    }
};

module.exports = {
    login
}