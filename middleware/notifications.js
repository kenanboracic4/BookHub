const notificationService = require("../services/NotificationService");
const withTiming = require("./timingHelper"); // Ovo ti je falilo!

const notifications = withTiming("notifications", async (req, res, next) => {
    try {
        if (!req.user) {
            res.locals.notifications = [];
            res.locals.notificationsCount = 0;
            return next();
        }
        const list = await notificationService.getNotifications(req.user.id);
        const unreadCount = list ? list.filter((n) => !n.isRead).length : 0;
        
        res.locals.notifications = list || [];
        res.locals.notificationsCount = unreadCount;
        return next();
    } catch (error) {
        res.locals.notifications = [];
        res.locals.notificationsCount = 0;
        return next();
    }
});

module.exports = notifications;