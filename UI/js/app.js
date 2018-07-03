let app = angular.module('SoccerDraw', ['ngRoute']);
app.config( function($routeProvider) {
  $routeProvider
  .when('/', {
    controller: 'formCtrl',
    templateUrl: 'views/form.html'
  })
  .when('/teams', {
    controller: 'mainCtrl',
    templateUrl: 'views/pots.html'
  })
  .when('/groups', {
    controller: 'groupCtrl',
    templateUrl: 'views/groups.html'
  })
  .otherwise( {
    redirectTo: '/'
  });
});
