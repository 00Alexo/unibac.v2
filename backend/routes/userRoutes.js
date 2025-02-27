const express = require('express');
const{
    signup,
    signin,
    getUserProfile
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.get('/getUserProfile/:username', getUserProfile);
router.post('/signin', signin);

module.exports= router;