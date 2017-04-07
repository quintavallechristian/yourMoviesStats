angular.module('yourMovieStats').controller('registerController', function(Register, $http, $uibModalInstance){
	this.userData = {};
	this.regStatus = {};
	this.regStatus.message = "";
	this.regStatus.error = -1;
	registerController = this;
	this.addUserData = function() {
			sendableUserData = angular.copy(this.userData);
			sendableUserData.password = hex_sha512(this.userData.password);
			sendableUserData.password2 = hex_sha512(this.userData.password2);
			Register.register(sendableUserData)
			.success(function(data) {
					registerController.regStatus.message = data.message;
					registerController.regStatus.error = data.error;
			});
		}

	this.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});