const { Router } = require("express");
const router = Router();

const {
	getAllInscripcion,
	getInscripcion,
	createInscripcion,
	deleteInscripcion,
	updateInscripcion,
	createInscripcion2,
	updateNroIntento,
	getAllInscripcionByEstudiante,
} = require("../controllers/inscripcion.controller");

router.get("/inscripcion", getAllInscripcion);
router.get("/getAllInscripcionByEstudiante/:id_estudiante", getAllInscripcionByEstudiante);
router.get("/inscripcion/:id", getInscripcion);
router.post("/inscripcion", createInscripcion);
router.post("/getinscripcion", createInscripcion2);
router.delete("/inscripcion/:id", deleteInscripcion);
router.put("/inscripcion/:id", updateInscripcion);
router.post("/updateNota", updateNroIntento);

module.exports = router;
