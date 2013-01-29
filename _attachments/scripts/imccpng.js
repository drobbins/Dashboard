(function () {
  'use strict';
  /*jshint browser:true devel:true jquery:true*/
  /*global angular:true*/

  var imccp = angular.module("imccp", ["ngResource"]);

  imccp.config(function ($routeProvider) {
    $routeProvider.when("/", {templateUrl : "templates/main/home.html"}).
      when("/patients", {templateUrl : "templates/main/patients.html"}).
      when("/dashboard", {templateUrl : "templates/main/dashboard.html"}).
      when("/admin", {controller : "AdminController", templateUrl : "templates/main/admin.html"}).
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
        currentSession = null;
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
    return $resource('../../../_users/:id', {id:"@id"}, {
      "put" : { method : "PUT"},
      "list" : { method : "GET", params : {id:"_all_docs"}}
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
          $scope.$emit("updateNav");
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
      $scope.navbar = "";
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
        } else if (roles.indexOf("nurse") !== -1) {
          $scope.navbar = "templates/navbars/nurse.html";
        } else if (roles.indexOf("dashboard") !== -1) {
          $scope.navbar = "templates/navbars/dashboard.html";
        }
      }
    };
    $scope.$on("updateNav", $scope.updateNav);
    $rootScope.$on("updateNav", $scope.updateNav);
  });

  imccp.controller("AdminController", function ($scope) {
  });

  imccp.controller("UserController", function ($scope, User) {
    var response = User.list(function () {
      $scope.users = response.rows.map(function (row) {
        if (row.id !== "_design/_auth") {
          row.name = row.id.slice(17);
          return row;
        }
      }).filter(function (row) {
        if (row) return row;
      });
    });

    $scope.clinics = ["", "Breast", "Gi", "Gyn Onc", "Head And Neck", "Lymp And Leuk", "Neuro Onc", "Thoracic", "Urology"];
    $scope.updatePassword = function updatePassword () {
      var user = new User($scope.user);
      user.password = $scope.password;
      user.$put({id : user._id}, function () {
        $scope.updateUserModel();
      });
    };
    $scope.updateRoles = function updateRoles () {
      var updatedRoles = [], user;
      if ($scope.dashboard) updatedRoles.push("dashboard");
      updatedRoles.push($scope.clinic);
      $scope.user.roles = updatedRoles.concat($scope.user.roles.filter(function (role) {
        if ($scope.clinics.indexOf(role) === -1 && role !== "dashboard") return role;
      }));
      user = new User($scope.user);
      user.$put({id : user._id}, function () {
        $scope.updateUserModel();
      });
    };
    $scope.updateUserModel = function updateUserModel () {
      $scope.user = User.get({ "id" : $scope.selected.id}, function () {
        $scope.dashboard = ($scope.user.roles.indexOf("dashboard") !== -1);
        $scope.clinic = (function () {
          return $scope.clinics.filter(function (clinic) {
            return $scope.user.roles.indexOf(clinic) !== -1 ? clinic : null;
          })[0];
        })();
      });
    };
  });

})();