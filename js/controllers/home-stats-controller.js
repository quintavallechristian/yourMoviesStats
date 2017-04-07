var app = angular.module('yourMovieStats')
app.controller('HomeStatsController', function(Api, $uibModal) {
	//stats
	this.data = {};
	this.genres = {};
	//chart
	this.retrievedData = {};
	this.years = 2;
	this.period = "months";
	this.type = "bar";
	this.stat = "minutes_watched";
	this.chartData = {};

	var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/disclaimer-modal.html',
    });
	
	controller = this;
	//stats api
	Api.homeStats()
	.success(function(data) {
		controller.data = data.data;
	});
	
	Api.genreSummaryStats()
	.success(function(data) {
		controller.genres = data.data;
	});
	
	Api.movieSummaryStats()
	.success(function(data) {
		controller.movies = data.data;
		console.log(controller.movies);
	});
	
	Api.actorSummaryStats()
	.success(function(data) {
		controller.actors = data.data;
		console.log(controller.actors);
	}); 
	
	
	//chart api
	Api.homeCharts()
	.success(function(data) {
		controller.retrievedData = data.data;
		chartData = setUpChart(controller.retrievedData.movies_number, controller.period, controller.stat, controller.type, controller.years);
		chartData.options = {tooltipTemplate: "<%if (label){%><%=label%> <%}%>: <%= value %> Minuti guardati"}
		controller.chartData = chartData;
	});
	
	this.togglePeriod = function(){
		if(controller.period == "months"){
			controller.period = "years";
			chartData = setUpChart(controller.retrievedData.movies_number, controller.period, controller.stat, controller.type, controller.years);
			controller.chartData = chartData;
		}
		else{
			controller.period = "months";
			chartData = setUpChart(controller.retrievedData.movies_number, controller.period, controller.stat, controller.type, controller.years);
			controller.chartData = chartData;
		}
	}
	
	this.toggleStat = function(){
		if(controller.stat == "movies_watched"){
			controller.stat = "minutes_watched";
			chartData = setUpChart(controller.retrievedData.movies_number, controller.period, controller.stat, controller.type, controller.years);
			chartData.options = {tooltipTemplate: "<%if (label){%><%=label%> <%}%>: <%= value %> Minuti guardati"}
			controller.chartData = chartData;
		}
		else{
			controller.stat = "movies_watched";
			chartData = setUpChart(controller.retrievedData.movies_number, controller.period, controller.stat, controller.type, controller.years);
			chartData.options = {tooltipTemplate: "<%if (label){%><%=label%> <%}%>: <%= value %> Film Visti"}
			controller.chartData = chartData;
		}
	}
	
	this.setYears = function(offset){
		this.years = this.years+offset;
		chartData = setUpChart(controller.retrievedData.movies_number, controller.period, controller.stat, controller.type, controller.years);
		controller.chartData = chartData;
	}
	
	this.setPeriod = function(period){
		this.period = period;
		chartData = setUpChart(controller.retrievedData.movies_number, controller.period, controller.stat, controller.type, controller.years);
		controller.chartData = chartData;
	}
	
	this.setStat = function(stat){
		this.stat = stat;
		chartData = setUpChart(controller.retrievedData.movies_number, controller.period, controller.stat, controller.type, controller.years);
		if(controller.stat == "movies_watched"){
			chartData.options = {tooltipTemplate: "<%if (label){%><%=label%> <%}%>: <%= value %> Film visti"}
		}
		else{
			chartData.options = {tooltipTemplate: "<%if (label){%><%=label%> <%}%>: <%= value %> Minuti guardati"}
		}
		controller.chartData = chartData;
	}
	
	this.getYears = function(){
			return this.years;
	}
	
	this.getPeriod = function(period){
		if(this.period == period){
			return true;
		}
		else return false;
	}
	
	this.getStat = function(stat){
		if(this.stat == stat){
			return true;
		}
		else return false;
	}
});

function setUpChart(data, granularity, stat, type, interval){
	//data: object with user history
	//granularity: month or year view
	//stat: minutes or number of movies
	//type: bar or line
	//interval: number of year that must be visualized

	//object with all drawing parameters. Initialization
	var drawingData = []; 
	drawingData.dataset = [];
	drawingData.colours = [];
	drawingData.labels = [];
	
	var values = []; //object with all drawing parameters
	var sum = 0; //contains the sum of the monthly stats (used in "year view")
	var i = 0;
	
	if(granularity=="months"){
		angular.forEach( data, function( val, key ) { //for each year
			angular.forEach( val, function( val1, key1 ) { //for each month
				if(parseInt(key) > (2015-interval)){ //consider only the wanted period
					drawingData["labels"][i] = key1+"/"+key; //stores the labels. eg "May/2015"
					values[i] = val1[stat]; //select the correct value to be visualized
					i++;
				}
			});
		});
		drawingData["dataset"][0] = values;
	}
	else if(granularity == "years"){
		angular.forEach( data, function( val, key ) { //for each year
			if(parseInt(key) > (2015-interval)){  //consider only the wanted period 
				angular.forEach( val, function( val1, key1 ) { //for each month
					drawingData["labels"][i] = key; //stores the labels. eg "2015"
					sum +=val1[stat]; //sum the correct value of each month
				});
				values[i] = sum; //stores the sum
				sum = 0;
				i++;
			}
		});
		drawingData["dataset"][0] = values;
	}
	var colours = {fillColor: "#01579B",
				strokeColor: "#01579B",
				highlightFill: "#0288D1",
				highlightStroke: "#0288D1",
				};
	drawingData["colours"][0] = colours;
	return drawingData;
}