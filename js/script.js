$('#btnRun1').click(function() {

    $.ajax({
        url: "php/api1.php",
        type: 'POST',
        dataType: 'json',
        data: {
        country: $('#selCountry').val(),
        lang: $('#selLanguage').val()
    },
    success: function(result) {

        console.log(JSON.stringify(result));

        if (result.status.name == "ok") {
                
            $('#txtContinent').html(result['data'][0]['continent']);
            $('#txtCapital').html(result['data'][0]['capital']);
            $('#txtLanguages').html(result['data'][0]['languages']);
            $('#txtPopulation').html(result['data'][0]['population']);
            $('#txtArea').html(result['data'][0]['areaInSqKm']);

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
console.log(latitude, longitude);

$('#btnRun3').click(function() {

    $.ajax({
        url: "php/api2",
        type: 'POST',
        dataType: 'json',
        data: {
        latitude: $('#oceanLatitude').val(),
        longitude: $('#oceanLongitude').val()
    },
    success: function(result) {

        console.log(JSON.stringify(result));

        if (result.status.name == "ok") {

            $('#txtOcean').html(result['data'][0]['ocean']);
            $('#txtName').html(result['data'][0]['name']);
            $('#txtDistance').html(result['data'][0]['distance']);
        }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
    }
});
});
