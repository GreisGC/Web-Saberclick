const { Router } = require('express');
const router = Router();

const {
    getAllEstudiante,
    getEstudiante,
    createEstudiante,
    deleteEstudiante,
    updateEstudiante
} = require('../controllers/estudiante.controller');


router.get('/estudiante', getAllEstudiante);
router.get('/estudiante/:id', getEstudiante);
router.post('/estudiante', createEstudiante);
router.delete('/estudiante/:id', deleteEstudiante);
router.put('/estudiante/:id', updateEstudiante);

module.exports = router;