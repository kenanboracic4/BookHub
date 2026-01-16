const bookService = require('../services/bookService');
const userService = require('../services/userService');

module.exports = {
    async renderBooksPage(req, res) {
        try {
            const books = await bookService.getBooksForBooksPage();
            res.render('books', { books: books });
        } catch (error) {
            console.error(error);
            res.status(500).send('Greška.');
        }
    },

    async renderBookDetailsPage(req, res) {
        const id = req.params.id;
        const parsedId = parseInt(id);

        if (isNaN(parsedId)) return res.status(400).send("Nevalidan ID.");

        try {
            const book = await bookService.getBookById(parsedId);
            if (!book) return res.status(404).send('Knjiga nije pronađena');

            // 🚀 OPTIMIZACIJA: "Fire and Forget"
            // Ne koristimo 'await'. Pustimo bazu da to radi u pozadini dok mi odmah šaljemo odgovor korisniku.
            // Ovo skida oko 500ms-1s sa vremena učitavanja.
            bookService.incrementBookViewCount(parsedId).catch(err => console.error("Greška pri brojanju pregleda:", err));

            res.render('bookDetail', { book: book });

        } catch (error) {
            console.error("Greška na details stranici:", error);
            res.status(500).send("Serverska greška");
        }
    },

    // ... Ostale metode (renderAddBookPage, handleAddBook, itd.) su OK, ostavi ih iste ...
    // Samo kopiraj gornje dvije metode, a ostatak fajla ostavi kako jeste.
    async renderAddBookPage(req, res) {
           const LKData = await bookService.getAllLookupData();
           res.render('addBook', { ...LKData });
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
                  console.error('Greška:', error);
                  res.status(500).send('Greška.');
           }
    },
    async renderEditBookPage(req, res) {
           const id = req.params.id;
           const book = await bookService.getBookById(parseInt(id));
           const genres = await bookService.getAllGenres();
           const languages = await bookService.getAllLanguages();
           const conditions = await bookService.getAllConditions();
           const locations = await bookService.getAllLocations();
           if (!book) { return res.status(404).send('Nema knjige'); }
           res.render('editBook', { book, genres, languages, conditions, locations });
    },
    async handleEditBook(req, res) {
           try {
                  const bookId = req.params.id;
                  const bookData = req.body;
                  if (req.file) { bookData.imageUrl = '/uploads/' + req.file.filename; }
                  const bookUpdate = await bookService.updateBook(bookId, bookData);
                  if (!bookUpdate) { return res.status(404).send('Nema knjige.'); }
                  res.status(200).send('Uspješno');
           } catch (error) { res.status(400).send(error.message); }
    },
    async renderSearchPage(req, res) {
           try {
                  const books = await bookService.filteredBooks(req.query);
                  const LKData = await bookService.getAllLookupData();
                  res.render('books', { books: books, ...LKData, });
           } catch (error) { res.status(500).send('Greška.'); }
    },
    async handleDeleteBook(req,res){
           try{
                  const bookId = parseInt(req.params.id);
                  await bookService.deleteBook(bookId);
                  res.status(200).json({ success: true, message: 'Obrisano.' })
           }catch(error){ res.status(500).json({ success: false, message: 'Greška.' }) }
    }
};