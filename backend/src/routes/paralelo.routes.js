const { Router } = require('express');
const router = Router();

const {
    getAllParalelo,
    getParalelo,
    getParaleloPorTutoria,
    getTutorPorParalelo,
    createParalelo,
    deleteParalelo,
    updateParalelo
} = require('../controllers/paralelo.controller');


router.get('/paralelo', getAllParalelo);
router.get('/paralelo/:id', getParalelo);
router.get('/paraleloPorTutoria/:id', getParaleloPorTutoria);
router.get('/TutorPorParalelo/:id', getTutorPorParalelo, );
router.post('/paralelo', createParalelo);
router.delete('/paralelo/:id', deleteParalelo);
router.put('/paralelo/:id', updateParalelo);

module.exports = router;