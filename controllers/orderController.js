const orderService = require('../services/orderService.js');
const bookService = require('../services/bookService.js');
const notificationService = require('../services/NotificationService');

module.exports = {


    async checkoutOrder(req, res) {
        try {
            const currentUserId = req.user.id; 
            const buyerName = `${req.user.firstName}`;

            const createdOrdersInfo = await orderService.createOrder(currentUserId);

            
            for (const orderInfo of createdOrdersInfo) {
                await notificationService.createNotification({
                    userId: orderInfo.sellerId, 
                    senderId: currentUserId,    
                    type: 'Narudžba',
                    content: `Korisnik ${buyerName} je naručio ${orderInfo.bookCount} knjigu/e od vas.`,
                    link: `/orders/details/${orderInfo.id}`
                });
            }

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error("Greška u checkoutOrder:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    },



    async renderOrdersPage(req, res) {

        const orders = await orderService.getPurchasesWithItems(req.user.id);

        console.log("orders:", orders);
        res.render('orders', {
            orders: orders
        });
    },

    async renderSalesPage(req, res) {
        try {
            const userId = req.user.id;
            const sales = await orderService.getSalesWithItems(userId);
            res.render('sales', { orders: sales });
        } catch (error) {

            res.status(500).send("Greška: " + error.message);
        }
    },
    async acceptOrder(req, res) {
        try {
            const orderId = req.params.orderId;
            const userId = req.user.id;

            await orderService.acceptOrder(orderId, userId);

            res.status(200).json({
                success: true,
                message: 'Narudžba uspješno prihvaćena!'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    async rejectOrder(req, res) {
        try {
            const orderId = req.params.orderId;
            const userId = req.user.id;

            await orderService.rejectOrder(orderId, userId);

            res.status(200).json({
                success: true,
                message: 'Narudžba uspješno otkazana!'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    async cancelOrder(req, res) {
        try {
            const orderId = req.params.orderId;
            const userId = req.user.id;

            await orderService.cancelOrder(orderId, userId);

            res.status(200).json({
                success: true,
                message: 'Narudžba uspješno otkazana!'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    async handleRateBookAndUser(req, res) {
        
       try{
            const userId = req.user.id;
          const {userRating, bookRating, bookComment,  bookId,sellerId} = req.body;

          await orderService.RateBookAndUser(bookId, bookRating,userRating, userId, bookComment,sellerId);
        
        await notificationService.createNotification({
            userId: sellerId,
            senderId: userId,
            type: 'Ocjena',
            content: ` Dobili ste ocjenu  ${bookRating} na Vašu knjigu`,
            link: `/books/details/${bookId}`
        })


         return res.status(200).json({
               success: true
          })
        }catch(error){
            console.log(error);
           return res.status(500).json({
               success: false,
               message: error.message
           })
       }
    },

  async finishOrder(req, res) {
    console.log("aaaa");
    try{
        const orderId = req.params.orderId;
        
        await orderService.finishOrder(orderId);
        res.status(200).json({
            success: true,
            message: 'Narudžba je završena.'
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
  }


}