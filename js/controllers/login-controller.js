angular.module('yourMovieStats').controller('loginController', function(Login, $window, $http, $uibModalInstance){
	this.userData = {};
	this.signStatus = {};
	this.signStatus.message = "";
	this.signStatus.error = -1;
	signController = this;
	this.signUser = function() {
			sendableUserData = angular.copy(this.userData);
			sendableUserData.password = hex_sha512(this.userData.password);
			console.log(sendableUserData);
			Login.login(sendableUserData)
			.success(function(data) {
				if(data.error == 0){
					$window.location.reload();
				}
				else{
					signController.signStatus.message = data.message;
					console.log(signController.signStatus.message);
				}
			});
		}
	
	this.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});