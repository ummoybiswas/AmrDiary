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
 
 if(ISSET($_GET['postId']))
 {
 	$post->id=$_GET['postId'];
 	// read single posts
 	$results=$post->readSinglePost();

 	// output in json format
	echo $results;
 }


 

?>