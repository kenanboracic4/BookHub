const conversationService = require('../services/conversationService');
const messageService = require('../services/messageService');


module.exports = {


    async renderChatPage(req, res) {


        res.render('chat');
    },

   async renderMessagePage(req, res) {
    try {
        const conversationId = req.params.conversationId;
        const userId = req.user.id; // ID ulogovanog korisnika

        const conversation = await conversationService.getConversationById(conversationId);
        
        // Ako konverzacija ne postoji
        if (!conversation) {
            console.log("Konverzacija nije pronađena");
            return res.redirect('/chat');
        }

        // Provjera prava pristupa (da li je korisnik kupac ili prodavac u ovoj konverzaciji)
        if (userId != conversation.sellerId && userId != conversation.buyerId) {
            console.log("Nemate pravo pristupa ovoj konverzaciji");
            return res.redirect('/');
        }

        const allMessages = await messageService.getMessages(conversationId);
        const allConversations = await conversationService.getAllConversations(userId);

        return res.render('messages', {
            conversation: conversation,
            messages: allMessages,
            user: req.user, // Promijenjeno u 'user' da se poklapa sa tvojim EJS-om
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