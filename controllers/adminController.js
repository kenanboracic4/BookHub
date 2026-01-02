
const userService = require('../services/userService');


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
    }
}