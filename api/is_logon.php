<?php
include_once '../config/core.php';
if(isset($_SESSION["email"])){
	 
    // include database connection
    include_once '../config/database.php';
 
    // user object
    include_once '../models/user.php';
 
    // class instance
    $database = new Database();
    $db = $database->getConnection();
    $user = new user($db);
	
	// set user property values
	$user->email = $_SESSION['email'];
    $user->password = $_SESSION['password'];
    
    // match user data
    $results=$user->readAll();

    echo $results;
}
?>