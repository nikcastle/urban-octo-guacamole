
// ------- GLOBAL VARIABLES ---------------
var city = "";
var apiKey = "31bc0639ecbf46fe8fb7a18255b9f63c";
var lon;
var lat;
var userInput;


function stateParks(){
    var act =[];
    var queryURL = "https://developer.nps.gov/api/v1/parks?stateCode=" + userInput + "&api_key=8Mvx3Lnd1BgLAuyl8VNeOCL5jxVIYfmhBrnxwNWu";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);

        for (var i = 0; i < response.data.length; i++) {
            var name = response.data[i].fullName;
            var parkName = $("<div>");
            var parkImage = $("<img>");
            var imgSrc = "";
            if(response.data[i].images.length === 0){
                imgSrc = ""
            } else {
                imgSrc= response.data[i].images[0].url;
        
            }

            parkImage.attr(
                "src", imgSrc,
                "class", "imgOfPark");

            parkName.text(name).addClass("nameOfPark");
            parkName.append(parkImage);

            // console.log(parkName);
            // console.log(name);
            
            $("#parkList").append(parkName);

        }
    })


}

$("#add-park").on("click", function (event) {
    event.preventDefault();
    userInput = $("#user-input").val().trim();
    console.log(userInput);
   
    stateParks();
    $("#user-input").val("");
});

// ?? on click event for info block
// ---- populate lon and lat (use response.data.latitude and response.data.longitude)
// --- call weather functions

// ------------- WEATHER FUNCTIONS ----------------------

function getWeather() {
    //!update this to input lat and lon parameters
    var weatherUrl = `https://api.weatherbit.io/v2.0/current/?city=denver&key=${apiKey}&units=i`

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

function forecast() {
    //!update this to input lat and lon parameters
    var forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?city=denver&key=${apiKey}&units=i&days=3`

    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(function (response) {

        var forecast = response.data
       
        for (var i = 0; i < forecast.length; i++) {
            var foreDate = $(`<p> ${moment.unix(forecast[i].ts).format("M/D/YY")} </p> `);
            var foreTemp = $(`<p> Current Temperature: ${forecast[i].temp} &degF </p> `);
            var iconCode = forecast[i].weather.icon
            var icon = $(`<img>`)
            icon.attr("src", `assets/icons/${iconCode}.png`)
            var foreWind = $(`<p> Wind Speed: ${forecast[i].wind_spd} MPH</p>`);
            $("#forecast").prepend(foreDate, icon, foreTemp, foreWind);
        }

    })

}


    $("#search").on("click", function () {
        city = $("#search-input").val().trim();
        getWeather();
        forecast();
    })