const { Router } = require('express');
const router = Router();

const {
    getAllTutoria,
    getTutoria,
    createTutoria,
    deleteTutoria,
    updateTutoria,
    getTutoriaPorInstitucion
} = require('../controllers/tutoria.controller');


router.get('/tutoria', getAllTutoria);
router.get('/tutoria/:id', getTutoria);
router.get('/tutoriaPorInstitucion/:id',getTutoriaPorInstitucion);
router.post('/tutoria', createTutoria);
router.delete('/tutoria/:id', deleteTutoria);
router.put('/tutoria/:id', updateTutoria);

module.exports = router;