<?php
include_once '../config/core.php';
if(isset($_SESSION["email"])){
	 
    // include database connection
    include_once '../config/database.php';
 
    // post object
    include_once '../models/post.php';
 
    // class instance
    $database = new Database();
    $db = $database->getConnection();
    $post = new post($db);
	
	// set post property values
	$post->author_email = $_SESSION['email'];
    
    // match post data
    $results=$post->readAllPostsUser();

    echo $results;
}
?>