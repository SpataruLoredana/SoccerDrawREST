
app.factory('apiService', ['$http',  function($http) {
  return $http.get('http://localhost:3000/api/pots')
  .success( function(data) {
    console.log(data);
    return data;
  })
  .error( function(err) {
    return err;
  });
}]);
