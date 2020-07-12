// ------- GLOBAL VARIABLES ---------------
var city = "";
var apiKey = "31bc0639ecbf46fe8fb7a18255b9f63c";
var lon;
var lat;
var userInput;
var natParkCode;
var chosenPark;
var imgSource;
var parkInfo = $("#parkInfo");
var rain = "";


//clear function
function clear() {
    $("#parkList").empty()
    $("#appInfo").hide()
}

// when page loads
function onLoad() {
    $("#appInfo").show();
    $("#parkList").hide();
    $("#parkInfo").hide();
    $("#goBack").hide();
    clearStorage();
}

//gather info from NPS
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
            // console.log(lat)
            var name = response.data[i].fullName;
            natParkCode = response.data[i].parkCode;
            var description = $(`<p> ${response.data[i].description}</p>`);

            var parkName = $("<h4>");
            var imgDiv = $("<div class= 'card-image'>");
            var cardStacked = $("<div class='card-stacked'>")
            var cardDiv = $("<div class='card horizontal'> ");
            var desDiv = $("<div class='card-content'>");

            var parkImage = $(`<img data-code="${natParkCode}" class='imgOfPark' src=''/>`);
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

// gather info for parkInfo div
function choosePark(chosenPark) {

    var queryURL = "https://developer.nps.gov/api/v1/parks?stateCode=" + userInput + "&api_key=8Mvx3Lnd1BgLAuyl8VNeOCL5jxVIYfmhBrnxwNWu";


    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {


        for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].parkCode === chosenPark) {
                console.log(response.data[i].fullName);
                var parkCard = $("<div col s9>")
                var actDiv = $("<ul>")
                var parkTitle = $("<h4>").text(response.data[i].fullName);
                var actTitle = $("<h5>").text("Available Activities: ");
                var acts = response.data[i].activities
                var actLi = [];

                for(var j = 0; j < acts.length; j++){
                    var item = $("<li>").text(acts[j].name);
                    actLi.push(item);
                }
    
                actDiv.append(actLi);
                parkCard.append(parkTitle, actTitle, actDiv);
                $("#parkInfo").append(parkCard);
            } 


            // console.log(actDiv);
        }
    })
}

// gets forecast
function forecast(parkLat, parkLon) {

    if (!parkLat && !parkLon) {
        return false;
    }

    var forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lon=${parkLon}&lat=${parkLat}&key=${apiKey}&units=i&days=3`

    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(function (response) {
        var forecast = response.data
        console.log(response)
        var weatherDiv = $("<div class='wrapper container'>");
        var forecastDiv = $("<div class='col s3 days center-align'>");
        var cardDiv = $("<div>");

        for (var i = 0; i < forecast.length; i++) {
            
            var weatherCode = forecast[i].weather.code
            console.log(weatherCode)
            var weatherDes = forecast[i].weather.description
            console.log(weatherDes)
            var iconCode = forecast[i].weather.icon
            
            var cardPanel = $("<div class = 'card-panel teal lighten-5 center-align days'>");

            var date = $(`<h5> ${moment.unix(forecast[i].ts).format("M/D/YY")} </h5> `);
            var temp = $(`<p> Temperature: ${forecast[i].temp} &degF </p> `);
            var icon = $(`<img>`)
            icon.attr({
                "src": `assets/icons/${iconCode}.png`,
                "data-weatherCode": weatherCode
            });


            ifRaining(weatherCode, weatherDes);
            cardPanel.append(date, temp, icon, rain);
            cardDiv.append(cardPanel);
            forecastDiv.append(cardDiv)
            // weatherDiv.append(forecastDiv)
            $("#parkInfo").append(forecastDiv)
            
            
        }

    })
    
}

// shows link if it is bad weather
function ifRaining(weatherCode) {
    
    if (weatherCode < 800) {
        rain = `<p> Looks like the weather is not great. Look up other activities in the area?</p>
        <p> <a href='www.tripadvisor.com' target='_blank'>Trip Advisor</a> </p>`;
    } else {
        rain = "<p>The weather is great for an adventure!</p>";
    }
    return rain;
}

// local storage functions
function saveUserInput() {
    localStorage.setItem("input", JSON.stringify(userInput));
}

function getUserInput() {
    userInput = JSON.parse(localStorage.getItem("input")) || "";
    stateParks();
}

function clearStorage() {
    localStorage.clear();
}

// * ---- FUNCTION CALLS ----
onLoad();

// * ----- CLICK EVENTS ------
$(document).on("click", ".imgOfPark", function () {
    
    $("#parkList").hide();
    $("#parkInfo").show().empty();
    $("#goBack").show();
    
    var parkLat = $(this).data("lat");
    var parkLon = $(this).data("lon");
    var chosenPark = $(this).data("code");
    
    forecast(parkLat, parkLon);
    choosePark(chosenPark);
});

$("#add-park").on("click", function (event) {
    event.preventDefault();
    clear();
    $("#parkList").show();
    $("#parkInfo").hide();
    userInput = $("#user-input").val().trim();
    // console.log(userInput);
    stateParks();
    $("#user-input").val("");
    saveUserInput();
    
});

$("#goBack").on("click", function() {
    // onLoad();
    // getUserInput();
    // $("#parkInfo").hide();
    $("#parkList").show();
}) 

