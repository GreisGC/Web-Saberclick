const { Router } = require('express');
const multer = require('multer');

const router = Router();

// Multer para subir archivos a /upload
const upload = multer({ dest: 'upload/' });

const {
    getAllTutor,
    getTutor,
    createTutor,
    updateTutor
} = require('../controllers/tutor.controller');

router.get('/tutor', getAllTutor);
router.get('/tutor/:id', getTutor);

// 👉 Aquí permitimos subir el PDF del cv
router.post('/tutor', upload.single('cv'), createTutor);

// 👉 También permitimos subir un nuevo pdf en la actualización
router.put('/tutor/:id', upload.single('cv'), updateTutor);

module.exports = router;
