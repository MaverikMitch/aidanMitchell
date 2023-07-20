$(document).ready(function() {
  var map = L.map('map').setView([0, 0], 2); // Initialize the map with default center coordinates and zoom level

  // Add a tile layer to the map (you can change the tile provider if needed)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }).addTo(map);

  var userMarker = null; // Variable to hold the user's marker

  // Function to center the map on the user's current location
  function centerOnUserLocation(position) {
    var lat = position.coords.latitude; // Gets the latitude from the position object
    var lng = position.coords.longitude; // Gets the longitude from the position object

    if (userMarker) {
      map.removeLayer(userMarker); // Remove the previously added user marker if exists
    }

    map.setView([lat, lng], 12); // Center the map on the user's location
    userMarker = L.marker([lat, lng]).addTo(map); // Create a marker at the user's location and add it to the map
  }

  // Function in case of an error with geolocation
  function handleGeolocationError(error) {
    console.error('Error getting user location:', error);
  }

  // Check if the browser supports geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(centerOnUserLocation, handleGeolocationError);
  } else {
    console.error('Geolocation is not supported by this browser.');
  }

  // Function to handle the selection change in the dropdown
  $('#countrySelect').change(function() {
    var selectedCountry = $(this).val();

    if (selectedCountry === 'current') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(centerOnUserLocation, handleGeolocationError);
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    }
  });

  var selectedMarker = null; // Variable to hold the selected marker

  // Loads the GeoJSON data
  fetch('json/countries.geojson')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      populateCountryDropdown(data); // Populate the country dropdown with countries from the GeoJSON

      // Handle submit button click
      $('#submitButton').click(function() {
        var selectedCountry = $('#countrySelect').val(); // Get the selected country from the dropdown menu

        if (selectedCountry !== 'current') {
          var selectedFeature = data.features.find(function(feature) {
            return feature.properties.NAME === selectedCountry; // Find the feature based on the selected country
          });

          if (selectedFeature) {
            var coordinates = selectedFeature.geometry.coordinates; // Get the coordinates of the selected country

            // Code for handling the coordinates within the json file
            var lat, lng;

            if (selectedFeature.geometry.type === 'MultiPolygon') {
              var firstPolygonCoordinates = coordinates[0][0]; // Take the first polygon's coordinates
              lat = firstPolygonCoordinates[0][1]; // Latitude is at index [0][1]
              lng = firstPolygonCoordinates[0][0]; // Longitude is at index [0][0]
            } else if (selectedFeature.geometry.type === 'Polygon') {
              var firstPolygonCoordinates = coordinates[0]; // Take the polygon's coordinates
              lat = firstPolygonCoordinates[0][1]; // Latitude is at index [0][1]
              lng = firstPolygonCoordinates[0][0]; // Longitude is at index [0][0]
            }

            if (selectedMarker) {
              map.removeLayer(selectedMarker); // Remove the previously selected marker if it exists
            }

            map.setView([lat, lng], 5); // Center the map on the selected country
            selectedMarker = L.marker([lat, lng]).addTo(map); // Create a marker and add it to the map

            // Bind a popup to the marker with the country name and "Click for More Info" link
            selectedMarker.bindPopup(
              '<b>' + selectedFeature.properties.NAME + '</b><br><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#countryInfoModal">Click here for more info</button>'
            ).openPopup();

            // Make AJAX call to retrieve country info from countryInfo.php
            console.log('lat: ' + lat);
            console.log('long: ' + lng);

            // Make a request for the country code: CountryCode / reverse geocoding
            // Use the country code and feed it into this request to get country details
            $.ajax({
              url: 'libs/php/reverseGeocode.php',
              method: 'GET',
              data: {
                latitude: lat,
                longitude: lng
              },
              dataType: 'json',
              success: function(response) {
                var countryCode = response.results[0].components['ISO_3166-1_alpha-2']; // Retrieve the country code from the OpenCage response

                // Make another AJAX call to get the country information using the retrieved country code
                $.ajax({
                  url: 'libs/php/getCountryInfo.php',
                  method: 'GET',
                  data: {
                    countryCode: countryCode
                  },
                  dataType: 'json',
                  success: function(response) {
                    var countryInfo = response.data; // Retrieve the country info from the response

                    // Make AJAX call to retrieve timezone information
                    $.ajax({
                      url: 'libs/php/getTimezoneInfo.php',
                      method: 'GET',
                      data: {
                        lat: lat,
                        lng: lng
                      },
                      dataType: 'json',
                      success: function(response) {
                        var timezoneInfo = response.data; // Retrieve the timezone info from the response

                        // Make AJAX call to retrieve country flag using Flagpedia API
                        $.ajax({
                          url: 'https://flagcdn.com/en/codes.json',
                          method: 'GET',
                          dataType: 'json',
                          success: function(response) {
                            var countryCodeLowerCase = countryCode.toLowerCase();
                            var flagUrl = 'https://flagcdn.com/w80/' + countryCodeLowerCase + '.png';

                            countryInfo['flag'] = flagUrl; // Add flag URL to countryInfo object

                            // Make AJAX call to retrieve exchange rates using functions.php
                            $.ajax({
                              url: 'libs/php/getExchangeRates.php',
                              method: 'GET',
                              data: {
                                countryCode: countryCode
                              },
                              dataType: 'json',
                              success: function(response) {
                                var exchangeRates = response.exchangeRates; // Retrieve the exchange rates data
                                countryInfo['exchangeRates'] = exchangeRates; // Add exchange rates to countryInfo object
                                populateCountryModal(countryInfo, timezoneInfo, selectedCountry);
                              },
                              error: function(error) {
                                console.error('Error fetching exchange rates:', error);
                                countryInfo['exchangeRates'] = null; // Set exchange rates to null if there was an error
                                populateCountryModal(countryInfo, timezoneInfo, selectedCountry); // Still populate the modal even if exchange rate fetching fails
                              }
                            });

                          },
                          error: function(error) {
                            console.error('Error fetching country flag:', error);
                            populateCountryModal(countryInfo, timezoneInfo, selectedCountry); // Still populate the modal even if flag fetching fails
                          }
                        });
                      },
                      error: function(error) {
                        console.error('Error fetching timezone info:', error);
                      }
                    });
                  },
                  error: function(error) {
                    console.error('Error fetching country info:', error);
                  }
                });
              },
              error: function(error) {
                console.error('Error fetching country code:', error);
              }
            });
          }
          
        }
      });
    });

  // Function to populate the country dropdown
  function populateCountryDropdown(data) {
    var countrySelect = $('#countrySelect');

    // Sort the features array by country name
    var sortedFeatures = data.features.sort(function(a, b) {
      var countryNameA = a.properties.NAME.toUpperCase();
      var countryNameB = b.properties.NAME.toUpperCase();
      if (countryNameA < countryNameB) {
        return -1;
      }
      if (countryNameA > countryNameB) {
        return 1;
      }
      return 0;
    });

    // Iterate over the sorted features and populate the dropdown
    sortedFeatures.forEach(function(feature) {
      var countryName = feature.properties.NAME;
      var option = $('<option>').val(countryName).text(countryName);
      countrySelect.append(option);
    });
  }

  // Function to open the country info modal
function populateCountryModal(countryDetails, timezoneInfo, selectedCountry) {
  var modalTitle = $('#countryInfoModal .modal-title');
  modalTitle.empty();

  // Add flag image to the modal title
  var flagUrl = countryDetails['flag'];
  var flagImg = $('<img>').attr('src', flagUrl).attr('alt', countryDetails['countryName'] + ' Flag');
  modalTitle.append(flagImg);

  modalTitle.append(countryDetails['countryName']);

  var modalBody = $('#countryInfoModal .modal-body');
  modalBody.empty();

  modalBody.append('<p><strong>Country Name:</strong> ' + selectedCountry + '</p>');
  modalBody.append('<p><strong>Country Capital:</strong> ' + countryDetails['capital'] + '</p>');
  modalBody.append('<p><strong>Population:</strong> ' + countryDetails['population'] + '</p>');
  modalBody.append('<p><strong>Area:</strong> ' + countryDetails['area'] + ' sq km</p>');
  modalBody.append('<p><strong>Telephone Code:</strong> ' + countryDetails['telephoneCode'] + '</p>');
  modalBody.append('<p><strong>Currency:</strong> ' + countryDetails['currency'] + '</p>');

  // Add languages spoken to the modal
  var languages = countryDetails['languages'];

  if (languages && languages.length > 0) {
    var languagesList = $('<ul>');

    languages.forEach(function(language) {
      var languageItem = $('<li>').text(language.name);
      languagesList.append(languageItem);
    });

    modalBody.append('<p><strong>Languages Spoken:</strong></p>');
    modalBody.append(languagesList);
  } else {
    modalBody.append('<p><strong>Languages Spoken:</strong> N/A</p>');
  }

  // Add exchange rates to the modal
  var exchangeRates = countryDetails['exchangeRates'];

  if (exchangeRates && Object.keys(exchangeRates).length > 0) {
    var gbpExchangeRate = exchangeRates['GBP'];
    if (gbpExchangeRate) {
      modalBody.append('<p><strong>Exchange Rate (GBP):</strong> ' + gbpExchangeRate + '</p>');
    } else {
      modalBody.append('<p><strong>Exchange Rate (GBP):</strong> N/A</p>');
    }
  } else {
    modalBody.append('<p><strong>Exchange Rate (GBP):</strong> N/A</p>');
  }

  // Adding timezone information to the modal
  var timezoneId = timezoneInfo['timezoneId'];
  var time = timezoneInfo['time'];
  var utcOffset = timezoneInfo['utcOffset'];

  modalBody.append('<p><strong>Timezone ID:</strong> ' + timezoneId + '</p>');
  modalBody.append('<p><strong>Time:</strong> ' + time + '</p>');
  modalBody.append('<p><strong>UTC Offset:</strong> ' + utcOffset + '</p>');

  // Adding Wikipedia link to the modal
  var wikipediaLink = $('<a>')
    .attr('href', 'https://en.wikipedia.org/wiki/' + selectedCountry)
    .attr('target', '_blank')
    .text('Read more about ' + selectedCountry + ' with Wikipedia!');
  modalBody.append(wikipediaLink);

  $('#countryInfoModal').modal('show');
}

});













