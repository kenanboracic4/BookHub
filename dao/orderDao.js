const { Order, OrderItem, Cart, Book, User} = require('../models/associations');

module.exports = {
    async createOrder(orderData, transaction) {
        return await Order.create(orderData, { transaction });
    },

    async createOrderItems(items, transaction) {
        
        return await OrderItem.bulkCreate(items, { transaction });
    },

    async clearUserCart(userId, transaction) {
        return await Cart.destroy({
            where: { userId: userId },
            transaction
        });
    },

    async getOrderItems(orderId){
        return await OrderItem.findAll({
            where: { orderId: orderId }
        })
    },

    async getPurchasesWithItems(userId) {
    return await Order.findAll({
        where: { buyerId: userId },
        include: [
            {
                model: OrderItem,
                as: 'items', 
                include: [
                    { 
                        model: Book, 
                        as: 'book' 
                    }
                ]
            },
            {
                model: User,
                as: 'seller', 
                attributes: ['firstName', 'lastName', 'email']
            }
        ],
        order: [['createdAt', 'DESC']]
    });
},
async getSalesWithItems(userId) {
    try {
        return await Order.findAll({
            where: { sellerId: userId },
            include: [
                {
                    model: OrderItem,
                    as: 'items', 
                    include: [
                        { 
                            model: Book, 
                            as: 'book' 
                        }
                    ]
                },
                {
                    model: User,
                    as: 'buyer', 
                    attributes: ['firstName', 'lastName', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
    } catch (error) {
        throw error;
    }
},

async acceptOrder(orderId, userId) {
    return await Order.update(
        { status: 'PRIHVAĆENO' },
        { 
            where: { 
                id: orderId, 
                sellerId: userId 
            } 
        } 
    );
},
async rejectOrder(orderId, userId) {
    return await Order.update(
        { status: 'ODBIJENO' },
        { 
            where: { 
                id: orderId, 
                sellerId: userId
            } 
        } 
    );
},
async cancelOrder(orderId, userId) {
    return await Order.update(
        { status: 'OTKAZANO' },
        { 
            where: { 
                id: orderId, 
                buyerId: userId
            } 
        } 
    );
},
async finishOrder(orderId){
    return await Order.update(
        { status: 'ZAVRŠENO' },
        { 
            where: { 
                id: orderId
            } 
        } 
      );
},
async updateOrderItem(bookId,  bookRating){
    return await OrderItem.update(
        { isRated: bookRating },
        { 
            where: { 
                bookId: bookId,
            } 
        }
        );
}

};