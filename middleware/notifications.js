const notificationService = require('../services/NotificationService');

module.exports = async (req, res, next) => {

    if(!req.user){
        res.locals.notifications = [];
        res.locals.notificationsCount = 0;
        return next();
    }

    try{
        const notifications = await notificationService.getNotifications(req.user.id);
        
        const unreadCount = notifications.filter(n => !n.isRead).length;
        res.locals.notifications = notifications;
        res.locals.notificationsCount = unreadCount;
        next();
    }catch(error){
        next();
    }
    
    

};