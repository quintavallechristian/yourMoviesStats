<?php
require_once('inc/config.php');
require_once('send_email.php');
$mysqli = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE);

$error = -1;
$message = "Unreachable";
$data = [];
 
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

if(isset($request->name) && isset($request->surname) && isset($request->email) && isset($request->password)){
	// Sanitize and validate the data passed in
    $name = filter_var($request->name, FILTER_SANITIZE_STRING);
    $surname = filter_var($request->surname, FILTER_SANITIZE_STRING);
    $email = filter_var($request->email, FILTER_SANITIZE_EMAIL);
    $email = filter_var($email, FILTER_VALIDATE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Not a valid email
        $error = 3;
		$message = "Inserisci un indirizzo email valido";
    }
 
    $password = filter_var($request->password, FILTER_SANITIZE_STRING);
    if (strlen($password) != 128) {
        // The hashed pwd should be 128 characters long.
        // If it's not, something really odd has happened
        $error = 4;
		$message = "Configurazione password non valida";
    }
 
    // Username validity and password validity have been checked client side.
    // This should should be adequate as nobody gains any advantage from
    // breaking these rules.
 
    $prep_stmt = "SELECT id FROM users WHERE user_email = ? LIMIT 1";
    $stmt = $mysqli->prepare($prep_stmt);
 
   // check existing email  
    if ($stmt) {
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->store_result();
 
        if ($stmt->num_rows == 1) {
            // A user with this email address already exists
			$error = 6;
			$message = "La tua email risulta essere già registrata";
            $stmt->close();
        }
    }
	else {
		$error = 7;
		$message = "Database selection failed";
        $stmt->close();
    }
 
 
    // TODO: 
    // We'll also have to account for the situation where the user doesn't have
    // rights to do registration, by checking what type of user is attempting to
    // perform the operation.
 
    if ($error == -1) {
 
        // Create hashed password using the password_hash function.
        // This function salts it with a random salt and can be verified with
        // the password_verify function.
		
        $password = password_hash($password, PASSWORD_BCRYPT);
 
        // Insert the new user into the database 
		if ($insert_stmt = $mysqli->prepare("INSERT INTO users (user_name, user_surname, user_email, user_password) VALUES (?, ?, ?, ?)")) {
            $insert_stmt->bind_param('ssss', $name, $surname, $email, $password);
			// Execute the prepared query.
            if (! $insert_stmt->execute()) {
                $error = 5;
				$message = "Database insertion failed: ". mysql_error();
            }
			else{
				$emailResponse = sendEmail($name, $email, "confirmation");
				$error = $emailResponse["error"];
				$message = $emailResponse["message"];
			}
        }
		else{
			$error = 0;
			$message = mysql_error();
		}
    }
}
$response["error"] = $error;
$response["message"] = $message;
$response["data"] = $data;
echo json_encode($response);