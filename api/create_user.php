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
    $user->fname = $_POST['fname'];
    $user->lname = $_POST['lname'];
    $user->email = $_POST['email'];
    $user->password = md5($_POST['password']);
    $user->isAdmin = 0;
    
    // create the user
    echo $user->create() ? "true" : "false";
}
?>