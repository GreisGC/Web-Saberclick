const { Router } = require("express");
const router = Router();

const {
	getAllParalelo,
	getParalelo,
	getParaleloPorTutoria,
	getTutorPorParalelo,
	createParalelo,
	deleteParalelo,
	updateParalelo,
	getAllParaleloByTutor,
	getParaleloPorTutoriaByEstudiante,
} = require("../controllers/paralelo.controller");

router.get("/paralelo", getAllParalelo);
router.get("/getAllParaleloByTutor/:id_tutor", getAllParaleloByTutor);
router.get("/paralelo/:id", getParalelo);
router.get("/paraleloPorTutoria/:id", getParaleloPorTutoria);
router.get(
	"/getParaleloPorTutoriaByEstudiante/:id_estudiante/:id_tutoria",
	getParaleloPorTutoriaByEstudiante
);
router.get("/TutorPorParalelo/:id", getTutorPorParalelo);
router.post("/paralelo", createParalelo);
router.delete("/paralelo/:id", deleteParalelo);
router.put("/paralelo/:id", updateParalelo);

module.exports = router;
