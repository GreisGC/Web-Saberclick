const { Router } = require("express");
const router = Router();

const {
	getAllPregunta,
	getPregunta,
	createPregunta,
	deletePregunta,
	updatePregunta,
	getPreguntasByInstitutoTutoria,
	getIncisosByPregunta,
} = require("../controllers/pregunta.controller");

router.get("/pregunta", getAllPregunta);
router.get("/pregunta/:id", getPregunta);
router.post("/pregunta", createPregunta);
router.delete("/pregunta/:id", deletePregunta);
router.put("/pregunta/:id", updatePregunta);
router.post("/pregunta/listarPreguntas", getPreguntasByInstitutoTutoria);
router.get("/pregunta/incisos/:id_pregunta", getIncisosByPregunta);

module.exports = router;
