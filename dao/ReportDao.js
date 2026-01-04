const Report = require("../models/associations").Report;
const User = require("../models/associations").User;
const Book = require("../models/associations").Book;

module.exports = {
    async findById(id) {
        return await Report.findByPk(id);
    },
    async findAll() {
        return await Report.findAll();
    },

    async deleteReport(id) {
        return await Report.destroy({ where: { id } });
    },

    async banUser(userId) {
        return await User.update({ isBanned: true }, { where: { id: userId } });
    },

    async deleteBook(bookId) {
        return await Book.destroy({ where: { id: bookId } });
    },
    async createReport(reportData) {
        return await Report.create(reportData);
    },
    async getAllPendingReports() {
    return await Report.findAll({
        where: { status: 'NA ČEKANJU' },
        include: [
            { 
                model: User, 
                as: 'reporter', 
                attributes: ['firstName', 'lastName'] 
            },
            { 
                model: User, 
                as: 'reportedUser', // Mora se podudarati s relacijom u models/index.js
                attributes: ['firstName', 'lastName'],
                required: false 
            },
            { 
                model: Book, 
                as: 'reportedBook', // Mora se podudarati s relacijom u models/index.js
                attributes: ['title'],
                required: false 
            }
        ],
        order: [['createdAt', 'DESC']]
    });
}
};