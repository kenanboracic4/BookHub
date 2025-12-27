const Cart = require('../models/associations').Cart;
const Book = require('../models/associations').Book;

module.exports = {
    async bookAlreadyInCart(bookId, userId){
        return await Cart.findAll({
            where : {
                userId: userId,
                bookId: bookId
            }
        })
    },

    async addToCart(bookId, userId){
       
        return await Cart.create({
            userId: userId,
            bookId: bookId
        })
    },

    async getCartCount(userId){
        return await Cart.count({
            where : {
                userId: userId
            }
        })
    },

    async getCartItems(userId){
        return Cart.findAll({
            where: {
                userId: userId
            },
            include: [
                { model: Book ,
                    
                    attributes : ["id","title","price","imageUrl","sellerId"]
                }
                
            ]
        })
    },

    async deleteCartItem(userId, bookId){
    
        return await Cart.destroy({
            where:{
                userId: userId,
                bookId: bookId
            }
        })
    }
}