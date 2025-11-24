const { Router } = require("express");
const router = Router();

const {
    upload,        
    getAllTema,
    getTema,
    getTemaPorTutoria,
    createTema,
    deleteTema,
    updateTema
} = require("../controllers/tema.controller");



router.get("/tema", getAllTema);
router.get("/tema/:id", getTema);
router.get("/temaPorTutoria/:id", getTemaPorTutoria,);
router.post("/tema", upload.array("archivos"), createTema);
router.put("/tema/:id", updateTema);
router.delete("/tema/:id", deleteTema);

module.exports = router;
