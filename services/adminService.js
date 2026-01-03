const ConversationDao = require('../dao/ConversationDao');
const bookDao = require('../dao/bookDao');
const UserDao = require('../dao/userDao');
const MessageDao = require('../dao/MessageDao');
const NotificationDao = require('../dao/NotificationDao');

module.exports = {

    async broadcastMessage(adminId, content, io) {
        const users = await UserDao.findAllExcept(adminId);
        
        for (let user of users) {
           
            const [conversation] = await ConversationDao.findOrCreateSystemConversation(user.id, adminId);

            
            const message = await MessageDao.create({
                conversationId: conversation.id,
                senderId: adminId,
                content: content
            });

            
            await NotificationDao.createNotification({
                userId: user.id,
                senderId: adminId,
                type: 'Sistem',
                content: `Admin: ${content.substring(0, 30)}...`,
                link: `/chat/inbox/${conversation.id}`
            });

           
            if (io) {
                const payload = { conversationId: conversation.id, content, senderId: adminId };
                io.to(`user_${user.id}`).emit('updateNotification', payload);
                io.to(`user_${user.id}`).emit('systemNotification', {
                    title: "Poruka od administracije",
                    content: content
                });
            }
        }
        return users.length;
    }
};