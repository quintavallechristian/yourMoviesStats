	// Setup the dnd listeners.
	var dropZone = document.getElementById('drop_zone');
	dropZone.addEventListener('dragleave', handleDragLeave, false);
	dropZone.addEventListener('dragover', handleDragOver, false);
	dropZone.addEventListener('drop', function(evt) {
											avatar = handleFileSelect(evt, cl);
										}, false);

//click on save image button
	$("#btn-img-register-save").click(function(){
		if(imageEdited){
			avatar_data = $("#drop_zone").css('background-image');
			avatar_data = avatar_data.replace('url("','').replace('")','');
			
			if(avatar.name == "placeholder.png"){
				avatar_name = userData.img;
				avatar_data = -1;
			}
			else{
				avatar_name = avatar.name;
			}
			console.log(avatarSizeEdited);
			if(!avatarSizeEdited){
				avatarSize = userData.size;
			}
			
			if(!avatarPositionEdited){
				backgroundPos.x = -1;
				backgroundPos.y = -1;
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
								console.log(data);
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
		}
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
		if(imageEdited){
			dragging = true;
			initialMousePos.x = event.pageX;
			initialMousePos.y = event.pageY;
		}
	});	
	//handle mouse movement when dragging image
	$("#modal-table").mousemove(function(){
		if(imageEdited){
			if(dragging){
				avatarPositionEdited = true;
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
		}
	});
	//handle the behavior when user stops moving the avatar
	$("#modal-table").mouseup(function(){
		if(imageEdited){
			if(dragging){
				backgroundPos.x = backgroundMov.x;
				backgroundPos.y = backgroundMov.y;
				console.log(backgroundPos);
				currentMousePos.x = event.pageX;
				currentMousePos.y = event.pageY;
				$("body").removeClass("dragging");
				dragging = false;
			}
		}
	});
	//handle the behavior when user scrolls on avatar area
	$('#drop_zone').bind('DOMMouseScroll', function(e){
		if(imageEdited){
			avatarSizeEdited = true;
			avatarPositionEdited = false;
			console.log("ciao");
			if(e.originalEvent.detail > 0) {
				avatarSize -= 5;
			}else {
				avatarSize += 5;
			}
			$('#drop_zone').css("background-size", avatarSize+"%");
			$('#drop_zone').css("background-position", "center");
		}
		//prevent page fom scrolling
		return false;
	 });
	//handle the behavior when user scrolls on avatar area (IE, Opera and Safari)
	$('#drop_zone').bind('mousewheel', function(e){
		if(imageEdited){
			avatarSizeEdited = true;
			avatarPositionEdited = false;
			if(e.originalEvent.wheelDelta < 0) {
				avatarSize -= 5;
			}else {
				avatarSize += 5;
			}
			$('#drop_zone').css("background-size", avatarSize+"%");
			$('#drop_zone').css("background-position", "center");
		}
		//prevent page fom scrolling
		return false;
	 });	
	//END AVATAR POSITIONING HANDLING