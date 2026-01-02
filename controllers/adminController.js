
const userService = require('../services/userService');
const bookService = require('../services/bookService');

module.exports  ={
    async renderAdminPage(req,res){
        res.render('admin');
    },
    async renderAllUsersPage(req,res){

        const users = await userService.getAllUsers();

        res.render('adminAllUsers', {
            users: users
        });
    },

    async archiveUser(req,res){
        try{
            const userId = req.params.id;
            await userService.archiveUser(userId);
            res.status(200).json({
                success: true,
                message: 'Korisnik uspješno arhiviran.'
            })
        }catch(error){
            res.status(500).json({
                success: false,
                message: 'Greška pri arhiviranju korisnika.'
            })
        }
    },
    async renderAdminCatalogPage(req,res){
        
        try{
            res.render('adminCatalog');
        }catch(error){
            res.status(500).json({
                success: false,
                message: 'Greška pri prikazivanju kataloga.'
            })
        }
    },
    async handleAddGenre(req,res){
        
        try{
            const genreData = req.body.name;
             await bookService.createGenre(genreData);
            res.status(200).json({
                success: true,
                message: 'Uspješno dodano žanr.'
            })
        }catch(error){
            res.status(500).json({
                success: false,
                message: 'Greška pri dodavanju žanra.'
            })
        }
    },
    async handleAddLanguage(req,res){
        try{
            const languageData = req.body.name;
            await bookService.createLanguage(languageData);
            res.status(200).json({
                success: true,
                message: 'Uspješno dodano jezik.'
            })
        }catch(error){
            res.status(500).json({
                success: false,
                message: 'Greška pri dodavanju jezika.'
            })
        }
    },
    async handleAddLocation(req,res){
        try{
            const locationData = req.body.name;
             await bookService.createLocation(locationData);
            res.status(200).json({
                success: true,
                message: 'Uspješno dodana lokacija.'
            })
        }catch(error){
            res.status(500).json({
                success: false,
                message: 'Greška pri dodavanju lokacije.'
            })
        }
    },
    async handleAddCondition(req,res){
        try{
            const conditionData = req.body.name;
            await bookService.createCondition(conditionData);
            res.status(200).json({
                success: true,
                message: 'Uspješno dodan stanje.'
            })
        }catch(error){
            res.status(500).json({
                success: false,
                message: 'Greška pri dodavanju stanja.'
            })
        }
    }
}