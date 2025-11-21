const { Router } = require('express');
const router = Router();

const {
    getAllPregunta,
    getPregunta,
    createPregunta,
    deletePregunta,
    updatePregunta
} = require('../controllers/pregunta.controller');


router.get('/pregunta', getAllPregunta);
router.get('/pregunta/:id', getPregunta);
router.post('/pregunta', createPregunta);
router.delete('/pregunta/:id', deletePregunta);
router.put('/pregunta/:id', updatePregunta);

module.exports = router;