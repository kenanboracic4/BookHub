const bookDao = require('../dao/bookDao');

module.exports = {

    async getHomePageBooks() {
        const books = await bookDao.getRandomBooks();
        return books;
    },

    async getBookById(id) {
        const book = await bookDao.findBookById(id);
        return book;
    }

};