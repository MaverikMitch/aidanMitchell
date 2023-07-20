<?php

$latitude = $_GET['latitude'];
$longitude = $_GET['longitude'];
$apiKey = 'c2eaf11327e34886a8858c64b0137a53'; 

$url = "https://api.opencagedata.com/geocode/v1/json?q=$latitude+$longitude&key=$apiKey";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$response = json_decode($result, true);
echo json_encode($response);
?>

