const bookService = require('../services/bookService');

// Jednostavan in-memory cache
let cache = {
    data: null,
    timestamp: 0
};
const CACHE_TTL = 1000 * 60 * 60; // Keš traje 1 sat (60 minuta)

module.exports = async (req, res, next) => {
    try {
        const now = Date.now();

        // 1. Ako imamo podatke u kešu i nisu stariji od 1 sata, koristi njih!
        if (cache.data && (now - cache.timestamp < CACHE_TTL)) {
            const LKData = cache.data;
            res.locals.locations = LKData.locations;
            res.locals.genres = LKData.genres;
            res.locals.conditions = LKData.conditions;
            res.locals.languages = LKData.languages;
            return next(); // ODMAH IDI DALJE, NE DIRAJ BAZU
        }

        // 2. Ako nema keša, dohvati iz baze
        // Koristimo Promise.all u servisu, ali ovdje čekamo rezultat
        const LKData = await bookService.getAllLookupData();

        // Spasi u keš
        cache.data = LKData;
        cache.timestamp = now;

        res.locals.locations = LKData.locations;
        res.locals.genres = LKData.genres;
        res.locals.conditions = LKData.conditions;
        res.locals.languages = LKData.languages;
        
        next();
    } catch (error) {
        console.error("Greška u lkdata middleware:", error);
        // Čak i ako pukne, ne želimo da srušimo cijelu aplikaciju, samo next()
        next(); 
    }
}