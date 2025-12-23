var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');

router.get('/', function(req, res, next) {
    res.render('userProfile');
});

router.get('/register', userController.renderRegisterPage);
router.get('/login', userController.renderLoginPage);
router.get('/logout', userController.logoutUser);

router.post('/register-new-user', userController.registerUser);
router.post('/login',userController.loginUser);




module.exports = router;
