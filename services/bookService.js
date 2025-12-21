const bookDao = require('../dao/bookDao');

module.exports = {

    async getHomePageBooks() {
        const books = await bookDao.getRandomBooks();
        return books;
    },

    async getBookById(id) {
        const book = await bookDao.findBookById(id);
        return book;
    },

    async getAllLookupData(){
        const [genres, locations, conditions, languages] = await Promise.all([
            bookDao.getAllGenres(),
            bookDao.getAllLocations(),
            bookDao.getAllConditions(),
            bookDao.getAllLanguages()
        ]);
        return { genres, locations, conditions, languages };
    }

};