angular.module('yourMovieStats')
.filter('minutesToTime', function() {
	return function(minutes) {
		var days = Math.floor(minutes / 1440);
		var hours = Math.floor((minutes % 1440) /60);
		var minutes = Math.floor((minutes % 86400) % 60);
		var timeString = '';
		if(days > 0) timeString += (days > 1) ? (days + " g ") : (days + " day ");
		if(hours > 0) timeString += (hours > 1) ? (hours + " h ") : (hours + " hour ");
		return timeString;
	}
});

angular.module('yourMovieStats')
.filter('translate', function() {
	return function(word, lang) {
		if(lang == "it"){
			switch(word){
				case "minutes_watched": return "minuti spesi"; break;
				case "movies_watched": return "film visti"; break;
				case "months": return "mesi"; break;
				case "years": return "anni"; break;
				case "action": return "Azione"; break;
				case "sci_fi": return "Sci-Fi"; break;
				case "mystery": return "Mistero"; break;
				case "thriller": return "Thriller"; break;
				case "drama": return "Drammatico"; break;
				case "crime": return "Crime"; break;
				case "adventure": return "Avventura"; break;
				case "fantasy": return "Fantastico"; break;
				case "biography": return "Biografico"; break;
				case "history": return "Storico"; break;
				case "comedy": return "Commedia"; break;
				case "romance": return "Romantico"; break;
				case "family": return "Familiare"; break;
				case "animation": return "Animazione"; break;
				case "musical": return "Musical"; break;
				case "horror": return "Horror"; break;
				case "war": return "Guerra"; break;
				case "music": return "Musicale"; break;
				case "sport": return "Sportivo"; break;
				case "western": return "Western"; break;
				default: return word;
			}
		}
	}
});
	
angular.module('yourMovieStats')
.filter('properlyDisplay', function() {
	return function(word) {
		switch(word){
			case 0: return "Non votato"; break;
			default: return word;
		}
	}
});