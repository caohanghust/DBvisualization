/**
 * Created by caohang on 16/4/11.
 */
/*
第三方库
 */
var mysql = require('mysql');


var config = require('./config.js');
var conn = mysql.createConnection(config);

conn.connect();

var db = {
    databases : '',
    showDatabases:function(){
        var sql = 'show databases';
        coon.query(sql,function(err,rows))
};

//console.log(db.showDatabases());

//var obj = {
//    num : 0,
//    test1 : function(){
//        this.num = 1;
//        return this;
//    },
//    test2 : function(){
//        this.num = 2;
//        return this;
//    }
//}
//console.log(obj.test1().test2());

