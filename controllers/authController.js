const route = require('express').Router();
const getFormData = require('../helpers/getFormData');
const errorMapper = require('../helpers/errorMapper');

route.get('/login', (req, res) => {
    res.render('login');
});

route.get('/register', (req, res) => {
    res.render('register');
});

route.post('/register', async (req, res) => {
    let data = {};

    try {
        data = getFormData('register', req.body);
        const user = await req.auth.register(data);
        req.auth.setCookie(user.jwtSign());
        res.redirect('/trips');
    } catch (err) {
        console.log(err);
        res.locals.error = errorMapper.get(err);;
        res.render('register', data);
    }
});

route.post('/login', async (req, res) => {
    let data = {};

    try {
        data = getFormData('login', req.body);
        const user = await req.auth.login(data);
        req.auth.setCookie(user.jwtSign());
        res.redirect('/trips');
    } catch (err) {
        console.log(err);
        res.locals.error = errorMapper.get(err);;
        res.render('login', data);
    }
});

module.exports = route;