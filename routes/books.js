var express = require('express');
var router = express.Router();

const bookController = require('../controllers/bookController');
const homeController = require('../controllers/homeController');

router.get('/',  homeController.renderHomePage);
router.get('/:id',  bookController.renderBooksPage);

module.exports = router;
