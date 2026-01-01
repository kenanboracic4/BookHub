var express = require('express');
var router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middleware/auth').verifyToken;
const authorizeRole = require('../middleware/auth').authorizeRole;

router.get('/', verifyToken,authorizeRole('Kupac'),orderController.renderOrdersPage);
router.get('/sales', verifyToken, authorizeRole('Prodavač'), orderController.renderSalesPage);
router.post('/checkout', verifyToken, orderController.checkoutOrder);
router.post('/rate', verifyToken, orderController.handleRateBookAndUser);

router.put('/accept/:orderId', verifyToken, orderController.acceptOrder);
router.put('/reject/:orderId', verifyToken, orderController.rejectOrder);
router.put('/cancel/:orderId', verifyToken, orderController.cancelOrder);
router.put('/finish/:orderId', verifyToken, orderController.finishOrder);

module.exports = router;