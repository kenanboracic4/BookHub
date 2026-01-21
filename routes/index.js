var express = require('express');
var router = express.Router();
const homeController = require('../controllers/homeController');


router.get('/', homeController.renderHomePage);


module.exports = router;