angular.module('yourMovieStats').controller('confirmController', function($uibModal){
	var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/confirm-modal.html',
      controller: 'confirmMessageController',
      controllerAs: 'cmCtrl',
    });

});