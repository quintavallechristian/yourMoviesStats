<?php

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://www.imdb.com/list/export?list_id=ls000301495&author_id=ur22056773&ref_=wl_exp");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$file = curl_exec($ch);
curl_close($ch);

echo $file;
?>