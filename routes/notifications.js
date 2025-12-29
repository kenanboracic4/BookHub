var express = require('express');
var router = express.Router();

const notificationController = require('../controllers/notificationController');

router.put('/read/:id', notificationController.readNotification);

module.exports = router;