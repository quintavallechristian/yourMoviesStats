<?php  
function sec_session_start() {
	$session_name = 'login_session';   // Set a custom session name
    $secure = false;
    // This stops JavaScript being able to access the session id.
    $httponly = true;
    // Forces sessions to only use cookies.
    if (ini_set('session.use_only_cookies', 1) === FALSE) {
        header("Location: ../error.php?err=Could not initiate a safe session (ini_set)");
        exit();
    }
    // Gets current cookies params.
    $cookieParams = session_get_cookie_params();
    session_set_cookie_params($cookieParams["lifetime"],
        $cookieParams["path"], 
        $cookieParams["domain"], 
        $secure,
        $httponly);
		
    // Sets the session name to the one set above.
    session_name($session_name);
    session_start();            // Start the PHP session 
    session_regenerate_id(true);    // regenerated the session, delete the old one. 
}

function login($email, $password, $mysqli) {
    // Using prepared statements means that SQL injection is not possible. 
    if ($stmt = $mysqli->prepare("SELECT id, user_name, user_surname, user_password, user_image, image_displacementX, image_displacementY, image_size, user_confirmed FROM users WHERE user_email = ? LIMIT 1")) {
        $stmt->bind_param('s', $email);  // Bind "$email" to parameter.
        $stmt->execute();    // Execute the prepared query.
        $stmt->store_result();
 
        // get variables from result.
        $stmt->bind_result($user_id, $name, $surname, $db_password, $image, $image_x, $image_y, $image_size, $user_confirmed);
        $stmt->fetch();
 
        if ($stmt->num_rows == 1) {
            // If the user exists we check if the account is locked
            // from too many login attempts 
 
            if (checkbrute($user_id, $mysqli) == true) {
                // Account is locked 
                // Send an email to user saying their account is locked
				$response["status"] = false;
				$response["message"] = "Account bloccato. Qualcuno ha tentato troppe volte di effettuare l'accesso";
                return $response;
            } 
			else {
                // Check if the password in the database matches
                // the password the user submitted. We are using
                // the password_verify function to avoid timing attacks.
                if (password_verify($password, $db_password)) {
					if($user_confirmed == 1){
						// Password is correct!
						// Get the user-agent string of the user.
						$user_browser = $_SERVER['HTTP_USER_AGENT'];
						// XSS protection as we might print this value
						$user_id = preg_replace("/[^0-9]+/", "", $user_id);
						$_SESSION['user_id'] = $user_id;
						// XSS protection as we might print this value
						$name = preg_replace("/[^a-zA-Z0-9_\-]+/", "", $name);
						$_SESSION['name'] = $name;
						$_SESSION['surname'] = $surname;
						$_SESSION['image'] = $image;
						$_SESSION['image_x'] = $image_x;
						$_SESSION['image_y'] = $image_y;
						$_SESSION['image_size'] = $image_size;
						$_SESSION['login_string'] = hash('sha512', $db_password . $user_browser);
						// Login successful.
						$response["status"] = true;
						$response["message"] = "Login avvenuto con successo";
					}
					else{
						$response["status"] = false;
						$response["message"] = "Account non confermato";
					}
					return $response;
                } else {
                    // Password is not correct
                    // We record this attempt in the database
                    $now = time();
                    $mysqli->query("INSERT INTO login_attempts VALUES ('', '$user_id', '$now')");
                    $response["status"] = false;
					$response["message"] = "Password errata";
					return $response;
                }
            }
        } 
		else {
            // No user exists.
			$response["status"] = false;
			$response["message"] = "Utente inesistente";
            return $response;
        }
    }
}

function checkbrute($user_id, $mysqli) {
    // Get timestamp of current time 
    $now = time();
 
    // All login attempts are counted from the past 2 hours. 
    $valid_attempts = $now - (2 * 60 * 60);
 
    if ($stmt = $mysqli->prepare("SELECT time 
                             FROM login_attempts 
                             WHERE user_id = ? 
                            AND time > '$valid_attempts'")) {
        $stmt->bind_param('i', $user_id);
 
        // Execute the prepared query. 
        $stmt->execute();
        $stmt->store_result();
 
        // If there have been more than 5 failed logins 
        if ($stmt->num_rows > 5) {
            return true;
        } else {
            return false;
        }
    }
}

function login_check($mysqli) {
    // Check if all session variables are set 
    if (isset($_SESSION['user_id']) && isset($_SESSION['name']) && isset($_SESSION['login_string'])) {
        $user_id = $_SESSION['user_id'];
        $login_string = $_SESSION['login_string'];
        $name = $_SESSION['name'];
        $surname = $_SESSION['surname'];
		$image = $_SESSION['image'];
        $image_x = $_SESSION['image_x'];
        $image_y = $_SESSION['image_y'];
        $image_size = $_SESSION['image_size'];
        // Get the user-agent string of the user.
        $user_browser = $_SERVER['HTTP_USER_AGENT'];
 
        if ($stmt = $mysqli->prepare("SELECT user_password 
                                      FROM users 
                                      WHERE id = ? LIMIT 1")) {
            // Bind "$user_id" to parameter. 
            $stmt->bind_param('i', $user_id);
            $stmt->execute();   // Execute the prepared query.
            $stmt->store_result();
 
            if ($stmt->num_rows == 1) {
                // If the user exists get variables from result.
                $stmt->bind_result($password);
                $stmt->fetch();
                $login_check = hash('sha512', $password . $user_browser);
 
                if (hash_equals($login_check, $login_string) ){
                    // Logged In!!!! 
					$response["error"] = 0;
					$response["user_id"] = $user_id;
					$response["name"] = $name;					
					$response["surname"] = $surname;					
					$response["image"] = $image;										
					$response["image_x"] = $image_x;							
					$response["image_y"] = $image_y;									
					$response["image_size"] = $image_size;
                    return $response;
                } else {
                   $response["error"] = 1;
                    return $response;
                }
            } else {
                // Not logged in 
                $response["error"] = 2;
                return $response;
            }
        } else {
            // Not logged in
			$response["error"] = 3;
            return $response;
        }
    } else {
        // Not logged in 
        $response["error"] = 4;
        return $response;
    }
}

function esc_url($url) {
 
    if ('' == $url) {
        return $url;
    }
 
    $url = preg_replace('|[^a-z0-9-~+_.?#=!&;,/:%@$\|*\'()\\x80-\\xff]|i', '', $url);
 
    $strip = array('%0d', '%0a', '%0D', '%0A');
    $url = (string) $url;
 
    $count = 1;
    while ($count) {
        $url = str_replace($strip, '', $url, $count);
    }
 
    $url = str_replace(';//', '://', $url);
 
    $url = htmlentities($url);
 
    $url = str_replace('&amp;', '&#038;', $url);
    $url = str_replace("'", '&#039;', $url);
 
    if ($url[0] !== '/') {
        // We're only interested in relative links from $_SERVER['PHP_SELF']
        return '';
    } else {
        return $url;
    }
}

if(!function_exists('hash_equals'))
{
    function hash_equals($str1, $str2)
    {
        if(strlen($str1) != strlen($str2))
        {
            return false;
        }
        else
        {
            $res = $str1 ^ $str2;
            $ret = 0;
            for($i = strlen($res) - 1; $i >= 0; $i--)
            {
                $ret |= ord($res[$i]);
            }
            return !$ret;
        }
    }
}

?>