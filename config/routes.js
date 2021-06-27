const routes = require('express').Router();

const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const notFoundController = require('../controllers/notFoundController');
const crudController = require('../controllers/crudController');

const { isAuth, isGuest, isOwner } = require('../middlewares/guards');

routes.use('/', isOwner(), homeController);
routes.use('/auth', isGuest(), authController);
routes.use('/asset', isAuth(), isOwner(), crudController);
routes.use('*', notFoundController);

module.exports = routes;