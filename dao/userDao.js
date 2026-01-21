


const languageLK = require('../models/associations').LanguagesLK;
const genresLK = require('../models/associations').GenresLK;
const Users = require('../models/associations').User;
const Book = require('../models/associations').Book;
const UserRating = require('../models/associations').UserRating;
const locationsLK = require('../models/associations').LocationsLK;
const sequelizeInstance = require('../config/db');

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
   async findUserBasicInfo(id) {
        return await Users.findByPk(id, {

            attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'status', 'blockExpiresAt'] 
        });
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
    // 1. Koristimo 'sequelizeInstance' koji si uvezao na vrhu fajla
    const t = await sequelizeInstance.transaction();

    try {
        // 2. Pronalazimo korisnika unutar transakcije
        const user = await Users.findByPk(userId, { transaction: t });
        
        if (!user) {
            // Ako korisnik ne postoji, prekidamo i vraćamo grešku
            await t.rollback();
            throw new Error('Korisnik nije pronađen');
        }

        // 3. Ažuriramo osnovne podatke
        await user.update(updateData, { transaction: t });

        // 4. Pripremamo niz zadataka za Many-to-Many relacije
        const associationTasks = [];

        if (genreIds !== undefined) {
            associationTasks.push(user.setGenres(genreIds, { transaction: t }));
        }
        
        if (languageIds !== undefined) {
            associationTasks.push(user.setLanguages(languageIds, { transaction: t }));
        }

        // 5. Izvršavamo asocijacije paralelno radi brzine
        await Promise.all(associationTasks);

        // 6. Sve je OK, snimamo promjene trajno
        await t.commit();
        
        return user;
    } catch (error) {
        // 7. Ako bilo šta pukne, poništavamo sve promjene u bazi
        if (t) await t.rollback();
        console.error("Greška u DAO updateUser:", error);
        throw error;
    }
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
    },
    async banUser(userId, duration) {
        return await Users.update(
            { status: 'Blokiran',
            blockExpiresAt: duration
             },
            {
                where: {
                    id: userId
                }
            }
        ); 
    }
    


};