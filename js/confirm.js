//////////VARIABLE INITIALIZATION//////////
var userData; //stores user's information

$(function() {
	
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
		window.location.replace("http://rankyourworld.it/movies");
	}
	
	$("#confirmation-successful").css("height", "100%");
	var c= $(document).getUrlParam("c");
	if(c !== null){
		userId = c.substring(0,1);
		digest = c.substring(1,c.length);
		console.log(digest);
		checkProfile(userId, digest);
	}
	
	//general click handling
	$(document).click(function(event) { 
		//register-login popup handling. If user clicks in the black area, it will close the popup
			if(event.target.id == "modal-table"){
				location.href="index.html?page=home";
			}      
	});
	
	$("#btn-confirmation").click(function(){
		location.href="index.html?page=home";
	});
})

function checkProfile(id, digest){
	$.post("server/check_user.php", {
		id: id,
		digest: digest
		}, function(data) {
				data = JSON.parse(data);
				console.log(data);
				$(".modal-table").fadeIn(250);
				$("#register-modal").show();
				$(".confirmation-successful-title").html(data.message);
				if(data.error == 0){
					$("#btn-confirmation").show();
				}
			});
}

