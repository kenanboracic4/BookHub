var express = require('express');
var router = express.Router();

const adminController = require('../controllers/adminController');

router.get('/', adminController.renderAdminPage);
router.get('/users', adminController.renderAllUsersPage);

module.exports = router;