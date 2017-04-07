angular.module('yourMovieStats')
.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'templates/pages/home/index.html',
		controller: 'HomeStatsController',
		controllerAs: 'hsCtrl'
	})
	.when('/home', {
		templateUrl: 'templates/pages/home/index.html',
		controller: 'HomeStatsController',
		controllerAs: 'hsCtrl'
	})
	.when('/actors', {
		templateUrl: 'templates/pages/actors/index.html',
		controller: 'ActorsStatsController',
		controllerAs: 'asCtrl'
	})
	.when('/directors', {
		templateUrl: 'templates/pages/directors/index.html',
	})
	.when('/films', {
		templateUrl: 'templates/pages/films/index.html',
		controller: 'FilmsStatsController',
		controllerAs: 'fsCtrl'
	})
	.when('/profile', {
		templateUrl: 'templates/pages/profile/index.html',
	})
	.when('/confirm', {
		templateUrl: 'templates/pages/confirm/index.html',
		controller: 'confirmController',
		controllerAs: 'confirmCtrl'
	})
	.otherwise({
		redirectTo: '/',
	})
});