const express = require('express');
const{
    chatMinaAi,
    newChatMinaAi,
    getPromptsConv,
    getPromptsHistory
} = require('../controllers/minaAiController');

const router = express.Router();

router.post('/chatMinaAi/:chatId', chatMinaAi)
router.post('/newChatMinaAi', newChatMinaAi)
router.post('/getPromptsConv/:chatId', getPromptsConv)
router.post('/getPromptsHistory', getPromptsHistory)

module.exports = router;