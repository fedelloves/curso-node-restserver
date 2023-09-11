const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const usuariosGet = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  // const usuarios = await Usuario.find({ estado: true })
  //   .skip(desde)
  //   .limit(limite);

  // const total = await Usuario.countDocuments({ estado: true });

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments({ estado: true }),
    Usuario.find({ estado: true }).skip(desde).limit(limite),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar en base de datos
  await usuario.save();

  res.json({
    usuario,
  });
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  // TODO validar contra base de datos
  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto, {
    new: true,
  });

  res.json(usuario);
};

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "Peticion PATCH - Controlador",
  });
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  const uid = req.uid;

  const usuario = await Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    {
      new: true,
    }
  );

  res.json(usuario);
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
