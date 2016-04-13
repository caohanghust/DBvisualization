var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zbgk',
    port: 3306
});
conn.connect();

//var insertSQL = 'insert into t_user(name) values("conan"),("fens.me")';
var selectSQL = 'select * from zb_area limit 10';
//var deleteSQL = 'delete from t_user';
//var updateSQL = 'update t_user set name="conan update"  where name="conan"';

conn.query(selectSQL, function (err2, rows) {
    if (err2) console.log(err2);

    console.log("SELECT ==> ");
    for (var i in rows) {
        console.log(rows[i]);
    }
})

conn.end();