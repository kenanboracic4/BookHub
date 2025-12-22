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
    },

    async handleAddBook(req, res) {
       try{
              const bookData= {
                     title: req.body.title,
                     author: req.body.author,
                     description: req.body.description,
                     price: parseFloat(req.body.price) || 0.00,
                     imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
                     genreId: req.body.genreId || null,
                     locationId: req.body.locationId || null,
                     conditionId: req.body.conditionId || null,
                     languageId: req.body.languageId || null
              };
              await bookService.addBook(bookData);
              
              res.redirect('/books?success=true');
       } catch (error) {
              console.error('Greška prilikom dodavanja knjige:', error);
              res.status(500).send('Došlo je do greške prilikom dodavanja knjige.');
       }
    }
};