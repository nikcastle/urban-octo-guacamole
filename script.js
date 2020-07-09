var city = "";
var apiKey = "31bc0639ecbf46fe8fb7a18255b9f63c";

function getWeather() {
    var weatherUrl = `https://api.weatherbit.io/v2.0/current/?city=${city}&key=${apiKey}&units=i`

    $.ajax({
        url: weatherUrl,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var current = response.data[0]

        //current
        var cityName = $(`<p> ${current.city_name} </p>`);
        var temp = $(`<p> Current Temperature: ${current.temp} &degF </p> `);
        //    var icon = $(`<img src="${current.condition.icon}"`);
        var wind = $(`<p> Wind Speed: ${current.wind_spd} MPH</p>`);

        $("#current").append(cityName, temp, wind);
    })

}

function forecast() {
    var forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${apiKey}&units=i&days=3`

    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(function (response) {

        var forecast = response.data

        for (var i = 0; i < forecast.length; i++) {
            // var cityName = $(`<p> ${forecast.city_name} </p>`);
            var foreTemp = $(`<p> Current Temperature: ${forecast[i].temp} &degF </p> `);
            //    var icon = $(`<img src="${current.condition.icon}"`);
            var foreWind = $(`<p> Wind Speed: ${forecast[i].wind_spd} MPH</p>`);
            $("#forecast").append(foreTemp,foreWind);
        }

    })

}


    $("#search").on("click", function () {
        city = $("#search-input").val().trim();
        getWeather();
        forecast();
        console.log(city)
    })