const { Router } = require('express');
const router = Router();

const {
    getAllInscripcion,
    getInscripcion,
    createInscripcion,
    deleteInscripcion,
    updateInscripcion
} = require('../controllers/inscripcion.controller');


router.get('/inscripcion', getAllInscripcion);
router.get('/inscripcion/:id', getInscripcion);
router.post('/inscripcion', createInscripcion);
router.delete('/inscripcion/:id', deleteInscripcion);
router.put('/inscripcion/:id', updateInscripcion);

module.exports = router;