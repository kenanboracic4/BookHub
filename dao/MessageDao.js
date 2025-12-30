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
    }

};