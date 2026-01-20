
const Book = require('../models/associations').Book;
const GenresLK = require('../models/associations').GenresLK;
const LocationsLK = require('../models/associations').LocationsLK;
const BookConditionsLK = require('../models/associations').BookConditionsLK;
const LanguagesLK = require('../models/associations').LanguagesLK;
const Users = require('../models/associations').User;
const BookRating = require('../models/associations').BookRating;




const {fn,col,Op, Sequelize} = require('sequelize');

module.exports = {

    getAllBooks(){
        return Book.findAll();
    },
   getRandomBooks() {
        return Book.findAll({
            order: Sequelize.literal('RANDOM()'), 
            limit: 12,
            include: [{
                model: GenresLK,
                as: 'genre',
                attributes: ['name'] 
            }],
            raw: true,
            nest: true
        });
    },
    getRandomBooksForBooksPage() {
        return Book.findAll({
            order: Book.sequelize.random(),
            limit: 32,
            include: [{
                model: GenresLK,
                as: 'genre'
            }],
            raw: true,
            nest: true
        });
    },
    getPopularBooks() {
        return Book.findAll({
            order: [["viewCount", 'DESC']],
            limit: 12,
            include: [{
                model: GenresLK,
                as: 'genre'
            }],
            raw: true,
            nest: true
        });
    },
    async getUserInterests(userId) {

        const user = await Users.findByPk(userId, {
            include: [{
                model: GenresLK,
                as: 'Genres',
                attributes: ['id'],
                through: { attributes: [] }
            }]
        });


        if (!user || !user.Genres || user.Genres.length === 0) {
            return [];
        }


        const preferredGenreIds = user.Genres.map(g => g.id);

        return await Book.findAll({
            where: {
                genreId: {
                    [Op.in]: preferredGenreIds
                }
            },
            include: ['genre', 'location'],
            limit: 10
        });
    },

    async findBookById(id) {
        return await Book.findByPk(id, {
        include: [
            { model: Users, as: 'seller' },
            { model: GenresLK, as: 'genre' },
            { model: LanguagesLK, as: 'language' },
            { model: BookConditionsLK, as: 'condition' },
            { model: LocationsLK, as: 'location' },
           
            {
                model: BookRating,
                as: 'bookReviews',
                include: [
                    {
                        model: Users,
                        as: 'reviewer',
                        attributes: ['firstName', 'lastName', 'profileImage']
                    }
                ]
            }
        ]
    });
    },
    getAllGenres() {
        return GenresLK.findAll();
    },
    getAllLocations() {
        return LocationsLK.findAll();
    },
    getAllConditions() {
        return BookConditionsLK.findAll();
    },
    getAllLanguages() {
        return LanguagesLK.findAll();
    },

    createBook(bookData) {
        return Book.create({
            title: bookData.title,
            author: bookData.author,
            description: bookData.description,
            price: bookData.price,
            imageUrl: bookData.imageUrl,
            isForExchange: bookData.isForExchange || false,
            genreId: bookData.genreId,
            locationId: bookData.locationId,
            conditionId: bookData.conditionId,
            languageId: bookData.languageId,
            sellerId: bookData.sellerId

        });
    },

    async incrementBookViewCount(bookId) {

        return await Book.increment('viewCount', {
            by: 1,
            where: { id: bookId }
        });
    },

    async updateBook(bookId, bookData) {
        const book = await Book.findByPk(bookId);
        if (!book) {
            throw new Error('Knjiga nije pronađena.');
        }


        const updateFields = {
            title: bookData.title,
            author: bookData.author,
            description: bookData.description,
            price: bookData.price,
            genreId: bookData.genreId,
            locationId: bookData.locationId,
            conditionId: bookData.conditionId,
            languageId: bookData.languageId,
            status: bookData.status
        };


        if (bookData.imageUrl) {
            updateFields.imageUrl = bookData.imageUrl;
        }

        return await book.update(updateFields);
    },

    async getBooks(whereClause, orderClause) {
        return await Book.findAll({
            where: whereClause,
            order: orderClause,
            include: [{ all: true }]
        });
    },
    async updateBookStatus(bookId, status) {
        return await Book.update({
            status: status
        }, {
            where: { id: bookId }
        });
    },






    async updateBookAvgRating(bookId) {

        const result = await BookRating.findOne({
            where: { bookId: bookId },
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('value')), 'avgScore']
            ],
            raw: true
        });


        const newAvgRating = result && result.avgScore ? parseFloat(result.avgScore).toFixed(1) : 0;


        return await Book.update({
            averageRating: newAvgRating
        }, {
            where: { id: bookId }
        });
    },

    async deleteBook(bookId) {
        return await Book.update(
            {
                status: 'Arhivirano'
            }, {
            where: { id: bookId }
        }
        );
    },
    async createGenre(genreData){
        return await GenresLK.create({
            name: genreData
        });
    },
    async createLanguage(languageData){
        return await LanguagesLK.create({
            name: languageData
        });
    },
    async createLocation(locationData){
        return await LocationsLK.create({
            name: locationData
        });
    },
    async createCondition(conditionData){
        return await BookConditionsLK.create({
            name: conditionData
        });
    },
    async deleteGenre(id){
        return await GenresLK.destroy({
            where: { id: id }
        });
    },
    async deleteLanguage(id){
        return await LanguagesLK.destroy({
            where: { id: id }
        });
    },
    async deleteLocation(id){
        return await LocationsLK.destroy({
            where: { id: id }
        });
    },
    async deleteCondition(id){
        return await BookConditionsLK.destroy({
            where: { id: id }
        });
    },
    async updateGenre(id, data){
        return await GenresLK.update({
            name: data.name
        }, {
            where: { id: id }
        });
    },
    async updateLanguage(id, data){
        return await LanguagesLK.update({
            name: data.name
        }, {
            where: { id: id }
        });
    },
    async updateLocation(id, data){
        return await LocationsLK.update({
            name: data.name
        }, {
            where: { id: id }
        });
    },
    async updateCondition(id, data){
        return await BookConditionsLK.update({
            name: data.name
        }, {
            where: { id: id }
        });
    },
    async avgBooksPerSeller(){
        const totalBooks = await Book.count();
        const totalSellers = await Users.count({
            where: { role: 'Prodavač' }
        });

        if(totalSellers === 0){
            return 0;
        }
        return totalBooks / totalSellers;
    },

   async getPopularGenres() {
    return await Book.findAll({
        attributes: [
            'genreId',
            [fn('COUNT', col('Book.id')), 'bookCount']
        ],
        where: {
            genreId: { [Op.ne]: null }
        },
        include: [{
            model: GenresLK,
            as: 'genre',     
            attributes: ['name']
        }],
        group: ['genreId', 'genre.id'], 
        order: [[fn('COUNT', col('Book.id')), 'DESC']],
        limit: 5,
        raw: true,
        nest: true
    });
}


};