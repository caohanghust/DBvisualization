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
        filter:{}
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

    $scope.fieldNames = temp;
    $scope.nowPage = 0;
    $scope.pageAmount = Math.ceil($scope.data.dataAmout / 15) ;
    $scope.selectedFieldName = null;
    $scope.showchart = false;
    $scope.chartData = {
        fieldName : $scope.selectedFieldName,
        xAxisData : [],
        yAxisData : [],
        unionData :[],
        type : 'bar'
    };

    $scope.fieldNames.forEach(function(item){
        $scope.config.filter[item] = null;
    })

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
            location.href = '#/datapage';
        })
    }

    $scope.selectFieldName = function(field){
        $scope.selectedFieldName = field;
    }
    $scope.filterChange = function(){
        //console.log($scope.config.filter);
    }

    $scope.sortStart = function(){
        var postData = $scope.config;
        postData.fieldname = $scope.selectedFieldName;
        if(postData.fieldname==null ){
            alert('请选择统计字段');
        }
        else{
            $http.post('http://last.com/?r=sortdata', $.param(postData)).then(function(response){
                $scope.showchart = true;

                var yAxisData = [];
                var xAxisData = [];
                var unionData = [];

                response.data.forEach(function(item){
                    yAxisData.push(item['amount']);
                    xAxisData.push(item[$scope.selectedFieldName]);
                    unionData.push({value:item['amount'],name:item[$scope.selectedFieldName]})
                })
                //填充数据
                $scope.chartData = {
                    fieldName : $scope.selectedFieldName,
                    xAxisData : xAxisData,
                    yAxisData : yAxisData,
                    unionData : unionData,
                    type : 'bar'
                }
                //默认绘制柱状图
                chart($scope.chartData);
            })
        }
    }

    $scope.changeChartType = function(type){
        $scope.chartData.type = type;
        chart($scope.chartData);
    }
})

//绘图函数
function chart(chartData){
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('chart'));

    // 指定图表的配置项和数据
    var option = getOption(chartData);

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
//生成绘图配置
function getOption(chartData){
    var option = {};
    switch (chartData.type) {
        //返回柱状图配置
        case 'bar':
            option = {
                title: {
                    text: chartData.fieldName+'统计数'
                },
                tooltip: {},
                legend: {
                    data:[chartData.xAxisData]
                },
                xAxis: {
                    data: chartData.xAxisData
                },
                yAxis: {},
                series: [{
                    name: chartData.fieldName+'统计数',
                    type: chartData.type,
                    data: chartData.yAxisData
                }]
            };
            break;
        case 'pie':
            option = {
                title : {
                    text: chartData.fieldName,
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: chartData.xAxisData
                },
                series : [
                    {
                        name: chartData.fieldName,
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:chartData.unionData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            break;
        case 'map':

            break;
        default :
            break;
    }

    return option
}