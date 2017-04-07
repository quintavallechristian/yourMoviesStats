angular.module('yourMovieStats')
.factory('Register', function LoginFactory($http){
	return {
		register: 	function(userData){
						return	$http({
									method: 'POST', 
									url: '/movies/server/register.php', 
									data: userData,
									headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
								});
					},
		confirm: 	function(userData){
						return	$http({
									method: 'POST', 
									url: '/movies/server/confirm_user.php', 
									data: userData,
									headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
								});
					}
	}
});