$('#btnRun1').click(function() {
    $.ajax({
        url: "php/api1.php",
        type: 'POST',
        dataType: 'json',
        data: {
            latitude: $('#txtLatitude').val(),
            longitude: $('#txtLongitude').val()
        },
        success: function(result) {
            console.log(JSON.stringify(result));
            if (result.status.name == "ok") {
                $('#txtOcean').html(result['data']['ocean']['name']);
                $('#txtDistance').html(result['data']['distance']);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
           
        }
    });
});


$('#btnRun2').click(function() {
    $.ajax({
        url: "php/api3.php",
        type: 'POST',
        dataType: 'json',
        data: {
            latitude: $('#latitude').val(),
            longitude: $('#longitude').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#txtCountry').html(result['data']['countryName']);
                $('#txtTimezoneId').html(result['data']['timezoneId']);
                $('#txtGMTOffset').html(result['data']['gmtOffset']);
                $('#txtDSTOffset').html(result['data']['dstOffset']);
                $('#txtTime').html(result['data']['time']);
                $('#txtSunrise').html(result['data']['sunrise']);
                $('#txtSunset').html(result['data']['sunset']);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
});


$('#btnRun3').click(function() {
    $.ajax({
        url: 'php/api2.php',
        type: 'POST',
        dataType: 'json',
        data: {
            latitude: $('#weatherLatitude').val(),
            longitude: $('#weatherLongitude').val()
        },
        success: function(result) {
            console.log(JSON.stringify(result));
            if (result.status.name == 'ok') {
                $('#txtTemperature').html(result['data']['weatherObservation']['temperature']);
                $('#txtHumidity').html(result['data']['weatherObservation']['humidity']);
                $('#txtWindSpeed').html(result['data']['weatherObservation']['windSpeed']);
                $('#txtWeatherDescription').html(result['data']['weatherObservation']['weatherCondition']);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
});
    














