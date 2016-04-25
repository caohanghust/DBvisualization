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
        .when('/datapage',{
            templateUrl:'view/datapage.html',
            controller:'Datapage'
        })
})
//数字范围过滤器
app.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=0; i< total; i++)
            input.push(i);
        return input;
    };
});


app.controller('App',function($scope,$http){
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $scope.config = {
        dns : 'localhost',
        user : 'root',
        passwd : '',
        dbname:'zbgk',
        table:null,
        page:0,

    }
    $scope.data = {
        tables:[],
        databases:[],
        data:[]
    }
})
app.controller('Login',function($scope,$http){
    $scope.errorMsg = '数据库连接失败，请检查输入信息是否有误';
    $scope.isError = false;
    $scope.login = function(){
        $http.post('http://last.com/?r=showdatabases', $.param($scope.config)).then(function(response){
            var temp = [];
            if(typeof response.data == 'string'){
                $scope.isError = true;
            }else{
                response.data.forEach(function(item){
                    if(item!='information_schema'&&item!='performance_schema'){
                        temp.push(item);
                    }
                })
                $scope.data.databases = temp;
                location.href = '#/databases';
            }
        })
    }
})
app.controller('Databases',function($scope,$http){
    $scope.showTables = function(dbname){
        $scope.config.dbname = dbname;
        $http.post('http://last.com/?r=showtables', $.param($scope.config)).then(function(response){
            $scope.data.tables = response.data;
        })
    }
    $scope.getData = function(table){
        $scope.config.page = 0;
        $scope.config.table = table;
        $http.post('http://last.com/?r=getdata', $.param($scope.config)).then(function(response){
            $scope.data.data = response.data.data;
            $scope.data.dataAmout = response.data.amount;
            location.href = '#/datapage';
        })
    }
})
app.controller('Datapage',function($scope,$http){
    var temp = [];
    for(var index in $scope.data.data[0]){
        temp.push(index);
    }
    $scope.filedNames = temp;
    $scope.nowPage = 0;
    $scope.pageAmount = Math.ceil($scope.data.dataAmout / 15) ;

    $scope.getData = function(page){
       if(typeof page == 'string'){
            if(page=='last'){
                $scope.config.page = $scope.nowPage-1>-1?$scope.nowPage-1:0;
                $scope.nowPage = $scope.nowPage-1>-1?$scope.nowPage-1:0;
            }
            if(page=='next'){
                $scope.config.page = $scope.nowPage+1<$scope.pageAmount-1?$scope.nowPage+1:$scope.pageAmount-1;
                $scope.nowPage = $scope.nowPage+1<$scope.pageAmount-1?$scope.nowPage+1:$scope.pageAmount-1;
            }
       }else{
           $scope.config.page = page;
           $scope.nowPage = page;
       }
        $http.post('http://last.com/?r=getdata', $.param($scope.config)).then(function(response){
            $scope.data.data = response.data.data;
            $scope.data.dataAmout = response.data.amount;
            console.log(response.data.data.length);
            location.href = '#/datapage';
        })
    }
})