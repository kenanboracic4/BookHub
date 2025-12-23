const userDao = require('../dao/userDao');
const bcrypt = require("bcrypt");
const saltRound = 10;


module.exports = {

    async getLKDataForRegister() {

        const [genres, languages] = await Promise.all([
            userDao.getAllGenres(),
            userDao.getAllLanguages()
        ]);

        return {
            genres,
            languages
        };
    },


    async registerUser(userData) {

        const exsistingUser = await userDao.findUserByEmail(userData.email);
        if (exsistingUser) {
            throw new Error('Korisnik sa unesenim emailom već postoji.');
        }

        if (!userData.firstName.trim() || !userData.lastName.trim() || !userData.email.trim() || !userData.password.trim()) {
            throw new Error('Uneseni podaci su neispravni');
        }

        const hashedPassword = await bcrypt.hash(userData.password, saltRound);

        const newUser = await userDao.createUser({
            firstName: userData.firstName.trim(),
            lastName: userData.lastName.trim(),
            email: userData.email.trim(),
            password: hashedPassword,
            genreIds: userData.genreIds,
            languageIds: userData.languageIds
        });

        return newUser;
    },

    async loginUser(email, password) {
        const user = await userDao.findUserByEmail(email);
        if (!user) {
            throw new Error('Email nije pronađen.');
        }

        const MatchedPassword = await bcrypt.compare(password, user.password);

        if (!MatchedPassword) {
            throw new Error('Lozinka nije tačna.');
        }

        return user;
    },

    async findUserDataById(id) {

        return await userDao.findUserDataById(id);
    },

    async getUserBooks(id){

        return await userDao.getUserBooks(id);
    },

    async getAllGenres() {
        return userDao.getAllGenres();
    },

    async getAllLanguages() {
        return userDao.getAllLanguages();
    }

};