const { Router } = require('express');
const router = Router();

const {
    getAllAdministrador,
    getAdministrador,
    createAdministrador,
    deleteAdministrador,
    updateAdministrador
} = require('../controllers/administrador.controller');


router.get('/administrador', getAllAdministrador);
router.get('/administrador/:id', getAdministrador);
router.post('/administrador', createAdministrador);
router.delete('/administrador/:id', deleteAdministrador);
router.put('/administrador/:id', updateAdministrador);

module.exports = router;