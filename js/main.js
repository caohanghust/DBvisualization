/**
 * Created by caohang on 16/4/19.
 */
var app = angular.module('myApp',['ngRoute']);
app.config(function($routeProvider){
    $routeProvider
        .when('/',{
            templateUrl:'view/login.html',
            controller:'Login'
        })
        .when('/databases',{
            templateUrl:'view/databases.html',
            controller:'Databases'
        })
})


app.controller('App',function($scope,$http){
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $scope.config = {
        dns : 'localhost',
        user : 'root',
        passwd : '',
        dbname:'zbgk',
        databases:[],
        tables:[],
        table:null,
        page:0,
        data:[]
    }
})
app.controller('Login',function($scope,$http){
    $scope.login = function(){
        $http.post('http://last.com/?r=showdatabases', $.param($scope.config)).then(function(response){
            var temp = [];
            response.data.forEach(function(item){
                if(item!='information_schema'&&item!='performance_schema'){
                    temp.push(item);
                }
            })
            $scope.config.databases = temp;
            location.href = '#/databases';
        })
    }
})
app.controller('Databases',function($scope,$http){
    $scope.showTables = function(dbname){
        $scope.config.dbname = dbname;
        $http.post('http://last.com/?r=showtables', $.param($scope.config)).then(function(response){
            $scope.config.tables = response.data;
        })
    }
    $scope.getData = function(table){
        $scope.config.table = table;
        $http.post('http://last.com/?r=getdata', $.param($scope.config)).then(function(response){
            console.log(response);
        })
    }
})