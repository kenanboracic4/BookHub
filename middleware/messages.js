const messageService = require('../services/messageService');

module.exports = async (req, res, next) => {
    try{
        if(!req.user){
            res.locals.messageCount = 0;
            return next();
        }

        const numberOfMessages = await messageService.getUserMessagesCount(req.user.id);
        res.locals.messageCount = numberOfMessages;
        console.log(numberOfMessages);
        return next();
    }catch(error){
        console.error(error);
    }
}