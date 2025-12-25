var express = require('express');
var router = express.Router();
const cartController = require('../controllers/cartController');
const verifyToken = require('../middleware/auth').verifyToken;

router.get('/items',verifyToken,cartController.getCartItems);

router.post('/add/:bookId',verifyToken,cartController.addToCart);

router.delete('/delete/:bookId',verifyToken,cartController.deleteCartItem);

module.exports = router;
