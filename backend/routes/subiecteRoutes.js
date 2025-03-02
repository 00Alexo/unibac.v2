const multer = require("multer");
const express = require('express');
const{
    uploadPdf,
    downloadSubiect,
    downloadBarem
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

module.exports= router;