<?php
// include core configuration
include_once '../config/core.php';
 
// include database connection
include_once '../config/database.php';
 
// post object
include_once '../models/post.php';

// class instance
$database = new Database();
$db = $database->getConnection();
$post = new post($db);
 
 if(ISSET($_GET['title']))
 {
 	$post->title=htmlspecialchars(strip_tags($_GET['title']));
 	// read all posts
 	$results=$post->searchPost();
 }
 else
 {
 	// read all posts
 	$results=$post->readAll();
 	
 }

 // output in json format
	echo $results;
 

?>