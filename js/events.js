//////////VARIABLE INITIALIZATION//////////
var userData; 							//stores user's information
var registered = false;					//states if the user has already compleated the registration process
//AVATAR HANDLING
var dragging = false; 					//states if the user is currentily clicking and dragging the mouse
var initialMousePos = { x: -1, y: -1 }; //stores the initial mouse position: used in image resizing
var currentMousePos = { x: -1, y: -1 }; //stores the current mouse position: used in image resizing
var movement = { x: 0, y: 0 }; 			//stores the mouse movement: used in image resizing
var backgroundPos = { x: 0, y: 0 }; 	//stores the initial avatar position: used in image resizing
var backgroundMov = { x: 0, y: 0 }; 	//stores the movement the avatar must do, accordingly to mouse movement: used in image resizing
var avatar = [];						//stores avatar information: url, position and size
var avatarSize = 100;					//stores avatar sized: used in image resizing
var imageEdited = false;				//states if the avatar have been modified
var avatarSizeEdited = false;			//states if the avatar size have been modified
var avatarPositionEdited = false;		//states if the avatar position have been modified
avatar["name"] = "placeholder.png";		//initialize the user avatar with the default one
//END AVATAR HANDLING

//////////END VARIABLE INITIALIZATION//////////
$(function() {
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

		
	$(window).resize( function respondCanvas(){ 
		$("#myChart").attr('width', $("#chart").width() ); //max width
		$("#myChart").attr('height', $("#chart").height() ); //max height
	});
	
	//////////PAGE INITIALIZATION//////////
	//look local storage searching for user info
	var userData = isLogged();
	if(!userData.status){
		$("body").css("background-image", "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),url(/movies/img/wp.jpg");
		$("body").css("background-position", "center");
		$("header").css("background-color", "rgba(0,0,0,0.1)");
		$("nav").hide();
		$("header").css("height", "90px");
		$("nav button").css("border-color", "rgba(0,0,0,0.0)");
		$("#sub-container").hide();
		showWelcome();
	}
	else{
		$("#btn-register").css("display", "none");
		$("#btn-login").css("display", "none");
		$("#username-nav").css("display", "block");
		$("#username-nav").html(userData.name);
		$("#avatar-nav").css("display", "block");
		$("#image-nav").css("background-image", "url(/movies/img/avatars/"+userData.image);
		$("#image-nav").css("background-size", userData.image_size+"%");
		if(userData.image_x != -1){
			actualDispX = userData.image_x*40/200;
			actualDispY = userData.image_y*40/200;
			$("#image-nav").css("background-position", actualDispX + "px " + actualDispY + "px");
		}
		else{
			$("#image-nav").css("background-position", "center");
		}
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
	
	//general click handling
	$(document).click(function(event) { 
		//register-login popup handling. If user clicks in the black area, it will close the popup
			if(event.target.id == "modal-table" && !dragging){
				$(".modal-table").fadeOut(250);
			}
		//profile popup handling. If user clicks outside the popup, it will close it	
		if((!$(event.target).closest('#profile-popup').length && !$(event.target).is('#profile-popup'))
			&& (!$(event.target).closest('#profile').length && !$(event.target).is('#profile'))) {
			if($('#profile-popup').is(":visible")) {
				$('#profile-triangle').hide(200);
				$('#profile-popup').hide(200);
			}
		}        
	})
	
	//////////NAV BAR CLICKS//////////
	$("#home").click(function(){
		location.href="index.html?page=home";
	});
	$("#actors").click(function(){
		location.href="index.html?page=actors";
	});
	$("#films").click(function(){
		location.href="index.html?page=movies";
	});
	//////////END NAV BAR CLICKS//////////
	
	//////////GENERAL POPUP EVENTS//////////
	$("#close-btn").click(function(){
		$(".modal-table").fadeOut(250);
	})
	$("#btn-return-to-home").click(function(){
		$(".modal-table").fadeOut(250);
	})
	//////////END GENERAL POPUP EVENTS//////////
	
	//////////REGISTRATION EVENTS//////////
	//click on nav bar register button - the button appears only if the user is not loggedIn
	$("#btn-register").click(function(){
		if(!registered){
			$(".modal-table").fadeIn(250);
			$("#register-modal").show();
			$("#register-successful").hide();
			$("#login-modal").hide();
		}
		else{
			$(".header-modal").hide();
			$(".modal-table").fadeIn(250);
			$("#register-modal").hide();
			$("#register-successful").css("height", "100%");
			$("#register-successful").show();
			$("#login-modal").hide();
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
			password: hex_sha512(password)
			}, function(data) {
					data = JSON.parse(data);
					if(data.error == 0){
						$("#register-modal").hide();
						console.log(data);
						cl.show();
						sendEmail(data.data.name, data.data.email, "confirmation");
						setTimeout(function(){
							cl.hide();
							$("#register-modal").hide();
							$(".final-message-container").css("display", "block");
							$(".header-modal").hide();
							$(".header-modal").hide();
							registered = true;
							$("#register-successful").css("height", "100%");
							$("#register-successful").fadeIn(1000);
						}, 2000);
					}
					else{
						$("#register-message").html(data.message);
					}
				});
		}
	});
	
	//////////END REGISTRATION EVENTS//////////
	
	//////////LOGIN EVENTS//////////
	//click on nav bar login button
	$("#btn-login").click(function(){
		$(".modal-table").fadeIn(250);
		$("#register-successful").hide();
		$("#register-modal").hide();
		$("#login-modal").show();
	});
	
	//click on confirm login button
	$("#login-btn").click(function(){
		email = $("#login-email-or-username").val();
		password = $("#login-password").val();
		if(email == ""){
			loginMessage = "Inserisci email";
			$("#login-message").html(loginMessage);
		}
		else if(password.length < 8){
			loginMessage = "Inserisci una password valida"
			$("#login-message").html(loginMessage);
		}
		else{
			$.post("server/login.php", {
			email: email,
			password: hex_sha512(password),
			}, function(data) {
					console.log(data);
					data = JSON.parse(data);
					if(data.error == 0){
						location.reload();
					}
					else{
						if(data.error == 1){
							loginMessage = data.message;
							$("#login-message").html(loginMessage);
						}
					}
				});
		}
	});
	//////////END LOGIN EVENTS//////////
	
	//////////PROFILE EVENTS//////////
	$("#profile").mouseover(function(){
		$("#image-nav").css("box-shadow", "inset 0 0 0 1000px rgba(255,255,255,.2)");
	});
	
	$("#profile").mouseleave(function(){
		$("#image-nav").css("box-shadow", "inset 0 0 0 0 rgba(255,255,255,.2)");
	});
	
	$("#profile").mousedown(function(){
		if(userData.status){
			$("#profile-triangle").fadeIn(200);
			$("#profile-popup").fadeIn(200);
		}
	});
	
	$("#profile").mouseup(function(){
		$("#image-nav").css("box-shadow", "inset 0 0 0 1000px rgba(255,255,255,.2)");
	});
	
	$("#profile-popup button").mouseover(function(){
		$(this).animate({"padding":"2rem 0.5rem 2rem 0.5rem"}, 200);
	});
	
	$("#profile-popup button").mouseleave(function(){
		$(this).animate({"padding":"2rem 0rem 2rem 0rem"}, 200);
	});
	
	$("#logout").click(function(){
		$.post("server/logout.php", {
			}, function(data) {
					console.log(data);
					data = JSON.parse(data);
					if(data.error == 0){
						location.reload();
					}
					else{
						//unreachable
					}
					
				});
	});
	//////////END PROFILE EVENTS//////////
	
	//////////SCROLL LISTENER EVENTS//////////
	
	$(window).scroll(function () {
		var scrollTop = $(document).scrollTop();
		var height = $(document).height();
		var firstRowHeight = $("#first-row").height();
		console.log(height);
		console.log(scrollTop);
		console.log(scrollTop/(height-firstRowHeight));
		$('.second-half').css({
			'opacity': ((height - (scrollTop+((scrollTop/(height-firstRowHeight))*firstRowHeight))) / height)
		});
		$('#page-title').css({
			'opacity': ((height - (scrollTop+((scrollTop/(height-firstRowHeight))*firstRowHeight))) / height)
		});
		$('#second-row-page-title').css({
			'opacity': 1-((height - (scrollTop+((scrollTop/(height-firstRowHeight))*firstRowHeight))) / height)
		});
	});
	
	//////////END SCROLL LISTENER EVENTS//////////
	
	
})
