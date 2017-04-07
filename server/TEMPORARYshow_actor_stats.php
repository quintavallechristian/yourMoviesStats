<?php
require_once('functions.php');

if(isset($_GET["num"])){
show_actor_stats("all","json", $_GET["num"], $_GET["field"]);
}
else{
show_actor_stats("all","json", 10, "appearence");
}
?>