const { Router } = require('express');
const router = Router();

const {
    getAllGerente,
    getGerente,
    createGerente,
    deleteGerente,
    updateGerente
} = require('../controllers/gerente.controller');


router.get('/gerente', getAllGerente);
router.get('/gerente/:id', getGerente);
router.post('/gerente', createGerente);
router.delete('/gerente/:id', deleteGerente);
router.put('/gerente/:id', updateGerente);

module.exports = router;