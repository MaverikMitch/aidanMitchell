<?php

require('functions.php');

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$countryCode = $_GET['countryCode'];

$url = "https://openexchangerates.org/api/latest.json?app_id=a812f0d33df947759ab46103202db6ff";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$exchangeRates = json_decode($result, true); // Extract the exchange rates from the response

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

// Check if the API returned valid data
if ($exchangeRates && isset($exchangeRates['rates'])) {
    $output['exchangeRates'] = $exchangeRates['rates']; // Return the exchange rates directly
} else {
    $output['exchangeRates'] = null; // Set exchangeRates to null if no valid exchange rates are available
}

echo json_encode($output);
?>
