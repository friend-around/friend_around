'use strict';

//Regions service used to communicate Regions REST endpoints
angular.module('regions').factory('Regions', ['$resource',
	function($resource) {
		return $resource('regions/:regionId:cmd',
            {
                regionId: '@_id'
		    },
            {
                update: {
                    method: 'PUT'
                },
                query: {
                    method: 'GET',
                    isArray: true
                }
		    }
        );
	}
]);