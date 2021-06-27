const route = require('express').Router();
const errorMapper = require('../helpers/errorMapper');
const User = require('../models/User');

//HOME
route.get('/', async (req, res) => {
    try {
        res.render('home');
    } catch (err) {
        res.locals.error = errorMapper.get(err);
        res.render('home');
    }
});

//TRIPS
route.get('/trips', async (req, res) => {
    try {
        const trips = await req.store.getAllByQuery();
        res.render('trips', { trips });
    } catch (err) {
        res.locals.error = errorMapper.get(err);
        res.render('home');
    }
});

// DETAILS
route.get('/details/:id', async (req, res) => {
    let owner = false;
    let buddy = false
    try {
        const trip = await req.store.getNotLeanOne(req.params.id);
        const author = await User.findById(trip.creator);
        if (req.auth.user) {
            owner = req.isOwner(trip);
            buddy = trip.buddies.includes(req.auth.user._id);

        }
        const booked = await User.find({ _id: { $in: trip.buddies } }, { _id: 0, email: 1 }).lean();
        const ifSeats = trip.seats !== 0;
        res.render('details', { ...trip.getProps(), author: author.email, owner, buddy, ifSeats, booked });
    } catch (err) {
        res.locals.error = errorMapper.get(err);;
        res.render('notFound');
    }
});

//LOGOUT
route.get('/logout', (req, res) => {
    req.auth.logout();
});

module.exports = route;