	var userData;
	var dragging = false;
	var currentMousePos = { x: -1, y: -1 };
	var initialMousePos = { x: -1, y: -1 };
	var backgroundPos = { x: 0, y: 0 };
	var backgroundMov = { x: 0, y: 0 };
	var movement = { x: 0, y: 0 };
	var avatar = [];
	var avatarSize = 100;
	avatar["name"] = "placeholder.png";
	
$(function() {
	
	//localStorage initialization
	if(typeof localStorage.userData == "undefined" || localStorage.userData == "{}"){
		localStorage.setItem("userData", '{}');
		localStorage.setItem("imgSkipped", false);
		localStorage.setItem("unSkipped", false);
	}
	userData = JSON.parse(localStorage.userData);
	
	//Loading wheel initialization
	var cl = new CanvasLoader('canvasloader-container');
	//loader initialization
		cl.setColor('#ed5860'); // default is '#000000'
		cl.setShape('spiral'); // default is 'oval'
		cl.setDiameter(44); // default is 40
		cl.setDensity(37); // default is 40
		cl.setRange(1); // default is 1.3
	// Positioning
	var loaderObj = document.getElementById("canvasLoader");
  		loaderObj.style.position = "absolute";
  		loaderObj.style["top"] = cl.getDiameter() * -0.5 + "px";
  		loaderObj.style["left"] = cl.getDiameter() * -0.5 + "px";
	
	// Setup the dnd listeners.
	var dropZone = document.getElementById('drop_zone');
	dropZone.addEventListener('dragleave', handleDragLeave, false);
	dropZone.addEventListener('dragover', handleDragOver, false);
	dropZone.addEventListener('drop', function(evt) {
											avatar = handleFileSelect(evt, cl);
										}, false);


	//////////PAGE INITIALIZATION//////////
	//look local storage searching for user info
	if(typeof userData.confirmed == "undefined" || userData.confirmed == 0 || userData.logged == 0){
		showWelcome();
	}
	else{
		$("#btn-register").css("display", "none");
		$("#btn-login").css("display", "none");
		$("#username-nav").css("display", "block");
		$("#username-nav").html(userData.name);
		$("#avatar-nav").css("display", "block");
		$("#image-nav").css("background-image", "url(/movies/img/avatars/"+userData.img);
		$("#image-nav").css("background-size", userData.size+"%");
		
		actualDispX = userData.displacementX*40/200;
		actualDispY = userData.displacementY*40/200;
		console.log(actualDispX);
		$("#image-nav").css("background-position", actualDispX + "px " + actualDispY + "px");
		
		var page= $(document).getUrlParam("page");
		if(page == "home" || page === null){
			initHome();
		}
		else if(page == "actors"){
			initActorsStats();
		}
		else if(page == "actor"){
			initActorStats($(document).getUrlParam("id"));
		}
		else if(page == "movies"){
			initMoviesStats();
		}
		else if(page == "movie"){
			initMovieStats($(document).getUrlParam("id"));
		}
		else if(page == "search"){
			initSearch($(document).getUrlParam("find"));
		}
	}
	//////////END PAGE INITIALIZATION//////////
	
	//////////EVENT HANDLER//////////
	//Nav bar click
	$("#home").click(function(){
		location.href="index.html?page=home";
	});
	$("#actors").click(function(){
		location.href="index.html?page=actors";
	});
	$("#films").click(function(){
		location.href="index.html?page=movies";
	});
	
	//////////REGISTRATION EVENTS//////////
	
	//click on nav bar register button
	$("#btn-register").click(function(){
		$(".modal-table").fadeIn(250);
		$("#register-modal").show();
		$("#login-modal").hide();
		//check if registratipn process has already begun
		if(userData.id > 0 && userData.confirmed == 0 && userData.img == "placeholder.png" && localStorage.imgSkipped == "false"){
			//shows "new avatar" message
			$("#register-modal").hide();
			$("#register-successful").show();
			$("#drop_zone").css("background-image", "url(/movies/img/avatars/"+userData.img);
			$("#drop_zone").css("background-position", userData.displacementX+"px "+userData.displacementY+"px");
			$("#drop_zone").css("background-size", userData.size+"%");
			$(".image-container .register-successful-title").html("Questo avatar mi sembra un po grigio!");
			$(".image-container .register-successful-message").html("Sostituiscilo con uno che testimoni il tuo fascino hollywoodiano!");
			$(".register-again").show();
		}
		if(userData.id > 0 && userData.confirmed == 0 && (userData.img != "placeholder.png" || localStorage.imgSkipped == "true") && userData.username == "" && localStorage.unSkipped == "false"){
			//shows "new username" message
			$("#register-modal").hide();
			$("#register-successful").show();
			$(".image-container").hide();
			$(".username-container").show();
			$(".username-container .register-successful-title").html("Sei ancora qua?");
			$(".username-container .register-successful-message").html("Occupa il tempo impostando un username memorabile!");
			$(".register-again").show();
		}
		if(userData.id > 0 && userData.confirmed == 0 && (userData.img != "placeholder.png" || localStorage.imgSkipped == "true") && (userData.username != "" || localStorage.unSkipped == "true")){
			//shows final message
			$("#register-modal").hide();
			$("#register-successful").show();
			$(".image-container").hide();
			$(".username-container").hide();
			$(".final-message-container").show();
			$(".final-message-container .register-successful-title").html("Non hai ancora ricevuto la mail?");
			$(".final-message-container .register-successful-message").html("Prova a fartela mandare nuovamente!");
			$(".register-again").show();
		}
	});
	
	//register-login popup handling. If user clicks in the black area, it will close the popup
	$("div").mousedown(function(event) {
        // this.append wouldn't work
         if(event.target.id == "modal-table" && !dragging){
			 $(".modal-table").fadeOut(250);
		 }
    });
	
	//click on confirm registration button
	$("#register-btn").click(function(event) {
		message = "";
		error = 0;
		name = $("#name").val();
		surname = $("#surname").val();
		email = $("#mail").val();
		password = $("#password").val();
		passwordConfirmation = $("#passwordConfirmation").val();

		//checks for val consistency
		if(error == 0 && name == ""){
			message = "Inserisci il tuo nome";
			error = 1;
		}
		if(error == 0 && surname == ""){
			message = "Inserisci il tuo cognome";
			error = 2;
		}
		if(error == 0 && !isValid(email)){
			message = "Inserisci un indirizzo email valido";
			error = 3;
		}
		if(error == 0 && password.length < 8){
			message = "La password deve essere lunga almeno 8 caratteri";
			error = 4;
		}
		if(error == 0 && password != passwordConfirmation){
			message = "Le due password devono coincidere";
			error = 5;
		}
		
		
		if(error > 0){
			$("#register-message").html(message);
		}
		else{
			//user insertion in database
			$.post("server/register.php", {
			name: name,
			surname: surname,
			email: email,
			password: password
			}, function(data) {
					data = JSON.parse(data);
					if(data.error == 0){
						//stores new values in localStorage
						localStorage.setItem("userData", JSON.stringify(data.data));
						userData = JSON.parse(localStorage.userData);
						$("#register-modal").hide();
						cl.show();
						setTimeout(function(){
							cl.hide();
							$("#register-modal").hide();
							$(".image-container").css("display", "block");
							$(".username-container").css("display", "none");
							$("#drop_zone").css("background-image", "url(/movies/img/avatars/placeholder.png");
							$(".image-container .register-successful-title").html("Grande! Sei dei nostri!");
							$(".image-container .register-successful-message").html("Mentre aspetti la mail di conferma, puoi impostare il tuo avatar!");
							$(".final-message-container").css("display", "none");
							$("#register-successful").fadeIn(1000);
						}, 2000);
					}
					else{
						$("#register-message").html(data.message);
					}
				});
		}
	});
	
	//click on save image button
	$("#btn-img-register-save").click(function(){
		avatar_data = $("#drop_zone").css('background-image');
        avatar_data = avatar_data.replace('url("','').replace('")','');
		
		if(avatar.name == "placeholder.png"){
			avatar_name = userData.img;
			avatar_data = -1;
		}
		else{
			avatar_name = avatar.name;
		}
		//database update
		$.post("server/register.php?img=1", {
			user_id: userData.id,
			avatar: avatar_name,
			avatar_data: avatar_data,
			displacementX: backgroundPos.x,
			displacementY: backgroundPos.y,
			size: avatarSize,
			}, function(data) {
					data = JSON.parse(data);
					if(data.error == 0){
						if(data.data != -1){
							//stores new values in localStorage
							userData.img = data.data.image;
							userData.displacementX = data.data.displacementX;
							userData.displacementY = data.data.displacementY;
							userData.size = data.data.size;
							localStorage.setItem("userData", JSON.stringify(userData));
							$(".image-container").hide();
							$(".username-container").fadeIn(500);
						}
						else{
							$(".image-container").hide();
							$(".username-container").fadeIn(500);
						}
					}
					else{
						//handle error
					}
				});
	});
	
	//handles click on button to skip the image update process
	$("#change-img-later").click(function(){
		localStorage.setItem("imgSkipped", true);
		$(".username-container .register-successful-title").html("Uff! Non una gran scelta!");
		$(".username-container .register-successful-message").html("Siamo certi ti riscatterai pi&ugrave tardi! Intanto imposta l'username!");
		$(".image-container").hide();
		$(".username-container").fadeIn(500);
	});
	
	//click on save username button
	$("#btn-username-register-save").click(function(){
		username_data = $("#username").val();
		
		//database update
		$.post("server/register.php?un=1", {
			user_id: userData.id,
			username: username_data,
			}, function(data) {
					data = JSON.parse(data);
					if(data.error == 0){
						//stores new values in localStorage
						userData.username = data.data.username;
						localStorage.setItem("userData", JSON.stringify(userData));
						$(".username-container").hide();
						$(".final-message-container").fadeIn(500);
					}
					else{
						if(data.error == 10){
							$("#communication-div").css("opacity", "1");
						}
					}
				});
	});
	
	//handles click on button to skip the image update process
	$("#change-un-later").click(function(){
		localStorage.setItem("unSkipped", true);
		$(".final-message-container .register-successful-title").html("Un po' anonimo, non credi?");
		$(".final-message-container .register-successful-message").html("Quantomeno &egrave un username facile da ricordare!");
		$(".username-container").hide();
		$(".final-message-container").fadeIn(500);
	});
	
	//handles click on button to restart registration process
	$(".register-again").click(function(){
		//cleans localStorage
		userData = [];
		localStorage.userData = "{}";
		localStorage.imgSkipped = false;
		localStorage.unSkipped = false;
		
		//shows starting popup
		$("#register-successful").hide();
		$("#register-modal").show();
	});

	//AVATAR POSITIONING HANDLING
	//handle the behavior when user clicks on avatar area
	$("#drop_zone").mousedown(function(){
		dragging = true;
		initialMousePos.x = event.pageX;
		initialMousePos.y = event.pageY;
	});	
	//handle mouse movement when dragging image
	$("#modal-table").mousemove(function(){
		if(dragging){
			$("body").addClass("dragging");
			currentMousePos.x = event.pageX;
			currentMousePos.y = event.pageY;
			movement.x = (initialMousePos.x-currentMousePos.x)/$( document ).width()*500;
			movement.y = (initialMousePos.y-currentMousePos.y)/$( document ).height()*500;
			backgroundMov.x = backgroundPos.x-movement.x;
			backgroundMov.y = backgroundPos.y-movement.y;
			console.log(backgroundMov);
			$("#drop_zone").css("background-position", backgroundMov.x+"px "+backgroundMov.y+"px");
		}
	});
	//handle the behavior when user stops moving the avatar
	$("#modal-table").mouseup(function(){
		if(dragging){
			backgroundPos.x = backgroundMov.x;
			backgroundPos.y = backgroundMov.y;
			console.log(backgroundPos);
			currentMousePos.x = event.pageX;
			currentMousePos.y = event.pageY;
			$("body").removeClass("dragging");
			dragging = false;
		}
	});
	//handle the behavior when user scrolls on avatar area
	$('#drop_zone').bind('DOMMouseScroll', function(e){
		if(e.originalEvent.detail > 0) {
			avatarSize -= 5;
		}else {
			avatarSize += 5;
		}
		$('#drop_zone').css("background-size", avatarSize+"%");
		//prevent page fom scrolling
		return false;
	 });
	//handle the behavior when user scrolls on avatar area (IE, Opera and Safari)
	$('#drop_zone').bind('mousewheel', function(e){
		if(e.originalEvent.wheelDelta < 0) {
			avatarSize -= 5;
		}else {
			avatarSize += 5;
		}
		$('#drop_zone').css("background-size", avatarSize+"%");
		$('#drop_zone').css("background-position", "center");
		//prevent page fom scrolling
		return false;
	 });	
	
	//////////END REGISTRATION EVENTS//////////
	
	//////////LOGIN EVENTS//////////
	//click on nav bar register button
	$("#btn-login").click(function(){
		$(".modal-table").fadeIn(250);
		$("#register-successful").hide();
		$("#register-modal").hide();
		$("#login-modal").show();
		if(userData.email != ""){
			$("#login-email-or-username").val(userData.email);
			if(userData.username != ""){
				$("#login-email-or-username").val(userData.username);
			}
		}
	});
})

//handle comunication with server
function getData(type, id, num, field, user_id){
	/*
	type: specify the type of the request
	id: specify the id of the requested resource
	num: used in actors visualization, specify the limit of visualized acotors
	field: used in actors visualization, specify the aggregation field
	user_id: specify the user requesting the resource
	*/
	
	apiUrl = "server/api.php?";
	if(type!=""){
		apiUrl = apiUrl + "q=" + type + "&";
	}
	if(id!=""){
		apiUrl = apiUrl + "id=" + id + "&";
	}
	if(num!=""){
		apiUrl = apiUrl + "num=" + num + "&";
	}
	if(field!=""){
		apiUrl = apiUrl + "field=" + field + "&";
	}
	if(user_id!=""){
		apiUrl = apiUrl + "user_id=" + user_id + "&";
	}
	apiUrl = apiUrl.substring(0, apiUrl.length-1);
	data = [];
		$.ajax({
		  url: apiUrl,
		  dataType: 'json',
		  async: false,
		  success: function( results ) {
				data = results;
			}
		});
	return data;
}

window.jsonpcallback = function(data) {
};


//////////INIT FUNCTIONS/////////

//HOME INITIALIZATION
function initHome(){	
	//home elements population
	$("#home").css("border-bottom-color", "#ffffff").css("color", "#ffffff");
	
	$("#first-col-title").html("Statistiche");
	
	$("#second-col-title").html("Grafici riassuntivi");
	
	$("#first-col-content").html("<table class='the-table'>"+
	"<tr><td><strong>Film visti</strong></td><td id='film_watched'></td></tr>"+
	"<tr><td><strong>Minuti guardati</strong></td><td id='minute_watched'></td></tr>"+
	"<tr><td><strong>Ultimo film registrato</strong></td><td id='last_seen'></td></tr>"+
	"<tr><td><strong>Data ultimo film registrato</strong></td><td id='last_seen_date'></td></tr>"+
	"</table>");
	
	$("#second-col-subtitle").append('<p id="selector">'+
				'<form>Anni  '+
				'  <select id="num" style="display:inline; ">           '+
				'   <option value="1">1</option>                       '+
				'   <option value="2" selected="selected">2</option> '+
				'   <option value="3">3</option>                     '+
				'   <option value="4">4</option>                     '+
				'   <option value="5">5</option>                   '+
				'  </select>                                           '+
				'Range <span id="months" class="selected unselected" >MESI</span><span id="years" class="unselected">ANNI</span>'+
				' Statistica <span id="minutes" class="selected unselected" >MINUTI GUARDATI</span><span id="number" class="unselected">FILM VISTI</span>'+
				'</form>                                               '+
				'</p>');
				
	$("#second-col-content").append('<p id="chart">'+
				'<canvas id="myChart" width="300" height="300"></canvas> '+
				'</p>');
				
	$("#second-col-content").append('Tipo di grafico: <span id="bar" class="selected unselected" >A barre</span><span id="line" class="unselected">A linee</span>');
	
	//gets user data
	var data = getData("home", "","","", 1);
	//shows user data
	showBasicInformation(data);
	
	//draws charts
	
	//standard view
	var n = 2;
	var period = "months";
	var type = "bar";
	var stat = "minutes";
	drawTimeSeenBarChart(data.view_history, period, stat, type, n);
	
	//handles chart view changing
	var numList = $("#num");
	num.onchange = function() {
		n = parseInt($( "#num option:selected" ).text());
		drawTimeSeenBarChart(data.view_history, period, stat, type, n);
	}
	$("#months").click(function() {
		$("#months").addClass("selected");
		$("#years").removeClass("selected");
		checkSelected();
		drawTimeSeenBarChart(data.view_history, period, stat, type, n);
	});
	$("#years").click(function() {
		$("#months").removeClass("selected");
		$("#years").addClass("selected");
		checkSelected();
		drawTimeSeenBarChart(data.view_history, period, stat, type, n);
	});
	$("#minutes").click(function() {
		$("#minutes").addClass("selected");
		$("#number").removeClass("selected");
		checkSelected();
		drawTimeSeenBarChart(data.view_history, period, stat, type, n);
	});
	$("#number").click(function() {
		$("#minutes").removeClass("selected");
		$("#number").addClass("selected");
		checkSelected();
		drawTimeSeenBarChart(data.view_history, period, stat, type, n);
	});
	$("#bar").click(function() {
		$("#bar").addClass("selected");
		$("#line").removeClass("selected");
		checkSelected();
		drawTimeSeenBarChart(data.view_history, period, stat, type, n);
	});
	$("#line").click(function() {
		$("#bar").removeClass("selected");
		$("#line").addClass("selected");
		checkSelected();
		drawTimeSeenBarChart(data.view_history, period, stat, type, n);
	});
	
	//check which kind of representation the user selected
	function checkSelected(){
		if($("#months").hasClass("selected")){
			period = "months";
		}
		else{
			period = "years";
		}
		if($("#minutes").hasClass("selected")){
			stat = "minutes";
		}
		else{
			stat = "number";
		}
		
		if($("#bar").hasClass("selected")){
			type = "bar";
		}
		else{
			type = "line";
		}
	}
}

//shows basic information in the left side of the home page
function showBasicInformation(data){
	var days = Math.floor(data["watchtime"].minutes/(60*24));
	$("#film_watched").append(data["watchtime"].number);
	$("#minute_watched").append(data["watchtime"].minutes+' minuti = '+days+'+ giorni');
	$("#last_seen").append(data["movie_data"][0].movie_title);		
	$("#last_seen_date").append(data["movie_data"][0].date[2]+" "+data["movie_data"][0].date[1]+" "+data["movie_data"][0].date[4]);		
}

//draw home page chart
function drawTimeSeenBarChart(data, granularity, stat, type, interval){
	//data: object with user history
	//granularity: month or year view
	//stat: minutes or number of movies
	//type: bar or line
	//interval: number of year that must be visualized

	//object with all drawing parameters. Initialization
	var drawingData = []; 
	drawingData.datasets = [];
	drawingData.labels = [];
	
	var values = []; //object with all drawing parameters
	var sum = 0; //contains the sum of the monthly stats (used in "year view")
	var i = 0;
	
	if(granularity=="months"){
		$.each( data, function( key, val ) { //for each year
			$.each( val, function( key1, val1 ) { //for each month
				if(parseInt(key) > (2015-interval)){ //consider only the wanted period
					drawingData["labels"][i] = key1+"/"+key; //stores the labels. eg "May/2015"
					values[i] = val1[stat]; //select the correct value to be visualized
					i++;
				}
			});
		});
		
		//complete object with all the drawing parameters
		var objToPush = {label:"Chart",
						fillColor: "rgba(120,116,189,0.7)",
						strokeColor: "rgba(120,116,189,0.8)",
						highlightFill: "rgba(120,116,189,0.9)",
						highlightStroke: "rgba(120,116,189,1)",
						data: values
						}
		drawingData["datasets"][0] = objToPush;
	}
	else if(granularity == "years"){
		$.each( data, function( key, val ) { //for each year
			if(parseInt(key) > (2015-interval)){  //consider only the wanted period 
				$.each( val, function( key1, val1 ) { //for each month
					drawingData["labels"][i] = key; //stores the labels. eg "2015"
					sum +=val1[stat]; //sum the correct value of each month
				});
				values[i] = sum; //stores the sum
				sum = 0;
				i++;
			}
		});
		
		//complete object with all the drawing parameters
		var objToPush = {label:"Chart",
						fillColor: "rgba(170,153,255,0.7)",
						strokeColor: "rgba(170,187,204,0.8)",
						highlightFill: "rgba(170,153,255,0.9)",
						highlightStroke: "rgba(170,187,204,1)",
						data: values
						}
		drawingData["datasets"][0] = objToPush;
	}
	
	$( "#myChart" ).remove(); //clean canvas
	$( "#chart" ).append( '<canvas id="myChart" width="500" height="330" ></canvas>' );
	var canvas = document.getElementById('myChart');
    var ctx = canvas.getContext('2d');
	
	// creates bar chart
	if( type == "bar"){
		var myBarChart = new Chart(ctx).Bar(drawingData, {scaleShowGridLines : false, scaleFontColor : "rgb(186, 189, 198)", barShowStroke : false});
	}
	// creates line chart
	else{
		var myBarChart = new Chart(ctx).Line(drawingData, {scaleShowGridLines : false, scaleFontColor : "rgb(186, 189, 198)", barShowStroke : false});
	}
}

//END HOME INITIALIZATION

//MOVIES INITIALIZATION
function initMoviesStats(){
	
	//movie elements population
	$("#films").css("border-bottom-color", "#ffffff").css("color", "#ffffff");
	
	$("#first-col-title").html("Info riassuntive");
	
	$("#second-col-title").html("Lista film");
	
	$("#first-col-content").html("<table class='the-table two-row-table'>"+
	"<tr><td><strong>Film visti</strong></td><td id='film_seen'></td></tr>"+
	"<tr><td><strong>Film d'animazione visti</strong></td><td id='animation_seen'></td></tr>"+
	"<tr><td><strong>Minuti guardati</strong></td><td id='minute_watched'></td></tr>"+
    "</table>"+
	"<div class='sub-header'>Generi pi&ugrave; visti</div><div id='category-preview-container'><table id='cat' class='the-table two-row-table' style='width:100%'></table></div>"
	);
	
	$("#second-col-subtitle").append("<table class='the-table four-row-table'><tr><td class='unselected' id='title'><strong>TITOLO</strong></td><td class='unselected' id='duration'><strong>DURATA</strong></td><td class='unselected selected' id='personal_vote'><strong>VOTO PERSONALE</strong></td><td class='unselected' id='imdb_vote'><strong>VOTO IMDB</strong></td></tr></table>");
	
	$("#second-col-content").append("<div id='table-film'><div id='table-film-header-label'>FILM</div></div><div id='table-animation'><div id='table-animation-header-label'>FILM D'ANIMAZIONE</div></div>")
	
    $("#table-film").append("<div id='table-film-container' class='table-container'><table class='the-table four-row-table  table-film-content'></table></div>");
	
	$("#table-animation").append("<div id='table-animation-container' class='table-container table-invisible'><table class='the-table four-row-table table-animation-content'></table></div>");
	
	var retrievedData = getData("movies", "", "","", 1); //1 must be substituted with user id
	if(retrievedData.id == 1){
		movie_stats = retrievedData["movie_stats"];
		number_of_movies = movie_stats.length;
		var single_movie_info; //object containing infos of a single movie
		var data= []; //array containing all well-structured movies info
		var totalMinutes = 0; //total watch time
	
		var array_categories = new Array();
			array_categories = [
				["action",	0] ,
				["sci_fi" ,   0],
				["mystery",   0],
				["thriller",  0],
				["drama"  ,   0],
				["crime"  ,   0],
				["adventure", 0],
				["fantasy",   0],
				["biography", 0],
				["history",   0],
				["comedy" ,   0],
				["romance",   0],
				["family" ,   0],
				["animation", 0],
				["musical",   0],
				["horror" ,   0],
				["war"    ,   0],
				["music"  ,   0],
				["sport"  ,   0],
				["western",   0],
				["other",0]
			];
		
		for(j=0;j<number_of_movies;j++){
			single_movie_info = {id : movie_stats[j].id_movie_imdb,
				imdb_vote : movie_stats[j].movie_imdb_vote,
				personal_vote : movie_stats[j].movie_personal_vote,
				duration : movie_stats[j].movie_runtime,
				title : movie_stats[j].movie_title,
				categories : movie_stats[j].categories
				}
			data[j] = single_movie_info;
			totalMinutes += parseInt(movie_stats[j].movie_runtime);
			array_categories = count_categories(array_categories, movie_stats[j].categories);
		}
		var days = Math.floor(totalMinutes/(60*24));
		$('#minute_watched').text(totalMinutes);
		
		array_categories.sort(function(a, b) {return b[1] - a[1]});
		for(var i=0; i<array_categories.length;i++){
			$("#cat").append(	"<tr><td id=''><strong>"+translate("it",array_categories[i][0])+"</td><td>"+array_categories[i][1]+"</strong></td></tr>")
		}
		
		showMoviesList(data, "movies", "personal_vote");
	}
	else{
		//..must be handled. A redirect to 404 page ???
	}
	
	//toggle between movies and animation movies
	$("#table-animation").click(function() {
		$("#table-animation-container").slideDown("slow");
		$("#table-film-container").slideUp("slow");
		$("#table-animation-container").css("overflow-y", "auto");
	});
	$("#table-film").click(function() {
		$("#table-film-container").slideDown("slow");
		$("#table-animation-container").slideUp("slow");
		$("#table-film-container").css("overflow-y", "auto");
	});
	
	//handles click on the navigation bar
	$("#title").click(function() {
		$("#title").addClass("selected");
		$("#duration").removeClass("selected");
		$("#personal_vote").removeClass("selected");
		$("#imdb_vote").removeClass("selected");
		showMoviesList(data, "movies", "title");
	});
	$("#duration").click(function() {
		$("#title").removeClass("selected");
		$("#duration").addClass("selected");
		$("#personal_vote").removeClass("selected");
		$("#imdb_vote").removeClass("selected");
		showMoviesList(data, "movies", "duration");
	});
	$("#personal_vote").click(function() {
		$("#title").removeClass("selected");
		$("#duration").removeClass("selected");
		$("#personal_vote").addClass("selected");
		$("#imdb_vote").removeClass("selected");
		showMoviesList(data, "movies", "personal_vote");
	});
	$("#imdb_vote").click(function() {
		$("#title").removeClass("selected");
		$("#duration").removeClass("selected");
		$("#personal_vote").removeClass("selected");
		$("#imdb_vote").addClass("selected");
		showMoviesList(data, "movies", "imdb_vote");
	});
}
//ENDS MOVIES INITIALIZATION

//ACTORS INITIALIZATION
function initActorsStats(){
	//html population
	$(".eight-ven").css("width", "80%");
	
	$("#actors").css("border-bottom-color", "#ffffff").css("color", "#ffffff");
	
	$("#first-col-title").html("Grafico");
	
	$("#second-col-title").html("Classifica");
	
	$("#second-col-subtitle").append("<table class='the-table three-row-table'><tr><td class='unselected' id='title'><strong>#</strong></td><td class='unselected' id='duration'><strong>ATTORE</strong></td><td class='unselected selected' id='personal_vote'><strong>FILM VISITI</strong></td></tr></table>");
	
	$("#first-col-subtitle").html('<p id="selector">'+
				'<form >Numero di attori visualizzati: '+
				'  <select id="num" style="display:inline;">           '+
				'   <option value="5">5</option>                       '+
				'   <option value="10" selected="selected">10</option> '+
				'   <option value="20">20</option>                     '+
				'   <option value="50">50</option>                     '+
				'   <option value="100">100</option>                   '+
				'  </select>                                           '+
				'</form>                                               '+
				'</p>');
	
	$("#first-col-content").html("");
	
	$("#first-col-content").append(
				'<p id="chart">                                          '+
				'<canvas id="myChart" width="400" height="300"></canvas> '+
				'</p>');
	
	//variable initialization
	var n=10; //number of actors to be plotted
	var field="appearence"; //field under consideraton
	
	//gets data from database
	var datas = getData("actors", "", n, field, 1);//1 must be replaced with actual user id
	//draws charts
	drawActorsChart(datas["actors_stats"], field);
	
	//display actor list
	showActorsList(datas["actors_stats"], field);
	
	//handle changes on the number of actors that must be displayed
	var numList = $("#num");
	num.onchange = function() {
		n = parseInt($( "#num option:selected" ).text()); //keyphrase
		datas = getData("actors", "", n, field, 1); 
		drawActorsChart(datas["actors_stats"], field);
		showActorsList(datas["actors_stats"], field);
	}
	
	//handle click on the button that allow to show the actors starring in most of the films seen by the user
	$("#actor-most-film").click(function() {
		$(".selected").removeClass("selected");
		$("#actor-most-film").addClass("selected");
		field = "appearence"; //keyphrase
		datas = getData("actors", "", n, field, 1);
		drawActorsChart(datas["actors_stats"], field);
		showActorsList(datas["actors_stats"], field);
	});
	//handle click on the button that allow to show the actors starring in most of the animated films seen by the user
	$("#actor-most-animated-film").click(function() {
		$(".selected").removeClass("selected");
		$("#actor-most-animated-film").addClass("selected");
		field = "aniappearence"; //keyphrase
		datas = getData("actors", "", n, field, 1);
		drawActorsChart(datas["actors_stats"], field);
		showActorsList(datas["actors_stats"], field);
	});
	
	//handle click on the button that allow to show the actors starring in the user's highest rated films
	$("#actor-highest-rated-film").click(function() {
		$(".selected").removeClass("selected");
		$("#actor-highest-rated-film").addClass("selected");
		$(".three-row-table tr td:nth-child(3)").text("MEDIA");
		field = "average"; //keyphrase
		datas = getData("actors", "", n, field, 1);
		drawActorsChart(datas["actors_stats"], field);
		showActorsList(datas["actors_stats"], field);
	});
	$(".ven").show();
}

//draws charts
function drawActorsChart(datas, field){
		var data = [];
		$.each( datas, function( key, val ) {
			if(field == "average"){
				value = parseFloat(val[field]).toFixed(2);
			  }
			  else{
				value = parseInt(val["appearence"]);
			  }
			var obj = {label: val.name, value:value, color:getColor(key, datas.length), highlight:"rgb(91,91,152)"};
			data[key] = obj;
		});

		$( "#myChart" ).remove();
		$( "#chart" ).append( '<canvas id="myChart" width="400" height="370"></canvas>' );
		var canvas = document.getElementById('myChart');
		var ctx = canvas.getContext('2d');
		// Crea il grafico e visualizza i dati
        
	if(field == "appearence" || field == "aniappearence"){
		var myPieChart = new Chart(ctx).Pie(data, {segmentShowStroke : true, segmentStrokeWidth : 1, animationSteps : 100 });
	}
	else if(field = "average"){
		var myPieChart = new Chart(ctx).PolarArea(shuffle(data), {scaleIntegersOnly: false, segmentStrokeWidth : 1,});
	}
		$("#myChart").click( 
			function(evt){
				var activePoints = myPieChart.getSegmentsAtEvent(evt);
				var name = activePoints[0].label;
				$.each( datas, function( key, val ) {
					if(name == val.name){
						location.href = "index.html?page=actor&id=" + val.id;
					}
				});
			}
		);
}

//ENDS ACTORS INITIALIZATION

//SINGLE ACTOR INITIALIZATION
function initActorStats(id){
	//html population
	$("#actors").css("border-bottom-color", "#ffffff").css("color", "#ffffff");
	
	$("#second-col-title").html("Film visti");
	
	$("#first-col-content").html("<table class='the-table'>"+
	"<tr><td><strong>Voto medio dei suoi film</strong></td><td id='average'></td></tr>"+
	"<tr><td><strong>Film visti</strong></td><td id='film_seen'></td></tr>"+
	"<tr><td><strong>Film d'animazione visti</strong></td><td id='animation_seen'></td></tr>"+
	"</table>");

	var data = getData("actor", id, "","", 1);
	if(data.id == 1){
		$("#first-col-title").html(data.actor_stats.name);
		if(data.actor_stats.img != ""){
			$("#first-col-content").append('<p id="img_container"><img id="image" src="'+data.actor_stats.img+'" /></p>');
		}
		else{
			$("#first-col-content").append('<p id="img_container"><img id="image" src="img/placeholder.png" /></p>');
		}
		//variable initialization
		var sum = 0;
		var count = 0;
		
		//html population
		$("#average").append(data.actor_stats.average.toFixed(2));
		
		$("#second-col-subtitle").append("<table class='the-table four-row-table'><tr><td class='unselected' id='title'><strong>TITOLO</strong></td><td class='unselected' id='duration'><strong>DURATA</strong></td><td class='unselected selected' id='personal_vote'><strong>VOTO PERSONALE</strong></td><td class='unselected' id='imdb_vote'><strong>VOTO IMDB</strong></td></tr></table>");
		
		$("#second-col-content").append("<div id='table-film'><div id='table-film-header-label'>FILM</div></div><div id='table-animation'><div id='table-animation-header-label'>FILM D'ANIMAZIONE</div></div>")
		
		$("#table-film").append("<div id='table-film-container' class='table-container'><table class='the-table four-row-table  table-film-content'></table></div>");
		
		$("#table-animation").append("<div id='table-animation-container' class='table-container table-invisible'><table class='the-table four-row-table table-animation-content'></table></div>");
		
		//shows in a tabular way movies the actor starred in
		showMoviesList(data.actor_stats.films, "actor", "personal_vote");
		
		//handles click on headerS
		$("#title").click(function() {
			$("#title").addClass("selected");
			$("#duration").removeClass("selected");
			$("#personal_vote").removeClass("selected");
			$("#imdb_vote").removeClass("selected");
			showMoviesList(data.actor_stats.films, "actor", "title");
		});
		$("#duration").click(function() {
			$("#title").removeClass("selected");
			$("#duration").addClass("selected");
			$("#personal_vote").removeClass("selected");
			$("#imdb_vote").removeClass("selected");
			showMoviesList(data.actor_stats.films, "actor", "duration");
		});
		$("#personal_vote").click(function() {
			$("#title").removeClass("selected");
			$("#duration").removeClass("selected");
			$("#personal_vote").addClass("selected");
			$("#imdb_vote").removeClass("selected");
			showMoviesList(data.actor_stats.films, "actor", "personal_vote");
		});
		$("#imdb_vote").click(function() {
			$("#title").removeClass("selected");
			$("#duration").removeClass("selected");
			$("#personal_vote").removeClass("selected");
			$("#imdb_vote").addClass("selected");
			showMoviesList(data.actor_stats.films, "actor", "imdb_vote");
		});
		//handle choice between featured films and animated films
		$("#table-animation").click(function() {
			$("#table-animation-container").slideDown("slow");
			$("#table-film-container").slideUp("slow");
			$("#table-animation-container").css("overflow-y", "auto");
		});
		$("#table-film").click(function() {
			$("#table-film-container").slideDown("slow");
			$("#table-animation-container").slideUp("slow");
			$("#table-film-container").css("overflow-y", "auto");
		});
	}
	else{
		//maybe a 404?? :D
	}
}

//END SINGLE ACTOR INITIALIZATION

//SINGLE MOVIE INITIALIZATION
function initMovieStats(id){
	//html population
	$("#actors").css("border-bottom-color", "#ffffff").css("color", "#ffffff");
	
	$("#second-col-title").html("Cast");
	
	$("#first-col-content").html("");
	
	$("#first-col-content").html("<table class='the-table'>"+
	"<tr><td><strong>Quando è uscito</strong></td><td id='released'></td></tr>"+
	"<tr><td><strong>Quanto gli hai dato</strong></td><td id='personal_vote'></td></tr>"+
	"<tr><td><strong>Quanto gli hanno dato gli altri</strong></td><td id='imdb_vote'></td></tr>"+
	"<tr><td><strong>Categorie</strong></td><td id='categories'></td></tr>"+
	"</table>");
	
	var sum = 0;
	var count = 0;
	//retrieve data
	var datas = getData("movie", id, "", "", 1);//1 must be replaced with actual users ids

	if(data.id == 1){
		//html population
		$("#first-col-title").html(datas.movie_stats.movie_title);
		
		$("#released").html(datas.movie_stats.movie_year);
		
		//consider the status of the film: seen(rated/unrated)/unseen
		if(datas.movie_stats.movie_personal_vote == "0"){
			$("#personal_vote").html("Non votato");
		}
		else if(datas.movie_stats.movie_personal_vote == null){
			$("#personal_vote").html("Non visto");
		}
		else{
			$("#personal_vote").html(datas.movie_stats.movie_personal_vote);
		}
		
		$("#imdb_vote").html(datas.movie_stats.movie_imdb_vote);
		
		$.each( datas.movie_stats.categories, function(key, val) {
			if(key != 0){$("#categories").append(" - ");}
			$("#categories").append(translate("it", val));
		});
		$("#first-col-content").append('<p id="img_container"><img id="image" src="'+datas.movie_stats.img+'" /></p>');
		$("#second-col-subtitle").append("<table class='the-table three-row-table'><tr><td class='unselected' id='title'><strong>#</strong></td><td class='unselected' id='duration'><strong>ATTORE</strong></td><td class='unselected selected' id='personal_vote'><strong>FILM VISITI</strong></td></tr></table>");
		
		//shows the list of actors starring in the film
		if(datas.starring_actors != -1){
			console.log(datas.starring_actors);
			showActorsList(datas.starring_actors[0], "appearence");
		}
		else{
			$("#second-col-content").append("Ops! Non abbiamo la lista di attori per questo film!<br>Potresti aiutarci tu!");
		}
	}
	else{
		//404
	}

}

//END SINGLE MOVIE INITIALIZATION

//SEARCH INITIALIZATION
function initSearch(find){
	
	//html population
	$("#first-col-title").html("Info riassuntive");
	
	$("#second-col-title").html("Lista film");
	
	$("#first-col-content").html("<table class='the-table'>"+
	"<tr><td><strong>Film trovati</strong></td><td id='film_seen'></td></tr>"+
	"<tr><td><strong>Film d'animazione trovati</strong></td><td id='animation_seen'></td></tr>"+
	"<tr><td></td><td></td></tr>"+
	"<tr id='call_to_action' style='display:none;'><td>Sembra tu non abbia trovato alcun risultato. Aggiungi tu un nuovo film!</td><td><input type='button' class='button' value='+'></td></tr>"+
	"</table>");
	
	$("#second-col-subtitle").append("<table class='the-table four-row-table'><tr><td class='unselected' id='title'><strong>TITOLO</strong></td><td class='unselected' id='duration'><strong>DURATA</strong></td><td class='unselected selected' id='personal_vote'><strong>VOTO PERSONALE</strong></td><td class='unselected' id='imdb_vote'><strong>VOTO IMDB</strong></td></tr></table>");
	
	$("#second-col-subtitle").append("<div id='table-film'><div id='table-film-header-label'>FILM</div></div><div id='table-animation'><div id='table-animation-header-label'>FILM D'ANIMAZIONE</div></div>")
	
	$("#table-film").append("<div id='table-film-container' class='table-container'><table class='the-table four-row-table  table-film-content'></table></div>");
	
	$("#table-animation").append("<div id='table-animation-container' class='table-container table-invisible'><table class='the-table four-row-table table-animation-content'></table></div>");
	
	var retrievedData = getData("moviesSrc", "", "", find, 1); //1 must be replaced with actual user id
	
	if(retrievedData["id"] != 0){
		//show a message in case of zero results
		if(retrievedData["id"] == 2){
			$("#call_to_action").css("display", "table-row");
		}
		else{
			//creates the listable object
			length = retrievedData["movie_stats"].length;
			var single_movie_stats;
			var movies_stats = [];
			var j = 0;
			for(j=0;j<length;j++){
				single_movie_stats = {id : retrievedData["movie_stats"][j].id_movie_imdb,
					imdb_vote : retrievedData["movie_stats"][j].movie_imdb_vote,
					personal_vote : retrievedData["movie_stats"][j].movie_personal_vote,
					duration : retrievedData["movie_stats"][j].movie_runtime,
					title : retrievedData["movie_stats"][j].movie_title,
					categories : retrievedData["movie_stats"][j].categories
					}
				movies_stats[j] = single_movie_stats;
			}
			showMoviesList(movies_stats, "search", "personal_vote");
		}
	}
	else{
		//404?
	}
	
	//handles selection between featured and animated movies
	$("#table-animation").click(function() {
		$("#table-animation-container").slideDown("slow");
		$("#table-film-container").slideUp("slow");
		$("#table-animation-container").css("overflow-y", "auto");
	});
	$("#table-film").click(function() {
		$("#table-film-container").slideDown("slow");
		$("#table-animation-container").slideUp("slow");
		$("#table-film-container").css("overflow-y", "auto");
	});
	
	//handles the sorting of the list
	$("#title").click(function() {
		$("#title").addClass("selected");
		$("#duration").removeClass("selected");
		$("#personal_vote").removeClass("selected");
		$("#imdb_vote").removeClass("selected");
		showMoviesList(data, "search", "title");
	});
	$("#duration").click(function() {
		$("#title").removeClass("selected");
		$("#duration").addClass("selected");
		$("#personal_vote").removeClass("selected");
		$("#imdb_vote").removeClass("selected");
		showMoviesList(data, "search", "duration");
	});
	$("#personal_vote").click(function() {
		$("#title").removeClass("selected");
		$("#duration").removeClass("selected");
		$("#personal_vote").addClass("selected");
		$("#imdb_vote").removeClass("selected");
		showMoviesList(data, "search", "personal_vote");
	});
	$("#imdb_vote").click(function() {
		$("#title").removeClass("selected");
		$("#duration").removeClass("selected");
		$("#personal_vote").removeClass("selected");
		$("#imdb_vote").addClass("selected");
		showMoviesList(data, "search", "imdb_vote");
	});
	
}

//END SEARCH INITIALIZATION

//REGISTER INITIALIZATION
function initRegister(){
	
	//html population
	$("#first-col-title").html("Dati utente");
	
	$("#first-col-content").html("<table class='the-table'>"+
	"<tr><td><strong>Nome</strong></td><td id='user_name'></td></tr>"+
	"<tr><td><strong>Cognome</strong></td><td id='user_surname'></td></tr>"+
	"<tr><td><strong>Email</strong></td><td id='user_email'></td></tr>"+
	"<tr><td><strong>Password</strong></td id='user_password'><td></td></tr>"+
	"<tr><td><strong>Username</strong></td id='user_username'><td></td></tr>"+
	"<tr id='call_to_action' style='display:none;'><td>Sembra tu non abbia trovato alcun risultato. Aggiungi tu un nuovo film!</td><td><input type='button' class='button' value='+'></td></tr>"+
	"</table>");
}

//END REGISTER INITIALIZATION

//////////CROSS PAGE FUNCTIONS//////////

//screen to be shown to unregistered visitors
function showWelcome(){
	$(".eight-ven").hide();
	$("#welcome").fadeIn(1000);
	margin = ($("#welcome").height()-$("#welcome-content").height())/2;
	$("#welcome-content").css("margin-top", margin+"px");
	//setTimeout(function(){
	//	setInterval(function(){
	//			if(margin>150){
	//				margin --;
	//				$("#welcome-content").css("margin-top", margin+"px");
	//			}
	//	}, 10);
	//}, 1000);
}
//shows a list of films in a tabular way
function showMoviesList(data, page, sorting_field){
	//variable initialization
	var message = new Array();
	var tableFilm = ""; //string containing the html representation for movies
	var tableAnimation = ""; //string containing the html representation for animated movies
	var countFilm = 0; //holds the number of movies in the list
	var countAnimation = 0; //holds the number of animated movies in the list
	var seen_movies = [];
	var index = 0;
	if (page == "actor"){
		message[0] = "Questo attore ha fatto solo film d'animazione";
		message[1] = "Questo attore non ha fatto film d'animazione";
	}
    else if (page == "movie"){
		message[0] = "Non hai visto film";
		message[1] = "Non hai visto film d'animazione";
	}
	else{
		message[0] = "Non sono stati trovati film corrispondenti alla ricerca";
		message[1] = "Non sono stati trovati film d'animazione corrispondenti alla ricerca";
	}

	//remove data with null values in personal_vote field
	$.each( data, function( key,  movie ){
		if(movie.personal_vote != null){
			seen_movies[index] = movie;
			index++;
		}
	});
	console.log(seen_movies);
	//data sorting
	seen_movies = sortData(seen_movies, sorting_field);
	
	 $.each( seen_movies, function( key, val ) {
		//if the user did not provide a personal vote, substitutes the value with N.A.
		if(val.personal_vote == 0){
				personal_vote = "N.A.";
		}
		else{
			personal_vote = val.personal_vote;
		}
		
		//creates html
		if(val.personal_vote != null){
			if(val.categories.indexOf("animation") != 0){
				countFilm++;
				tableFilm += "<tr><td onclick='location.href=\"index.html?page=movie&id="+val.id+"\"'>" + val.title + "</td><td><strong>" + val.duration + "</strong></td><td><strong>" + personal_vote + "</strong></td><td><strong>" + val.imdb_vote + "</strong></td></tr>";
			}
			else{
				countAnimation++;
				tableAnimation += "<tr><td onclick='location.href=\"index.html?page=movie&id="+val.id+"\"'>" + val.title + "</td><td><strong>" + val.duration + "</strong></td><td><strong>" + personal_vote + "</strong></td><td><strong>" + val.imdb_vote + "</strong></td></tr>";
			}
		}
		
	});
	//show messages in case of empty fields
	if(countFilm == 0){
		tableFilm += "<tr><td>"+message[0]+"</td></tr>";
	}
	if(countAnimation == 0){
		tableAnimation += "<tr><td>"+message[1]+"</td></tr>";
	}
	
	//populates the html file
	$('#film_seen').html(countFilm);
	$('#animation_seen').html(countAnimation);
	$('.table-film-content').html(tableFilm);
	$('.table-animation-content').html(tableAnimation);
}

//shows a list of actors in a tabular way
function showActorsList(datas, field){
	$("#second-col-content").html("<div class='external-table-container'></div>");
	var data = [];
	  $.each( datas, function( key, val ) {
	  position = parseInt(key)+1;
	  if(field == "average"){
		value = parseFloat(val[field]).toFixed(2);
	  }
	  else if (field == "aniappearence"){
		value = parseInt(val["appearence"]);
	  }
	  else{
		value = parseInt(val[field]);
	  }
		data.push( "<tr onclick='location.href=\"index.html?page=actor&id="+val.id+"\"'><td>" + position + "</td><td class='name'>" + val.name + "</td><td class='appearences'><strong>" + value + "</strong></td></tr>" );
	  });
	 
	  $( "<table/>", {
		"class": "the-table",
		html: data.join("")
	  }).appendTo( ".external-table-container" );
}

//function to color cake charts
function getColor(j, max) {
		j++
		var lightblue = {r:255, g:255, b:255};
		var blue = {r:37, g:53, b:86};
		//var newColor = makeGradientColor(blue, lightblue, (j/max)*100);
        var newColor = makeGradientColor(blue, lightblue, Math.random()*100);
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

//returns data sorted with respect to the wanted field
function sortData(data, field){
	
	if(field=="title"){
		data.sort(function(a,b) {
			if(a[field] < b[field]) return -1;
			if(a[field] > b[field]) return 1;
		});
	}
	else{
		data.sort(function(a,b) {
			return parseFloat(b[field]) - parseFloat(a[field]);
		});
	}
	return data;
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

//function that counts how many movies are classified under a certain category
function count_categories(array_categories, film_categories){
		$.each( film_categories, function( key,  category ){
			switch(category){
				case "action":array_categories[0][1] += 1;    break;
				case "sci_fi":array_categories[1][1] += 1;    break;
				case "mystery":array_categories[2][1] += 1;   break;
				case "thriller":array_categories[3][1] += 1;  break;
				case "drama":array_categories[4][1] += 1;     break;
				case "crime":array_categories[5][1] += 1;     break;
				case "adventure":array_categories[6][1] += 1; break;
				case "fantasy":array_categories[7][1] += 1;   break;
				case "biography":array_categories[8][1] += 1; break;
				case "history":array_categories[9][1] += 1;   break;
				case "comedy": array_categories[10][1] += 1;   break;
				case "romance":array_categories[11][1] += 1;   break;
				case "family": array_categories[12][1] += 1;   break;
				case "animation":array_categories[13][1] += 1; break;
				case "musical":array_categories[14][1] += 1;   break;
				case "horror": array_categories[15][1] += 1;   break;
				case "war":array_categories[16][1] += 1;       break;
				case "music":array_categories[17][1] += 1;     break;
				case "sport":array_categories[18][1] += 1;     break;
				case "western":array_categories[19][1] += 1;   break;
				default: array_categories[20][1] += 1;         break;
			}
		});
		return array_categories;
}

//function that translate english genre's names in italian
function translate(language, word){
	if(language == "it"){
		switch(word){
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

//check email validity
function isValid(email){
	if(email != "" && email.indexOf("@")>=1){
		domain = email.substring(email.indexOf("@")+1, email.length);
		if(domain.indexOf(".")>=0) return true;
	}
	else return false;
}
//////////END CROSS PAGE FUNCTIONS//////////