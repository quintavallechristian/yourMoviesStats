angular.module('yourMovieStats')
.factory('Api', function ApiFactory($http){
	user_id = 1;
	
	var hS, gSS, mSS, aSS, aS, hC, fS, gS;
	return {
		homeStats: 		function(){
					if(typeof hS === "undefined"){
						hS = $http({method: 'GET', url: '/movies/server/api.php?q=home&field=stats&user_id='+user_id});
					}
					return hS;
				},
		genreSummaryStats: 	function(){
					if(typeof gSS === "undefined"){
						gSS = $http({method: 'GET', url: '/movies/server/api.php?q=genres-summary&user_id='+user_id});
					}
					return gSS;
				},
		movieSummaryStats: 	function(){
					if(typeof mSS === "undefined"){
						mSS = $http({method: 'GET', url: '/movies/server/api.php?q=movies-summary&user_id='+user_id});
					}
					return mSS;
		},
		actorSummaryStats: 	function(){
					if(typeof aSS === "undefined"){
						aSS = 	$http({method: 'GET', url: '/movies/server/api.php?q=actors-summary&user_id='+user_id});
					}
					return aSS;
		},
		actorsStats: 	function(){
					if(typeof aS === "undefined"){
						aS = $http({method: 'GET', url: '/movies/server/api.php?q=actors&user_id='+user_id});
					}
					return	aS;
		},
		filmsStats: 	function(){
					if(typeof fS === "undefined"){
						fS = $http({method: 'GET', url: '/movies/server/api.php?q=films&user_id='+user_id});
					}
					return	fS;
		},
		homeCharts: 	function(){
					if(typeof hC === "undefined"){
						hC = $http({method: 'GET', url: '/movies/server/api.php?q=home&field=charts&user_id='+user_id});
					}
					return	hC;
				},
		genresStats: function(){
					if(typeof gS === "undefined"){
						gS = $http({method: 'GET', url: '/movies/server/api.php?q=genres'});
					}
					return	gS;
				}
	}
});