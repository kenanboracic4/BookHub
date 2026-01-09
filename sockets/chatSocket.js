const { Server } = require("socket.io");
const MessageDao = require('../dao/MessageDao.js');
const Conversation = require('../models/associations').Conversation; 

module.exports = (server) => {
    const io = new Server(server);

    io.on('connection', (socket) => { 
        console.log('Korisnik povezan:', socket.id);

        // Korisnik ulazi u sobu konkretne konverzacije 
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`Korisnik ušao u sobu: ${roomId}`);
        });

        //  Korisnik ulazi u svoju privatnu sobu (za globalne notifikacije)
        socket.on('joinUserGlobal', (userId) => {
            socket.join(`user_${userId}`);
            console.log(`Korisnik se pridružio svojoj globalnoj sobi: user_${userId}`);
        });

        socket.on('sendMessage', async (data) => {
            try {
                // Spremamo poruku u bazu
                const newMessage = await MessageDao.create({
                    conversationId: data.conversationId,
                    senderId: data.senderId,
                    content: data.content,
                    isRead: false
                });

                // Pronalazimo konverzaciju da znamo ko je drugi učesnik (primatelj)
                const conversation = await Conversation.findByPk(data.conversationId);
                const recipientId = conversation.buyerId == data.senderId ? conversation.sellerId : conversation.buyerId;

                const messagePayload = {
                    id: newMessage.id,
                    conversationId: data.conversationId,
                    content: newMessage.content,
                    senderId : newMessage.senderId,
                    createdAt: newMessage.createdAt
                };

                //  Šaljemo poruku svima u sobi konverzacije
                io.to(data.conversationId).emit('newMessage', messagePayload);

                //  Šaljemo signal primatelju u njegovu PRIVATNU sobu za update brojača i sidebara
                io.to(`user_${recipientId}`).emit('updateNotification', messagePayload);

            } catch (error) {
                console.error("Greška pri slanju poruke:", error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Korisnik se odspojio');
        });
    });

    return io;
};