const User = require('../models/User');
const errorMapper = require('../helpers/errorMapper');

module.exports = {
    register,
    login,
    userSession
};

async function register(data) {
    if (data.email) {
        const isEmail = await User.findUser('email', data.email);
        // console.log('>Checking ', email, isEmail);
        if (isEmail != null) throw errorMapper.set('Email already exist!');
    }

    const user = new User(data);
    return user.save();
}

async function login(data) {
    const { email, password } = data;

    if (email && password) {
        const user = await User.findUser('email', email);
        if (user && await user.checkPassword(password)) {
            return user;
        } else {
            throw errorMapper.set('Username or password is incorrect');
        }
    }

    throw errorMapper.set('Enter username and password');
}

async function userSession(cookie) {
    return User.jwtValidation(cookie);
}