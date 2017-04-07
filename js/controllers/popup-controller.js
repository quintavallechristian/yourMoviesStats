angular.module('yourMovieStats').controller('PopupController', function (Logout) {
	this.logout = function() {
			Logout.logout()
			.success(function(data) {
				if(data.error == 0){
						location.reload();
					}
					else{
						//unreachable
					}
			});
		}
});