
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
}