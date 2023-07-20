<?php

require('functions.php');

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$countryCode = $_REQUEST['countryCode'];

$url = "https://restcountries.com/v2/alpha/" . $countryCode;

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$countryInfo = json_decode($result, true); // Extract the country info from the response

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

// Check if the API returned valid data
if ($countryInfo && isset($countryInfo['name']) && isset($countryInfo['callingCodes']) && isset($countryInfo['languages'])) {
    $output['data'] = array(
        'countryName' => $countryInfo['name'],
        'capital' => $countryInfo['capital'],
        'population' => $countryInfo['population'],
        'area' => $countryInfo['area'],
        'telephoneCode' => '+' . $countryInfo['callingCodes'][0],
        'countryCode' => $countryCode,
        'currency' => isset($countryInfo['currencies'][0]['code']) ? $countryInfo['currencies'][0]['code'] : '',
        'languages' => $countryInfo['languages'], // Add languages spoken to the data
       
    );
} else {
    $output['data'] = null; // Set data to null if no valid country info is available
}

echo json_encode($output);


