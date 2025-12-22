
const languageLK  = require('../models/associations').LanguagesLK;
const genresLK = require('../models/associations').GenresLK;

module.exports = {

    getAllGenres() {
        return genresLK.findAll();
    },
    getAllLanguages() {
        return languageLK.findAll();
    }
};