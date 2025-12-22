var express = require('express');
var router = express.Router();


const bookController = require('../controllers/bookController');
const homeController = require('../controllers/homeController');
const upload = require('../middleware/multer');


router.get('/add-book',  bookController.renderAddBookPage);
router.get('/',  homeController.renderHomePage);
router.get('/:id',  bookController.renderBooksPage);

router.post('/add-book',  upload.single('image'), bookController.handleAddBook);

module.exports = router;
