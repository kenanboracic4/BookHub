const cartDao = require('../dao/cartDao');

module.exports = {


    async bookAlreadyInCart(bookId, userId){
        return await cartDao.bookAlreadyInCart(bookId, userId);
    },

    async addToCart(bookId, userId){
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
        console.log("CART ITEMS:",await cartDao.getCartItems(userId));
        return await cartDao.getCartCount(userId);

    }
}