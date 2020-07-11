// ------- GLOBAL VARIABLES ---------------
var city = "";
var apiKey = "31bc0639ecbf46fe8fb7a18255b9f63c";
var lon;
var lat;
var userInput;
var natParkCode;
var chosenPark;

//clear function
function clear() {
    $("#parkList").empty()
}

//Pull Park Names
function stateParks() {
    var act = [];
    var queryURL = "https://developer.nps.gov/api/v1/parks?stateCode=" + userInput + "&api_key=8Mvx3Lnd1BgLAuyl8VNeOCL5jxVIYfmhBrnxwNWu";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        for (var i = 0; i < response.data.length; i++) {
            lat = response.data[i].latitude;
            lon = response.data[i].longitude;
            console.log(lat)
            var name = response.data[i].fullName;
            natParkCode = response.data[i].parkCode;
            var description = $(`<p> ${response.data[i].description}</p>`);

            var parkName = $("<h4>");
            var imgDiv = $("<div class= 'card-image'>");
            var cardStacked = $("<div class='card-stacked'>")
            var cardDiv = $("<div class='card horizontal'> ");
            var desDiv = $("<div class='card-content'>");

            var parkImage = $(`<img  data-code="${natParkCode}" class='imgOfPark'  src=''/>`);
            var imgSrc = "";

            if (response.data[i].images.length === 0) {
                imgSrc = ""
            } else {
                imgSrc = response.data[i].images[0].url;

            }

            parkImage.attr({
                "src": imgSrc,
                "data-lat": lat,
                "data-lon": lon
            });

            parkName.text(name).addClass("nameOfPark");

            // *Populates html for park list div
            imgDiv.append(parkImage);
            desDiv.append(description);
            cardStacked.append(desDiv);
            cardDiv.append(imgDiv, cardStacked);

            $("#parkList").append(parkName, cardDiv);

        }
    })

}

//Pull Park Activities
function choosePark(chosenPark) {
    var queryURL = "https://developer.nps.gov/api/v1/parks?stateCode=" + userInput + "&api_key=8Mvx3Lnd1BgLAuyl8VNeOCL5jxVIYfmhBrnxwNWu";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].parkCode === chosenPark) {

                var actDiv = $("<ul>")
                var acts = response.data[j].activities
                var actLi = [];
                acts.forEach(myFunction);

                function myFunction() {
                    var item = $("<li>").text(acts[j].name);
                    actLi.push(item);
                }

                actDiv.append(actLi);


            } else return;


            console.log(actDiv);
        }
    })
}

$(document).on("click", ".imgOfPark", function () {
    // event.preventDefault();
    $("#parkList").hide();
    $("#parkInfo").show();

    var parkLat = $(this).data("lat")
    var parkLon = $(this).data("lon")
    chosenPark = $(this).data("code");
    forecast(parkLat, parkLon);
    choosePark(chosenPark);
});

$("#add-park").on("click", function (event) {
    event.preventDefault();
    clear();
    $("#parkInfo").hide();
    userInput = $("#user-input").val().trim();
    console.log(userInput);
    stateParks();
    $("#user-input").val("");
});




// ------------- WEATHER FUNCTIONS ----------------------
function getWeather(parkLat, parkLon) {
    var weatherUrl = `https://api.weatherbit.io/v2.0/current/?lon=${parkLon}&lat=${parkLat}&key=${apiKey}=i`

    $.ajax({
        url: weatherUrl,
        method: "GET"
    }).then(function (response) {

        var current = response.data[0]

        //current
        var cityName = $(`<p> ${current.city_name} </p>`);
        var temp = $(`<p> Current Temperature: ${current.temp} &degF </p> `);
        var iconCode = current.weather.icon
        var icon = $(`<img>`)
        icon.attr("src", `assets/icons/${iconCode}.png`)
        var wind = $(`<p> Wind Speed: ${current.wind_spd} MPH</p>`);

        $("#current").prepend(cityName, icon, temp, wind);
    })

}

function forecast(parkLat, parkLon) {
    var forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lon=${parkLon}&lat=${parkLat}&key=${apiKey}&units=i&days=3`
    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(function (response) {

        var forecast = response.data

        for (var i = 0; i < forecast.length; i++) {
            var foreDate = $(`<p> ${moment.unix(forecast[i].ts).format("M/D/YY")} </p> `);
            var foreTemp = $(`<p> Current Temperature: ${forecast[i].temp} &degF </p> `);
            var weatherCode = forecast[i].code
            var weatherDes = forecast[i].description
            var iconCode = forecast[i].weather.icon
            var icon = $(`<img>`)
            icon.attr({
                "src": `assets/icons/${iconCode}.png`,
                "data-weatherCode": weatherCode
            })
            var foreWind = $(`<p> Wind Speed: ${forecast[i].wind_spd} MPH</p>`);
            $("#parkInfo").append(foreDate, icon, foreTemp, foreWind, ifRaining(weatherCode, weatherDes));

        }


    })

}

function ifRaining(weatherCode, weatherDes) {
    if (weatherCode < 800) {
        $(`<p> Looks like it is ${weatherDes}! Perhaps look up other activities in the area? <a href="https://www.tripadvisor.com/" target='_blank'`);
    }
}

$("#search").on("click", function () {
    city = $("#search-input").val().trim();
    getWeather();
    forecast();
})