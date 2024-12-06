var app = angular.module('musicLibraryApp', ['ngRoute'])

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
    .when('/artist', {
      templateUrl: 'templates/artist.html',
      controller: 'ArtistController'
    })
    .when('/playlist', {
      templateUrl: 'templates/playlist.html',
    })
    .when('/login', {
      templateUrl: 'templates/login.html',
    })
    .when('/register', {
      templateUrl: 'templates/register.html',
    })
    .when('/settings', {
      templateUrl: 'templates/settings.html',
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

app.controller('NavigationController', ['$scope', '$location', function ($scope, $location) {
  $scope.navigateTo = function (path) {
      $location.path(path); 
  };
}]);

app.controller('ArtistController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
  $scope.artist = null;
  $scope.albums = [];
  $scope.loading = false;
  $scope.error = null;

  const DISCOGS_API_KEY = 'btRisFfTfjEfmJVdBeIx';
  const DISCOGS_API_SECRET = 'xmBiFGMXZWbPFwPuGAoAhgjrjzdxusQn';
  
  // Get the artist's ID from the route parameters
  const artistId = $routeParams.artistId;

  $scope.fetchArtistDetails = function () {
    $scope.loading = true;
    $scope.error = null;

    // Fetch artist details using the Discogs API
    $http({
      method: 'GET',
      url: `https://api.discogs.com/artists/${artistId}`,
      params: {
        key: DISCOGS_API_KEY,
        secret: DISCOGS_API_SECRET
      }
    }).then(function (response) {
      $scope.artist = response.data;
      $scope.fetchArtistAlbums();
    }).catch(function (error) {
      $scope.error = 'Failed to fetch artist details. Please try again later.';
      $scope.loading = false;
    });
  };

  $scope.fetchArtistAlbums = function () {
    // Fetch releases (albums, singles, etc.) linked to the artist
    $http({
      method: 'GET',
      url: `https://api.discogs.com/artists/${artistId}/releases`,
      params: {
        key: DISCOGS_API_KEY,
        secret: DISCOGS_API_SECRET
      }
    }).then(function (response) {
      $scope.albums = response.data;
      $scope.loading = false;
    }).catch(function (error) {
      $scope.error = 'Failed to fetch releases. Please try again later.';
      $scope.loading = false;
    });
  };

  // Fetch the artist details and releases when the controller is loaded
  $scope.fetchArtistDetails();
}]);

app.controller('SearchController', ['$scope', '$http', function ($scope, $http) {
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

  $scope.searchMusic = function () {
    if (!$scope.searchQuery) return;

    $scope.loading = true;
    $scope.error = null;

    // Get albums from the database
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
    }).then(function (response) {
      $scope.results = response.data.results;
      $scope.loading = false;
    }).catch(function (error) {
      $scope.error = 'Failed to fetch results. Please try again.';
      $scope.loading = false;
    });
  };


  $scope.viewAlbumDetails = function (album) {
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
    }).then(function (response) {
      $scope.selectedAlbum = {
        ...response.data,
        inLibrary: $scope.library.some(item => item.id === album.id)
      };
      $scope.loadingDetails = false;
    }).catch(function (error) {
      $scope.error = 'Failed to fetch album details. Please try again.';
      $scope.loadingDetails = false;
      $scope.showModal = false;
    });
  };

  $scope.closeModal = function () {
    $scope.showModal = false;
    $scope.selectedAlbum = null;
  };

  const port = 3000;

  $scope.addToLibrary = function (album) {
    if (!$scope.library.find(item => item.id === album.id)) {
      const albumToAdd = {
        ...($scope.selectedAlbum || album),
        dateAdded: new Date(),
        inLibrary: true
      };
      $scope.library.push({
        ...albumToAdd
      });

      $http.post(`http://localhost:${port}/api/upload/library`, albumToAdd, {
        headers: {
          'Content-Type':  'application/json' // Let the browser set the content type
        }
      })
      .then(function(response) {
        console.log('Upload successful:', response.data);
      })
      .catch(function(error) {
        console.error('Upload failed:', error);
      });
    }
  };

  

  $scope.removeFromLibrary = function (albumId) {
    $scope.library = $scope.library.filter(item => item.id !== albumId);
    if ($scope.selectedAlbum && $scope.selectedAlbum.id === albumId) {
      $scope.selectedAlbum.inLibrary = false;
    }
  };

  // Close modal when clicking outside
  $scope.handleModalClick = function (event) {
    if (event.target.classList.contains('modal-backdrop')) {
      $scope.closeModal();
    }
  };
}]);

app.controller('HomeController', function($scope, $http, $location) {
  $scope.goToSearch = function () {
    $location.path('/searchSong');
  };

  const DISCOGS_TOKEN = 'wfAvzpwukLHBKnevhfxEnyCYXMARijZmyxOtUFdJ';
  
  $scope.genres = ['Rock', 'Jazz', 'Electronic', 'Hip Hop', 'Classical', 'Pop'];
  $scope.selectedGenre = 'Rock';
  $scope.albums = [];
  $scope.loading = false;
  $scope.error = null;

  $scope.changeGenre = function(genre) {
      $scope.selectedGenre = genre;
      fetchAlbums(genre);
  };

  function fetchAlbums(genre) {
      $scope.loading = true;
      $scope.error = null;

      const url = `https://api.discogs.com/database/search?type=release&genre=${genre}&per_page=20`;
      
      $http({
          method: 'GET',
          url: url,
          headers: {
              'Authorization': `Discogs token=${DISCOGS_TOKEN}`,
              'User-Agent': 'MusicLibraryApp/1.0'
          }
      }).then(function(response) {
          $scope.albums = response.data.results.map(album => ({
              title: album.title,
              thumb: album.thumb,
              year: album.year,
              artist: album.artist,
              style: album.style || []
          }));
          $scope.loading = false;
      }).catch(function(error) {
          $scope.error = 'Error fetching albums. Please try again later.';
          $scope.loading = false;
          console.error('Error:', error);
      });
  }

  fetchAlbums($scope.selectedGenre);
});