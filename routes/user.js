var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');

router.get('/', function(req, res, next) {
    res.render('userProfile');
});

router.get('/register', userController.renderRegisterPage);


module.exports = router;
