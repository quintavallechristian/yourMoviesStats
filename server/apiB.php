<?php
require_once('functions_read.php');
if( isset($_GET['q']) && $_GET['q'] != ""){
	$query = $_GET['q'];
	
	if( isset($_GET['id']) && $_GET['id'] != ""){
		$id = $_GET['id'];
	}
	else {
		$id = "";
	}
	
	if( isset($_GET['num']) && $_GET['num'] != ""){
		$num = $_GET['num'];
	}
	else {
		$num = 10;
	}
	
	if( isset($_GET['field']) && $_GET['field'] != ""){
		$field = $_GET['field'];
	}
	else {
		$field = "appearence";
	}
	if( isset($_GET['user_id']) && $_GET['user_id'] != ""){
		$user_id = $_GET['user_id'];
	}
	else {
		$user_id = "";
	}
	
}
else{
	$query = "";
	$id = 1;
	$num = 10;
	$field = "appearence";
}

switch($query){
	case "home":  show_user_stats($user_id); break;
	case "actors":show_actors_stats($num, $field, $user_id); break;
	case "actor": show_actor_stats($id, $user_id); break;
	case "movies": show_movies_stats("", $user_id); break;
	case "movie": show_movie_stats($id, $user_id); break;
	case "moviesSrc": show_movies_stats($field, $user_id); break;
}
?>