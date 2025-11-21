const { Router } = require('express');
const router = Router();

const {
    getAllPago,
    getPago,
    createPago,
    deletePago,
    updatePago
} = require('../controllers/pago.controller');


router.get('/pago', getAllPago);
router.get('/pago/:id', getPago);
router.post('/pago', createPago);
router.delete('/pago/:id', deletePago);
router.put('/pago/:id', updatePago);

module.exports = router;