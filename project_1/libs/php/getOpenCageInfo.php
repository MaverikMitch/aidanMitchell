

<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $lat = $_REQUEST['latitude'];
    $lng = $_REQUEST['longitude'];
    $apiKey = 'c2eaf11327e34886a8858c64b0137a53';

    $url = 'https://api.opencagedata.com/geocode/v1/json?q=' . $lat . '+' . $lng . '&key=' . $apiKey;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    $result = curl_exec($ch);

    curl_close($ch);

	$decode = json_decode($result, true);
    $addressInfo = $decode['results'][0]['components'];

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = array(
        'country' => $addressInfo['country'],
        'countryCode' => $addressInfo['country_code']
        // Add more relevant address components if needed
    );
    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
?>
