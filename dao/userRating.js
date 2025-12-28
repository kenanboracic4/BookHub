const UserRating = require('../models/associations').UserRating;

module.exports = {
    async rateUser(userId, rating, raterId) {
        return await UserRating.create({
            userId: userId,
            raterId: raterId,
            stars: rating
        });
    }
}