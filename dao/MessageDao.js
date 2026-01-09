const Message = require('../models/associations').Messages;
const User = require('../models/associations').User;
const Conversation = require('../models/associations').Conversation;
const { Op } = require('sequelize');

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
            senderId: { [Op.ne]: userId }, 
            isRead: false
        },
        include: [{
            model: Conversation,
            as: 'conversation',
            where: {
                [Op.or]: [
                    { buyerId: userId },
                    { sellerId: userId }
                ]
            }
        }],
        distinct: true,
        col: 'conversationId'
    });
}

};