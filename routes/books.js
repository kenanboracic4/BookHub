var express = require('express');
var router = express.Router();


const bookController = require('../controllers/bookController');
const homeController = require('../controllers/homeController');
const upload = require('../middleware/multer');
const verifyToken = require('../middleware/auth').verifyToken;  


router.get('/add-book',verifyToken,  bookController.renderAddBookPage);
router.get('/',  homeController.renderHomePage);
router.get('/:id',  bookController.renderBooksPage);
router.get('/edit/:id', bookController.renderEditBookPage);

router.post('/add-book', verifyToken, upload.single('image'), bookController.handleAddBook);

module.exports = router;
