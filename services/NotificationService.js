const notificationDao = require("../dao/NotificationDao");

module.exports = {

    async createNotification(data){
        return await notificationDao.createNotification(data);

    },
    async getNotifications(userId){
        return await notificationDao.getNotifications(userId);
    },
    async readNotification(notifId){
        return await notificationDao.readNotification(notifId);
    }
}