<?php
require 'phpmailer/PHPMailerAutoload.php';
require_once('inc/connect.php');
$db = new DB_CONNECT();

function sendEmail ($name, $email, $type){
	$query = "SELECT id FROM users WHERE user_email = '$email'";
	$result = mysql_query($query);
	
	if($result){
		$id = mysql_result($result, 0, "id");
		$link = $id."-".md5($email);
		
		$text = readText($type."_email.html");
		if($type == "confirmation"){
			$text = str_replace("{{nome utente}}", $name, $text);
			$text = str_replace("{{link}}", "www.rankyourworld.it/movies/#/confirm?c=".$link, $text);
		}
		$mail = new PHPMailer;

		//$mail->SMTPDebug = 3;                               // Enable verbose debug output

		$mail->isSMTP();                                      // Set mailer to use SMTP
		$mail->Host = 'srv-hp5.netsons.net';  				  // Specify main and backup SMTP servers
		$mail->SMTPAuth = true;                               // Enable SMTP authentication
		$mail->Username = 'chrissjdue@rankyourworld.it';      // SMTP username
		$mail->Password = '92qhomefi!';                       // SMTP password
		$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
		$mail->Port = 25;                                     // TCP port to connect to

		$mail->setFrom('chrissjdue@rankyourworld.it', 'YourMov!eStats');
		$mail->addAddress($email, $name);    				  // Add a recipient
		$mail->addReplyTo('chrissjdue@rankyourworld.it', 'Information');
		$mail->isHTML(true);                                  // Set email format to HTML

		$mail->Subject = 'Benvenuto in YourMov!eStats';
		$mail->Body    = $text;
		$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

		if(!$mail->send()) {
			$response["error"] = 6;
			$response["message"] = 'Mailer Error: ' . $mail->ErrorInfo;
		} else {
			$response["error"] = 0;
			$response["message"] = 'Message has been sent';
		}
	}
	else{ //must be unreachable
		$response["error"] = 7;
		$response["message"] = 'Database error';
	}
	
	return $response;
}

function readText($filename) {
	$text = "";
	if (file_exists($filename)) {
		$text = file_get_contents($filename);
	}		
	return $text;	
}
?>