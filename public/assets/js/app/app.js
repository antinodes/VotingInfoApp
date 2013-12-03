'use strict';
/*
 * VIP App
 *
 */

// Comment in if want to disable all "debug" logging
//debug.setLevel(0);

// VIP app module with its dependencies
var vipApp = angular.module('vipApp', ['ngRoute', 'ngCookies']);

// Constants
vipApp.constant('$appProperties', {
  contextRoot: '',
  mockServicesPath: '/mockServices',
  servicesPath: '/services',
  feedsService: '/feeds'
});

/*
 * VIP App configuration
 *
 * Will setup routing and retrieve reference data for the app before any pages are loaded
 *
 */
vipApp.config(['$routeProvider', '$appProperties', '$httpProvider',
  function ($routeProvider, $appProperties, $httpProvider) {

    debug.log("config()");

    $routeProvider.when('/', {
      templateUrl: $appProperties.contextRoot + '/app/partials/home.html',
      controller: 'HomeCtrl'
    });

    $routeProvider.when('/admin', {
      templateUrl: $appProperties.contextRoot + '/app/partials/admin.html',
      controller: 'AdminCtrl'
    });

    $routeProvider.when('/feeds', {
      templateUrl: $appProperties.contextRoot + '/app/partials/feeds.html',
      controller: 'FeedsCtrl'
    });

    $routeProvider.when('/template/feed', {
        templateUrl: $appProperties.contextRoot + '/app/partials/templates/feed.html'
    });
    $routeProvider.when('/profile', {
        templateUrl: $appProperties.contextRoot + '/app/partials/profile.html',
        controller: 'ProfileCtrl'
    });

    $routeProvider.when('/styleguide', {
      templateUrl: $appProperties.contextRoot + '/app/partials/styleguide.html',
      controller: 'StyleguideCtrl'
    });

    // default when no path specified
    $routeProvider.otherwise({redirectTo: '/'});


    /*
     * HTTP Interceptor
     * Will be used to check to see if user is authenticated
     */
    $httpProvider.responseInterceptors.push(function ($q, $location, $rootScope) {
      return function (promise) {
        return promise.then(
          // Success: just return the response
          function (response) {

            // if the user is logged in and going to the home page,
            // redirect to the feeds page
            if ($rootScope.user !== null && $rootScope.user.isAuthenticated === true && $location.path() === "/") {

              $location.url('/feeds');
            }

            return response;
          },
          // Error: check the error status for 401
          // and if so redirect back to homepage
          function (response) {
            if (response.status === 401) {
              $location.url('/');
            }
            return $q.reject(response);
          });
      }
    });

  }
]);

/*
 * Static initialization block
 *
 */
vipApp.run(function ($rootScope, $appService, $location) {

  debug.log("run()");


  $rootScope.pageHeader = {};
  $rootScope.user = null;

  /*
   * Sets PageHeader values
   *
   * @param title - the Title of the page
   * @breadcrumbs - the breadcrumbs
   * @section - section name used for the navigation bar "home", "admin", "feeds", "profile"
   * @error - error message to show on the screen
   */
  $rootScope.setPageHeader = function (title, breadcrumbs, section, error) {

    this.pageHeader = {};
    this.pageHeader.title = title;
    this.pageHeader.section = section;
    this.pageHeader.breadcrumbs = breadcrumbs;
    this.pageHeader.error = error;
  };

  // Before we render any pages,
  // see if user is authenticated or not and take appropriate action
  $appService.getUser()
    .success(function (data) {

      // set user object
      $rootScope.user = data;

      // redirect to home page if not authenticated
      if (data.isAuthenticated == false) {
        $location.path("/");
      }

    }).error(function (data) {

      // if we get an error, we could not connect to the server to check to
      // see if the user is authenticated, this should not happen
      $rootScope.pageHeader.error = "Server Error";
      $location.path("/");
    });

});
