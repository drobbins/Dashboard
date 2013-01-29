(function () {
  'use strict';
  /*jshint browser:true devel:true jquery:true*/
  /*global angular:true*/

  var couch_url, db_url, ddoc_url, href;

  href = document.location.href;
  couch_url = href.split("/").slice(0,3).join("/");

  var imccp = angular.module("imccp", ["ngResource"]);

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
            $scope.session = Session.get();
          });
        };

        $scope.logout = function logout() {
          Session.remove(function () {
            $scope.session = {};
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

  imccp.controller("NavController", function ($scope, Session) {
    $scope.template = "";
    $scope.session = Session.get();
  });

})();