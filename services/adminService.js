const ConversationDao = require('../dao/ConversationDao');
const bookDao = require('../dao/bookDao');
const UserDao = require('../dao/userDao');
const MessageDao = require('../dao/MessageDao');
const NotificationDao = require('../dao/NotificationDao');
const reportDao = require('../dao/ReportDao');

module.exports = {

    async broadcastMessage(adminId, content, io) {
        const users = await UserDao.findAllExcept(adminId);
        
        for (let user of users) {
           
            const [conversation] = await ConversationDao.findOrCreateSystemConversation(user.id, adminId);

            
            const message = await MessageDao.create({
                conversationId: conversation.id,
                senderId: adminId,
                content: content
            });

            
            await NotificationDao.createNotification({
                userId: user.id,
                senderId: adminId,
                type: 'Sistem',
                content: `Admin: ${content.substring(0, 30)}...`,
                link: `/chat/inbox/${conversation.id}`
            });

           
            if (io) {
                const payload = { conversationId: conversation.id, content, senderId: adminId };
                io.to(`user_${user.id}`).emit('updateNotification', payload);
                io.to(`user_${user.id}`).emit('systemNotification', {
                    title: "Poruka od administracije",
                    content: content
                });
            }
        }
        return users.length;
    },
    async getReports() {
        return await reportDao.getAllPendingReports();
    },
    async processReport(id, action) {
        const report = await reportDao.findById(id);
        
        if (!report) {
            throw new Error('REPORT_NOT_FOUND');
        }

        // Izvršavanje sankcije ako je akcija 'action'
        if (action === 'action') {
            if (report.type === 'KORISNIK') {
                await reportDao.banUser(report.targetId);
            } else if (report.type === 'KNJIGA') {
                await reportDao.deleteBook(report.targetId);
            }
        }

        // Brisanje prijave (za oba slučaja: dismiss i action)
        await reportDao.deleteReport(id);

        return {
            success: true,
            message: action === 'dismiss' ? 'Prijava odbačena.' : 'Sankcija izvršena.'
        };
    },
   async createReport(reportData) {
    // Možeš dodati validaciju ovdje (npr. da korisnik ne može prijaviti sam sebe)
    if (reportData.reporterId == reportData.targetId) {
        throw new Error("Ne možete prijaviti sami sebe.");
    }
    return await reportDao.createReport(reportData);
}
};