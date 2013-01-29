(function () {
  'use strict';
  /*jshint browser:true devel:true jquery:true*/
  /*global angular:true*/

  var imccp = angular.module("imccp", ["ngResource"]);

  imccp.config(function ($routeProvider) {
    $routeProvider.when("/", {templateUrl : "templates/main/home.html"}).
      when("/patients", {templateUrl : "templates/main/patients.html"}).
      when("/dashboard", {templateUrl : "templates/main/dashboard.html"}).
      when("/admin", {templateUrl : "templates/main/admin.html"}).
      otherwise({redirectTo:"/"});
  });

  imccp.factory("Session", function ($http, $resource, $q) {
    var currentSession, sessionService, sessionURL = "../../../_session";
    sessionService = {
      login : function login (username, password, callback) {
        return $http.post(sessionURL, {name:username, password:password})
          .then(function () {
            return $http.get(sessionURL);
          })
          .then(function (response) {
            currentSession = response.data;
            return response.data;
          });
      },
      logout : function logout () {
        return $http({method : "DELETE", url : sessionURL});
      },
      loggedIn : function () {
        if (currentSession) {
          return currentSession;
        } else {
          return false;
        }
      },
      getSession : function getSession() {
        return $http.get(sessionURL).then(function (response) {
          if (response.data.userCtx.name) {
            currentSession = response.data;
            return response.data;
          }
        });
      }
    };
    return sessionService;
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
          Session.login(name || this.name, password || this.password)
            .then(function (session) {
              $scope.session = session;
              $scope.$emit("updateNav");
            });
        };

        $scope.logout = function logout() {
          Session.logout().then(function () {
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

        Session.getSession().then(function (session) {
          $scope.session = session;
        });

        $scope.$watch( function () { return $scope.session; }, function (session) {
          var user = $scope.session && $scope.session.userCtx;
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
      var user, roles, session;
      session = Session.loggedIn();
      if (session) {
        user = session.userCtx;
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
      }
    };
    $scope.$on("updateNav", $scope.updateNav);
    $rootScope.$on("updateNav", $scope.updateNav);
  });

})();