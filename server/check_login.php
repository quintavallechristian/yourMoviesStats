<?php
require_once('inc/config.php');
require_once('secure_login_functions.php');
$mysqli = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE);
sec_session_start();
$loggedIn = login_check($mysqli);
echo json_encode($loggedIn);

