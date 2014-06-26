'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * City Schema
 */
var CitySchema = new Schema({
    id: {
        type: Number,
        default: ''
    },
    region_id: {
        type: Number,
        default: ''
    },
    regionTitle: {
        type: String,
        default: '',
        required: 'Please fill City name',
        trim: true
    },
	title: {
		type: String,
		default: '',
		required: 'Please fill City name',
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

mongoose.model('City', CitySchema);