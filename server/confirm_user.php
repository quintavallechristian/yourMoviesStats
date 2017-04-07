<?php
require_once('inc/connect.php');
$db = new DB_CONNECT();

$error = -1;
$message = "Unreachable";

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

if(isset($request->id) && isset($request->digest)){
	$id = filter_var($request->id, FILTER_SANITIZE_STRING);
    $digest = filter_var($request->digest, FILTER_SANITIZE_STRING);
    
	$query = "SELECT user_email, user_confirmed FROM users WHERE id = '$id'";
	$result = mysql_query($query);
	if($result){
		if(mysql_num_rows($result) == 1){
			$confirmed = mysql_result($result, 0, 'user_confirmed');
			if($confirmed == 0){
				$error = 1;
				$message = "User successfully retrieved";
				$email = mysql_result($result, 0, 'user_email');
				if(md5($email) == $digest){
					$query = "UPDATE users SET user_confirmed = '1' WHERE id = '$id'";
					$result = mysql_query($query);
					if($result){
						$error = 0;
						$message = "Email confermata! Buona Navigazione!";
					}
					else{ //must be unreachable
						$error = 5;
						$message = "Database error: ".mysql_error();
					}
				}
				else{
					$error = 2;
					$message = "Questo link non è più valido";
				}
			}
			else{
				$error = 6;
				$message = "Utente già confermato";
			}
		}
		else if(mysql_num_rows($result) == 0){
			$error = 3;
			$message = "Nessun utente corrispondente a questa email";
		}
		else {
			$error = 4;
			$message = "Strange! ". mysql_error();
		}
	}
	else{ //must be unreachable
		$error = 5;
		$message = "Database error: ".mysql_error();
	}
}

$response["error"] = $error;
$response["message"] = $message;
echo json_encode($response);
?>