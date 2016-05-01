<?php 
function execSql($dbh,$sql){
    $statement = $dbh->query($sql);
    $result = array();
    foreach ($statement->fetchAll() as $key => $value) {
        array_push($result,$value);
    }
    return $result;
}
class Db {
    public $dbname = 'zbgk';
    public $host = 'localhost';
    public $user = 'root';
    public $passwd = '';
   
    public $databases = array();
    public $dbh = null;
    public $tables = array();
    function init($dbname,$host,$user,$passwd){
        $this->dbname = $dbname;
        $this->host = $host;
        $this->user = $user;
        $this->passwd = $passwd;

        $dns = 'mysql:dbname='.$this->dbname.';host='.$this->host;
        $this->dbh = new PDO($dns,$this->user,$this->passwd);
        $this->databases = self::getDatabases();
        $this->tables = self::getTables();
    }
    function getDatabases(){
        $sql = 'SHOW DATABASES';
        $result = array();
        foreach (execSql($this->dbh,$sql) as $key => $value) {
            array_push($result,$value['Database']);
        }
        return $result;
    }
    function getTables(){
        $sql = 'SHOW TABLES';
        $result = array();
        foreach (execSql($this->dbh,$sql) as $key => $value) {
            array_push($result,$value[0]);
        }
        return $result;
    }
    function getFieldNames($table){
        $sql = 'SELECT * FROM '.$table.' limit 1';
        $result = array();
        foreach (execSql($this->dbh,$sql)[0] as $key => $value) {
            if (is_string($key)) {
                array_push($result,$key);
            }
        }
        return $result;
    }
    function getData($table,$page){
        $sql = 'SELECT * FROM '.$table.' limit '.(string)($page*15).',15';
        $data = array();
        foreach (execSql($this->dbh,$sql) as $key => $value) {
            $item = array();
            foreach ($value as $key => $value) {
                if (is_string($key)) {
                    $item[$key] = $value;
                }
            }
            array_push($data,$item);
        }
        $sql = 'SELECT COUNT(*) FROM '.$table;
        $amount = execSql($this->dbh,$sql);
        $result=array('amount'=>$amount[0][0],'data'=>$data);
        return $result;
    }
    function sortData($table,$fieldname){
        $sql = 'SELECT COUNT(*),'.$fieldname.' FROM '.$table .' GROUP BY '.$fieldname;
        $result = array();
        foreach (execSql($this->dbh,$sql) as $key => $value) {
            array_push($result,array($fieldname=>$value[$fieldname],'amount'=>$value['COUNT(*)']));
        }
        return $result;
    }
}