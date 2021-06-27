const route = require('express').Router();

route.all('*', (req, res) => {
	res.render('notFound');
});

module.exports = route;