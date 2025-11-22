const { Router } = require("express");
const router = Router();

const {
	getAllUsuario,
	getUsuario,
	createUsuario,
	deleteUsuario,
	updateUsuario,
	loginSesion,
} = require("../controllers/usuario.controller");

router.get("/usuario", getAllUsuario);
router.get("/usuario/:id", getUsuario);
router.post("/usuario", createUsuario);
router.delete("/usuario/:id", deleteUsuario);
router.put("/usuario/:id", updateUsuario);
router.post("/usuario/login", loginSesion);

module.exports = router;
