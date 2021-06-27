const mongoose = require('mongoose');

module.exports = async function (dbUri) {

    mongoose.connection.on('connecting', () => {
        console.log("trying to establish a connection to mongo");
    });

    mongoose.connection.on('connected', () => {
        console.log("connection established successfully");
    });

    mongoose.connection.on('error', (err) => {
        console.error('connection to mongo failed ' + err);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('mongo db connection closed');
    });

    await mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    });
}