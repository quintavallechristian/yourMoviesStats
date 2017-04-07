function handleFileSelect(evt, cl) {
	
	evt.stopPropagation();
	evt.preventDefault();
	var files = evt.dataTransfer.files;

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

		// Only process image files.
			if (!f.type.match('image.*')) {
			continue;
		}

		var reader = new FileReader();
		reader = new FileReader();
		reader.onerror = errorHandler;
		reader.onabort = function(e) {
			alert('File read cancelled');
		};
      
		// Closure to capture the file information.
		reader.onload = (function(theFile) {
		return function(e) {
			cl.show();
			setTimeout(function(){
							cl.hide();
							$('#drop_zone').css("background-image", "url("+e.target.result+")");
							$('#drop_zone').css("background-position", "center");
							$('#drop_zone').css("background-size", "cover");
							$("#btn-img-register-save .btn-modal").css("background-color", "#ed5860");
							imageEdited = true;
						}, 1000);
			console.log(escape(theFile.name));
		};
		})(f);
      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
	  return f;
    }
}

function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	$("#drop_zone").css("border-color", "#ed5860");
}

function handleDragLeave(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	$("#drop_zone").css("border-color", "#c4c4c4");
}

function errorHandler(evt) {
	switch(evt.target.error.code) {
	  case evt.target.error.NOT_FOUND_ERR:
		alert('File Not Found!');
		break;
	  case evt.target.error.NOT_READABLE_ERR:
		alert('File is not readable');
		break;
	  case evt.target.error.ABORT_ERR:
		break;
	  default:
		alert('An error occurred reading this file.');
	};
}