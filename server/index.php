<?php 
require_once './db.php';
//跨域POST配置
header("Access-Control-Allow-Origin:*");
header("Access-Control-Allow-Headers:Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

//路由控制，URL中的变量r
$route = isset($_GET['r'])?$_GET['r']:'';
//初始化一个db
$db = new Db;
switch ($route) {
    case 'showdatabases':
        $db->init($_POST['dbname'],$_POST['dns'],$_POST['user'],$_POST['passwd']);
        output($db->databases);
        break;
    case 'showtables':
        if(paraCheck(['dbname'])){
            $db->dbname = $_POST['dbname'];
            $db->init($_POST['dbname'],$_POST['dns'],$_POST['user'],$_POST['passwd']);
            output($db->tables);
        }
        break;
    case 'getdata':
        if (paraCheck(['dbname','table','page'])) {
            $db->dbname = $_POST['dbname'];
            $db->init($_POST['dbname'],$_POST['dns'],$_POST['user'],$_POST['passwd']);
            output($db->getData($_POST['table'],$_POST['page'],isset($_POST['filter'])?$_POST['filter']:null));
        }
        break;
    case 'sortdata':
        if (paraCheck(['dbname','table','fieldname'])) {
            $db->dbname = $_POST['dbname'];
            $db->init($_POST['dbname'],$_POST['dns'],$_POST['user'],$_POST['passwd']);
            output($db->sortData($_POST['table'],$_POST['fieldname'],isset($_POST['filter'])?$_POST['filter']:null));
        }
        break;
    case 'getrawdata':
        if (paraCheck(['dbname','table','axis'])) {
            $db->dbname = $_POST['dbname'];
            $db->init($_POST['dbname'],$_POST['dns'],$_POST['user'],$_POST['passwd']);
            output($db->getRawData($_POST['table'],$_POST['axis'],isset($_POST['filter'])?$_POST['filter']:null));
        }
        break;
    default:
        echo '404 NOT FOUND';
        break;
}

//参数检查
function paraCheck($para){
    $config = ['dns','user'];
    foreach ($config as $key => $value) {
        if(!isset($_GET[$value])&&!isset($_POST[$value])){
            echo $value.' is required';
            return false;
        }
    }

    foreach ($para as $key => $value) {
        if(!isset($_GET[$value])&&!isset($_POST[$value])){
            echo $value.' is required';
            return false;
        }
    }
    return true;
}

function output($data){
    if(isset($_GET['cb'])){
        echo $_GET['cb'].'('.json_encode($data).')';
    }
    else{
        echo json_encode($data);
    }
}