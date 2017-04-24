<?php
include_once '../config/core.php';
if(isset($_SESSION["email"])){
	// remove all session variables
	unset($_SESSION["email"]);
	unset($_SESSION["password"]);
	session_unset(); 
	
	// destroy the session 
	session_destroy();

	echo "true"; 
}
?>