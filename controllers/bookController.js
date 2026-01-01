const bookService = require('../services/bookService');
const userService = require('../services/userService');

module.exports = {
       async renderBooksPage(req, res) {


              const books = await bookService.getBooksForBooksPage();

              res.render('books', {
                     books: books,

              });


       },

       async renderBookDetailsPage(req, res) {
              const id = req.params.id;
              const parsedId = parseInt(id);


              if (isNaN(parsedId)) {
                     return res.status(400).send("Nevalidan ID knjige.");
              }

              try {
                     const book = await bookService.getBookById(parsedId);

                     if (!book) {
                            return res.status(404).send('Knjiga nije pronađena');
                     }

                     await bookService.incrementBookViewCount(parsedId);

                     res.render('bookDetail', {
                            book: book
                     });
              } catch (error) {
                     console.error("Greška na details stranici:", error);
                     res.status(500).send("Serverska greška");
              }
       },

       async renderAddBookPage(req, res) {

              const LKData = await bookService.getAllLookupData();

              res.render('addBook', {
                     ...LKData
              });
       },

       async handleAddBook(req, res) {
              try {
                     const bookData = {
                            title: req.body.title,
                            author: req.body.author,
                            description: req.body.description,
                            price: parseFloat(req.body.price) || 0.00,
                            imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
                            isForExchange: req.body.isExchange,
                            genreId: req.body.genreId || null,
                            locationId: req.body.locationId || null,
                            conditionId: req.body.conditionId || null,
                            languageId: req.body.languageId || null,
                            sellerId: req.user.id
                     };

                     const userId = req.user.id;
                     await userService.updateUserRole(userId);
                     await bookService.addBook(bookData);

                     res.redirect('/books?success=true');
              } catch (error) {
                     console.error('Greška prilikom dodavanja knjige:', error);
                     res.status(500).send('Došlo je do greške prilikom dodavanja knjige.');
              }
       },

       async renderEditBookPage(req, res) {

              const id = req.params.id;
              const book = await bookService.getBookById(parseInt(id));

              const genres = await bookService.getAllGenres();
              const languages = await bookService.getAllLanguages();
              const conditions = await bookService.getAllConditions();
              const locations = await bookService.getAllLocations();

              console.log(JSON.stringify(book));




              if (!book) {
                     res.status(404).send('Knjiga nije pronađena');
                     return;

              }


              res.render('editBook', {
                     book: book,
                     genres: genres,
                     languages: languages,
                     conditions: conditions,
                     locations: locations
              });
       },

       async handleEditBook(req, res) {



              try {
                     const bookId = req.params.id;

                     const bookData = req.body;


                     if (req.file) {
                            bookData.imageUrl = '/uploads/' + req.file.filename;
                     }

                     const bookUpdate = await bookService.updateBook(bookId, bookData);


                     if (!bookUpdate) {
                            return res.status(404).send('Knjiga nije pronađena.');
                     }
                     res.status(200).send('Uspješno ažurirana knjiga');

              } catch (error) {

                     res.status(400).send(error.message);
              }
       },

       async renderSearchPage(req, res) {

              try {


                     const books = await bookService.filteredBooks(req.query);
                     const LKData = await bookService.getAllLookupData();

                     res.render('books', {
                            books: books,
                            ...LKData,

                     });
              } catch (error) {
                     res.status(500).send('Došlo je do greške.');
              }

       },

       async handleDeleteBook(req,res){
              try{
                     const bookId = parseInt(req.params.id);

                     await bookService.deleteBook(bookId);
                     res.status(200).json({
                            success: true,
                            message: 'Knjiga je uspješno obrisana.'
                     })
              }catch(error){
                     res.status(500).json({
                            success: false,
                            message: 'Greška pri brisanju knjige.'
                     })
              }
       }

};