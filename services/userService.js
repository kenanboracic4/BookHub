const userDao = require('../dao/userDao');

module.exports = {

    async getLKDataForRegister(){

        const [genres, languages] = await Promise.all([
            userDao.getAllGenres(),
            userDao.getAllLanguages()
        ]);

        return {
            genres,
            languages
        };
    }
};