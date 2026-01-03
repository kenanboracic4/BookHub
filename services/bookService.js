const bookDao = require('../dao/bookDao');
const userDao = require('../dao/userDao');

const { Op } = require('sequelize');

module.exports = {

    async getHomePageBooks() {
        const books = await bookDao.getRandomBooks();
        return books;
    },
    async getBooksForBooksPage() {
        const books = await bookDao.getRandomBooksForBooksPage();
        return books;
    },
    async getPopularBooks() {
        return await bookDao.getPopularBooks();
    },
    async getUserInterests(userId) {
        return await bookDao.getUserInterests(userId);
    },


    async getBookById(id) {
        const book = await bookDao.findBookById(id);
        console.log("book:", JSON.stringify(book));
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
            !bookData.description || !bookData.description.trim() || !bookData.status) {
            throw new Error('Nedostaju obavezna polja za ažuriranje knjige.');
        }
        return await bookDao.updateBook(bookId, bookData);


    },

    async filteredBooks(query) {
        const { q, price_min, price_max, sort, location, genre, condition, language } = query;

        let whereClause = {};
        let orderClause = [['createdAt', 'DESC']];


        if (q) {
            whereClause.title = { [Op.iLike]: `%${q}%` };
        }


        if (price_min || price_max) {
            whereClause.price = {};
            if (price_min) whereClause.price[Op.gte] = price_min;
            if (price_max) whereClause.price[Op.lte] = price_max;
        }


        if (location) whereClause.locationId = location;
        if (genre) whereClause.genreId = genre;
        if (condition) whereClause.conditionId = condition;
        if (language) whereClause.languageId = language;


        if (sort) {
            if (sort === 'price_asc') orderClause = [['price', 'ASC']];
            if (sort === 'price_desc') orderClause = [['price', 'DESC']];
            if (sort === 'oldest') orderClause = [['createdAt', 'ASC']];
        }


        return await bookDao.getBooks(whereClause, orderClause);
    },
    async getAverageRating(bookId) {
        console.log(bookId);
        return await bookDao.getAverageRating(bookId);
    },
    async updateBookRating(bookId, averageRating) {
        return await bookDao.updateBookRating(bookId, averageRating);
    },

    async deleteBook(bookId){
        return await bookDao.deleteBook(bookId);
    },
    async createGenre(genreData){
        return await bookDao.createGenre(genreData);
    },
    async createLanguage(languageData){
        return await bookDao.createLanguage(languageData);
    },
    async createLocation(locationData){
        return await bookDao.createLocation(locationData);
    },
    async createCondition(conditionData){
        return await bookDao.createCondition(conditionData);
    },
    async deleteCatalog(type, id){
        if(type === 'genre'){
            return await bookDao.deleteGenre(id);
        }else if(type === 'language'){
            return await bookDao.deleteLanguage(id);
        }else if(type === 'location'){
            return await bookDao.deleteLocation(id);
        }else if(type === 'condition'){
            return await bookDao.deleteCondition(id);
        }
    },
    async updateCatalog(type, id, data){
        if(type === 'genre'){
            return await bookDao.updateGenre(id, data);
        }else if(type === 'language'){
            return await bookDao.updateLanguage(id, data);
        }else if(type === 'location'){
            return await bookDao.updateLocation(id, data);
        }else if(type === 'condition'){
            return await bookDao.updateCondition(id, data);
        }
    }
};