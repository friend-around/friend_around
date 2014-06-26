'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	City = mongoose.model('City'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'City already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a City
 */
exports.create = function(req, res) {
	var city = new City(req.body);
	city.user = req.user;

	city.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(city);
		}
	});
};

/**
 * Show the current City
 */
exports.read = function(req, res) {
	res.jsonp(req.city);
};

/**
 * Update a City
 */
exports.update = function(req, res) {
	var city = req.city ;

	city = _.extend(city , req.body);

	city.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(city);
		}
	});
};

/**
 * Delete an City
 */
exports.delete = function(req, res) {
	var city = req.city ;

	city.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(city);
		}
	});
};

/**
 * List of Cities
 */
exports.list = function(req, res) {
    var skipVal = req.param('skip') ? req.param('skip') : 0;
    var limitVal = req.param('take') ? req.param('take') : 0;
    var likeObj = {};
    if(req.param('search_term')){
        var term = req.param('search_term');
        likeObj = {title : {$regex: term, $options: 'i'}};
    }

    var rowCount = 0;
    City.find(likeObj).count().exec(function(err, count) {
        rowCount = count;
    });

    City.find(likeObj).skip(skipVal).limit(limitVal).sort('title').exec(function(err, cities) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.setHeader('Count', rowCount);
            res.jsonp(cities);
        }
    });
};

/**
 * City middleware
 */
exports.cityByID = function(req, res, next, id) { City.findById(id).populate('user', 'displayName').exec(function(err, city) {
		if (err) return next(err);
		if (! city) return next(new Error('Failed to load City ' + id));
		req.city = city ;
		next();
	});
};
