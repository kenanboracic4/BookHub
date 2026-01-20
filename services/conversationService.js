const convesationDao = require('../dao/ConversationDao.js');

module.exports = {

    async getConversation(buyerId,sellerId, bookId){
        return await convesationDao.getConversation(buyerId,sellerId, bookId);
    },
    async createConversation(buyerId,sellerId, bookId){
        return await convesationDao.createConversation(buyerId,sellerId, bookId);
    },
    async getConversationById(conversationId){
        return await convesationDao.getConversationById(conversationId);
    },
    async getAllConversations(id){
        return await convesationDao.getAllConversations(id); 
    },
    async markConversationAsRead(conversationId, userId){
        return await convesationDao.markConversationAsRead(conversationId, userId);
    },


};