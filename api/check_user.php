<?php

// if the form was submitted
if($_POST){
 
    // include core configuration
    include_once '../config/core.php';
 
    // include database connection
    include_once '../config/database.php';
 
    // user object
    include_once '../models/user.php';
 
    // class instance
    $database = new Database();
    $db = $database->getConnection();
    $user = new user($db);
	
	// set user property values
    $user->email = $_POST['email'];
    $user->password = md5($_POST['password']);
    
    // match user data
    $results=$user->readAll();
    $results=json_decode($results,true);
    //print_r($results);
    //echo count($results);
    if(count($results) >=1)
    {
               
        $_SESSION["email"] = $results[0]['email'];     
        $_SESSION["password"] = $results[0]['password'];  
        echo "true";
    }
    else
    {
        echo "false";
    }
}
?>