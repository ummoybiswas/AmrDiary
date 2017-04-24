<?php

function base64_to_jpeg($base64_string, $output_file) {
    $ifp = fopen("../uploads/".$output_file, "wb"); 

    $data = explode(',', $base64_string);

    fwrite($ifp, base64_decode($data[1])); 
    fclose($ifp); 

    return $output_file; 
}
// if the form was submitted
if($_POST){
 
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
	
	$image_filename=base64_to_jpeg($_POST['data_uri'],time().".jpg");

	
    // set post property values
    $post->title = $_POST['title'];
    $post->description = $_POST['description'];
    $post->author = $_POST['author'];
    $post->author_email = $_SESSION['email'];
    $post->image = $image_filename;
    
    // create the post
    echo $post->create() ? "true" : "false";
}
?>