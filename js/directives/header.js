angular.module('yourMovieStats')
.directive("appHeader", function() {
	return {
	  restrict: 'E',
	  templateUrl: "templates/header.html"
	};
});