var express = require('express');
var router = express.Router();


const bookController = require('../controllers/bookController');
const homeController = require('../controllers/homeController');
const upload = require('../middleware/multer');
const verifyToken = require('../middleware/auth').verifyToken;  


router.get('/add-book',verifyToken,  bookController.renderAddBookPage);
router.get('/',  bookController.renderHomePage);
router.get('/details/:id',  bookController.renderBooksPage);
router.get('/edit/:id', bookController.renderEditBookPage);
router.get('/search', bookController.renderSearchPage);

router.post('/add-book', verifyToken, upload.single('image'), bookController.handleAddBook);

router.put('/edit/:id', verifyToken, upload.single('image'), bookController.handleEditBook);
module.exports = router;
