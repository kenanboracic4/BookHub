
const languageLK = require('../models/associations').LanguagesLK;
const genresLK = require('../models/associations').GenresLK;
const Users = require('../models/associations').User;

module.exports = {

    getAllGenres() {
        return genresLK.findAll();
    },
    getAllLanguages() {
        return languageLK.findAll();
    },

    async findUserByEmail(email) {
        return Users.findOne({ where: { email } });
    },

    async createUser(userData) {

        const user = await Users.create(
            {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password
            }

        )

        if (userData.genreIds && userData.genreIds.length > 0) {
            await user.setGenres(userData.genreIds);
        }

        if (userData.languageIds && userData.languageIds.length > 0) {
            await user.setLanguages(userData.languageIds);
        }
        return user;
    }
};