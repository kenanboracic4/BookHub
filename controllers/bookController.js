const bookService = require('../services/bookService');

module.exports = {

    async renderBooksPage(req, res) {
       const id = req.params.id;
       const book = await bookService.getBookById(parseInt(id));



       if(!book){
              res.status(404).send('Knjiga nije pronađena');
              return;

       }
       res.render('bookDetail', {
              book: book
       });
    },

    async renderAddBookPage(req, res) {
       
       const LKData = await bookService.getAllLookupData();


       res.render('addBook', {
            ...LKData
       });
    }
};