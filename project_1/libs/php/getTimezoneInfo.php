<?php

require('functions.php');

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$latitude = $_REQUEST['lat'];
$longitude = $_REQUEST['lng'];
$username = 'maverikmitch';

$url = "http://api.geonames.org/timezoneJSON?lat=$latitude&lng=$longitude&username=$username";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);
$timezoneInfo = $decode; // Store the timezone info

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = array(
    'timezoneId' => $timezoneInfo['timezoneId'],
    'time' => $timezoneInfo['time'],
    'utcOffset' => $timezoneInfo['gmtOffset']
);

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
?>

