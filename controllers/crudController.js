const route = require('express').Router();
const getFormData = require('../helpers/getFormData');
const errorMapper = require('../helpers/errorMapper');

//DELETE
route.get('/delete/:id', async (req, res) => {
    try {
        const trip = await req.store.getNotLeanOne(req.params.id);
        errorMapper.owner(req.isOwner(trip), 'trip');
        await trip.remove();
        res.redirect('/');
    } catch (err) {
        res.locals.error = errorMapper.get(err);;
        res.render('notFound');
    }
});

//ACTION
route.get('/join/:id', async (req, res) => {
    console.log('here');
    try {
        const trip = await req.store.getNotLeanOne(req.params.id);
        errorMapper.notOwner(req.isOwner(trip), 'trip');
        if (trip.buddies.includes(req.auth.user._id)) {
            throw errorMapper.set('You already booked  this trip');
        }
        trip.buddies.push(req.auth.user);
        trip.seats -= 1;
        req.auth.user.trips.push(trip);
        await req.auth.user.save({ validateBeforeSave: false })
        await trip.save();
        res.redirect('/details/' + trip._id);
    } catch (err) {
        console.log(err);
        res.locals.error = errorMapper.get(err);;
        res.render('notFound');
    }
});

//CREATE
route.get('/create', (req, res) => {
    res.render('asset/create');
});

route.post('/create', async (req, res) => {
    let createData = {}
    try {
        createData = getFormData('create', req.body);
        console.log(req.body);
        await req.store.create({ ...createData, creator: req.auth.user });
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.locals.error = errorMapper.get(err);;
        res.render('asset/create', createData);
    }
});

//EDIT
route.get('/edit/:id', async (req, res) => {
    try {
        const trip = await req.store.getOne(req.params.id);
        errorMapper.owner(req.isOwner(trip), 'trip');
        res.render('asset/edit', trip);
    } catch (err) {
        res.locals.error = errorMapper.get(err);;
        res.render('notFound');
    }
});

route.post('/edit/:id', async (req, res) => {
    let editData = {};
    try {
        editData = getFormData('create', req.body);
        //preload
        const trip = await req.store.getNotLeanOne(req.params.id);
        errorMapper.owner(req.isOwner(trip), 'trip');
        Object.assign(trip, editData);
        await trip.save();
        res.redirect('/details/' + trip._id);
    } catch (err) {
        res.locals.error = errorMapper.get(err);
        res.render('asset/edit', editData);
    }
});

//PROFILE
route.get('/profile', async (req, res) => {
    try {
        const genderType = req.auth.user.gender === 'male';
        const infoTrips = await req.store.getAllWithProjection({ _id: { $in: req.auth.user.trips } }, { _id: 0, start: 1, end: 1, date: 1, time: 1 });
        res.render('profile', { genderType, infoTrips });
    } catch (err) {
        res.locals.error = errorMapper.get(err);
        res.render('notFound');
    }
});
module.exports = route;