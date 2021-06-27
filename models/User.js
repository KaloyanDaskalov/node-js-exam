const { SALT_ROUNDS, SECRET } = require('../config/');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const ENGLISH_ALPHANUMERIC_PATTERN = /^[a-zA-Z0-9]+$/;
const EMAIL_PATTERN = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, 'Email is required'],
		lowercase: true,
		index: true,
		validate: {
			validator: (value) => {
				return EMAIL_PATTERN.test(value)
			},
			message: (props) =>
				`${props.value} is invalid email!`
		}
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
		minlength: [4, 'Your password must be at least 4 characters.'],
	},
	gender: {
		type: String,
		enum: {
			values: ['male', 'female'],
			message: 'Invalid gender'
		},
		required: [true, 'Gender is required']
	},
	trips: {
		type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Asset'
		}],
		default: []
	}
});

UserSchema.methods.checkPassword = function (password) {
	return bcrypt.compare(password, this.password)
		.catch((e) => { throw new Error(e) });
};

UserSchema.methods.jwtSign = function () {
	return jwt.sign({ id: this._id }, SECRET, { expiresIn: '10h' });
};

UserSchema.statics.jwtValidation = function (cookie) {
	const token = jwt.verify(cookie, SECRET);
	const m_id = mongoose.Types.ObjectId(token.id);
	return this.findOne({ _id: m_id })
};

UserSchema.statics.findUser = function (key, value) {
	return this.findOne({ [key]: { $regex: new RegExp(`^${value}$`, "i") } });
};

UserSchema.virtual('repeatPassword')
	.get(function () {
		return this._repeatPassword;
	})
	.set(function (value) {
		this._repeatPassword = value;
	});

UserSchema.pre('validate', function (next) {
	if (this.password !== this.repeatPassword) {
		this.invalidate('repeatPassword', 'Passwords don\'t match');
	}
	next();
});

UserSchema.pre('save', function (next) {
	const user = this;
	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();
	// hash the password using our new salt
	bcrypt.hash(user.password, SALT_ROUNDS, function (err, hash) {
		if (err) return next(err);
		// override the cleartext password with the hashed one
		user.password = hash;
		next();
	});
});

module.exports = mongoose.model('User', UserSchema);