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
    function getData($table,$page,$filter){
        $filterSQL = ' WHERE 1 ';
        if ($filter) {
            $sql = 'SELECT * FROM '.$table;
            //组装过滤器
            foreach ($filter as $key => $value) {
                if ($value) {
                    if (preg_match('/>/', $value)) {
                        $filterSQL = $filterSQL.' AND '.$key.' '.$value.' ';
                    }elseif (preg_match('/</', $value)) {
                        $filterSQL = $filterSQL.' AND '.$key.' '.$value.' ';
                    }else{
                        $filterSQL = $filterSQL.' AND '.$key.' = '.$value.' ';
                    }
                }
            }
            $sql = $sql.$filterSQL.' limit '.(string)($page*15).',15';
        }else{
            $sql = 'SELECT * FROM '.$table.' limit '.(string)($page*15).',15';
        }
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
        $sql = 'SELECT COUNT(*) FROM '.$table.$filterSQL;
        $amount = execSql($this->dbh,$sql);
        $result=array('amount'=>$amount[0][0],'data'=>$data);
        return $result;
    }
    function sortData($table,$fieldname,$filter){
        if ($filter) {
            $sql = 'SELECT COUNT(*),'.$fieldname.' FROM '.$table .' WHERE 1 ';
            foreach ($filter as $key => $value) {
                //当value不为空时才过滤
                if ($value) {
                    if (preg_match('/>/', $value)) {
                        $sql = $sql.' AND '.$key.' '.$value.' ';
                    }elseif (preg_match('/</', $value)) {
                        $sql = $sql.' AND '.$key.' '.$value.' ';
                    }else{
                        $sql = $sql.' AND '.$key.' = '.$value.' ';
                    }
                }
            }
            $sql = $sql.' GROUP BY '.$fieldname;
            // var_dump($sql);
        }else{
            $sql = 'SELECT COUNT(*),'.$fieldname.' FROM '.$table .' GROUP BY '.$fieldname;
        }
        $result = array();
        foreach (execSql($this->dbh,$sql) as $key => $value) {
            array_push($result,array($fieldname=>$value[$fieldname],'amount'=>$value['COUNT(*)']));
        }
        return $result;
    }
}