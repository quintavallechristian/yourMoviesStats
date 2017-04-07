angular.module('yourMovieStats').controller('ModalDemoCtrl', function ($scope, $uibModal, $log) {
  this.profileClicked = false;
  
  this.open = function (popup) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/'+popup+'-modal.html',
      controller: popup+'Controller',
      controllerAs: popup+'Ctrl',
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
  
  this.setClicked = function(val){
	  this.profileClicked = val;
  }


});