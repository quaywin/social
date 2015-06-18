app = angular.module('app.controller',[]);
app.factory('posts', ['$http', function($http) {
  var o = {
    posts: []
  };
  o.getAll = function() {
    return $http.get('/loadPost').success(function(data) {
      angular.copy(data, o.posts);
    });
  };
  o.create = function(post) {
    return $http.post('/createPost', post).success(function(data) {
      o.posts.push(data);
    });
  };
  o.updateVote = function(post){
    return $http.post('/updatePostVote',{id:post._id}).success(function(data){
      post.upvotes = data.upvotes;
    });
  };
  o.updateComment = function(post){
    return $http.post('/updatePostComment',{id:post._id,comment:post.comment}).success(function(data){
      post.comments = data.comments;
    });
  };
  o.removePost = function(post,index){
    return $http.post('/removePost',{id:post._id}).success(function(data){
      if(data){
        o.posts.splice(index,1);
      }
    });
  };
  o.removeComment = function(post,index){
    return $http.post('/removeComment',{id:post._id,index:index}).success(function(data){
      if(data){
        post.comments.splice(index,1);
      }
    });
  };
  return o;
}]);
app.controller('MainCtrl', ['$scope', 'posts', function($scope, posts) {
  $scope.test = 'MEAN Stack';
  $scope.title = '';
  $scope.post = {}; 
  posts.getAll();
  $scope.posts = posts.posts;
  $scope.addNote = function() {
    if ($scope.title === '') {
      return;
    }
    post = {
      title: $scope.title,
      upvotes: 0,
      comments: []
    };
    posts.create(post);
    $scope.title = '';
  };
  $scope.addComment = function(post) {
    if (post.comment === '') {
      return;
    }
    posts.updateComment(post);
    post.comment = '';
  };
  $scope.vote = function(post) {
    posts.updateVote(post);
  };

  $scope.removePost = function(post,index){
    posts.removePost(post,index);
  };

  // $scope.init = function(){
  //   return $http.get('loadPostElement/'+$routeParams.id).success(function(data){
  //         $scope.post = data;
  //       });
  // };
  
  $scope.removeComment = function(post,index) {
    posts.removeComment(post,index);
  };
  // return $scope.init();

}]);
app.controller('PostCtrl', ['$scope', 'posts', '$routeParams','$http', function($scope, posts, $routeParams,$http) {
  $scope.comment = '';
  $scope.post = {}; 
  $scope.init = function(){
    return $http.get('loadPostElement/'+$routeParams.id).success(function(data){
          $scope.post = data;
        });
  };
  $scope.addComment = function() {
    if ($scope.comment === '') {
      return;
    }
    posts.updateComment($scope.post,$scope.comment);
    $scope.comment = '';
  };
  $scope.removeComment = function(index) {
    posts.removeComment($scope.post,index);
  };
  return $scope.init();
}]);