const multer = require("multer");
const express = require('express');
const{
    uploadPdf,
    downloadSubiect,
    downloadBarem,
    getSubiecte,
    getSubiecteUnverified,
    verifySubiect,
    deleteSubiect,
    getSubiect,
    gradeSubiect,
    addToSubiect,
    getRezolvariSubiect,
    getPunctaje,
    getSubiecteRezolvateTotale,
    getUserSubiecteTotale,
    getSubiectePostateByUser
} = require('../controllers/subiecteController');

const storage = multer.memoryStorage();
const upload = multer({ storage: multer.memoryStorage() }).fields([
    { name: 'subiect', maxCount: 1 },
    { name: 'barem', maxCount: 1 }
]);

const router = express.Router();

router.post('/uploadPdf', upload, uploadPdf);
router.get('/downloadSubiect/:id', downloadSubiect);
router.get('/downloadBarem/:id', downloadBarem);
router.get('/getSubiecte', getSubiecte);
router.get('/getSubiecteUnverified', getSubiecteUnverified);
router.patch('/verifySubiect/:id', verifySubiect);
router.delete('/deleteSubiect/:id', deleteSubiect);
router.get('/getSubiect/:id', getSubiect);
router.post('/gradeSubiect', gradeSubiect);
router.post('/addToSubiect', addToSubiect);
router.get('/getRezolvariSubiect/:id/:username', getRezolvariSubiect);
router.get('/getPunctaje/:id/:username', getPunctaje)
router.get('/getSubiecteRezolvateTotale/:username', getSubiecteRezolvateTotale);
router.get('/getUserSubiecteTotale/:username', getUserSubiecteTotale);
router.get('/getSubiectePostateByUser/:username', getSubiectePostateByUser);

module.exports= router;