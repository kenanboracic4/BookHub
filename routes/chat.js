var express = require('express');
var router = express.Router();

const chatController = require('../controllers/chatController');


router.get('/', chatController.renderChatPage);
router.get('/messages', chatController.renderMessagePage);

module.exports = router;
