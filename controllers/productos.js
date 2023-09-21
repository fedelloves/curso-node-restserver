const { response } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  const [total, productos] = await Promise.all([
    Producto.countDocuments({ estado: true }),
    Producto.find({ estado: true })
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .skip(desde)
      .limit(limite),
  ]);

  res.json({
    total,
    productos,
  });
};

const obtenerProducto = async (req, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.json(producto);
};

const crearProducto = async (req, res = response) => {
  const { estado, usuario, ...body } = req.body;
  body.nombre = body.nombre.toUpperCase();

  const productoDB = await Producto.findOne({ nombre: body.nombre });

  if (productoDB) {
    return res.status(400).json({
      msg: `El Producto ${productoDB.nombre} ya existe`,
    });
  }

  const data = {
    ...body,
    nombre: body.nombre,
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);

  producto.save();

  res.status(201).json(producto);
};

const actualizarProducto = async (req, res = response) => {
  const {id} = req.params;

  const { estado, usuario, ...body } = req.body;

  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id
  }

  const producto = await Producto.findByIdAndUpdate(id, data, {
    new: true,
  });
  
  res.json(producto);
}

const borrarProducto = async(req, res = response) => {
  const {id} = req.params;

  const productoBorrado = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json(productoBorrado);
}

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto
};
