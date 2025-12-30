const conversationService = require('../services/conversationService');
const messageService = require('../services/messageService');


module.exports = {


    async renderChatPage(req, res) {


        res.render('chat');
    },

    async renderMessagePage(req, res) {
        try {

            const conversationId = req.params.conversationId;
            const conversation = await conversationService.getConversationById(conversationId);
            const allMessages = await messageService.getMessages(conversationId);

            if (!conversation) {
                return res.redirect('/chat');
            }

            if (req.user.id !== conversation.sellerId && req.user.id !== conversation.buyerId) {
                return res.redirect('/');
            }

            return res.render('messages', {
                conversation: conversation,
                messages: allMessages,
                currentUser: req.user
            })


        } catch (error) {
            console.error(error);
            res.status(500).send('Greška prilikom prikazivanja inboxa.');
        }


    },

    async startConversation(req, res) {

        try {


            const bookId = parseInt(req.params.bookId);
            const sellerId = parseInt(req.params.sellerId);
            const buyerId = req.user.id;

            if (isNaN(bookId) || isNaN(sellerId)) {
                return res.status(400).send("Neispravan ID.");
            }
            if (buyerId === sellerId) {
                return res.redirect('back');
            }

            const conversation = await conversationService.getConversation(buyerId, sellerId, bookId);

            if (!conversation) {
                const newConversation = await conversationService.createConversation(buyerId, sellerId, bookId);
                res.redirect('/chat/inbox/' + newConversation.id);
                return;
            }
            return res.redirect('/chat/inbox/' + conversation.id);


        } catch (error) {
            console.error(error);
            res.status(500).send('Greška prilikom prikazivanja inboxa.');
        }
    }

}