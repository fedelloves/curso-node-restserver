const { Router, response } = require("express");
const { check } = require("express-validator");
const { Producto, Categoria } = require("../models");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");
const {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos");
const {
  existeCategoriaPorId,
  existeProductoPorId,
} = require("../helpers/db-validators");

const router = Router();

// Obtener Productos
router.get("/", obtenerProductos);

// Obtener un producto por id
router.get(
  "/:id",
  [
    check("id", "No es un ID de Mongo").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProducto
);

// Crear un Producto
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("categoria", "No es un ID de Mongo").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    validarCampos,
  ],
  crearProducto
);

// Actualizar un producto
router.put("/:id", [
    validarJWT,
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("id", "No es un ID de Mongo").isMongoId(),
    check("id").custom(existeProductoPorId),
    check("categoria", "No es un ID de Mongo").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    validarCampos
], actualizarProducto);

// Eliminar un producto
router.delete("/:id", [
    validarJWT,
    esAdminRole,
    check("id", "No es un id de Mongo valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos
], borrarProducto);

module.exports = router;
