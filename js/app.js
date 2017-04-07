(function(){
	angular.module('yourMovieStats', ['ui.bootstrap', 'ngRoute', 'chart.js', 'ngAnimate', 'ngMaterial'])
	.config(function (ChartJsProvider) {
	  ChartJsProvider.setOptions({ 	colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
									scaleFontColor: "#4c4c4c",
									maintainAspectRatio: false,
									segmentShowStroke: false
									});
	})
	.config(function($mdThemingProvider) {
	  $mdThemingProvider.theme('default')
		.primaryPalette('light-blue', {
									  'default': '900', // by default use shade 400 from the pink palette for primary intentions
									  'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
									  'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class)
						})
		.accentPalette('pink', {
									  'default': 'A400', // by default use shade 400 from the pink palette for primary intentions
									  'hue-1': 'A700', // use shade 100 for the <code>md-hue-1</code> class
									  'hue-2': 'A700', // use shade 600 for the <code>md-hue-2</code> class)
						});
	})
	.run(function ($rootScope, $location) {
  $rootScope.$on("$locationChangeStart", function (event, next, current) {
    $rootScope.path = $location.path();
  });
});
})();