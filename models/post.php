<?php
class Post{
 
    // database connection and table name
    private $conn;
    private $table_name = "posts";
 
    // object properties
    public $id;
    public $title;
    public $description;
    public $author;
    public $author_email;
    public $image;
    public $timestamp;
 
    public function __construct($db){
        $this->conn = $db;
    }
 
    public function create(){
        try{
 
            // insert query
            $query = "INSERT INTO posts
                SET title=:title, description=:description, author=:author, author_email=:author_email, image=:image, created=:created";
 
            // prepare query for execution
            $stmt = $this->conn->prepare($query);
 
            // sanitize
            $title=htmlspecialchars(strip_tags($this->title));
            $description=htmlspecialchars(strip_tags($this->description));
            $author=htmlspecialchars(strip_tags($this->author));
            $author_email=htmlspecialchars(strip_tags($this->author_email));
            $image=htmlspecialchars(strip_tags($this->image));
 
            // bind the parameters
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':author', $author);
            $stmt->bindParam(':author_email', $author_email);
            $stmt->bindParam(':image', $image);
 
            // we need the created variable to know when the record was created
            // also, to comply with strict standards: only variables should be passed by reference
            $created_date=date('Y-m-d');
            $created_time=date('h:i:s A');
            $created=$created_date." at ".$created_time;
            
            $stmt->bindParam(':created', $created);
 
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
        $query = "SELECT id, title, SUBSTRING(description,1,200) as description, author, image, created 
                    FROM " . $this->table_name . "
                    ORDER BY id DESC";
     
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
     
        $results=$stmt->fetchAll(PDO::FETCH_ASSOC);
     
        return json_encode($results);
    }

public function searchPost(){
 
        //select all data
        $query = "SELECT id, title, SUBSTRING(description,1,200) as description, author, image, created 
                    FROM " . $this->table_name . " where title like '%".$this->title."%'
                    ORDER BY id DESC";
     
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
     
        $results=$stmt->fetchAll(PDO::FETCH_ASSOC);
     
        return json_encode($results);
    }

public function readSinglePost(){
 
        //select all data
        $query = "SELECT id, title, description, author, image, created 
                    FROM " . $this->table_name . " where id =".$this->id."
                    ORDER BY id DESC";
     
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
     
        $results=$stmt->fetchAll(PDO::FETCH_ASSOC);
     
        return json_encode($results);
    }  

    public function readAllPostsUser(){
 
        //select all data
        $query = "SELECT id, title, SUBSTRING(description,1,200) as description, author, image, created 
                    FROM " . $this->table_name . " where author_email ='".$this->author_email."'
                    ORDER BY id DESC";
     
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
     
        $results=$stmt->fetchAll(PDO::FETCH_ASSOC);
     
        return json_encode($results);
    }  

    public function update(){
 
        // insert query
            $query = "UPDATE posts
                SET title=:title, description=:description, author=:author, author_email=:author_email, image=:image where id=".$this->id;
 
            // prepare query for execution
            $stmt = $this->conn->prepare($query);
 
            // sanitize
            $title=htmlspecialchars(strip_tags($this->title));
            $description=htmlspecialchars(strip_tags($this->description));
            $author=htmlspecialchars(strip_tags($this->author));
            $author_email=htmlspecialchars(strip_tags($this->author_email));
            $image=htmlspecialchars(strip_tags($this->image));
 
            // bind the parameters
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':author', $author);
            $stmt->bindParam(':author_email', $author_email);
            $stmt->bindParam(':image', $image);
// Execute the query
            if($stmt->execute()){
                return true;
            }else{
                return false;
            }
    } 

    // delete selected products
    public function delete($ins){
     
        // query to delete multiple records
        $query = "DELETE FROM ".$this->table_name." WHERE id = :ins";
     
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $ins=htmlspecialchars(strip_tags($ins));
     
        // bind the parameter
        $stmt->bindParam(':ins', $ins);
     
        if($stmt->execute()){
            return true;
        }else{
            return false;
        }
    }  
}