var app = angular.module('musicPlayerApp', ['ngRoute'])
        app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeController'
                })
                .when('/currentSong', {
                    templateUrl: 'templates/currentSong.html',
                })
                .when('/login', {
                    templateUrl: 'templates/login.html',
                })
                .when('/register', {
                    templateUrl: 'templates/register.html',
                })
                .when('/settings', {
                    templateUrl: 'templates/settings.html',
                    controller: 'SettingsController'
                })
                .otherwise({
                redirectTo: '/'
                });
        }]);

        app.controller('SettingsController', ['$scope', function ($scope) {
            // Placeholder user data
            $scope.userName = "John Doe";
            $scope.userEmail = "johndoe@example.com";
        
            // Logout function
            $scope.logout = function () {
                alert("You have successfully logged out!");
                // Tambahkan logika logout sesuai kebutuhan, misalnya navigasi ke halaman login
                window.location.href = "#/login";
            };
        }]);