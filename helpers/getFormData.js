const formsFields = {
	register: ['email', 'password', 'repeatPassword', 'gender'],
	login: ['email', 'password'],
	create: ['start', 'end', 'date', 'time', 'car', 'brand', 'seats', 'price', 'description']
};

module.exports = (form, data = {}) => {
	return formsFields[form].reduce((acc, key) => {
		if (data[key] !== undefined) {
			acc[key] = data[key].trim();
		} else {
			acc[key] = '';
		}
		return acc;
	}, {});
};