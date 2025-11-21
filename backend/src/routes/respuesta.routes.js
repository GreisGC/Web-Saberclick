const { Router } = require('express');
const router = Router();

const {
    getAllRespuesta,
    getRespuesta,
    createRespuesta,
    deleteRespuesta,
    updateRespuesta
} = require('../controllers/respuesta.controller');


router.get('/respuesta', getAllRespuesta);
router.get('/respuesta/:id', getRespuesta);
router.post('/respuesta', createRespuesta);
router.delete('/respuesta/:id', deleteRespuesta);
router.put('/respuesta/:id', updateRespuesta);

module.exports = router;