const userService = require('../services/userService');
const jwt = require('jsonwebtoken');


const JWT_SECRET = process.env.JWT_SECRET;
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
    },

    async loginUser(req, res){

        try{

            const {email, password } = req.body;

            if(!email || !password) {
                res.status(400).send("Email i sifra su obavezni! ");
                return;
            }

            const user = await userService.loginUser(email, password);

           const token = jwt.sign(
            {
            id: user.id ,
            email: user.email,
            firstName: user.firstName
            },
            JWT_SECRET,
            {expiresIn: '1h'}
           );

           res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000
           });

           return res.json({message: 'Uspješna prijava!'});
        } catch(error){

            if(error.message == 'Email nije pronađen.'){
                res.status(401).send('Email nije tačan!');
                return;
            }

            if(error.message == 'Lozinka nije tačna.'){
                res.status(401).send('Lozinka nije tačna!');
                return;
            }


            console.error(error);
            res.status(500).send('Došlo je do greške na serveru.');
        }

    },

    async logoutUser(req,res){
         res.clearCookie("token");
        res.redirect("/");
    }

}