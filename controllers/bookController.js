const bookService = require('../services/bookService');

module.exports = {

    async renderBooksPage(req, res) {
       const id = req.params.id;
       const book = await bookService.getBookById(parseInt(id));

       console.log(JSON.stringify(book, null, 2));
       console.log(book.genre.name);
       console.log(book.genre);
       console.log(book.seller.firstName);
       console.log(book.seller.lastName);

       if(!book){
              res.status(404).send('Knjiga nije pronađena');
              return;

       }
       res.render('bookDetail', {
              book: book
       });
    }
};