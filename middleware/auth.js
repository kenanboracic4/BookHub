const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => { // verifikacija tokena
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

const setUserContext = (req, res, next) =>{

    const token = req.cookies.token;

    if(!token){
        res.locals.user = null;
        return next();
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.user = decoded; // za ejs fajlove
        req.user = decoded; // za kontrollere 
        next();
    }catch(error){

        res.clearCookie('token');
        res.locals.user = null;
        next();
    }
}

module.exports = {
    verifyToken,
    setUserContext
}



