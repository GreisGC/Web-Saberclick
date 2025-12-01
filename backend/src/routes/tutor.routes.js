const { Router } = require('express');
const multer = require('multer');

const router = Router();

// Multer para subir archivos a /upload
const upload = multer({ dest: 'upload/' });

const {
    getAllTutor,
    getTutor,
    createTutor,
    updateTutor,
    deleteTutor,
} = require('../controllers/tutor.controller');

router.get('/tutor', getAllTutor);
router.get('/tutor/:id', getTutor);
router.delete('/tutor/:id', deleteTutor);
router.post('/tutor', upload.single('cv'), createTutor);
router.put('/tutor/:id', upload.single('cv'), updateTutor);

module.exports = router;
