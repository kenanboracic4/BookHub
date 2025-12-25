var express = require('express');
var router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/items',cartController.getCartItems);

router.post('/add/:bookId',cartController.addToCart);

module.exports = router;
