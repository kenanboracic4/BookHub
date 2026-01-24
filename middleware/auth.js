const jwt = require("jsonwebtoken");
const userService = require("../services/userService");
const cartService = require("../services/cartService");
const withTiming = require("./timingHelper"); // Uvozimo helper

const verifyToken = withTiming("verifyToken", async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return res.redirect("/user/login");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        res.clearCookie("token");
        return res.status(401).send("Sesija istekla.");
    }
});

const setUserContext = withTiming("setUserContext", async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        res.locals.user = null;
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       const [dbUser, cartCount] = await Promise.all([
        userService.getBasicUser(decoded.id),
        cartService.getCartCount(decoded.id)
    ]);

        if (!dbUser) {
            res.clearCookie("token");
            res.locals.user = null;
            return next();
        }

        const now = new Date();
        if (dbUser.status === "Blokiran" && dbUser.blockExpiresAt && new Date(dbUser.blockExpiresAt) < now) {
            await dbUser.update({ status: "Aktivan", blockExpiresAt: null });
        } else if (dbUser.status === "Blokiran" || dbUser.status === "Arhiviran") {
            res.clearCookie("token");
            return res.status(403).send("Korisnik je blokiran.");
        }

        

        req.user = {
            ...decoded,
            role: dbUser.role,
            status: dbUser.status,
            isAdmin: dbUser.role === "Admin",
            cartCount,
        };
        res.locals.user = req.user;
        return next(); 
    } catch (error) {
        res.clearCookie("token");
        res.locals.user = null;
        return next();
    }
});

const authorizeRole = (requiredRole) => withTiming(`authorizeRole(${requiredRole})`, async (req, res, next) => {
    if (!req.user) return res.redirect("/user/login");
    if (req.user.role !== requiredRole && !req.user.isAdmin) return res.redirect("/books");
    return next();
});

module.exports = { verifyToken, setUserContext, authorizeRole };