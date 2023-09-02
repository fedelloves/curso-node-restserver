const { response } = require("express");

const usuariosGet = (req, res = response) => {

  const { q, nombre, apiKey = 'Vacio' } = req.query;

  res.json({
    msg: "Peticion GET - Controlador",
    q,
    nombre,
    apiKey
  });
};

const usuariosPost = (req, res = response) => {
    const { nombre, edad } = req.body;

  res.json({
    msg: "Peticion POST - Controlador",
    nombre,
    edad
  });
};

const usuariosPut = (req, res = response) => {
  const id = req.params.id;

  res.json({
    msg: "Peticion PUT - Controlador",
    id
  });
};

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "Peticion PATCH - Controlador",
  });
};

const usuariosDelete = (req, res = response) => {
  res.json({
    msg: "Peticion DELETE - Controlador",
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete
};
