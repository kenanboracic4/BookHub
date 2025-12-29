const userService = require('../services/userService');
const jwt = require('jsonwebtoken');


const JWT_SECRET = process.env.JWT_SECRET;
module.exports = {

    async renderRegisterPage(req, res) {
        const data = await userService.getLKDataForRegister();

        res.render('register', {
            ...data
        });
    },
    // post (ajax) register
    async registerUser(req, res) {
        try {

            const { firstName, lastName, email, password, genreIds, languageIds } = req.body;

            if (!email || !password) {

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

            res.json({ message: 'Uspešna registracija korisnika.' });

        } catch (error) {
            if (error.message == 'Korisnik sa unesenim emailom već postoji.') {
                res.status(409).send(error.message);
                return;
            } else if (error.message == 'Uneseni podaci su neispravni') {
                res.status(400).send(error.message);
                return;
            } else {

                res.status(500).send('Došlo je do greške na serveru.');
                return;
            }

        }

    },

    async renderLoginPage(req, res) {
        res.render('login');
    },

    async loginUser(req, res) {

        try {

            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).send("Email i sifra su obavezni! ");
                return;
            }

            const user = await userService.loginUser(email, password);
            console.log(user);
            console.log("user role: ", user.role);
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    role: user.role
                },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                maxAge: 3600000
            });

            return res.json({ message: 'Uspješna prijava!' });
        } catch (error) {

            if (error.message == 'Email nije pronađen.') {
                res.status(401).send('Email nije tačan!');
                return;
            }

            if (error.message == 'Lozinka nije tačna.') {
                res.status(401).send('Lozinka nije tačna!');
                return;
            }


            console.error(error);
            res.status(500).send('Došlo je do greške na serveru.');
        }

    },

    async logoutUser(req, res) {
        res.clearCookie("token");
        res.redirect("/");
    },


    async renderUserProfilePage(req, res) {
    try {
        const id = req.params.id;
        // Izvlačimo parametre iz URL-a
        const { status, date, price, title } = req.query;

        const user = await userService.findUserDataById(parseInt(id));
        if (!user) {
            return res.status(404).send('Korisnik nije pronađen.');
        }

        if (req.user && req.user.id === user.id) {
            user.cartCount = req.user.cartCount;
        }

        
        const books = await userService.getUserBooks(id, { status, date, price, title });

        res.render('userProfile', {
            profileUser: user,
            profileUserBooks: books,
         
            filters: req.query 
        });
    } catch (error) {
        console.error("Greška u kontroleru:", error);
        res.status(500).send('Greška na serveru');
    }
},


    async renderUserProfileEditPage(req, res) {
        try {
            const id = req.params.id;
            const user = await userService.findUserDataById(parseInt(id));
            const userBooks = await userService.getUserBooks(id);
            const genres = await userService.getAllGenres();
            const languages = await userService.getAllLanguages();

            if (!user) {
                return res.status(404).send('Korisnik nije pronađen.');
            }

            res.render('userProfileEdit', {
                user: user,
                userBooks: userBooks,
                genres: genres,
                languages: languages
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Greška pri učitavanju stranice.');
        }
    },

    async updateUserProfile(req, res) {
        try {
            const { genreIds, languageIds, status, role, bio, newPassword } = req.body;
            const id = req.params.id;
            const file = req.file;

            await userService.updateUserProfile(
                { id, status, role, bio, newPassword },
                genreIds,
                languageIds,
                file
            );

            res.status(200).send('Uspešno ste ažurirali profil.');
        } catch (error) {
            console.error(error);
            res.status(500).send('Došlo je do greške: ' + error.message);
        }
    }


}