const { Router } = require('express');
const router = Router();

const {
    getAllTutoria,
    getTutoria,
    createTutoria,
    deleteTutoria,
    updateTutoria
} = require('../controllers/tutoria.controller');


router.get('/tutoria', getAllTutoria);
router.get('/tutoria/:id', getTutoria);
router.post('/tutoria', createTutoria);
router.delete('/tutoria/:id', deleteTutoria);
router.put('/tutoria/:id', updateTutoria);

module.exports = router;