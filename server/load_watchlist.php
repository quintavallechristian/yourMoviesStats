<?php
require_once('functions_write.php');

//global variable
$moviesAdded = 0; //count the number of movie added in the database

//read csv
$file = fopen("../WATCHLIST.csv","r");
$userMovies = read_csv($file);

for($i=1;$i<count($userMovies)-1;$i++){ //count($userMovies)-1
	if($userMovies[$i][1] != 'const'){
		$id_imdb = mysql_real_escape_string($userMovies[$i][1]); //imdb id
		$date = mysql_real_escape_string($userMovies[$i][2]); //date when the film was added in the watchlist
		$userPersonalVote = mysql_real_escape_string($userMovies[$i][8]); //list of movie's genres
		$genres = $userMovies[$i][12]; //list of movie's genres
		
		//adds movies to the database
		$addMovieResponse = addMoviesToDb($userMovies[$i]);
		
		//Check if the movie was added in the database
		if($addMovieResponse['id'] == 1){ //if so...
			//counts how many movies are added
			$moviesAdded++;
			//adds actors to the database (if necessary) and create the binding with the corresponding movie
			$addActorResponse = addActorsToDb($id_imdb);
			if($addActorResponse["id"] == 0){
				echo $addActorResponse["message"]."<br>";
			}
			//adds genres to the database (if necessary) and create the binding with the corresponding movie
			$addGenreResponse = addGenresToDb($id_imdb, $genres);
		}
		
		//binds user and movie
		$bindUserResponse = bindUsersToMovies(1, $id_imdb, $userPersonalVote, $date); //1 must be replaced with user id
	}
}
?>