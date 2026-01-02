var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');
const verifyToken = require('../middleware/auth').verifyToken;
const upload = require('../middleware/multer');



router.get('/register', userController.renderRegisterPage);
router.get('/login', userController.renderLoginPage);
router.get('/logout', userController.logoutUser);
router.get('/profile/:id',verifyToken, userController.renderUserProfilePage);
router.get('/profile/:id/edit',verifyToken, userController.renderUserProfileEditPage);

router.post('/register-new-user', userController.registerUser);
router.post('/login',userController.loginUser);

router.put('/profile/:id/update', verifyToken, upload.single('profileImage'), userController.updateUserProfile);




module.exports = router;
