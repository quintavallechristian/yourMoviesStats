var app = angular.module('yourMovieStats')
app.controller('PopupFiltersController', function ($scope, $timeout, $mdSidenav, $log) {
	this.applyFilters = function () {
	  // Component lookup should always be available since we are not using `ng-if`
	  $mdSidenav('right').close()
		.then(function () {
		  $log.debug("close RIGHT is done");
		});
	};
});