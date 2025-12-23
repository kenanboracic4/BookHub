const userService = require('../services/userService');

module.exports ={

    async renderRegisterPage(req, res){
        const data = await userService.getLKDataForRegister();
        console.log(data);
        res.render('register',{
            ...data
        });
    },
    // post (ajax) register
    async registerUser(req, res){
        try{

            const {firstName, lastName, email, password, genreIds, languageIds} = req.body;

            if(!email || !password){
               
                res.status(400).send('Email i lozinka su obavezni.');
                return;
            }

            const user = await userService.registerUser({
                firstName,
                lastName,
                email,
                password,
                genreIds,
                languageIds
            });

            res.json({message: 'Uspešna registracija korisnika.'});

        } catch(error){
           if(error.message == 'Korisnik sa unesenim emailom već postoji.'){
                res.status(409).send(error.message);
                return;
           }else if(error.message == 'Uneseni podaci su neispravni'){
                res.status(400).send(error.message);
                return;
           }else{
               
                res.status(500).send('Došlo je do greške na serveru.');
                return;
           }
           
        }
    
    },

    async renderLoginPage(req, res){
        res.render('login');
    }
}