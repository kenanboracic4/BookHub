const bookService = require('../services/bookService');
const userService = require('../services/userService');

module.exports = {
       async renderHomePage(req, res) {
              try {

                     const [books, lookupData] = await Promise.all([
                            bookService.getHomePageBooks(),

                     ]);


                     console.log("GRAD 1:", lookupData.locations[0].toJSON());
                     res.render('index', {
                            books: books,

                     });

              } catch (error) {
                     console.error('Greška pri učitavanju početne stranice:', error);
                     res.status(500).send('Došlo je do greške na serveru.');
              }
       },

       async renderBooksPage(req, res) {
              const id = req.params.id;
              const book = await bookService.getBookById(parseInt(id));

              if (isNaN(parseInt(id))) {
                     return res.status(400).send('Neispravan format ID-a knjige.');
              }



              if (!book) {
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

              console.log("Book:", book);



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
              console.log("BODY:", req.body); // Vidi da li su title, author, price ovdje
              console.log("FILE:", req.file);


              try {
                     const bookId = req.params.id;

                     const bookData = req.body;

                     // Ako je Multer uhvatio novu sliku, dodajemo je u bookData
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
                            isSuccess: books.length > 0
                     });
              } catch (error) {
                     res.status(500).send('Došlo je do greške.');
              }

       }
};