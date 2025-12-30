const { Server } = require("socket.io");
const MessageDao = require('../dao/MessageDao.js');

module.exports = (server) => {
    const io = new Server(server);

    io.on('connection', (socket) => { 
        console.log('Korisnik povezan:', socket.id);

        socket.on('joinRoom', (conversationId) => {
            socket.join(conversationId);
            console.log(`Korisnik ušao u sobu: ${conversationId}`);
        });

        socket.on('sendMessage', async (data) => {
            try {
                
                const newMessage =await MessageDao.create({
                    conversationId: data.conversationId,
                    senderId: data.senderId,
                    content: data.content,
                    isRead: false
                });



                
                console.log('Nova poruka:', data);
                io.to(data.conversationId).emit('newMessage', {
                    id: newMessage.id,
                    content: newMessage.content,
                    senderId : newMessage.senderId,
                    createdAt: newMessage.createdAt
                });
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