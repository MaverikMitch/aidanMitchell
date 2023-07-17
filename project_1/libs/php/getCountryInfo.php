
<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $lat = $_REQUEST['latitude'];
    $lng = $_REQUEST['longitude'];
    $username = 'maverikmitch';

    $url = 'http://api.geonames.org/countryInfoJSON?lat=' . $lat . '&lng=' . $lng . '&username=' . $username;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    $result = curl_exec($ch);

    curl_close($ch);

    $decode = json_decode($result, true);
    $countryInfo = $decode['geonames'][0]; // Extract the country info from the response

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = array(
        'capital' => $countryInfo['capital'],
        'population' => $countryInfo['population'],
        'area' => $countryInfo['areaInSqKm'],
        'telephoneCode' => isset($countryInfo['phone']) ? $countryInfo['phone'] : '',
        'countryCode' => $countryInfo['countryCode'],
        'currency' => $countryInfo['currencyCode'],
        'exchangeRates' => '' // Add your logic to fetch exchange rates or leave it empty
    );
?>
