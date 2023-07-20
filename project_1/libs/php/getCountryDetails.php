<?php
require('functions.php');

if (isset($_GET['country'])) {
  $countryCode = $_GET['country'];

  $username = 'maverikmitch';
  $url = "http://api.geonames.org/countryInfoJSON?country=$countryCode&username=$username";

  $curl = curl_init();
  curl_setopt($curl, CURLOPT_URL, $url);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

  $response = curl_exec($curl);
  curl_close($curl);

  header('Content-Type: application/json');
  echo $response;
}
