app.controller('formCtrl', [
'$scope',
'$http',
'$location',

function($scope, $http, $location) {
  $scope.sendLocation = function() {
    let url = 'http://localhost:3000/location';
    $http.post(url, {"location": $location.absUrl()}).then(function() {
      console.log('Success');
    }, function() {
      console.log('Error');
    });
  }

}]);
