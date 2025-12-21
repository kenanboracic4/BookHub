const Book = require('../models/tables/Book');


module.exports = {

    getRandomBooks(){
        return Book.findAll(
            { order: Book.sequelize.random(),
              limit: 6
            }
        );
    }

};