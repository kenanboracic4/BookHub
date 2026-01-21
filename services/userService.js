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

    async getUserBooks(id, filters = {}) {

        return await userDao.getUserBooks(id, filters);
    },
    async getBasicUser(id) {
        return await userDao.findUserBasicInfo(id);
    },

    async getAllGenres() {
        return userDao.getAllGenres();
    },

    async getAllLanguages() {
        return userDao.getAllLanguages();
    },
    async getAllLocations() {
        return userDao.getAllLocations();
    },

    async updateUserProfile(userData, genreIds, languageIds, file, location) {
        const user = await userDao.findUserDataById(userData.id);
        if (!user) throw new Error('Korisnik nije pronađen');

        let dataToUpdate = {};
        if (userData.role) dataToUpdate.role = userData.role;
        if (userData.status) dataToUpdate.status = userData.status;
        if (userData.bio !== undefined) dataToUpdate.bio = userData.bio;
        if (file) dataToUpdate.profileImage = '/uploads/' + file.filename;
        if (location) dataToUpdate.locationId = location;

        if (userData.newPassword && userData.newPassword.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            dataToUpdate.password = await bcrypt.hash(userData.newPassword, salt);
        }


        return await userDao.updateUser(userData.id, dataToUpdate, genreIds, languageIds);
    },
    async updateUserRole(userId) {
        return await userDao.updateUserRole(userId);
    },
    async getAllUsers() {
        return await userDao.getAllUsers();
    },
    async archiveUser(userId) {
        return await userDao.archiveUser(userId);
    },
    async banUser(userId, duration) {
        let block = null;
        if (duration === '15') {
            block = new Date();
            block.setDate(block.getDate() + 15);
        }
        return await userDao.banUser(userId, block);
    }

};