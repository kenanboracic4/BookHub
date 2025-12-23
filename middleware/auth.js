const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
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

