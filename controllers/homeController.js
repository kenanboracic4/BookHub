const bookService = require('../services/bookService');

exports.renderHomePage = async (req, res) => {
    try {
        const books = await bookService.getHomePageBooks();
        console.log(books);
        res.render('index',{
            books: books
        });
    }catch (error) {
        console.error('Greška pri učitavanju početne stranice:', error);
        res.status(500).send('Došlo je do greške na serveru.');
    }
};