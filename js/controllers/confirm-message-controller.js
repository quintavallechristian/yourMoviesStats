angular.module('yourMovieStats').controller('confirmMessageController', function(Register, $location, $uibModalInstance){
	this.userData = {};
	this.confirmStatus = {};
	this.confirmStatus.message = "";
	this.confirmStatus.error = -1;
	confirmMessageController = this;
	
	var hash = $location.search().c;
	this.userData.id = hash.substring(0, hash.indexOf("-"));
	this.userData.digest = hash.substring((hash.indexOf("-")+1), hash.length);
	console.log(this.userData.digest);
	Register.confirm(this.userData)
			.success(function(data) {
					confirmMessageController.confirmStatus.message = data.message;
			});
	
	this.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});