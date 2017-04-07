<?php

require_once('inc/connect.php');
$db = new DB_CONNECT();

//print summary informations
function homeStats($user_id, $field){
	$response["id"] = -1;
	$response["message"] = "";
	$response["data"] = [];
	if($field == "stats"){
		
		$watchtime_data = get_full_watchtime($user_id);
		
		if($watchtime_data["id"] == 1){
			$response["id"] = 1;
			$response["message"] = $watchtime_data["message"];
			$response["data"] = $watchtime_data["data"];
		}
	}
	else{
		$history_data = get_complete_history($user_id);
		if($history_data["id"] == 1){
			$response["id"] = 1;
			$response["message"] = $history_data["message"];
			$response["data"] = $history_data;
		}
	}
	echo json_encode($response);
}

//print summary informations about genres loved/hated by the user
function genreSummaryStats($user_id){
	$response["id"] = -1;
	$response["message"] = "";
	$response["data"] = [];		
	$genres = get_genre($user_id);
	
	if($genres["id"] == 1){
		
		$response["data"]["best_genre"]["name"] = $genres["genres"][0]["category_name"];
		$response["data"]["best_genre"]["average"] = $genres["genres"][0]["avg"];
		$response["data"]["worst_genre"]["name"] = $genres["genres"][count($genres["genres"])-1]["category_name"];
		$response["data"]["worst_genre"]["average"] = $genres["genres"][count($genres["genres"])-1]["avg"];
		
		$response["data"]["mostly_seen_genre"]["name"] = "";
		$response["data"]["mostly_seen_genre"]["total"] = 0;
		foreach($genres["genres"] as $g){
			if($g["total"] > $response["data"]["mostly_seen_genre"]["total"]){
				$response["data"]["mostly_seen_genre"]["total"] = $g["total"];
				$response["data"]["mostly_seen_genre"]["name"] = $g["category_name"];
			}
		}
		
		$response["id"] = 1;
		$response["message"] = $genres["message"];
	}
	echo json_encode($response);
}

//print summary informations about genres loved/hated by the user
function movieSummaryStats($user_id){
	$response["id"] = -1;
	$response["message"] = "";
	$response["data"] = [];		
	$movies = get_movies_stats($user_id);
	if($movies["id"] == 1){
		
		$response["data"]["last_film"]["name"] = $movies["movies"][0]["movie_title"];
		$response["data"]["last_film"]["vote"] = $movies["movies"][0]["movie_personal_vote"];
		//$response["data"]["worst_genre"]["name"] = $genres["genres"][count($genres["genres"])-1]["category_name"];
		//$response["data"]["worst_genre"]["average"] = $genres["genres"][count($genres["genres"])-1]["avg"];
		//
		$response["data"]["best_film"]["name"] = "";
		$response["data"]["best_film"]["vote"] = 0;
		
		$response["data"]["worst_film"]["name"] = "";
		$response["data"]["worst_film"]["vote"] = 10;
		
		foreach($movies["movies"] as $m){
			if(intval($m["movie_personal_vote"]) && $m["movie_personal_vote"] > $response["data"]["best_film"]["vote"]){
				$response["data"]["best_film"]["vote"] = $m["movie_personal_vote"];
				$response["data"]["best_film"]["name"] = $m["movie_title"];
			}
			
			if(intval($m["movie_personal_vote"]) && $m["movie_personal_vote"] < $response["data"]["worst_film"]["vote"]){
				$response["data"]["worst_film"]["vote"] = $m["movie_personal_vote"];
				$response["data"]["worst_film"]["name"] = $m["movie_title"];
			}
			
			if($response["data"]["best_film"]["vote"] == 10 && $response["data"]["worst_film"]["vote"] == 1){
				break;
			}
		}
		//
		$response["id"] = 1;
		$response["message"] = $movies["message"];
	}
	
	echo json_encode($response);
}

function actorSummaryStats($user_id){
	$response["id"] = -1;
	$response["message"] = "";
	$response["data"] = [];		
	$actors = get_actors_stats($user_id);
	if($actors["id"] == 1){
	
		$response["data"]["best_actor"]["name"] = "";
		$response["data"]["best_actor"]["appearence"] = 0;
		$response["data"]["best_actor"]["vote"] = 0;
		
		$response["data"]["worst_actor"]["name"] = "";
		$response["data"]["worst_actor"]["appearence"] = 0;
		$response["data"]["worst_actor"]["vote"] = 10;
		
		$response["data"]["mostly_seen_actor"]["name"] = "";
		$response["data"]["mostly_seen_actor"]["appearence"] = 0;
		$response["data"]["mostly_seen_actor"]["vote"] = 0;
		foreach($actors["actors"] as $a){
			if(intval($a["appearence"]) >= 3){
				if($a["average"]  > $response["data"]["best_actor"]["vote"]){
					$response["data"]["best_actor"]["appearence"] = $a["appearence"];
					$response["data"]["best_actor"]["vote"] = $a["average"];
					$response["data"]["best_actor"]["name"] = $a["name"];
				}
				
				if(intval($a["average"]) > 0 && intval($a["average"])  < $response["data"]["worst_actor"]["vote"]){
					$response["data"]["worst_actor"]["appearence"] = $a["appearence"];
					$response["data"]["worst_actor"]["vote"] = $a["average"];
					$response["data"]["worst_actor"]["name"] = $a["name"];
				}
				
				if(intval($a["appearence"])  > $response["data"]["mostly_seen_actor"]["appearence"]){
					$response["data"]["mostly_seen_actor"]["appearence"] = $a["appearence"];
					$response["data"]["mostly_seen_actor"]["vote"] = $a["average"];
					$response["data"]["mostly_seen_actor"]["name"] = $a["name"];
				}
			}
		}
		
		$response["id"] = 1;
		$response["message"] = $actors["message"];
	}
	
	echo json_encode($response);
}

function actorsStats($user_id){
	$response["id"] = -1;
	$response["message"] = "";
	$response["data"] = [];		
	$actors = get_actors_stats($user_id);
	if($actors["id"] == 1){
		$response["actors"] = $actors["actors"];
		$response["id"] = 1;
		$response["message"] = $actors["message"];
	}
	
	echo json_encode($response);
}

function filmsStats($user_id){
	$response["id"] = -1;
	$response["message"] = "";
	$response["data"] = [];		
	$movies = get_movies_stats($user_id);
	if($movies["id"] == 1){
		$response["movies"] = $movies["movies"];
		$response["id"] = $movies["id"];
		$response["message"] = $movies["message"];
	}
	
	echo json_encode($response);
}

//returns number of seen movies and total watchtime
function get_full_watchtime($id){
	$query = "SELECT SUM(movie_runtime) AS minutes, COUNT(*) AS number FROM movies JOIN rel_users_movies WHERE rel_users_movies.id_movie = movies.id_movie_imdb AND rel_users_movies.id_user='$id'";
	$result = mysql_query($query);
	if($result){
		$res["id"] = 1;
		$res["data"] = mysql_fetch_assoc($result);
		$res["message"] = "Watchtime succesfully retrieved";
	}
	else{
		$res["id"] = 0;
		$res["data"] = -1;
		$res["message"] = "Error: ".mysql_error();
	}
	return $res;
}

//returns how many movies did the user see for each month
function get_complete_history($user_id){
	$i=0;
	$query = "SELECT id_movie_imdb, movie_runtime, date_added FROM movies JOIN rel_users_movies ON id_movie = id_movie_imdb AND id_user = '$user_id'";
	$result = mysql_query($query);
	if($result){
		while ($film = mysql_fetch_assoc($result)){
			$movie_data[$i] = $film;
			
			$date = explode( " ", preg_replace('/\s+/', ' ',$film["date_added"] ));
			$movie_data[$i]["date"] = $date;			
			$i++;
		}
		$movie_data = array_reverse($movie_data);
		$res["id"] = 1;
		$res["movies_number"] = count_occurences($movie_data);
		$res["message"] = "Data successfuly retrieved";
	}
	else{
		$res["id"] = 0;
		$res["movies_number"] = -1;
		$res["message"] = "Error: ".mysql_error();
	}
	return $res;
}

//return informations about genres loved/hated by the user
function get_genre($user_id){
	//SELECT categories.category_name, COUNT(categories.category_name) FROM `rel_users_movies` JOIN rel_categories_movies JOIN categories ON categories.id = rel_categories_movies.id_category AND rel_users_movies.id_movie = rel_categories_movies.id_movie WHERE rel_users_movies.id_user = 1 GROUP BY categories.category_name
	$query = "SELECT categories.category_name, AVG(rel_users_movies.movie_personal_vote) AS avg, COUNT(categories.category_name) AS total FROM `rel_users_movies` JOIN rel_categories_movies JOIN categories ON categories.id = rel_categories_movies.id_category AND rel_users_movies.id_movie = rel_categories_movies.id_movie WHERE rel_users_movies.id_user = '$user_id' GROUP BY categories.category_name ORDER BY avg DESC";
	$result = mysql_query($query);
	if($result){
		while ($retrieved_genre = mysql_fetch_assoc($result)){
			$genres[] = $retrieved_genre;
		}
		$res["id"] = 1;
		$res["genres"] = $genres;
		$res["message"] = "Genres successfuly retrieved";
	}
	else{
		$res["id"] = 0;
		$res["genres"] = -1;
		$res["message"] = "Error: ".mysql_error();
	}
	return $res;
}

//returns all the movies seen by a certain user and his history (how many movies did he see for each month)
function get_movies_stats($user_id){
	$i=0;
	$query = "SELECT movie_title, id_movie_imdb, date_added, movie_runtime, movie_imdb_vote, movie_year, movie_personal_vote FROM movies JOIN rel_users_movies ON id_movie = id_movie_imdb AND id_user = '$user_id' AND movie_type = 'Feature Film'";
	$result = mysql_query($query);
	if($result){
		while ($film = mysql_fetch_assoc($result)){
			$movie_data[$i] = $film;
			
			$date = explode( " ", preg_replace('/\s+/', ' ',$film["date_added"] ));
			$movie_data[$i]["date"] = $date;
			
			$categories = get_single_movie_categories($film["id_movie_imdb"]);
			if($categories["id"] != 0){
				$movie_data[$i]["categories"] = $categories["categories"];
			}
			
			$i++;
		}
		$movie_data = array_reverse($movie_data);
		$res["id"] = 1;
		$res["movies"] = $movie_data;
		$res["message"] = "Data successfuly retrieved";
	}
	else{
		$res["id"] = 0;
		$res["movies"] = -1;
		$res["message"] = "Error: ".mysql_error();
	}
	return $res;
}

function get_actors_stats($user_id){
	//select all actors starring in animated movies
	$query = "SELECT actors.id, actors.name, movies.movie_title, movie_personal_vote
				FROM 	actors 
						JOIN rel_actors_movies 
						JOIN movies
						JOIN rel_users_movies
							ON id_user = '1'
							AND movies.id_movie_imdb = rel_users_movies.id_movie
				WHERE 	actors.id = rel_actors_movies.id_actor 
						AND rel_actors_movies.id_movie=movies.id_movie_imdb  
						AND movie_personal_vote > 0";
	$result = mysql_query($query);
	if($result){
		$actors = [];
		while ($actor = mysql_fetch_assoc($result)){
			if(!array_key_exists($actor["name"], $actors)){
				$actors[$actor["name"]]["name"] = $actor["name"]; 
				$actors[$actor["name"]]["appearence"] = 1;
				$actors[$actor["name"]]["average"] = intval($actor["movie_personal_vote"]);
				$actors[$actor["name"]]["movies"] = [$actor["movie_title"]];
			}
			else{
				$actors[$actor["name"]]["average"] = (($actors[$actor["name"]]["average"]*$actors[$actor["name"]]["appearence"])+ intval($actor["movie_personal_vote"]))/($actors[$actor["name"]]["appearence"]+1);
				$actors[$actor["name"]]["appearence"] ++;
				$actors[$actor["name"]]["movies"][] = $actor["movie_title"];
			}
		}
		$response["id"] = 1;
		$response["message"] = "Actors succesfully retrieved";
		$response["actors"] = $actors;
	}
	else{
		$response["id"] = 0;
		$response["message"] = "Error: ".mysql_error();
		$response["actors"] = -1;
	}
	return $response;
}

function get_genres(){
	$query = "SELECT  categories.category_name FROM categories";
	$result = mysql_query($query);
	if($result){
		while ($genre = mysql_fetch_assoc($result)){
			$genres[] = $genre["category_name"];
		}
		$response["id"] = 1;
		$response["message"] = "Genres succesfully retrieved";
		$response["genres"] = $genres;
	}
	else{
		$response["id"] = 0;
		$response["message"] = "Error: ".mysql_error();
		$response["genres"] = -1;
	}
	
	echo json_encode($response);
}

/*
function get_actors_stats($user_id){
	//select all actors starring in animated movies
	$query = "	SELECT actors.id, actors.name, COUNT(*) AS appearence, AVG(movie_personal_vote) AS average 
				FROM 	actors 
						JOIN rel_actors_movies 
						JOIN movies
						JOIN rel_users_movies
							ON id_user = '$user_id'
							AND movies.id_movie_imdb = rel_users_movies.id_movie
				WHERE 	actors.id = rel_actors_movies.id_actor 
						AND rel_actors_movies.id_movie=movies.id_movie_imdb  
						AND movie_personal_vote > 0
				GROUP BY name";
	$result = mysql_query($query);
	if($result){
		while ($actor = mysql_fetch_assoc($result)){
			$actor["appearence"] = floatval($actor["appearence"]);
			$actor["average"] = floatval($actor["average"]);
			$actors[] = $actor;
		}
		$response["id"] = 1;
		$response["message"] = "Actors succesfully retrieved";
		$response["actors"] = $actors;
	}
	else{
		$response["id"] = 0;
		$response["message"] = "Error: ".mysql_error();
		$response["actors"] = -1;
	}
	return $response;
}
*/


//retrieve categories given a movie id
function get_single_movie_categories($id){
	$query = "SELECT * FROM categories JOIN rel_categories_movies WHERE rel_categories_movies.id_movie='$id' AND categories.id = rel_categories_movies.id_category";
	if($result = mysql_query($query)){
		while($category = mysql_fetch_assoc($result)){
			$categories[] = $category["category_name"];
		}
		$res["id"] = 1;
		$res["message"] = "Category succesfully retrieved";
		$res["categories"] = $categories;
	}
	else {
		$res["id"] = 0;
		$res["message"] = "Error: ".mysql_error();
		$res["categories"] = -1;
	}
	return $res;
}
//////////END INTERFACE WITH DATABASE//////////

//////////SUPPORT FUNCTIONS//////////
function count_occurences($array){
	$i = 0;
	$vett=[];
	foreach($array as $el){
		$year = $el["date"][4];
		$month = convertMonthToNumbers($el["date"][1]);
		if(array_key_exists($year, $vett)){
			if(array_key_exists($month, $vett[$year])){
				$vett[$year][$month]["movies_watched"] = $vett[$year][$month]["movies_watched"]+1;
				$vett[$year][$month]["minutes_watched"] = $vett[$year][$month]["minutes_watched"]+intval($el["movie_runtime"]);
			}
			else{
				$vett[$year][$month]["movies_watched"] = 1;
				$vett[$year][$month]["minutes_watched"] = intval($el["movie_runtime"]);
			}
		}
		else{
			$vett[$year][$month]["movies_watched"] = 1;
			$vett[$year][$month]["minutes_watched"] = intval($el["movie_runtime"]);
		}
	}
	return $vett;
}

function convertMonthToNumbers($month){
	switch($month){
		case "Jan": return 1;
		case "Feb": return 2;
		case "Mar": return 3;
		case "Apr": return 4;
		case "May": return 5;
		case "Jun": return 6;
		case "Jul": return 7;
		case "Aug": return 8;
		case "Sep": return 9;
		case "Oct": return 10;
		case "Nov": return 11;
		case "Dec": return 12;
	}
}
//////////END SUPPORT FUNCTIONS//////////