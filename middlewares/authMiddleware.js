const { COOKIE_NAME } = require('../config/');
const { register, login, userSession } = require('../services/auth');

module.exports = () => async (req, res, next) => {

    const user = await validateSession();
    res.locals.user = user && user.email;

    req.auth = {
        register,
        login,
        logout,
        setCookie,
        user
    }
    next();

    async function validateSession() {
        const cookie = req.cookies[COOKIE_NAME]
        let currentSession = null;
        try {
            if (cookie) {
                currentSession = await userSession(cookie);
            }
        } catch (err) {
            res.clearCookie(COOKIE_NAME);
        }
        return currentSession;
    }

    function logout() {
        res.clearCookie(COOKIE_NAME).redirect('/');
    }

    function setCookie(cookie) {
        res.cookie(COOKIE_NAME, cookie, { httpOnly: true });
    }
};

