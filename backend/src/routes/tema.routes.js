const { Router } = require("express");
const router = Router();

const {
    upload,        // <-- Importamos multer desde el controlador
    getAllTema,
    getTema,
    createTema,
    deleteTema,
    updateTema
} = require("../controllers/tema.controller");

// =========================
//       RUTAS TEMA
// =========================

// Obtener todos los temas
router.get("/tema", getAllTema);

// Obtener un tema por ID
router.get("/tema/:id", getTema);

// Crear un tema con múltiples archivos
// Campo: archivos (multiple)
router.post("/tema", upload.array("archivos"), createTema);

// Actualizar un tema (sin archivos)
router.put("/tema/:id", updateTema);
// Eliminar un tema (lógico)
router.delete("/tema/:id", deleteTema);

module.exports = router;
