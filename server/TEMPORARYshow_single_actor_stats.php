<?php
require_once('functions.php');
if(isset($_GET["id"])){
show_actor_stats($_GET["id"],"json", 1,"");
}
?>