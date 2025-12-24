
const Book = require('../models/associations').Book;
const GenresLK = require('../models/associations').GenresLK;
const LocationsLK = require('../models/associations').LocationsLK;
const BookConditionsLK = require('../models/associations').BookConditionsLK;
const LanguagesLK = require('../models/associations').LanguagesLK;
const Users = require('../models/associations').User;

module.exports = {

    getRandomBooks(){
        return Book.findAll({
            order: Book.sequelize.random(),
              limit: 6,
             include: [{
                model: GenresLK,
                as: 'genre'
            }],
            raw: true,
        nest: true
            }
        );
    },
    findBookById(id) {
        return Book.findByPk(id, {
            include: [{
                model: GenresLK,
                as: 'genre'
            },
            {
                model: LocationsLK,
                as: 'location'
            },
            {
                model: BookConditionsLK,
                as: 'condition'
            },
            {
                model: LanguagesLK,
                as: 'language'
            },{
                model: Users,
                as: 'seller'
            }
        ],
        }
        );
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

    async incrementBookViewCount(bookId){
       
        return await Book.increment('viewCount',{
            by: 1,
            where: {id: bookId}
        });
    },

    async updateBook(bookId, bookData) {
    const book = await Book.findByPk(bookId);
    if (!book) {
        throw new Error('Knjiga nije pronađena.');
    }

    // Kreiramo objekt za update
    const updateFields = {
        title: bookData.title,
        author: bookData.author,
        description: bookData.description,
        price: bookData.price,
        genreId: bookData.genreId,
        locationId: bookData.locationId,
        conditionId: bookData.conditionId,
        languageId: bookData.languageId
    };

    // Ako u bookData postoji nova slika, dodaj je u polja za update
    if (bookData.imageUrl) {
        updateFields.imageUrl = bookData.imageUrl;
    }

    return await book.update(updateFields);
}

};