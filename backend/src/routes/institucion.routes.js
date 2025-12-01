const { Router } = require("express");
const {
	getAllInstitucion,
	getInstitucion,
	createInstitucion,
	deleteInstitucion,
	updateInstitucion,
	getAllInstitucionByGerente,
} = require("../controllers/institucion.controller");

const router = Router();

router.get("/institucion", getAllInstitucion);

router.get("/institucionByGerente/:id_gerente", getAllInstitucionByGerente);

router.get("/institucion/:id", getInstitucion);

router.post("/institucion", createInstitucion);

router.delete("/institucion/:id", deleteInstitucion);

router.put("/institucion/:id", updateInstitucion);

module.exports = router;
