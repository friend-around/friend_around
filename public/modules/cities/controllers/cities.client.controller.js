'use strict';

// Cities controller
angular.module('cities').controller('CitiesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Regions', 'Cities',
	function($scope, $stateParams, $location, Authentication, Regions, Cities ) {
		$scope.authentication = Authentication;

		// Create new City
		$scope.create = function() {
			// Create new City object
			var city = new Cities ({
                id: this.id,
                region_id: this.region_id,
                regionTitle: this.regionTitle,
                title: this.title,
                keywords: this.keywords,
                description: this.description
			});

			// Redirect after save
			city.$save(function(response) {
				$location.path('cities');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
            this.id = '';
            this.region_id = '';
            this.regionTitle = '';
            this.title = '';
            this.keywords = '';
            this.description = '';
		};

		// Remove existing City
		$scope.remove = function( city ) {
			if ( city ) { city.$remove();

				for (var i in $scope.cities ) {
					if ($scope.cities [i] === city ) {
						$scope.cities.splice(i, 1);
					}
				}
			} else {
				$scope.city.$remove(function() {
					$location.path('cities');
				});
			}
		};

		// Update existing City
		$scope.update = function() {
			var city = $scope.city ;

			city.$update(function() {
				$location.path('cities');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Cities
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
            $scope.regionFilter = {
                selectedRegionId: '',
                regions: Regions.query()
            };

            $scope.getPagedData = function (pageSize, page, searchText, regionId) {
                var skip = (page - 1) * pageSize;
                Cities.query({skip: skip, take: pageSize, region_id: regionId, search_term: searchText}, function(data, responseHeaders) {
                    $scope.cities = data;
                    $scope.totalServerItems = responseHeaders('Count');
                });
            };

            $scope.getPagedData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

            $scope.$watch('pagingOptions', function (newVal, oldVal) {
                if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                    $scope.getPagedData(
                        $scope.pagingOptions.pageSize,
                        $scope.pagingOptions.currentPage,
                        $scope.filterOptions.filterText,
                        $scope.regionFilter.selectedRegionId
                    );
                }
            }, true);

            $scope.$watch('filterOptions', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.getPagedData($scope.pagingOptions.pageSize,
                        $scope.pagingOptions.currentPage,
                        $scope.filterOptions.filterText,
                        $scope.regionFilter.selectedRegionId
                    );
                }
            }, true);

            $scope.$watch('regionFilter', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    console.log($scope.regionFilter.selectedRegion);
                    $scope.getPagedData(
                        $scope.pagingOptions.pageSize,
                        $scope.pagingOptions.currentPage,
                        $scope.filterOptions.filterText,
                        $scope.regionFilter.selectedRegionId
                    );
                }
            }, true);

            $scope.gridOptions = {
                data : 'cities',

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
                    {field:'regionTitle', displayName:'Регион'},
                    {field:'keywords', displayName:'Keywords'},
                    {field:'description', displayName:'Description'},
                    {field:'edit-link', displayName: '', enableCellEdit: false, width: 130, cellTemplate:
                        '<div class="ngCellText" ng-class="col.colIndex()">' +
                            '<a href="#!/cities/{{row.getProperty(\'_id\')}}/edit">Редактировать</a>' +
                            '</div>'}
                ]
            };
		};

		// Find existing City
		$scope.findOne = function() {
			$scope.city = Cities.get({ 
				cityId: $stateParams.cityId
			});
		};
	}
]);