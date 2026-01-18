const Conversation = require('../models/associations').Conversation;
const Book = require('../models/associations').Book;
const User = require('../models/associations').User;
const Message = require('../models/associations').Messages;
const { Op } = require('sequelize');

module.exports = {

    async getConversation(buyerId, sellerId, bookId) {
        return await Conversation.findOne({
            where: { buyerId, sellerId, bookId }
        });
    },

    async createConversation(buyerId, sellerId, bookId) {
        return await Conversation.create({ buyerId, sellerId, bookId });
    },

    async getConversationById(id) {
        return await Conversation.findByPk(id, {
            include: [
                { model: Book, as: 'book', attributes: ['id', 'title', 'price', 'imageUrl'] },
                { model: User, as: 'buyer', attributes: ['id', 'firstName', 'lastName', 'profileImage'] },
                { model: User, as: 'seller', attributes: ['id', 'firstName', 'lastName', 'profileImage'] }
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
            attributes: ['id', 'updatedAt', 'bookId', 'buyerId', 'sellerId'], 
            include: [
                { 
                    model: Book, 
                    as: 'book', 
                    attributes: ['title'] 
                },
                { 
                    model: User, 
                    as: 'buyer', 
                    attributes: ['firstName', 'lastName', 'profileImage'] 
                },
                { 
                    model: User, 
                    as: 'seller', 
                    attributes: ['firstName', 'lastName', 'profileImage'] 
                }
            ],
            order: [['updatedAt', 'DESC']]
        });
    },

    async markConversationAsRead(conversationId, userId) {
    // Fire and forget - Ne stavljamo 'await' ispred, neka radi u pozadini
    // Pazi: userId je onaj KOJI ČITA (tvoj ID), pa setujemo isRead=true porukama gdje TI nisi pošiljalac
    Message.update({ isRead: true }, {
        where: { 
            conversationId: conversationId,
            senderId: { [Op.ne]: userId }, // Ne označavaj svoje poruke kao pročitane (ionako su pročitane)
            isRead: false 
        }
    }).catch(err => console.error(err));
},

    async findOrCreateSystemConversation(userId, adminId) {
        return await Conversation.findOrCreate({
            where: {
                [Op.or]: [
                    { buyerId: userId, sellerId: adminId },
                    { buyerId: adminId, sellerId: userId }
                ],
                bookId: null 
            },
            defaults: { buyerId: userId, sellerId: adminId, bookId: null }
        });
    }
};