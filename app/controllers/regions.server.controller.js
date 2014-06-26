'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Region = mongoose.model('Region'),
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
				message = 'Region already exists';
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
 * Create a Region
 */
exports.create = function(req, res) {
	var region = new Region(req.body);
	region.user = req.user;

	region.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(region);
		}
	});
};

/**
 * Show the current Region
 */
exports.read = function(req, res) {
	res.jsonp(req.region);
};

/**
 * Update a Region
 */
exports.update = function(req, res) {
	var region = req.region ;

	region = _.extend(region , req.body);

	region.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(region);
		}
	});
};

/**
 * Delete an Region
 */
exports.delete = function(req, res) {
	var region = req.region ;

	region.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(region);
		}
	});
};

/**
 * List of Regions
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
    Region.find(likeObj).count().exec(function(err, count) {
        rowCount = count;
    });

    Region.find(likeObj).skip(skipVal).limit(limitVal).sort('title').exec(function(err, regions) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
            res.setHeader('Count', rowCount);
			res.jsonp(regions);
		}
	});
};

/**
 * Region middleware
 */
exports.regionByID = function(req, res, next, id) { Region.findById(id).populate('user', 'displayName').exec(function(err, region) {
		if (err) return next(err);
		if (! region) return next(new Error('Failed to load Region ' + id));
		req.region = region ;
		next();
	});
};