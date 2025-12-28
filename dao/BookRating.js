const BookRating = require('../models/associations').BookRating;

module.exports = {
    async rateBook(bookId, rating, userId, comment) {
        return await BookRating.create({
            bookId: bookId,
            userId: userId,
            value: rating,
            comment: comment
        })
    },
    
    async getAverageRating(bookId) {
   const result = await BookRating.aggregate('value', 'AVG', {
        where: { bookId: bookId },
        raw : true
    });
    
    
    return result && result.average ? parseFloat(result.average).toFixed(1) : "0";
}
}