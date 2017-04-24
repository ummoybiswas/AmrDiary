<?php
class User{
 
    // database connection and table name
    private $conn;
    private $table_name = "users";
 
    // object properties
    public $fname;
    public $lname;
    public $email;
    public $password;
    public $isAdmin;
 
    public function __construct($db){
        $this->conn = $db;
    }
 
    public function create(){
        try{
 
            // insert query
            $query = "INSERT INTO users
                SET fname=:fname, lname=:lname, email=:email, password=:password, isAdmin=:isAdmin";
 
            // prepare query for execution
            $stmt = $this->conn->prepare($query);
 
            // sanitize
            $fname=htmlspecialchars(strip_tags($this->fname));
            $lname=htmlspecialchars(strip_tags($this->lname));
            $email=htmlspecialchars(strip_tags($this->email));
            $password=htmlspecialchars(strip_tags($this->password));
			$isAdmin=htmlspecialchars(strip_tags($this->isAdmin));
 
            // bind the parameters
            $stmt->bindParam(':fname', $fname);
            $stmt->bindParam(':lname', $lname);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password', $password);
			$stmt->bindParam(':isAdmin', $isAdmin);
 
             
            // Execute the query
            if($stmt->execute()){
                return true;
            }else{
                return false;
            }
 
        }
 
        // show error if any
        catch(PDOException $exception){
            die('ERROR: ' . $exception->getMessage());
        }
    }

    public function readAll(){
 
    //select all data
    $query = "SELECT *
                FROM " . $this->table_name . "
                where email='".$this->email."' and password='".$this->password."'";
 
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
 
    $results=$stmt->fetchAll(PDO::FETCH_ASSOC);
 
    return json_encode($results);
}
}