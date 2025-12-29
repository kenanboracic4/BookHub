const notificationService = require('../services/NotificationService');

module.exports = {

    async readNotification(req,res){
        try{
            const notifId = req.params.id;

            await notificationService.readNotification(notifId);
            res.status(200).json({message:'Notifikacija pročitana'});
        }
        catch(error){
            res.status(500).json({message:'Greška prilikom čitanja notifikacije'});
        }
    }

}