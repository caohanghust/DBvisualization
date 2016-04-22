/**
 * Created by caohang on 16/4/19.
 */
var app = angular.module('myApp',['ngRoute']);
app.config(function($routeProvider){
    $routeProvider
        .when('/',{
            templateUrl:'view/login.html',
        })
        .when('/databases',{
            templateUrl:'view/databases.html',
        })
})


app.controller('App',function($scope,$http){
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $scope.config = {
        dns : 'localhost',
        user : 'root',
        passwd : '',
        dbname:'zbgk',
        databases:[]
    }
    $scope.login = function(){
        $http.post('http://last.com/?r=showdatabases', $.param($scope.config)).then(function(response){
            $scope.config.databases = response.data;
            location.href = '#/databases';
        })
    }
    $scope.selectDb = function(dbname){
        console.log(dbname);
    }
})