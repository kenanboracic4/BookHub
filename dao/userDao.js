const { where } = require('sequelize');


const languageLK = require('../models/associations').LanguagesLK;
const genresLK = require('../models/associations').GenresLK;
const Users = require('../models/associations').User;
const Book = require('../models/associations').Book;
const UserRating = require('../models/associations').UserRating;
const locationsLK = require('../models/associations').LocationsLK;

const { Op, Sequelize } = require('sequelize');
module.exports = {

    getAllGenres() {
        return genresLK.findAll();
    },
    getAllLanguages() {
        return languageLK.findAll();
    },
    getAllLocations() {
        return locationsLK.findAll();
    },

    async findUserByEmail(email) {
        return Users.findOne({ where: { email } });
    },

    async findUserDataById(id) {
        return Users.findOne({
            where: { id },
            include: [
                { model: genresLK, as: 'Genres', through: { attributes: [] } },
                { model: languageLK, as: 'Languages', through: { attributes: [] } },
                { model: locationsLK, as: 'location' }

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

    async getUserBooks(id, filters = {}) {
        const { status, date, price, title } = filters;
        let whereClause = { sellerId: id };


        if (status && status !== 'all') {
            whereClause.status = (status === 'prodato') ? 'Prodano' : 'Aktivno';
        }

        let orderClause = [];


        if (price) {
            orderClause.push(['price', price === 'price-asc' ? 'ASC' : 'DESC']);
        }
        else if (title) {
            orderClause.push(['title', title === 'title-asc' ? 'ASC' : 'DESC']);
        }
        else if (date) {
            orderClause.push(['createdAt', date === 'date-asc' ? 'ASC' : 'DESC']);
        }
        else {

            orderClause.push(['createdAt', 'DESC']);
        }

        return await Book.findAll({
            where: whereClause,
            order: orderClause
        });
    },

    async updateUser(userId, updateData, genreIds, languageIds) {
        const user = await Users.findByPk(userId);
        if (!user) throw new Error('Korisnik nije pronađen');


        await user.update(updateData);


        if (genreIds) await user.setGenres(genreIds);
        if (languageIds) await user.setLanguages(languageIds);

        return user;
    },

    async updateUserRole(userId) {
        const user = await Users.findByPk(userId);

        return await user.update({
            role: "Prodavač"
        })
    },

    async updateUserRating(userId) {
        const result = await UserRating.findOne({
            where: { userId: userId },
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgScore']
            ],
            raw: true
        });

        const newAvgRating = result && result.avgScore ? parseFloat(result.avgScore).toFixed(1) : 0;

        return await Users.update({
            averageRating: newAvgRating
        }, {
            where: { id: userId }
        })
    },

    async getAllUsers() {
        return Users.findAll({
            where: {
                role: {
                    [Op.in]: ["Prodavač", "Kupac"]
                }
            }
        });
    },
    async archiveUser(userId) {
        return await Users.update(
            { status: 'Arhiviran' },
            {
                where: {
                    id: userId
                }
            }
        );
    },
    async findAllExcept(adminId) {
        return await Users.findAll({
            where: {
                id: { [Op.ne]: adminId }
            }
        });
    }


};