const cartService = require('../services/cartService');

module.exports = {

    async addToCart(req, res) {
        try {

            if (!req.user) {
                res.status(404).send('Korisnik nije prijavljen.');
                return;
            }

            const bookId = req.params.bookId;
            const userId = req.user.id;

            const alreadyInCart = await cartService.bookAlreadyInCart(bookId, userId);

            if (alreadyInCart.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Knjiga je već u korpi!'
                });

            }

            await cartService.addToCart(bookId, userId);

            const cartCount = await cartService.getCartCount(userId);


            res.status(200).json({
                success: true,
                message: 'Knjiga uspješno dodana u korpu!',
                cartCount: cartCount
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Došlo je do greške!',
                error: error
            })
        }

    },

    async getCartItems(req,res){
        try{
            const userId = req.user.id;
            const cartItems = await cartService.getCartItems(parseInt(userId));
            console.log("CART ITEMS:",cartItems);
           res.status(200).json({
               success: true,
               items: cartItems
           })
        }catch(error){
            res.status(500).json({
                success: false,
                message: 'Došlo je do greške!',
                error: error
            })
        }   
    }


}