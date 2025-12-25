const bookDao = require('../dao/bookDao');
const userDao = require('../dao/userDao');

module.exports = {

    async getHomePageBooks() {
        const books = await bookDao.getRandomBooks();
        return books;
    },

    async getBookById(id) {
        const book = await bookDao.findBookById(id);
        return book;
    },

    async getAllLookupData() {
        const [genres, locations, conditions, languages] = await Promise.all([
            bookDao.getAllGenres(),
            bookDao.getAllLocations(),
            bookDao.getAllConditions(),
            bookDao.getAllLanguages()
        ]);
        return { genres, locations, conditions, languages };
    },

    async addBook(bookData) {

        if (!bookData.title || !bookData.author || !bookData.description) {
            throw new Error('Nedostaju obavezna polja za dodavanje knjige.');
        }

        

        if (bookData.price < 0) {
            throw new Error('Cijena knjige ne može biti negativna.');
        }

        const newBook = await bookDao.createBook(bookData);
        return newBook;
    },


    async incrementBookViewCount(bookId) {
        return await bookDao.incrementBookViewCount(bookId);
    },

    async getAllGenres() {
        return await bookDao.getAllGenres();
    },

    async getAllLocations() {
        return await bookDao.getAllLocations();
    },

    async getAllConditions() {
        return await bookDao.getAllConditions();
    },

    async getAllLanguages() {
        return await bookDao.getAllLanguages();
    },

    async updateBook(bookId, bookData) {

        if (isNaN(bookData.price) || parseFloat(bookData.price) < 0) {
            throw new Error('Cijena knjige ne moze biti negativna.');
        }

        if (!bookData.title || !bookData.title.trim() ||
            !bookData.author || !bookData.author.trim() ||
            !bookData.description || !bookData.description.trim()) {
            throw new Error('Nedostaju obavezna polja za ažuriranje knjige.');
        }
        return await bookDao.updateBook(bookId, bookData);


    }
};