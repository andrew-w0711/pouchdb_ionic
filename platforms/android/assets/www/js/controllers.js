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
