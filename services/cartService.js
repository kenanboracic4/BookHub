const cartDao = require('../dao/cartDao');
const bookDao = require('../dao/bookDao');
module.exports = {


    async bookAlreadyInCart(bookId, userId){
        return await cartDao.bookAlreadyInCart(bookId, userId);
    },

    async addToCart(bookId, userId){
         const book = await bookDao.findBookById(bookId);
        if(book.sellerId == userId){
            throw new Error('Ne možete kupiti svoju knjigu!')
        }

        return await cartDao.addToCart(bookId, userId);
    },

    async getCartCount(userId){
        return await cartDao.getCartCount(userId);
    },

    async getCartItems(userId){
        return await cartDao.getCartItems(userId);
    },
    async deleteCartItem(userId, bookId){
        
        await cartDao.deleteCartItem(userId, bookId);
      
        return await cartDao.getCartCount(userId);

    }
}