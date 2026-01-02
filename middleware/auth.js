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

        const isAdmin = await userService.findUserDataById(decoded.id);
        const cartCount = await cartService.getCartCount(decoded.id);

        decoded.isAdmin = isAdmin.role === 'Admin' ? true : false;
        decoded.cartCount = cartCount;

        res.locals.user = decoded; // za ejs fajlove
        req.user = decoded;        // za kontrollere 

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



