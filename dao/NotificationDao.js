const Notification = require("../models/tables/Notification");

module.exports = {

   async createNotification({ userId, senderId, type, content, link }) {
    return await Notification.create({
        userId,
        senderId,
        type,
        content,
        link: link || "",
        isRead: false
    });
},

async getNotifications(userId){
    return await Notification.findAll({
        where: { userId: userId },
        order: [['createdAt', 'DESC']]
    });
},
async readNotification(notifId){
    return await Notification.update(
        { isRead: true },
        { 
            where: { 
                id: notifId 
            } 
        } 
);
}

};