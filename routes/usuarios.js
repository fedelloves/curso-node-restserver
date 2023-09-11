const { Router } = require("express");
const { check } = require("express-validator");

const {validarCampos, validarJWT, esAdminRole, tieneRol} = require('../middlewares');

const { esRolValido, existeEmail, existeUsuarioPorId } = require("../helpers/db-validators");

const {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
} = require("../controllers/usuarios");


const router = Router();

router.get("/", usuariosGet);

router.post("/", [
  check('nombre', 'El nombre es obligatorio').notEmpty(),
  check('password', 'El password debe tener mas de 6 caracteres').isLength({min: 6}),
  check('correo', 'El correo no es valido').isEmail(),
  check('correo').custom(existeEmail),
  //check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('rol').custom(esRolValido),
  validarCampos
], usuariosPost);

router.put("/:id", [
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  check('rol').custom(esRolValido),
  validarCampos
], usuariosPut);

router.patch("/", usuariosPatch);

router.delete("/:id", [
  validarJWT,
  //esAdminRole,
  tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], usuariosDelete);

module.exports = router;
