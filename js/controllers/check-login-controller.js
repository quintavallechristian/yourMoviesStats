angular.module('yourMovieStats')
.controller('checkLoginController', function(Login, $scope) {
	loginController = this;
	loginController.data= {};
	loginController.data.error = -1;
	
	Login.isLogged()
	.success(function(data) {
		console.log(data);
		loginController.data = data;
	});
	
	
	this.isLogged = function(){
		if(loginController.data.error == 0) return true;
		else return false;
	}
	
	this.isInitialized = function(){
		if(loginController.data.error >= 0) return true;
		else return false;
	}
})