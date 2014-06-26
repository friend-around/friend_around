'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Region Schema
 */
var RegionSchema = new Schema({
    id: {
        type: Number,
        default: ''
    },
	title: {
		type: String,
		default: '',
		required: 'Please fill Region name',
		trim: true
	},
    keywords: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Region', RegionSchema);