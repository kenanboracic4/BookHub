const bookService = require('../services/bookService');

module.exports = {
    async renderHomePage(req, res) {
        try {
           
           const randomBooks = await bookService.getHomePageBooks();
            const popularBooks = await bookService.getPopularBooks();

            const userInterests = req.user ? await bookService.getUserInterests(req.user.id): [];
            
      
            res.render('index', {
                books: randomBooks,
                popularBooks : popularBooks,
                userInterests : userInterests
                
            });
           
        } catch (error) {
            console.error('Greška pri učitavanju početne stranice:', error);
            res.status(500).send('Došlo je do greške na serveru.');
        }
    }
};