<?php

//support script. Must be reconsidered

ini_set('max_execution_time', 600); //300 seconds = 5 minutes
require_once('inc/connect.php');
$db = new DB_CONNECT();
//aggiungo film mancanti al database
$query = "DELETE n1 FROM rel_actors_movies n1, rel_actors_movies n2 WHERE n1.id > n2.id AND n1.id_movie = n2.id_movie AND n1.id_actor = n2.id_actor";
$result = mysql_query($query);
?>