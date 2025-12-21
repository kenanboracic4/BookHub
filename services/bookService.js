const bookDao = require('../dao/bookDao');

module.exports = {

    async getHomePageBooks() {
        const books = await bookDao.getRandomBooks();
        return books;
    }

};