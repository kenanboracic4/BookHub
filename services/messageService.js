const messageDao = require('../dao/MessageDao.js');

module.exports = {

    async getMessages(conversationId){
        return await messageDao.getMessages(conversationId);
    }

};