const Message = require('../models/associations').Messages;
const User = require('../models/associations').User;

module.exports = {

    async getMessages(conversationId){
        return await Message.findAll({
            where: {
                conversationId: conversationId
            },
            order: [
                ['createdAt', 'ASC']
            ],
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['firstName', 'lastName', 'profileImage']
                }
            ]
        });
    },
    async create(data){
        return await Message.create(data);
    },
    async getUserMessagesCount(userId) {
    return await Message.count({
        where: {
            senderId: userId, // Obično brojimo poruke koje je korisnik PRIMIO, a ne poslao
            isRead: false
        },
        col: 'conversationId', // Brojimo unikatne ID-ove konverzacija
        distinct: true
    });
}

};