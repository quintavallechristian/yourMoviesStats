angular.module('yourMovieStats')
.factory('Login', function LoginFactory($http){
	return {
		isLogged: 	function(){
						return	$http({method: 'GET', url: '/movies/server/check_login.php'});
					},
		login: function(userData){
					return	$http({
								method: 'POST', 
								url: '/movies/server/login.php', 
								data: userData,
								headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
					});
				}
	}
});