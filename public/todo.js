angular.module('todoApp', [])
  .controller('TodoListController', function ($scope, $http) {
    var todoList = this
    $scope.datasearch = []
    $scope.players = []
    $scope.login = 1
    // Simple GET request example:

    $http.get('/profile').then(function (response) {
      $scope.name = response.data.displayName
      $scope.photo = response.data.photos[0].value
      $scope.login = 2
    }, function (response) {
      console.log(response)
    })

    $scope.logout = function () {
      $scope.login = 1

    }

    $scope.start = function () {
      $scope.login = 3

    }

    todoList.post = function () {
      console.log('test')
      value = {message: $scope.text}
      $http.post('/post', value).then(function (response) {
        // console.log(response.data)
        $scope.datasearch = response.data
        // $scope.$apply()

      }, function (response) {
        console.log(response)
      })
    }

    $scope.addPlayer = function (data) {
      console.log(data)
      var temp = {name: data.name,picture: data.picture.data.url, score: 0}
      $scope.players.push(temp)
      $scope.$apply()
    }

    $scope.addscore = function (index) {
      $scope.players[index].score++
    }

    $scope.endgame = function () {
      $scope.players = []
      $scope.login = 2
      $scope.datasearch = []
      $scope.text = ''

    }
    $scope.delPlayer = function (index) {
      $scope.players.splice(index, 1)
      $scope.$apply()
    }

    $scope.sortdata = function () {
      $scope.players.score.sort()
      console.log($scope.players)
    }

  })
