<?php
ini_set('max_execution_time', 300000); //300 seconds = 5 minutes
require_once('functions_write.php');

flush();
ob_flush();
for($i = 397062  ;$i<=397143;$i++){
	if(($i % 20) == 0){
		sleep(15);
	}
	$result = addMoviesToDb($i);
	//if($result["id"] > 1){
		echo $i . " - " . json_encode($result);
		echo "<br>";
		flush();
		ob_flush();
	//}
}

?>