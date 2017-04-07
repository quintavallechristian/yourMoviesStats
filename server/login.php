<?php
require_once('inc/connect.php');
require_once('secure_login_functions.php');
$db = new DB_CONNECT();
$mysqli = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE);

sec_session_start(); // Our custom secure way of starting a PHP session.

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

if (isset($request->email, $request->password)) {
    $email = filter_var($request->email, FILTER_SANITIZE_EMAIL);
    $password = filter_var($request->password, FILTER_SANITIZE_STRING);
	
	$login = login($email, $password, $mysqli);
	
    if ($login["status"] == true) {
        $error = 0;
		$message = $login["message"];
    } else {
        $error = 1;
		$message = $login["message"];
    }
} else {
    // The correct POST variables were not sent to this page. 
    $error = 1;
	$message = 'Invalid Request';
}

$response["error"] = $error;
$response["message"] = $message;
echo json_encode($response);

?>