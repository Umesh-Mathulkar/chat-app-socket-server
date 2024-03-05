const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/message', chatController.postMessage);
router.get('/messages/:chatroomId', chatController.getChatroomMessages);

module.exports = router;
