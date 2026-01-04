const jwt = require('jsonwebtoken');
const cartService = require('../services/cartService');
const userService = require('../services/userService');


const verifyToken = async (req, res, next) => { // 
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/user/login');

    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded;
       
        next();
    }catch(error){
        res.clearCookie('token');
        return res.status(401).send('Sesija istekla.');
    }
    
}
const setUserContext = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.locals.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Uzimamo svježe podatke direktno iz baze
        const dbUser = await userService.findUserDataById(decoded.id);

        if (!dbUser) {
            res.clearCookie('token');
            res.locals.user = null;
            return next();
        }

        // --- PROVJERA BAN / ARHIVA ---
        const now = new Date();

        // Ako je privremeni ban istekao, automatski ga aktiviraj
        if (dbUser.status === 'Blokiran' && dbUser.blockExpiresAt && new Date(dbUser.blockExpiresAt) < now) {
            await dbUser.update({ status: 'Aktivan', blockExpiresAt: null });
        } 
        // Ako je i dalje Blokiran ili je Arhiviran, šalji 403
        else if (dbUser.status === 'Blokiran' || dbUser.status === 'Arhiviran') {
            res.clearCookie('token');
            return res.status(403).send('Korisnik je blokiran.');
        }

        // --- SVE OK - POSTAVI KONTEKST ---
        const cartCount = await cartService.getCartCount(decoded.id);
        
        req.user = {
            ...decoded,
            role: dbUser.role,
            status: dbUser.status,
            isAdmin: dbUser.role === 'Admin',
            cartCount: cartCount
        };

        res.locals.user = req.user;
        next();

    } catch (error) {
        res.clearCookie('token');
        res.locals.user = null;
        next();
    }
}

const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect('/user/login');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

          
            if (req.user.role !== requiredRole) {
               
               return  res.redirect('/books');
            }

            next();
        } catch (error) {
            res.clearCookie('token');
            return res.redirect('/user/login');
        }
    };
};

module.exports = {
    verifyToken,
    setUserContext,
    authorizeRole
}



