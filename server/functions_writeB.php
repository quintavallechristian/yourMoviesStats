<?php

//Response legend
//IDs
//0 -> error
//1 -> succesfull addition/binding
//2 -> element already in the database

ini_set('max_execution_time', 300000); //300 seconds = 5 minutes
require_once('inc/connect.php');
$db = new DB_CONNECT();

//read csv file containing user watchlist
function read_csv($file){
	while(! feof($file)){
		$rows[] = fgetcsv($file);
	}
	return $rows;
}

//adds movies to the Db if necessary
function addMoviesToDb($movieInstance){
	
	$idimdb = mysql_real_escape_string($movieInstance[1]);
	$name = mysql_real_escape_string($movieInstance[5]);
	$type = mysql_real_escape_string($movieInstance[6]);
	$personal_vote = mysql_real_escape_string($movieInstance[8]);
	$imdb_vote = mysql_real_escape_string($movieInstance[9]);
	$runtime = mysql_real_escape_string($movieInstance[10]);
	$year = mysql_real_escape_string($movieInstance[11]);
	$image = "";
	
	$query = "SELECT * FROM movies WHERE id_movie_imdb = '$idimdb'";
	$result = mysql_query($query);
	if($result){
		if(mysql_num_rows($result) == 0){
			$wikidataId = getWikidataId($idimdb);
			if($wikidataId != ""){
				$wikidataId = substr($wikidataId, strpos($wikidataId, "Q"));
				$image = mysql_real_escape_string(getImage($wikidataId));
			}
			$query = "INSERT INTO movies VALUES ('','$name','$idimdb', '$type', '$runtime', '$imdb_vote', '$year', '$image')";
			$query_result = mysql_query($query);
			if($query_result){
				$response['id'] = 1;
				$response['message'] = "Movie successfuly added";
			}
			else{ //must be unreachable
				$response['id'] = 0;
				$response['message'] = "MySql error: ". mysql_error();
				return $response;
			}
		}
		else{
			$response['id'] = 2;
			$response['message'] = "Movie already in our database";
		}
	}
	else{ //must be unreachable
		$response['id'] = 0;
		$response['message'] = "MySql error: ". mysql_error();
		return $response;
	}
	return $response;
}

//creates binding between the owner of the read csv and the movies in its watchlist
//This function is called whenever the csv file is read. The reason for that is that a  
//watchlist may contain movies that were already added in the database by other users
function bindUsersToMovies($id_user, $id_imdb, $userPersonalVote, $date){
	
	//checks if the binding was already present in the db
	$query = "SELECT * FROM rel_users_movies WHERE id_user = '$id_user' AND id_movie = '$id_imdb'";
	$result = mysql_query($query);
	if($result){
		if(mysql_num_rows($result) == 0){ //if not...
			$query = "INSERT INTO rel_users_movies VALUES ('','1','$id_imdb', '$userPersonalVote', '$date')"; //creates it
			$result = mysql_query($query);
			if($result){
				$response['id'] = 1;
				$response['message'] = "Binding succesfully created";
				return $response;
			}
			else{ //must be unreachable
				$response['id'] = 0;
				$response['message'] = "MySql error: ". mysql_error();
				return $response;
			} 
		}
		else{
			$response['id'] = 2;
			$response['message'] = "The user already added this film before";
			return $response;
		}
	}
	else{ //must be unreachable
		$response['id'] = 0;
		$response['message'] = "MySql error: ". mysql_error();
		return $response;
	}
}

//adds actors to Db if necessary and creates binding with corresponding movies.
//This function is called only when a new movie is added in the database
function addActorsToDb($id_imdb){
	$actors = "";
	//get actor list from WikiData
	$actors = getActors($id_imdb);
	if(!empty($actors["actors"])){
		foreach($actors["actors"] as $actor){
			$actorName = mysql_real_escape_string($actor["name"]);

			//check if the actor is already inserted in the database
			$query = "SELECT * FROM actors WHERE name = '$actorName'";
			$result = mysql_query($query);
			if($result){
				if(mysql_num_rows($result)){ //if so...
					$row = mysql_fetch_array($result);
					$actor_id = $row["id"]; //get id
				}else{ //else...
					$image = mysql_real_escape_string(getImage($actor["id"]));
					$queryInsert = "INSERT INTO actors VALUES ('', '$actorName', '$image')"; //insert it
					$result = mysql_query($queryInsert);
					if($result){
						$actor_id = mysql_insert_id(); //...and get id
					}
					else{ //must be unreachable
						$response['id'] = 0;
						$response['message'] = "MySql error: ". mysql_error();
						return $response;
					} 
				}
			}else{ //must be unreachable
				$response['id'] = 0;
				$response['message'] = "MySql error: ". mysql_error();
				return $response;
			} 
			
			//creates binding
			$queryInsert = "INSERT INTO rel_actors_movies VALUES ('', '$actor_id', '$id_imdb')";
			$result = mysql_query($queryInsert);
			if($result){
				$response['id'] = 1;
				$response['message'] = "Binding succesfully created";
			}
			else{ //must be unreachable
				$response['id'] = 0;
				$response['message'] = "MySql error: ". mysql_error();
				return $response;
			} 
		}
	}
	else{
		$response['id'] = 0;
		$response['message'] = "I can't find actors for the movie with id ". $actors["id_imdb"];
		return $response;
	}
	return $response;
}

//adds genres to Db if necessary and creates binding with corresponding movies.
//This function is called only when a new movie is added in the database
function addGenresToDb($id_imdb, $genres){
	
	$categories_array = explode(", ", $genres);
		
	foreach($categories_array as $category){
		$category = mysql_real_escape_string($category);
		//Check if the category is already present in the database
		$query = "SELECT * FROM categories WHERE category_name = '$category'";
		$result = mysql_query($query);
		if($result){
			if(mysql_num_rows($result)){ //if so...
				$row= mysql_fetch_array($result);
				$category_id = $row["id"]; //get id
			}
			else{ //else...
				$query = "INSERT INTO categories VALUES ('','$category')"; //insert it
				$result = mysql_query($query);
				if($result){
					$category_id = mysql_insert_id(); //...and get id
				}
				else{
					$response['id'] = 0;
					$response['message'] = "MySql error: ". mysql_error();
					return $response;
				}
			}
		}else{ //must be unreachable
			$response['id'] = 0;
			$response['message'] = "MySql error: ". mysql_error();
			return $response;
		}
		
		//creates binding
		$query = "INSERT INTO rel_categories_movies VALUES ('','$category_id','$id_imdb')";
		$result = mysql_query($query);
		if($result){
			$response['id'] = 1;
			$response['message'] = "Binding succesfully created";
		}
		else{ //must be unreachable
			$response['id'] = 0;
			$response['message'] = "MySql error: ". mysql_error();
			return $response;
		}
	}
	return $response;
}

//adds users to Db
function addUsersToDb($name, $surname, $email, $nickname, $image){
	$name = mysql_real_escape_string($name);
	$surname = mysql_real_escape_string($surname);
	$email = mysql_real_escape_string($email);
	$nickname = mysql_real_escape_string($nickname);
	$image = mysql_real_escape_string($image);
	$query = "SELECT * FROM users WHERE user_email = '$email'";
	$result = mysql_query($query)
	if($result){
		if(mysql_num_rows($result) == 0){
			$query = "INSERT INTO movies VALUES ('','$name','$surname', '$email', '$nickname', '$image')";
			$query_result = mysql_query($query);
			if($query_result){
				$response['id'] = 1;
				$response['message'] = "Movie successfuly added";
			}
			else{ //must be unreachable
				$response['id'] = 0;
				$response['message'] = "MySql error: ". mysql_error();
				return $response;
			}
		}
		else{
			$response['id'] = 2;
			$response['message'] = "User already in database";
		}
	}
	else{ //must be unreachable
		$response['id'] = 0;
		$response['message'] = "MySql error: ". mysql_error();
		return $response;
	}
	return $response;
}

//gets actors name from wikidata using SPARQL query
function getActors($id_imdb){
	$actors["id_imdb"] = $id_imdb;
	//gets italian json results and decodes it
	$wikidataJson = file_get_contents("https://query.wikidata.org/sparql?format=json&query=SELECT%20?cast%20?castLabel%20WHERE{%20?film%20wdt:P345%20%22".$id_imdb."%22%20.%20?film%20wdt:P161%20?cast%20.%20SERVICE%20wikibase:label%20{%20bd:serviceParam%20wikibase:language%20%22en%22%20}%20}");
	$wikidataObj = json_decode($wikidataJson);
	$i = 0;
	foreach($wikidataObj->results->bindings as $actorInstance){
		$actorsEntity = $actorInstance->cast->value;
		$actorsId = substr($actorsEntity, strpos($actorsEntity, "Q"));

		$actors["actors"][$i]["name"] = $actorInstance->castLabel->value;
		$actors["actors"][$i]["id"] = $actorsId;
		$i++;
	}
	return $actors;
}

function getImage($id){
	$dbpediaJson = file_get_contents("http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+owl%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23%3E%0D%0APREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0D%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0D%0APREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0D%0APREFIX+dc%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E%0D%0APREFIX+%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F%3E%0D%0APREFIX+dbpedia2%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2F%3E%0D%0APREFIX+dbpedia%3A+%3Chttp%3A%2F%2Fdbpedia.org%2F%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0ASELECT+%3Ffilm+%3Fimg%0D%0AWHERE+%7B%0D%0A%3Ffilm+owl%3AsameAs+%3Chttp%3A%2F%2Fwikidata.dbpedia.org%2Fresource%2F".$id."%3E.%0D%0A%3Ffilm+foaf%3Adepiction+%3Fimg.%0D%0A%7D&output=json");
	$dbpediaObj = json_decode($dbpediaJson);
	if(!empty($dbpediaObj->results->bindings)){
		return $dbpediaObj->results->bindings[0]->img->value;
	}
	else{
		return "";
	}
}

function getWikidataId($id_imdb){
	$wikidataJson = file_get_contents("https://query.wikidata.org/sparql?format=json&query=SELECT%20?film%20WHERE{%20?film%20wdt:P345%20%22".$id_imdb."%22%20.%20}");
	$wikidataObj = json_decode($wikidataJson);
	if(!empty($wikidataObj->results->bindings)){
		return $wikidataObj->results->bindings[0]->film->value;
	}
	else{
		return "";
	}
}

?>