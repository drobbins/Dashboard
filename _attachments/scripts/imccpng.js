(function () {
  'use strict';
  /*jshint browser:true devel:true jquery:true*/
  /*global angular:true*/

  var couch_url, db_url, ddoc_url, href;

  href = document.location.href;
  couch_url = href.split("/").slice(0,3).join("/");

  var imccp = angular.module("imccp", ["ngResource"]);

  imccp.config(function ($routeProvider) {
    $routeProvider.when("/", {templateUrl : "templates/main/home.html"}).
      when("/patients", {templateUrl : "templates/main/patients.html"}).
      when("/dashboard", {templateUrl : "templates/main/dashboard.html"}).
      when("/admin", {templateUrl : "templates/main/admin.html"}).
      otherwise({redirectTo:"/"});
  });

  imccp.factory("Session", function ($resource) {
    return $resource('../../../_session');
  });

  imccp.factory("User", function ($resource) {
    return $resource('../../../_users/:id', {id:"@_id"}, {
      "put" : { method : "PUT" }
    });
  });
  
  imccp.directive("account", function (Session, User) {
    return {
      restrict : "E",
      replace : true,
      scope : true,
      transclude : false,
      link : function ( $scope, element, attributes, controller) {

        $scope.login = function login(name, password) {
          Session.save({
            name : name || this.name, // use this rather than $scope..
            password : password || this.password
          }, function () {
            $scope.session = Session.get(function () {
              $scope.$emit("updateNav");
            });
          });
        };

        $scope.logout = function logout() {
          Session.remove(function () {
            $scope.session = {};
            $scope.$emit("updateNav");
          });
        };

        $scope.signup = function signup() {
          var user, username, password;
          username = this.name;
          password = this.password;
          user = new User({
            name : username,
            password : password,
            _id : "org.couchdb.user:"+username,
            roles : [],
            type : "user"
          });
          user.$put(function () {
            $scope.login(username, password);
          });
        };

        $scope.session = Session.get();

        $scope.$watch( function () { return $scope.session.userCtx; }, function (session) {
          var user = $scope.session.userCtx;
          if (user && user.name !== null) {
            $scope.template = "templates/account/loggedIn.html";
          } else {
            $scope.template = "templates/account/loggedOut.html";
          }
        });
      },
      template : [
        "<div ng-include=\"template\"></div>"
      ].join("")
    };
  });

  imccp.controller("NavController", function ($scope, $rootScope, Session) {
    $scope.navbar = "";
    $scope.updateNav = function updateNav() {
      var user, roles;
      user = $scope.session.userCtx;
      roles = user && user.roles;
      if (!roles) {
        $scope.navbar = "";
        return;
      }
      if (roles.indexOf("_admin") !== -1) {
        $scope.navbar = "templates/navbars/admin.html";
      } else if (user.clinic) {
        $scope.navbar = "templates/navbars/nurse.html";
      } else if (roles.indexOf("dashboard") !== -1) {
        $scope.navbar = "templates/navbars/dashboard.html";
      } else {
        $scope.navbar = "";
      }
    };
    $scope.session = Session.get($scope.updateNav);
    $scope.$on("updateNav", $scope.updateNav);
    $rootScope.$on("updateNav", $scope.updateNav);
  });

})();