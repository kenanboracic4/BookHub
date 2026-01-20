const conversationService = require('../services/conversationService');
const messageService = require('../services/messageService');

module.exports = {

    async renderChatPage(req, res) {
        try {
        
        const allConversations = await conversationService.getAllConversations(req.user.id);
        
            if(allConversations.length > 0){
                return res.redirect('/chat/inbox/'+allConversations[0].id);
            }
            res.render('chat',{
                conversations: [],
                conversation: null
            });
        } catch(error){
            console.log(error);
            res.redirect('/');
        }
    },

    async renderMessagePage(req, res) {
        try {
            const conversationId = req.params.conversationId;
            const userId = req.user.id; 

           
            const conversation = await conversationService.getConversationById(conversationId);
            
            if (!conversation) {
                return res.redirect('/chat');
            }

           
            if (userId != conversation.sellerId && userId != conversation.buyerId) {
                console.log("Nemate pravo pristupa ovoj konverzaciji");
                return res.redirect('/');
            }

            const [allMessages, allConversations] = await Promise.all([
                messageService.getMessages(conversationId),
                conversationService.getAllConversations(userId)
            ]);

            return res.render('messages', {
                conversation: conversation,
                messages: allMessages,
                user: req.user, 
                conversations: allConversations
            });

        } catch (error) {
            console.error("Greška u renderMessagePage:", error);
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

            let conversation = await conversationService.getConversation(buyerId, sellerId, bookId);

            if (!conversation) {
                conversation = await conversationService.createConversation(buyerId, sellerId, bookId);
            }
            
            return res.redirect('/chat/inbox/' + conversation.id);

        } catch (error) {
            console.error(error);
            res.status(500).send('Greška prilikom pokretanja chata.');
        }
    },

    async markConversationAsRead(req, res) {
        try {
            const conversationId = req.params.conversationId;
            const userId = req.user.id;

            await conversationService.markConversationAsRead(conversationId, userId);
            return res.status(200).json({ message: 'Uspješno.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Greška.' });
        }
    }
}