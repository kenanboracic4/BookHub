const Conversation = require('../models/associations').Conversation;
const Book = require('../models/associations').Book;
const User = require('../models/associations').User;
const Message = require('../models/associations').Messages;

const { Op } = require('sequelize');

module.exports = {

    async getConversation(buyerId, sellerId, bookId) {
        return await Conversation.findOne({
            where: {
                buyerId: buyerId,
                sellerId: sellerId,
                bookId: bookId
            }
        });
    },
    async createConversation(buyerId, sellerId, bookId) {
        return await Conversation.create({
            buyerId: buyerId,
            sellerId: sellerId,
            bookId: bookId
        });
    },
    async getConversationById(id) {
        return await Conversation.findByPk(id, {
            include: [
                { model: Book, as: 'book', attributes: ['title', 'price'] },
                { model: User, as: 'buyer', attributes: ['firstName', 'lastName'] },
                { model: User, as: 'seller', attributes: ['firstName', 'lastName'] }
            ]
        });
    },
   async getAllConversations(userId) {
    return await Conversation.findAll({
        where: {
            [Op.or]: [
                { buyerId: userId },
                { sellerId: userId }
            ]
        },
        include: [
            { model: Book, as: 'book', attributes: ['title', 'price'] },
            { model: User, as: 'buyer', attributes: ['firstName', 'lastName'] },
            { model: User, as: 'seller', attributes: ['firstName', 'lastName'] },
            // DODANO OVO: Uključujemo poruke da vidimo ima li nepročitanih
            { 
                model: Message,
                as: 'messages',
                required: false, // Left join (da vrati konverzaciju iako nema nepročitanih poruka)
                where: {
                    isRead: false,          // Samo nepročitane
                    senderId: { [Op.ne]: userId } // Koje NIJE poslao trenutni user
                }
            }
        ],
        order: [['updatedAt', 'DESC']]
    });
},
    async markConversationAsRead(cconversationId) {
        return await Message.update({
            isRead: true
        }, {
            where: {
                conversationId: cconversationId
                // senderId: { [Op.ne]: currentUserId }
            }
        })
    }




};