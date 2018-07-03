app.controller('mainCtrl', [
'$scope',
'apiService',

function($scope, apiService) {

  apiService.success( function(data) {
    $scope.pots = data;
  });

 }]);
