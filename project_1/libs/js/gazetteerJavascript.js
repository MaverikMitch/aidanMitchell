$(document).ready(function() {
    var map = L.map('map').setView([0, 0], 2); // Initialize the map with center coordinates and zoom level
  
    // Add a tile layer to the map (you can change the tile provider if needed)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    var selectedMarker = null; // Variable to hold the selected marker

    
  
    // Load the GeoJSON data
    fetch('json/countries.geojson')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        populateCountryDropdown(data); // Populate the country dropdown with the GeoJSON data
  
        // Handle submit button click
        $('#submitButton').click(function() {
          var selectedCountry = $('#countrySelect').val(); // Get the selected country from the dropdown menu
          var selectedFeature = data.features.find(function(feature) {
            return feature.properties.NAME === selectedCountry; // Find the feature based on the selected country
          });
  
          if (selectedFeature) {
            var coordinates = selectedFeature.geometry.coordinates; // Get the coordinates of the selected country
  
            // The coordinates array may contain multiple polygons, so we need to handle them accordingly
            if (selectedFeature.geometry.type === 'MultiPolygon') {
              var firstPolygonCoordinates = coordinates[0][0]; // Take the first polygon's coordinates
              var lat = firstPolygonCoordinates[0][1]; // Latitude is at index [0][1]
              var lng = firstPolygonCoordinates[0][0]; // Longitude is at index [0][0]
            } else if (selectedFeature.geometry.type === 'Polygon') {
              var firstPolygonCoordinates = coordinates[0]; // Take the polygon's coordinates
              var lat = firstPolygonCoordinates[0][1]; // Latitude is at index [0][1]
              var lng = firstPolygonCoordinates[0][0]; // Longitude is at index [0][0]
            }
  
            if (selectedMarker) {
              map.removeLayer(selectedMarker); // Remove the previously selected marker if exists
            }
  
            map.setView([lat, lng], 5); // Center the map on the selected country
            selectedMarker = L.marker([lat, lng]).addTo(map); // Create a marker and add it to the map
  
            // Bind a popup to the marker with the country name and "Click for More Info" link
            selectedMarker.bindPopup(
              '<b>' + selectedFeature.properties.NAME + '</b><br><a href="#" id="countryInfoLink">Click for More Info</a>'
            ).openPopup();
  
            // Add event listener to the link for opening the modal
            document.getElementById('countryInfoLink').addEventListener('click', function() {
              openCountryInfoModal(selectedFeature.properties.NAME);
            });
  
            // Make AJAX call to retrieve country info from countryInfo.php
            $.ajax({
              url: 'libs/php/getCountryInfo.php',
              method: 'GET',
              data: {
                latitude: lat,
                longitude: lng
              },
              dataType: 'json',
              success: function(response) {
                console.log(response); // Log the response to check its structure
                var countryInfo = response.geonames[0]; // Retrieve the country info from the response
  
                // Make AJAX call to retrieve more detailed country information
                $.ajax({
                  url: 'libs/php/getCountryDetails.php',
                  method: 'GET',
                  data: {
                    country: countryInfo.countryCode
                  },
                  dataType: 'json',
                  success: function(detailsResponse) {
                    console.log(detailsResponse); // Log the response to check its structure
                    var countryDetails = detailsResponse.geonames[0]; // Retrieve the detailed country info
  
                    countryInfo.capital = countryDetails.capital;
                    countryInfo.population = countryDetails.population;
                    countryInfo.area = countryDetails.areaInSqKm;
                    countryInfo.telephoneCode = countryDetails.phoneCode;
                    countryInfo.countryCode = countryDetails.countryCode;
                    countryInfo.currency = countryDetails.currencyCode;
                    countryInfo.exchangeRates = countryDetails.currencySymbol;
  
                    openCountryInfoModal(selectedFeature.properties.NAME, countryInfo); // Pass country name and countryInfo to the function
                  },
                  error: function(error) {
                    console.error('Error fetching country details:', error);
                  }
                });
              } // Add the missing closing curly brace here
            }).catch(error => {
              console.error('Error fetching GeoJSON data:', error);
            });
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
    function openCountryInfoModal(countryName, countryInfo) {
      $('#countryInfoModal .modal-body h2').text(countryName);
      $('#countryInfoModal .modal-body p:eq(0)').text('Capital: ' + countryInfo.capital);
      $('#countryInfoModal .modal-body p:eq(1)').text('Population: ' + countryInfo.population);
      $('#countryInfoModal .modal-body p:eq(2)').text('Area: ' + countryInfo.area);
      $('#countryInfoModal .modal-body p:eq(3)').text('Telephone code: ' + countryInfo.telephoneCode);
      $('#countryInfoModal .modal-body p:eq(4)').text('Country code: ' + countryInfo.countryCode);
      $('#countryInfoModal .modal-body p:eq(5)').text('Currency used: ' + countryInfo.currency);
      $('#countryInfoModal .modal-body p:eq(6)').text('Current exchange rates: ' + countryInfo.exchangeRates);
      $('#countryInfoModal').modal('show');
    }
  });
  