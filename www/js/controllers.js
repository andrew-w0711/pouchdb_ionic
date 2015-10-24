angular.module('starter.controllers', [])

.controller('DashCtrl',['$scope', '$q', 'pp', function($scope, $q, pp) {

  $scope.score = {};

  $q.all([
    pp.getScore('1'),
    pp.getScore('2'),
    pp.getScore('3')
  ]).then(function(res) {
      $scope.score['1'] = res[0];
      $scope.score['2'] = res[1];
      $scope.score['3'] = res[2];
    });

  $scope.incScore = function(id) {
    pp.add(id)
      .then(function(res) {
        return pp.getScore(id);
      })
      .then(function(score) {
        $scope.score[id] = score;
      })
  }
}])

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

var services = angular.module('starter.services', []);

services.value('version', '0.1');

services.factory('pouchdb', function() {
  PouchDB.enableAllDbs = true;
  var database = new PouchDB('starter221');
  return database;
});


services.factory('pp', function($q, pouchdb, $rootScope) {

  return {
    add: function(playerId) {
      var deferred = $q.defer();
      var doc = {
        type: 'goal',
        playerId: playerId
      };
      pouchdb.post(doc, function(err, res) {
        $rootScope.$apply(function() {
          if (err) {
            deferred.reject(err)
          } else {
            deferred.resolve(res)
          }
        });
      });
      return deferred.promise;
    },
    getScore: function(playerId) {

      var deferred = $q.defer();
      var map = function(doc) {
        if (doc.type === 'goal') {
          emit(doc.playerId, null)
        }
      };
      pouchdb.query({map: map, reduce: '_count'}, {key: playerId}, function(err, res) {
        $rootScope.$apply(function() {
          if (err) {
            deferred.reject(err);
          } else {
            if (!res.rows.length) {
              deferred.resolve(0);
            } else {
              deferred.resolve(res.rows[0].value);
            }
          }
        });
      });
      return deferred.promise;
    }
  }

});
