const { Router } = require('express');
const router = Router();

const {
    getAllOpcion,
    getOpcion,
    createOpcion,
    deleteOpcion,
    updateOpcion
} = require('../controllers/opcion.controller');


router.get('/opcion', getAllOpcion);
router.get('/opcion/:id', getOpcion);
router.post('/opcion', createOpcion);
router.delete('/opcion/:id', deleteOpcion);
router.put('/opcion/:id', updateOpcion);

module.exports = router;