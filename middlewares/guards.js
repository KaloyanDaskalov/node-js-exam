module.exports = {
    isAuth,
    isGuest,
    isOwner
};

function isAuth() {
    return (req, res, next) => {
        if (req.auth.user) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    };
}

function isGuest() {
    return (req, res, next) => {
        if (!req.auth.user) {
            next();
        } else {
            res.redirect('/');
        }
    };
}

function isOwner() {
    return (req, res, next) => {
        req.isOwner = (asset) => {
            return req.auth.user._id.equals(asset?.creator);
        };
        next();
    };
}
