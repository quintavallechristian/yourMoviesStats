var app = angular.module('yourMovieStats')
app.controller('FilmsStatsController', function(Api, $mdSidenav) {
	//stats
	this.finished = false;
	this.data = {};
	this.data.movies = [];
	this.data.displayedMovies = [];
	this.retrievedData = {};
	this.genres = {};
	this.lowerBound = 0;
	this.higherBound = 10;
	this.beginInterval = 1900;
	this.endInterval = 2016;
	this.limit = 10;
	this.orderingField = "-movie_personal_vote";
	this.selectedGenres = [];
	this.animationSelected = false;
	this.pickedGenres = [];
	this.pickedLower = 0;
	this.pickedHigher = 10;
	this.pickedBegin = 1900;
	this.pickedEnd = 2016;
	
	this.genres = ["war", "adventure"];
	
	controller = this;
	this.verticalSlider = {
						  value: 10,
						  options: {
							onChange: function(id) {
							},
							floor: 5,
							ceil: 100,
							vertical: true,
							showSelectionBar: true,
							getSelectionBarColor:function(value) {
								return '#01579B';
							},
							getPointerColor:function(value) {
								return '#01579B';
							},
						  }
						};
	
	Api.genresStats()
	.success(function(data){
		controller.genres = data.genres;
	});
	
	Api.filmsStats()
	.success(function(data) {
		i=0;
		angular.forEach( data.movies, function( val, key ) { 
				controller.data.movies[i] = val;
				controller.data.movies[i]["movie_personal_vote"] = parseInt(val["movie_personal_vote"]);
				i++;
		});
		controller.data.displayedMovies = controller.data.movies;
		controller.finished = true;
		
		lineChartData = setUpLineChart(controller.data.movies, controller.orderingField, controller.beginInterval, controller.endInterval, controller.selectedGenres);
		if(controller.orderingField == "+movie_personal_vote" || controller.orderingField == "-movie_personal_vote"){
			lineChartData.options = {tooltipTemplate: "<%if(label != 'Non votato'){%>Hai dato <%=label%> a <%=value%> film <%}%> <%if(label == 'Non votato'){%>Non hai votato <%=value%> film<%}%>"};
		}
		else{
			lineChartData.options = {showTooltips: true};
		}
		controller.chartData = lineChartData;
	});

	this.setOrderingField = function(val){
		if(controller.orderingField == '-'+val){
			controller.orderingField = '+'+val;
		}
		else{
			controller.orderingField = '-'+val;
		}
		console.log(controller.orderingField);
		lineChartData = setUpLineChart(controller.data.movies, controller.orderingField, controller.beginInterval, controller.endInterval, controller.selectedGenres);
		if(controller.orderingField == "+movie_personal_vote" || controller.orderingField == "-movie_personal_vote"){
			lineChartData.options = {tooltipTemplate: "<%if(label != 'Non votato'){%>Hai dato <%=label%> a <%=value%> film <%}%> <%if(label == 'Non votato'){%>Non hai votato <%=value%> film<%}%>"};
		}
		else{
			lineChartData.options = {showTooltips: true};
		}
		controller.chartData = lineChartData;
	}
	
	this.setLimit = function(val){
		controller.limit = val;
		lineChartData = setUpLineChart(controller.data.movies, controller.orderingField, controller.beginInterval, controller.endInterval, controller.selectedGenres);
		controller.chartData = lineChartData;
	}
	this.setBounds = function(lower, upper){
		controller.lowerBound = lower;
		controller.higherBound = upper;
	}
	
	this.resetFilters = function(){
		controller.genres = {};
		controller.lowerBound = 0;
		controller.higherBound = 10;
		controller.beginInterval = 1900;
		controller.endInterval = 2016;
		controller.data.displayedMovies = controller.filterGenres(controller.selectedGenres);
		lineChartData = setUpLineChart(controller.data.movies, controller.orderingField, controller.beginInterval, controller.endInterval, controller.selectedGenres);
		if(controller.orderingField == "+movie_personal_vote" || controller.orderingField == "-movie_personal_vote"){
			lineChartData.options = {tooltipTemplate: "<%if(label != 'Non votato'){%>Hai dato <%=label%> a <%=value%> film <%}%> <%if(label == 'Non votato'){%>Non hai votato <%=value%> film<%}%>"};
		}
		else{
			lineChartData.options = {showTooltips: true};
		}
		controller.chartData = lineChartData;
	}
	this.getOrderingField = function(val){
		if(controller.orderingField.indexOf(val) != -1){ return true; }
		else{ return false; };
	}
	
	this.getLowerBound = function(val){
		if(controller.lowerBound == val){ return true; }
		else{ return false; }
	}
	
	this.chartClick = function(points, evt){
		if(points[0].label == "Non votato"){
			points[0].label = 0;
		}
		controller.setBounds(points[0].label, points[0].label);
	}
	
	this.filters = function (lower, higher, begin, end){
		return function(item){
			return item["movie_personal_vote"] >= lower && item["movie_personal_vote"] <= higher && item['movie_year'] >= begin && item['movie_year'] <= end;
		}
	}
	
	this.filterGenres = function(genres){
		if(genres.length == 0) {
			return controller.data.movies;
		}
		else{
			returnedGenres = [];
			if(controller.animationSelected){
				for(i = 0; i<controller.data.movies.length; i++){
					for(j=0; j<genres.length; j++){
						if(controller.data.movies[i]["categories"].indexOf(genres[j]) != -1 && controller.data.movies[i]["categories"].indexOf("animation") != -1){
							returnedGenres.push(controller.data.movies[i]);
							break;
						}
					}
				}
			}
			else{
				for(i = 0; i<controller.data.movies.length; i++){
					for(j=0; j<genres.length; j++){
						if(controller.data.movies[i]["categories"].indexOf(genres[j]) != -1){
							returnedGenres.push(controller.data.movies[i]);
							break;
						}
					}
				}
			}
			return returnedGenres;
		}
	}
	
	this.showFilters = buildToggler('right');
	
	function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            console.log("toggle " + navID + " is done");
          });
      }
    }
	
	this.applyFilters = function (lower, higher, begin, end, genres) {
		console.log(lower);
		controller.lowerBound  = lower;
		controller.higherBound = higher;
		controller.beginInterval = begin;
		controller.endInterval = end;
		controller.selectedGenres = genres;
		
		controller.data.displayedMovies = controller.filterGenres(controller.selectedGenres);
		lineChartData = setUpLineChart(controller.data.movies, controller.orderingField, controller.beginInterval, controller.endInterval, controller.selectedGenres);
		controller.chartData = lineChartData;
		$mdSidenav('right').close();
	};
	
	this.areFiltersChanged = function(){
		return 	controller.selectedGenres.length != 0 || 
				controller.lowerBound != 0 ||
				controller.higherBound != 10 ||
				controller.beginInterval != 1900 ||
				controller.endInterval != 2016;
	}
	
	this.resetFilters = function(){
		controller.selectedGenres = [];
		controller.lowerBound = 0;
		controller.higherBound = 10;
		controller.beginInterval = 1900;
		controller.endInterval = 2016;
		controller.data.displayedMovies = controller.filterGenres(controller.selectedGenres);
		lineChartData = setUpLineChart(controller.data.movies, controller.orderingField, controller.beginInterval, controller.endInterval, controller.selectedGenres);
		controller.chartData = lineChartData;
	}
	
	//create ordered list of numbers
	this.range = function(a, b, step) {
		step = step || 1;
		var input = [];
		if(a>b){
			for (var i = a; i >= b; i -= step) {
				input.push(i);
			}
		}
		else{
			for (var i = a; i <= b; i += step) {
				input.push(i);
			}
		}
		return input;
	};
});

function setUpLineChart(data, field, begin, end, genres){
	//object with all drawing parameters. Initialization
	var drawingData = []; 
	drawingData.dataset = [];
	drawingData.labels = [];
	drawingData.colours = [];

	if(field == "+movie_personal_vote" || field == "-movie_personal_vote"){
		var values = [0,0,0,0,0,0,0,0,0,0,0];
		drawingData.labels = ["Non votato", "1", "2","3","4","5","6","7","8","9","10"];
		angular.forEach( data, function( val, key ) {
			if(val.movie_year >= begin && val.movie_year <= end){
				if(genres.length == 0){
					values[val.movie_personal_vote] ++;
				}
				else{
					flag = false;
					for(i=0; i<genres.length;i++){
						if(val.categories.indexOf(genres[i]) != -1){
							flag = true;
						};
					}
					if(flag) values[val.movie_personal_vote] ++;
				}
			}
		});
		drawingData["dataset"][0] = values;
		var colours = {fillColor: "#01579B",
			strokeColor: "#01579B",
			highlightFill: "#0288D1",
			highlightStroke: "#0288D1",
			};
		drawingData["colours"][0] = colours;
	}
	else if(field == "+movie_year" || field == "-movie_year"){
		var values = {};
		angular.forEach( data, function( val, key ) {
			if(val.movie_year >= begin && val.movie_year <= end && val.movie_personal_vote > 0){
				if(genres.length == 0){
					if(!(val.movie_year in values)){
						values[val.movie_year] = {};
						values[val.movie_year]["sum"] = val.movie_personal_vote;
						values[val.movie_year]["total"] = 1;
					}
					else{
						values[val.movie_year]["sum"] += val.movie_personal_vote;
						values[val.movie_year]["total"] ++;
					}
				}
				else{
					flag = false;
					for(i=0; i<genres.length;i++){
						if(val.categories.indexOf(genres[i]) != -1){
							flag = true;
						};
					}
					if(flag){
						if(!(val.movie_year in values)){
							values[val.movie_year] = {};
							values[val.movie_year]["sum"] = val.movie_personal_vote;
							values[val.movie_year]["total"] = 1;
						}
						else{
							values[val.movie_year]["sum"] += val.movie_personal_vote;
							values[val.movie_year]["total"] ++;
					}
					}
				}
			}
		});
		res = [];
		angular.forEach( values, function( val, key ) {
			if(val.total >= 3){
				drawingData.labels.push(key);
				res.push(parseFloat(val.sum/val.total).toFixed(2));
			}
		});
		drawingData.dataset[0] = res;
		var colours = {fillColor: "rgba(0,0,0,0)",
			strokeColor: "#01579B",
			highlightFill: "rgba(0,0,0,0)",
			highlightStroke: "#0288D1",
			};
		drawingData["colours"][0] = colours;
	}
	drawingData["colours"][0] = colours;
	
	return drawingData;
}