'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
        Menus.addMenuItem('topbar', 'Админка', 'admin', 'dropdown', null, null, ['admin']);
        Menus.addSubMenuItem('topbar', 'admin', 'Регионы', 'regions');
        Menus.addSubMenuItem('topbar', 'admin', 'Города', 'cities');

		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);