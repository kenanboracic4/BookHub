const bookService = require('../services/bookService');

module.exports = {
    async renderHomePage(req, res) {
        try {
           
           const books = await bookService.getHomePageBooks();

            
      
            res.render('index', {
                books: books,
                
            });
           
        } catch (error) {
            console.error('Greška pri učitavanju početne stranice:', error);
            res.status(500).send('Došlo je do greške na serveru.');
        }
    }
};