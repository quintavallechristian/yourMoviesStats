<?php

//Response legend
//IDs
//0 -> error
//1 -> succesfull addition/binding
//2 -> element already in the database

define("TMDB_APY_KEY", "468996e7a47ff4e46a266ce02cf013b0");

require_once('inc/connect.php');
$db = new DB_CONNECT();

//adds movies to the Db if necessary
function addMoviesToDb($n){
	
	$movieData = getMovieData($n);
	
	if($movieData["id"] == 1){
		$title = mysql_real_escape_string($movieData["title"]);
		$idimdb = mysql_real_escape_string($movieData["idimdb"]);
		$type = "movie";
		$runtime = mysql_real_escape_string($movieData["runtime"]);
		$year = mysql_real_escape_string($movieData["year"]);
		$image = mysql_real_escape_string($movieData["image"]);
	
		$query = "SELECT * FROM movies WHERE id_movie_imdb = '$idimdb'";
		$result = mysql_query($query);
		if($result){
			if(mysql_num_rows($result) == 0){
				$query = "INSERT INTO movies VALUES ('','$title','$idimdb', '$type', '$runtime', '', '$year', '$image')";
				$query_result = mysql_query($query);
				if($query_result){
					$response['id'] = 1;
					$response['message'] = "Movie successfuly added";
				}
				else{ //must be unreachable
					$response['id'] = 2;
					$response['message'] = "MySql error: ". mysql_error();
					return $response;
				}
			}
			else{
				$response['id'] = 3;
				$response['message'] = "Movie ".$title." already in our database";
			}
		}
		else{ //must be unreachable
			$response['id'] = 4;
			$response['message'] = "MySql error: ". mysql_error();
			return $response;
		}
	}
	else{
		$response['id'] = $movieData["id"];
		$response['message'] = $movieData["message"];
		return $response;
	}
	return $response;
}

function getMovieData($id){
	$movie["title"] = "";
	$movie["idimdb"] = "";
	$movie["year"] = "";
	$movie["runtime"] = "";
	$movie["image"] = "";
	$movie["actors"] = [];
	
	$curl_handle=curl_init();
	curl_setopt($curl_handle, CURLOPT_URL,'http://api.themoviedb.org/3/movie/'.$id.'?api_key='.TMDB_APY_KEY.'&append_to_response=credits,images');
	curl_setopt($curl_handle, CURLOPT_CONNECTTIMEOUT, 2);
	curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($curl_handle, CURLOPT_USERAGENT, 'Your application name');
	$responseJson = curl_exec($curl_handle);
	curl_close($curl_handle);
	$response = json_decode($responseJson);
	if(!empty($response) && !isset($response->status_code)){
		if(isset($response->imdb_id)){
			$movie["id"] = 1;
			$movie["message"] = "Movie retrieved";
			
			$movie["title"] = $response->title;
			$movie["idimdb"] = $response->imdb_id;
			$movie["year"] = explode("-", $response->release_date)[0];
			$movie["runtime"] = $response->runtime;
			if(!empty($response->images->posters)){
				$movie["image"] = $response->images->posters[0]->file_path;
			}
			foreach($response->credits->cast as $actor){
				$movie["actors"][] = $actor->name;
			}
			return $movie;
		}
		else{
			$movie["id"] = 5;
			$movie["message"] = "No id IMDB";
		}
	}
	else{
		$movie["id"] = $response->status_code;
		$movie["message"] = $response->status_message;
	}
	
	return $movie;
}

function getActorsData($id){
	$movie["title"] = "";
	$movie["idimdb"] = "";
	$movie["year"] = "";
	$movie["runtime"] = "";
	$movie["image"] = "";
	$movie["actors"] = [];
	
	$curl_handle=curl_init();
	curl_setopt($curl_handle, CURLOPT_URL,'http://api.themoviedb.org/3/movie/'.$id.'?api_key='.TMDB_APY_KEY.'&append_to_response=credits,images');
	curl_setopt($curl_handle, CURLOPT_CONNECTTIMEOUT, 2);
	curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($curl_handle, CURLOPT_USERAGENT, 'Your application name');
	$responseJson = curl_exec($curl_handle);
	curl_close($curl_handle);
	$response = json_decode($responseJson);
	if(!empty($response) && !isset($response->status_code)){
		if(isset($response->imdb_id)){
			$movie["id"] = 1;
			$movie["message"] = "Movie retrieved";
			
			$movie["title"] = $response->title;
			$movie["idimdb"] = $response->imdb_id;
			$movie["year"] = explode("-", $response->release_date)[0];
			$movie["runtime"] = $response->runtime;
			if(!empty($response->images->posters)){
				$movie["image"] = $response->images->posters[0]->file_path;
			}
			foreach($response->credits->cast as $actor){
				$movie["actors"][] = $actor->name;
			}
			return $movie;
		}
		else{
			$movie["id"] = 5;
			$movie["message"] = "No id IMDB";
		}
	}
	else{
		$movie["id"] = $response->status_code;
		$movie["message"] = $response->status_message;
	}
	
	return $movie;
}

function getActorDataFromImdbId($imdb_id){
	$movie["actors"] = [];
	
	$curl_handle=curl_init();
	curl_setopt($curl_handle, CURLOPT_URL,'http://api.themoviedb.org/3/find/'.$imdb_id.'?api_key='.TMDB_APY_KEY.'&append_to_response=credits');
	curl_setopt($curl_handle, CURLOPT_CONNECTTIMEOUT, 2);
	curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($curl_handle, CURLOPT_USERAGENT, 'Your application name');
	$responseJson = curl_exec($curl_handle);
	curl_close($curl_handle);
	$response = json_decode($responseJson);
	if(!empty($response) && !isset($response->status_code)){
		if(isset($response->imdb_id)){
			$movie["id"] = 1;
			$movie["message"] = "Actors retrieved";
			$movie["idimdb"] = $response->imdb_id;
			foreach($response->credits->cast as $actor){
				$movie["actors"][] = $actor->name;
			}
			return $movie;
		}
		else{
			$movie["id"] = 5;
			$movie["message"] = "No id IMDB";
		}
	}
	else{
		$movie["id"] = $response->status_code;
		$movie["message"] = $response->status_message;
	}
	
	return $movie;
}

?>