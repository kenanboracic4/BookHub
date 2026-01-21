const bookService = require("../services/bookService");
const withTiming = require("./timingHelper");

let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 1000 * 60 * 60; 

const lookupCache = withTiming("lookupCache", async (req, res, next) => {
    try {
        const now = Date.now();
        if (cache.data && now - cache.timestamp < CACHE_TTL) {
            const LKData = cache.data;
            res.locals.locations = LKData.locations;
            res.locals.genres = LKData.genres;
            res.locals.conditions = LKData.conditions;
            res.locals.languages = LKData.languages;
            return next();
        }

        const LKData = await bookService.getAllLookupData();
        cache.data = LKData;
        cache.timestamp = now;
        res.locals.locations = LKData.locations;
        res.locals.genres = LKData.genres;
        res.locals.conditions = LKData.conditions;
        res.locals.languages = LKData.languages;
        return next();
    } catch (error) {
        res.locals.locations = [];
        res.locals.genres = [];
        res.locals.conditions = [];
        res.locals.languages = [];
        return next();
    }
});

module.exports = lookupCache;