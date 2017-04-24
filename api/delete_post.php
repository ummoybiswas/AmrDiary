<?php
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
 
    $ins=$_POST['del_id'];
     
    // delete the post
    echo $post->delete($ins) ? "true" : "false";
}
?>