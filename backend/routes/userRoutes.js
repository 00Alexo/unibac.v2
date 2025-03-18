const express = require('express');
const{
    signup,
    signin,
    getUserProfile,
    updateUserAvatar,
    search,
    statusVerifier
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.get('/getUserProfile/:username', getUserProfile);
router.post('/signin', signin);
router.post('/updateUserAvatar', updateUserAvatar);
router.get('/search', search);
router.get('/statusVerifier', statusVerifier);

module.exports= router;