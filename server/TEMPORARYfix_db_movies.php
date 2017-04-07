<?php
	ini_set('max_execution_time', 600); //300 seconds = 5 minutes
	require_once('inc/connect.php');
	$db = new DB_CONNECT();
	$file = fopen("../WATCHLIST.csv","r");
	$flag = false;
	while(! feof($file)){
		$row = fgetcsv($file);
		if($row[1] != 'const'){
			$nome = mysql_real_escape_string($row[5]);
			$idimdb = $row[1];
			$released = $row[14];
			$imdb_vote = $row[9];
			$type = $row[6];
			$runtime = $row[10];
			$personal_vote = $row[8];
			//aggiungo film mancanti al database
			$query = "UPDATE movies SET movie_personal_vote='$personal_vote' WHERE id_movie_imdb = '$idimdb'";
			$result = mysql_query($query);
			if(!$result){
				$flag=true;
			}
		}
	}
	if($flag){echo "oh no!";}
	else{echo "ok";}
?>