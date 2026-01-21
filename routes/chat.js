var express = require('express');
var router = express.Router();

const chatController = require('../controllers/chatController');


router.get('/', chatController.renderChatPage);

router.get('/inbox/:conversationId', chatController.renderMessagePage);
router.get('/inbox/:bookId/:sellerId', chatController.startConversation);

router.put('/read/:conversationId', chatController.markConversationAsRead);


module.exports = router;
