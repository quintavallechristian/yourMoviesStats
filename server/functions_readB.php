<?php

require_once('inc/connect.php');
$db = new DB_CONNECT();

//////////INTERFACE WITH API//////////
//shows user stats in home page
function show_user_stats($user_id){
	//get list of seen movies
	$movies_data = get_movies_stats("", $user_id);
	if($movies_data["id"] == 1){
		
		//get the watch time of the user
		$watchtime_data = get_full_watchtime($user_id);
		if($watchtime_data["id"] == 1){
			$response["id"] = 1;
			$response["watchtime"] = $watchtime_data["data"];
			$response["movie_data"] = $movies_data["movie_data"];
			$response["view_history"] = $movies_data["movies_number"];
			$response["message"] = $movies_data["message"];
		}
		else{
			$response["id"] = 0;
			$response["watchtime"] = -1;
			$response["movie_data"] = -1;
			$response["view_history"] = -1;
			$response["message"] = $watchtime_data["message"];
		}
	}
	else{
		$response["id"] = 0;
		$response["watchtime"] = -1;
		$response["movie_data"] = -1;
		$response["view_history"] = -1;
		$response["message"] = $movies_data["message"];
	}
	echo json_encode($response);
}

//shows seen movies stats in movies page
function show_movies_stats($title, $id_user){
	$basic_info = get_movies_stats($title, $id_user);
	$response["id"] = $basic_info["id"];
	$response["message"] = $basic_info["message"];
	$response["movie_stats"] = $basic_info["movie_data"];
	
	//output
	echo json_encode($response);
}

//shows single movie stats
function show_movie_stats($movie_id, $id_user){
	$basic_info = get_movie_stats($movie_id, $id_user);
	$response["id"] = $basic_info["id"];
	$response["message"] = $basic_info["message"];
	$response["movie_stats"] = $basic_info["movie_stats"];
	if($movie_id!= ""){
		$actor_list = get_full_actor_list($movie_id);
		if($actor_list["id"] != 0){
			$response["starring_actors"] = $actor_list["actors_stats"];
		}
	}
	
	//output
	echo json_encode($response);
}

//shows actors and stats and infos on users relation with them
function show_actors_stats($limit, $field, $user_id){
	$range = 1; //minimum amount of movies for an actor to be considered
	$actors_stats = get_actors_stats($limit, $field, $range, $user_id);
	
	$response["id"] = $actors_stats["id"];
	$response["message"] = $actors_stats["message"];
	$response["actors_stats"] = $actors_stats["actors_stats"];
	
	//output
	echo json_encode($response);
}

//shows single actor stats and infos on users relation with him
function show_actor_stats($id, $user_id){
	$actors_stats = get_actor_stats($id, $user_id);
	
	$response["id"] = $actors_stats["id"];
	$response["message"] = $actors_stats["message"];
	$response["actor_stats"] = $actors_stats["actor_stats"];
	
	//output
	echo json_encode($response);
}

//////////END INTERFACE WITH API//////////

//////////INTERFACE WITH DATABASE//////////

//returns all the movies seen by a certain user and his history (how many movies did he see for each month)
function get_movies_stats($title, $user_id){
	$i=0;
	$query = "SELECT * FROM movies JOIN rel_users_movies ON id_movie = id_movie_imdb AND id_user = '$user_id'";
	if($title != ""){
		$query .= "WHERE movie_title LIKE '%".mysql_real_escape_string($title)."%'";
	}
	$result = mysql_query($query);
	if($result){
		while ($film = mysql_fetch_assoc($result)){
			$movie_data[$i] = $film;
			
			$date = explode( " ", preg_replace('/\s+/', ' ',$film["date_added"] ));
			$movie_data[$i]["date"] = $date;
			
			$categories = get_categories($film["id_movie_imdb"]);
			if($categories["id"] != 0){
				$movie_data[$i]["categories"] = $categories["categories"];
			}
			
			$i++;
		}
		$movie_data = array_reverse($movie_data);
		$res["id"] = 1;
		$res["movie_data"] = $movie_data;
		$res["movies_number"] = count_occurences($movie_data);
		$res["message"] = "Data successfuly retrieved";
	}
	else{
		$res["id"] = 0;
		$res["movie_data"] = -1;
		$res["movies_number"] = -1;
		$res["message"] = "Error: ".mysql_error();
	}
	return $res;
}

//returns stats given a movie id
function get_movie_stats($movie_id, $user_id){
	//singe movie stats
	if($movie_id!= ""){
		$query = "SELECT * FROM movies LEFT OUTER JOIN rel_users_movies ON id_movie = id_movie_imdb AND id_user = '$user_id' WHERE movies.id_movie_imdb='$movie_id'";
		$result = mysql_query($query);
		if($result){
			$stats = mysql_fetch_assoc($result);
			$stats["categories"] = get_categories($movie_id)["categories"];
			$res["id"] = 1;
			$res["message"] = "Movie stats successfuly retrieved";
			$res["movie_stats"] = $stats;
		}
		else{
			$res["id"] = 0;
			$res["message"] = "Error: ".mysql_error();
		}
	}
	return $res;
}

//retrieve actors' informations and infos on user relations with them
function get_actors_stats($limit, $field, $range, $user_id){
	//select all actors starring in animated movies
	if($field == "aniappearence"){
		$query = "SELECT actors.id, actors.name, COUNT(*) AS appearence, AVG(movie_personal_vote) AS average 
		FROM 	actors 
				JOIN rel_actors_movies 
				JOIN movies 
				JOIN categories 
				JOIN rel_categories_movies
				JOIN rel_users_movies
					ON id_user = '$user_id'
					AND movies.id_movie_imdb = rel_users_movies.id_movie
		WHERE 	actors.id = rel_actors_movies.id_actor 
				AND rel_actors_movies.id_movie=movies.id_movie_imdb 
				AND movies.id_movie_imdb=rel_categories_movies.id_movie 
				AND rel_categories_movies.id_category = categories.id 
				AND categories.category_name = 'animation' 
		GROUP BY name";
		$result = mysql_query($query);
		
		//users wants animated movies ordered by appearence. Change value for future use.
		$field = "appearence"; 
	}
	//select all actors, both animated films and featured films
	else{
		$query = "SELECT actors.id, actors.name, COUNT(*) AS appearence, AVG(movie_personal_vote) AS average 
		FROM 	actors 
				JOIN rel_actors_movies 
				JOIN movies
				JOIN rel_users_movies
					ON id_user = '$user_id'
					AND movies.id_movie_imdb = rel_users_movies.id_movie
		WHERE 	actors.id = rel_actors_movies.id_actor 
				AND rel_actors_movies.id_movie=movies.id_movie_imdb  
		GROUP BY name";
		$result = mysql_query($query);
	}
	if($result){
		while ($row = mysql_fetch_assoc($result)){
			//mantain only the actors starring in more than $range movies
			if(intval($row["appearence"])>=$range){
				$actors_appearence[] = $row;
			}
		}
		foreach($actors_appearence as $val){
			$sorting[] = floatval($val[$field]); //get the value of the sorting field (appearence or average)
			@array_multisort($sorting, SORT_DESC, $actors_appearence); //sort $actors_appearence according to $sorting
		}
		//number of actors to be show may stay in MIN($limit, count($actors_appearence)-1)
		if($limit>count($actors_appearence)-1){$limit = count( $actors_appearence)-1;}
		for($i=0;$i<$limit;$i++){
			$actors_to_be_shown[]=$actors_appearence[$i];
		}
			$response["id"] = 1;
			$response["message"] = "Actors succesfully retrieved";
			$response["actors_stats"] = $actors_to_be_shown;
	}
	else{
		$response["id"] = 0;
		$response["message"] = "Error: ".mysql_error();
		$response["actors_stats"] = -1;
	}
	return $response;
}

//retrieve single actor's informations and infos on user relations with him
function get_actor_stats($id, $user_id){
	$i=0;
	$query = "	SELECT *, actors.img AS image FROM actors 
					JOIN rel_actors_movies 
					JOIN movies 
					LEFT OUTER JOIN rel_users_movies
                    ON rel_users_movies.id_movie = movies.id_movie_imdb
				WHERE actors.id = '$id'
				AND actors.id = rel_actors_movies.id_actor
				AND rel_actors_movies.id_movie = movies.id_movie_imdb";
	$result = mysql_query($query);
	if($result){
		//variable initialization
		$actor_stats = [];
		$actor_stats["img"] = "";
		
		//stores actor id
		$actor_stats["id"] = $id;
		
		//retrieval of actor movies
		while ($row = mysql_fetch_assoc($result)){
			//stores actor name 
			$actor_stats["name"] = $row["name"];
			
			//stores actor image
			if($actor_stats["img"] == ""){
				$actor_stats["img"] = $row["image"];
			}
			
			//stores movies infos
			$actor_stats["films"][$i]["id"] = $row["id_movie_imdb"];
			$actor_stats["films"][$i]["title"] = $row["movie_title"];
			$actor_stats["films"][$i]["duration"] = $row["movie_runtime"];
			$actor_stats["films"][$i]["personal_vote"] = $row["movie_personal_vote"];
			$actor_stats["films"][$i]["imdb_vote"] = $row["movie_imdb_vote"];
			$actor_stats["films"][$i]["categories"] = get_categories($row["id_movie_imdb"])["categories"];
			$i++;
		}
		
		//calculates the average vote of the actor
		$sum = 0;
		$count = 0;
		foreach ($actor_stats["films"] as $film) {
			if(!is_null($film["personal_vote"])){
				$count ++;
				$sum+=$film["personal_vote"];
			}
		}
		$actor_stats["appearence"] = $count;
		if($actor_stats["appearence"] != 0){
			$actor_stats["average"] = $sum/$actor_stats["appearence"];
		}
		else{
			$actor_stats["average"] = "N.A.";
		}
		
		$response["id"] = 1;
		$response["message"] = "Actor stats successfuly retrieved";
		$response["actor_stats"] = $actor_stats;
	}
	else{
		$response["id"] = 0;
		$response["message"] = "Error: ". mysql_error();
		$response["actor_stats"] = -1;
	}
	return $response;
}

//retrieve the list of actors starring in a given film
function get_full_actor_list($id){
		$i=0;
		$query = "SELECT actors.id 
		FROM actors 
		JOIN rel_actors_movies 
		WHERE rel_actors_movies.id_actor = actors.id 
		AND rel_actors_movies.id_movie='$id'";
		$result = mysql_query($query);
		if($result){
			if(mysql_num_rows($result) != 0){
				while ($actor = mysql_fetch_assoc($result)){
					$actors[$i] = get_actor_stats($actor["id"], 1)["actor_stats"];
					$i++;
				}
				foreach($actors as $val){
				$sorting[] = floatval($val["appearence"]); //get the value of the sorting field (appearence or average)
				@array_multisort($sorting, SORT_DESC, $actors); //sort $actor according to $sorting
				}
				$response["id"] = 1;
				$response["message"] = "actors successfuly retrieved";
				$response["actors_stats"][0] = $actors;
				$response["actors_stats"][1] = count($actors);
			}
			else{
				$response["id"] = 2;
				$response["message"] = "Missing actors' list";
				$response["actors_stats"] = -1;
			}
		}
		else{
			$response["id"] = 0;
			$response["message"] = "Error: ".mysql_error();
			$response["actors_stats"] = -1;
		}

		return $response;
}

//retrieve categories given a movie id
function get_categories($id){
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

//returns number of seen movies and total watch time
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
				$vett[$year][$month]["number"] = $vett[$year][$month]["number"]+1;
				$vett[$year][$month]["minutes"] = $vett[$year][$month]["minutes"]+intval($el["movie_runtime"]);
			}
			else{
				$vett[$year][$month]["number"] = 1;
				$vett[$year][$month]["minutes"] = intval($el["movie_runtime"]);
			}
		}
		else{
			$vett[$year][$month]["number"] = 1;
			$vett[$year][$month]["minutes"] = intval($el["movie_runtime"]);
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


//BOOOH
function get_common_movies($name1, $name2){
	$query='SELECT actors.id, actors.name, movie_title FROM (SELECT movie_title, id_movie FROM movies JOIN rel_actors_movies JOIN actors WHERE id_movie_imdb = id_movie AND rel_actors_movies.id_actor = actors.id AND actors.name = "'+$name1+'") AS s JOIN rel_actors_movies JOIN actors WHERE s.id_movie = rel_actors_movies.id_movie AND rel_actors_movies.id_actor = actors.id AND actors.name = "'+$name2+'"';
	$result = mysql_query($query);
		if($result){
			if(mysql_num_rows($result)>0){
			$i=0;
			while ($film = mysql_fetch_assoc($result)){
				$response[1][$i] = $film["movie_title"];
				$i++;
			}
			$ris[0] = $actors;
			$ris[1] = count($actors);
			}
			else{
				$response[0] = 1;
				$response[1][0] = mysql_num_rows($result);
				$response[1][1] = $name1;
				$response[1][2] = $name2;
				$response[1][3] = [];
				$response[2] = "No common films";
			}
		}
		else{
			$response[0] = 0;
			$response[1] = [];
			$response[2] = "Problem";
		}

		return $response;
}
?>