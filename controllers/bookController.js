const bookService = require('../services/bookService');

module.exports = {

    async renderBooksPage(req, res) {
       const id = req.params.id;
       const book = await bookService.getBookById(parseInt(id));

       if (isNaN(parseInt(id))) {
            return res.status(400).send('Neispravan format ID-a knjige.');
        }


       
       if(!book){
              res.status(404).send('Knjiga nije pronađena');
              return;

       }

       await bookService.incrementBookViewCount(parseInt(id));
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
                     languageId: req.body.languageId || null,
                     sellerId: req.user.id       
              };
              await bookService.addBook(bookData);
              
              res.redirect('/books?success=true');
       } catch (error) {
              console.error('Greška prilikom dodavanja knjige:', error);
              res.status(500).send('Došlo je do greške prilikom dodavanja knjige.');
       }
    }
};