const { Schema, model } = require('mongoose');

const URL_PATTERN = /^https?:\/\//;

const AssetSchema = new Schema({
    start: {
        type: String,
        required: [true, 'Start point name is required'],
    },
    end: {
        type: String,
        required: [true, 'End point is required'],
    },
    date: {
        type: String,
        required: [true, 'Date is required'],
    },
    time: {
        type: String,
        required: [true, 'Time is required'],
    },
    car: {
        type: String,
        required: [true, 'Car image url is required'],
        match: [URL_PATTERN, 'Invalid car image address']
    },
    brand: {
        type: String,
        required: [true, 'Car brand is required'],
        minlength: [4, 'Car brand must be at least 4 characters'],
    },
    seats: {
        type: Number,
        required: [true, 'Seats is required'],
        min: [0, 'Seats must be from 0 to 4'],
        max: [4, 'Seats must be from 0 to 4']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [1, 'Price must be from 1 to 50'],
        max: [50, 'Price must be from 1 to 50']
    },
    description: {
        type: String,
        required: [true, 'Description brand is required'],
        minlength: [10, 'Description must be at least 10 characters'],
    },
    buddies: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

AssetSchema.statics.findTheater = function (key, value) {
    return this.findOne({ [key]: { $regex: new RegExp(`^${value}$`, "i") } });
};

AssetSchema.methods.getProps = function () {
    return {
        _id: this._id,
        start: this.start,
        end: this.end,
        date: this.date,
        time: this.time,
        car: this.car,
        brand: this.brand,
        seats: this.seats,
        price: this.price,
        description: this.description,
        buddies: this.buddies
    }
};


module.exports = model('Asset', AssetSchema);

/*
•	Start Point - string (required),
•	End Point – string (required),
•	Date – string (required),
•	Time – string (required),
•	Car Image – string (required),
•	Car Brand – string (required),
•	Seats – number (required),
•	Price – number (required),
•	Description – string (required),
•	Creator – object Id (reference to the User model),
•	Buddies – a collection of Users (reference to the User model)

•	The Starting Point and End Point should be at least 4 characters long (each).
•	The Description should be minimum 10 characters long.
•	The Car Brand should be minimum 4 characters long.

*/