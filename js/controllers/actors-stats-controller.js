var app = angular.module('yourMovieStats')
app.controller('ActorsStatsController', function(Api) {
	//stats
	this.finished = false;
	this.data = {};
	this.data.actors = [];
	this.genres = {};
	//chart
	this.retrievedData = {};
	this.limit = 10;
	this.orderingField = "-appearence";
	//this.chartData = {};
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
	//chart api
	Api.actorsStats()
	.success(function(data) {
		i=0;
		angular.forEach( data.actors, function( val, key ) { 
			if(val.appearence >= 3){
				controller.data.actors[i] = val;
				i++;
			}
		});
		controller.finished = true;
		
		cakeChartData = setUpCakeChart(controller.data.actors, controller.orderingField, controller.limit);
		cakeChartData.options = {segmentShowStroke: false};
		controller.chartData = cakeChartData;
	});

	this.setOrderingField = function(val){
		if(controller.orderingField == '-'+val){
			controller.orderingField = '+'+val;
		}
		else{
			controller.orderingField = '-'+val;
		}
		console.log(controller.orderingField);
		cakeChartData = setUpCakeChart(controller.data.actors, controller.orderingField, controller.limit);
		controller.chartData = cakeChartData;
	}
	
	this.setLimit = function(val){
		controller.limit = val;
		cakeChartData = setUpCakeChart(controller.data.actors, controller.orderingField, controller.limit);
		controller.chartData = cakeChartData;
	}
	
	this.getOrderingField = function(val){
		if(controller.orderingField.indexOf(val) != -1){ return true; }
		else{ return false; };
	}
	
	this.greaterThan = function(prop, val){
		return function(item){
		  return item[prop] > val;
		}
	}
	
	this.prova = function(){
		cakeChartData = setUpCakeChart(controller.data.actors, controller.orderingField, controller.limit);
		controller.chartData = cakeChartData;
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

function setUpCakeChart(data, field, limit){
	console.log(data);
	//data: object with user history
	//granularity: month or year view
	//stat: minutes or number of movies
	//type: bar or line
	//interval: number of year that must be visualized

	if(field == "-average"){
		data.sort(function(a, b) {
			return b["average"] - a["average"];
		});
	}
	else if(field == "+average"){
		data.sort(function(a, b) {
			return a["average"] - b["average"];
		});
	}
	else if(field == "+appearence"){
		data.sort(function(a, b) {
			return a["appearence"] - b["appearence"];
		});
	}
	else{
		data.sort(function(a, b) {
			return b["appearence"] - a["appearence"];
		});
	}
	//object with all drawing parameters. Initialization
	var drawingData = []; 
	drawingData.dataset = [];
	drawingData.colours = [];
	drawingData.labels = [];
	
	var values = []; //object with all drawing parameters
	var sum = 0; //contains the sum of the monthly stats (used in "year view")
	for(i = 0; i<limit; i++){
		if(field.indexOf("average") !=-1){
			value = parseFloat(data[i]["average"]).toFixed(2);
		}
		else{
			value = parseInt(data[i]["appearence"]);
		}
			drawingData.dataset[i] = value;
			drawingData.labels[i] = data[i].name;
			drawingData.colours[i] = getColor(i, limit);
	}
	
	return drawingData;
}

function getColor(j, max) {
	console.log(j);
		j++
		var lightblue = {r:197, g:202, b:233};
		var blue = {r:1, g:87, b:155};
		var newColor = makeGradientColor(blue, lightblue, (j/(max*1))*100+15);
        //var newColor = makeGradientColor(blue, lightblue, Math.random()*100);
		return newColor.cssColor;
}

//function to create a gradient of colors for cake charts
function makeGradientColor(color1, color2, percent) {
    var newColor = {};

    function makeChannel(a, b) {
        return(a + Math.round((b-a)*(percent/100)));
    }

    function makeColorPiece(num) {
        num = Math.min(num, 255);   // not more than 255
        num = Math.max(num, 0);     // not less than 0
        var str = num.toString(16);
        if (str.length < 2) {
            str = "0" + str;
        }
        return(str);
    }

    newColor.r = makeChannel(color1.r, color2.r);
    newColor.g = makeChannel(color1.g, color2.g);
    newColor.b = makeChannel(color1.b, color2.b);
    newColor.cssColor = "#" + 
                        makeColorPiece(newColor.r) + 
                        makeColorPiece(newColor.g) + 
                        makeColorPiece(newColor.b);
    return(newColor);
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};