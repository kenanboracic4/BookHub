const cartDao = require('../dao/cartDao');
const orderDao = require('../dao/orderDao');
const sequelize = require('../config/db');
const bookDao = require('../dao/bookDao');
const userDao = require('../dao/userDao');
const bookRatingDao = require('../dao/bookRating');
const userRatingDao = require('../dao/userRating');

module.exports = {


    async createOrder(userId) {
        const sellers = {};
        const cartItems = await cartDao.getCartItems(userId);

        console.log("Broj stavki u korpi:", cartItems.length);

        if (!cartItems || cartItems.length === 0) {
            throw new Error('Korpa je prazna!');
        }

        cartItems.forEach(item => {

            const bookData = item.Book || item.book;

            if (bookData) {
                const sId = bookData.sellerId;
                if (!sellers[sId]) {
                    sellers[sId] = [];
                }
                sellers[sId].push(bookData);
            }
        });
        console.log("Sellers mapa:", JSON.stringify(sellers, null, 2));

        const t = await sequelize.transaction();
        const createdOrdersInfo = [];

        try {
            for (const sellerId in sellers) {
                const books = sellers[sellerId];


                const totalAmount = books.reduce((sum, b) => sum + parseFloat(b.price), 0);

                const newOrder = await orderDao.createOrder({
                    buyerId: userId,
                    sellerId: parseInt(sellerId),
                    orderType: 'Prodaja',
                    totalPrice: totalAmount,
                    status: 'Na čekanju'
                }, t);

                const orderItemsData = books.map(book => ({
                    orderId: newOrder.id,
                    bookId: book.id,
                    priceAtPurchase: parseFloat(book.price)
                }));

                await orderDao.createOrderItems(orderItemsData, t);

                createdOrdersInfo.push({
                    sellerId: parseInt(sellerId),
                    orderId: newOrder.id,
                    bookCount: books.length,
                    
                });
            }

            await orderDao.clearUserCart(userId, t);
            await t.commit();


            return createdOrdersInfo;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    },

    async getPurchasesWithItems(userId) {
        return orderDao.getPurchasesWithItems(userId);
    },

    async getSalesWithItems(userId) {
        return orderDao.getSalesWithItems(userId);
    },

    async acceptOrder(orderId, userId) {
        const result = await orderDao.acceptOrder(orderId, userId);

        const orderItems = await orderDao.getOrderItems(orderId);

        for (const item of orderItems) {
            await bookDao.updateBookStatus(item.bookId, 'Prodano');
        }

    },

    async rejectOrder(orderId, userId) {
        return await orderDao.rejectOrder(orderId, userId);
    },

    async cancelOrder(orderId, userId) {
        return await orderDao.cancelOrder(orderId, userId);
    },


    async RateBookAndUser(bookId, bookRating, userRating, userId, comment, sellerId) {

        await bookRatingDao.rateBook(parseInt(bookId), parseInt(bookRating), parseInt(userId), comment);
        await userRatingDao.rateUser(parseInt(sellerId), parseInt(userRating), parseInt(userId));

        await bookDao.updateBookAvgRating(bookId);
        await userDao.updateUserRating(userId);

        

        return true;
    },

    async finishOrder(orderId){
        return await orderDao.finishOrder(orderId);
    },

    async updateOrderItem(bookId,  bookRating){
        if(bookRating > 0){
            bookRating = true;
        }else{
            bookRating = false;
        }
        return await orderDao.updateOrderItem(bookId, bookRating);
    }

}