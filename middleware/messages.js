const messageService = require("../services/messageService");
const withTiming = require("./timingHelper");

const messageCount = withTiming("messageCount", async (req, res, next) => {
    try {
        if (!req.user) {
            res.locals.messageCount = 0;
            return next();
        }
        const numberOfMessages = await messageService.getUserMessagesCount(req.user.id);
        res.locals.messageCount = numberOfMessages || 0;
        return next();
    } catch (error) {
        res.locals.messageCount = 0;
        return next();
    }
});

module.exports = messageCount;