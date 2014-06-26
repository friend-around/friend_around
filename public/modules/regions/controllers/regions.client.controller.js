'use strict';

// Regions controller
angular.module('regions').controller('RegionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Regions',
	function($scope, $stateParams, $location, Authentication, Regions ) {
		$scope.authentication = Authentication;

		// Create new Region
		$scope.create = function() {
			// Create new Region object
			var region = new Regions ({
                id: this.id,
				title: this.title,
                keywords: this.keywords,
                description: this.description
			});

			// Redirect after save
			region.$save(function(response) {
				$location.path('regions');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
            this.id = '';
            this.title = '';
            this.keywords = '';
            this.description = '';
		};

		// Remove existing Region
		$scope.remove = function( region ) {
			if ( region ) { region.$remove();

				for (var i in $scope.regions ) {
					if ($scope.regions [i] === region ) {
						$scope.regions.splice(i, 1);
					}
				}
			} else {
				$scope.region.$remove(function() {
					$location.path('regions');
				});
			}
		};

		// Update existing Region
		$scope.update = function() {
			var region = $scope.region ;

			region.$update(function() {
				$location.path('regions');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Regions
		$scope.find = function() {
            $scope.filterOptions = {
                filterText: '',
                useExternalFilter: true
            };
            $scope.pagingOptions = {
                pageSizes: [5, 10, 20],
                pageSize: 20,
                currentPage: 1
            };

            $scope.getPagedData = function (pageSize, page, searchText) {
                var skip = (page - 1) * pageSize;
                Regions.query({skip: skip, take: pageSize, search_term: searchText}, function(data, responseHeaders) {
                    $scope.regions = data;
                    $scope.totalServerItems = responseHeaders('Count');
                });
            };

            $scope.getPagedData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

            $scope.$watch('pagingOptions', function (newVal, oldVal) {
                if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                    $scope.getPagedData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                }
            }, true);

            $scope.$watch('filterOptions', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.getPagedData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                }
            }, true);

            $scope.gridOptions = {
                data : 'regions',

                enablePaging: true,
                showFooter: true,
                totalServerItems: 'totalServerItems',
                pagingOptions: $scope.pagingOptions,
                filterOptions: $scope.filterOptions,

                beforeSelectionChange: function() {
                    return false;
                },

                columnDefs: [
                    {field:'title', displayName:'Наименование'},
                    {field:'keywords', displayName:'Keywords'},
                    {field:'description', displayName:'Description'},
                    {field:'edit-link', displayName: '', enableCellEdit: false, width: 130, cellTemplate:
                        '<div class="ngCellText" ng-class="col.colIndex()">' +
                            '<a href="#!/regions/{{row.getProperty(\'_id\')}}/edit">Редактировать</a>' +
                        '</div>'}
                ]
            };
		};

		// Find existing Region
		$scope.findOne = function() {
			$scope.region = Regions.get({ 
				regionId: $stateParams.regionId
			});
		};
	}
]);