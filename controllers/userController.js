const userService = require('../services/userService');

module.exports ={

    async renderRegisterPage(req, res){
        const data = await userService.getLKDataForRegister();
        console.log(data);
        res.render('register',{
            ...data
        });
    }
}