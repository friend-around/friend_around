'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var cities = require('../../app/controllers/cities');

	// Cities Routes
	app.route('/cities')
		.get(cities.list)
		.post(users.requiresLogin, cities.create);

	app.route('/cities/:cityId')
		.get(cities.read)
		.put(users.requiresLogin, cities.update)
		.delete(users.requiresLogin, cities.delete);

	// Finish by binding the City middleware
	app.param('cityId', cities.cityByID);
};