module.exports = () => (req, res, next) => {
    console.log(`${req.auth.user?.username || 'Guest'} > ${req.method} to ${req.path}`);
    next();
};