

const languageLK = require('../models/associations').LanguagesLK;
const genresLK = require('../models/associations').GenresLK;
const Users = require('../models/associations').User;
const Book = require('../models/associations').Book;

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

    async findUserDataById(id) {
        return Users.findOne({
            where: { id },
            include: [
                { model: genresLK, as: 'Genres', through: { attributes: [] } },
                { model: languageLK, as: 'Languages', through: { attributes: [] } }
            ]
        })
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
    },

    async getUserBooks(id) {
        return await Book.findAll({
            where: { sellerId: id }
        })
    },

    async updateUserProfile(userData, genreIds, languageIds) {

        const user = await Users.findByPk(userData.id);

        if (!user) throw new Error('Korisnik nije pronađen');


        await user.update({
            status: userData.status,
            role: userData.role,
            bio: userData.bio
        });


        await user.setGenres(genreIds || []);
        await user.setLanguages(languageIds || []);

        return user;
    },

    async updateUserRole(userId) {
        const user = await Users.findByPk(userId);

        return await user.update({
            role: "Prodavač"
        })
    }

};