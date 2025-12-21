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
    }
};