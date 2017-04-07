angular.module('yourMovieStats')
.factory('Logout', function LoginFactory($http){
	return {
		logout: 	function(){
						return	$http({method: 'GET', url: '/movies/server/logout.php'});
					}
	}
});