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

module.exports= router;