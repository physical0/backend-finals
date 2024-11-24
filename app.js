var app = angular.module('musicLibraryApp', ['ngRoute'])

app.constant('CONFIG', {
    DISCOGS_API_KEY: 'ORTtjiltQITILFvcgxlj',
    DISCOGS_API_SECRET: 'rhiCeRwiKtclkHWCDCcopwLNKosaUIhg',
})

app.config(['$routeProvider', '$locationProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/home.html',
            controller: 'HomeController'
        })
        .when('/searchSong', {
            templateUrl: 'templates/search.html',
            controller: 'SearchController'
        })
        .when('/currentSong', {
            templateUrl: 'templates/currentSong.html',
        })
        .otherwise({
            redirectTo: '/'
        });
}]);


app.controller('HomeController', ['$scope', '$location',
    function ($scope, $location) {
        $scope.goToSearch = function() {
            $location.path('/searchSong'); 
        };
    }
]);

app.controller('SearchController', ['$scope', '$http', function($scope, $http) {
    $scope.searchQuery = '';
    $scope.results = [];
    $scope.library = [];
    $scope.loading = false;
    $scope.error = null;
    $scope.selectedAlbum = null;
    $scope.showModal = false;
    $scope.loadingDetails = false;
    
    const DISCOGS_API_KEY = 'btRisFfTfjEfmJVdBeIx';
    const DISCOGS_API_SECRET = 'xmBiFGMXZWbPFwPuGAoAhgjrjzdxusQn';
    
    $scope.searchMusic = function() {
      if (!$scope.searchQuery) return;
      
      $scope.loading = true;
      $scope.error = null;
      
      $http({
        method: 'GET',
        url: `https://api.discogs.com/database/search`,
        params: {
          q: $scope.searchQuery,
          key: DISCOGS_API_KEY,
          secret: DISCOGS_API_SECRET,
          per_page: 10,
          type: 'release'
        }
      }).then(function(response) {
        $scope.results = response.data.results;
        $scope.loading = false;
      }).catch(function(error) {
        $scope.error = 'Failed to fetch results. Please try again.';
        $scope.loading = false;
      });
    };

    $scope.viewAlbumDetails = function(album) {
      $scope.loadingDetails = true;
      $scope.showModal = true;
      $scope.selectedAlbum = null;
      
      // Get detailed release information from Discogs
      $http({
        method: 'GET',
        url: `https://api.discogs.com/releases/${album.id}`,
        params: {
          key: DISCOGS_API_KEY,
          secret: DISCOGS_API_SECRET
        }
      }).then(function(response) {
        $scope.selectedAlbum = {
          ...response.data,
          inLibrary: $scope.library.some(item => item.id === album.id)
        };
        $scope.loadingDetails = false;
      }).catch(function(error) {
        $scope.error = 'Failed to fetch album details. Please try again.';
        $scope.loadingDetails = false;
        $scope.showModal = false;
      });
    };

    $scope.closeModal = function() {
      $scope.showModal = false;
      $scope.selectedAlbum = null;
    };
    
    $scope.addToLibrary = function(album) {
      if (!$scope.library.find(item => item.id === album.id)) {
        const albumToAdd = $scope.selectedAlbum || album;
        $scope.library.push({
          ...albumToAdd,
          dateAdded: new Date()
        });
        if ($scope.selectedAlbum) {
          $scope.selectedAlbum.inLibrary = true;
        }
      }
    };
    
    $scope.removeFromLibrary = function(albumId) {
      $scope.library = $scope.library.filter(item => item.id !== albumId);
      if ($scope.selectedAlbum && $scope.selectedAlbum.id === albumId) {
        $scope.selectedAlbum.inLibrary = false;
      }
    };

    // Close modal when clicking outside
    $scope.handleModalClick = function(event) {
      if (event.target.classList.contains('modal-backdrop')) {
        $scope.closeModal();
      }
    };


  }]);