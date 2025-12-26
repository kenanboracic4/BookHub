const bookService = require('../services/bookService');

module.exports = async (req, res, next) => {

    try{
        const LKData = await bookService.getAllLookupData();
        res.locals.locations = LKData.locations;
        res.locals.genres = LKData.genres;
        res.locals.conditions = LKData.conditions;
        res.locals.languages = LKData.languages;
        next();
    }catch(error){
        res.status(500).send('Došlo je do greške.');
        next();
    }
}