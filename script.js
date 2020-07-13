// ------- GLOBAL VARIABLES ---------------
var city = "";
var apiKeyFore = "31bc0639ecbf46fe8fb7a18255b9f63c";
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

            var parkCard = $("<div class='col s12 m6 l4' id='parkSearchResults'>")
            var cardDiv = $("<div class='card large'> ");
            var imgDiv = $("<div class= 'card-image'>");
            var parkImage = $(`<img data-code="${natParkCode}" class='imgOfPark' src=''/>`);
            var parkName = $(`<span class = 'card-title'>${name}<span>`);
            
            var desDiv = $("<div class='card-content'>");
            var description = $(`<p> ${response.data[i].description}</p>`);

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

            
            // *Populates html for park list div
            imgDiv.append(parkImage, parkName);
            desDiv.append(description);
            cardDiv.append(imgDiv, desDiv);
            parkCard.append(cardDiv);
            $("#parkList").append(parkCard);

          

        }
    })

}

//Pull Park Activities
function choosePark(chosenPark) {

    $.ajax({
        url: "https://developer.nps.gov/api/v1/campgrounds?parkCode=" + chosenPark + "&api_key=8Mvx3Lnd1BgLAuyl8VNeOCL5jxVIYfmhBrnxwNWu",
        method: "GET"
    }).then(function(response){
        console.log(response);
        var campDiv = $("<div>");
        var campTitle = $("<h5>").text("Campgrounds: ")
        var campUl = $("<ul>");
        for (var i = 0; i < response.data.length; i++) {
            console.log(response.data[i].name);
            var campLi = $("<li>").text(response.data[i].name);
            campUl.append(campLi);
            
        }
        
        campDiv.append(campTitle, campUl);
        $("#parkInfo").prepend(campDiv);
    })

    $.ajax({
        url: "https://developer.nps.gov/api/v1/parks?stateCode=" + userInput + "&api_key=8Mvx3Lnd1BgLAuyl8VNeOCL5jxVIYfmhBrnxwNWu",
        method: "GET"
    }).then(function (response) {


        for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].parkCode === chosenPark) {
                console.log(response.data[i].fullName);
                var parkCard = $("<div>")
                var actDiv = $("<ul>")
                var parkTitle = $("<h4>").text(response.data[i].fullName);

                var actTitle = $("<h5>").text("Available Activities: ");
                var acts = response.data[i].activities
                var actLi = [];

                var direcDiv = $("<div>")
                var direcTitle = $("<h5>").text("Directions to the Park: ")
                var direcInfo = $("<p>").text(response.data[i].directionsInfo);
                //entrance fee info
                var entDiv = $("<div>")
                var entTitle = $("<h5>").text("Entrance Fees: ")
                var entFeeTitle = $("<p>").text(response.data[i].entranceFees[0].title);
                var entFees = $("<p>").text("$" + parseFloat(response.data[i].entranceFees[0].cost).toFixed(2));
                var entFeeDesc = $("<p>").text(response.data[i].entranceFees[0].description);

                for (var j = 0; j < acts.length; j++) {
                    var item = $("<li>").text(acts[j].name);
                    actLi.push(item);
                }

                entDiv.append(entTitle, entFeeTitle, entFees, entFeeDesc);
                direcDiv.append(direcTitle, direcInfo);
                actDiv.append(actLi);
                parkCard.append(parkTitle, actTitle, actDiv, direcDiv, entDiv);
                $("#parkInfo").prepend(parkCard);
            }

        }
    })

}

function getAlerts(chosenPark) {

    if (!chosenPark) {
        return false
    }

    var alertUrl = `https://developer.nps.gov/api/v1/alerts?parkCode=${chosenPark}&stateCode=${userInput}&api_key=HtphDBtSdwAKMfdRhxg6VcvTpgK8vRGyDRko6hx2`

    $.ajax({
        url: alertUrl,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var alerts = response.data
        var alertDiv = $("<div>");

        for (var i = 0; i < alerts.length; i++) {
            var alertDes = alerts[i].description;
            var alertCat = alerts[i].category;
            var alertTitle = alerts[i].title;

            var alertHead = $(`<h5> ${alertTitle} </h5>`);
            var alertSubhead = $(`<h6>${alertCat}</h6>`);
            var alertInfo = $(`<p> ${alertDes} </p>`);

            alertDiv.append(alertHead, alertSubhead, alertInfo);
            $("#parkInfo").append(alertDiv);
        }

    })
}

// gets forecast
function forecast(parkLat, parkLon) {

    if (!parkLat && !parkLon) {
        return false;
    }

    var forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lon=${parkLon}&lat=${parkLat}&key=${apiKeyFore}&units=i&days=3`

    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(function (response) {
        var forecast = response.data
        console.log(response)
        var weatherDiv = $("<div class='wrapper container'>");
        var forecastDiv = $("<div class='row days center-align'>");
        var cardDiv = $("<div class='col s12 offset-s1'>");

        for (var i = 0; i < forecast.length; i++) {

            var weatherCode = forecast[i].weather.code
            console.log(weatherCode)
            var weatherDes = forecast[i].weather.description
            console.log(weatherDes)
            var iconCode = forecast[i].weather.icon

            var cardPanel = $("<div class = 'card-panel teal lighten-5 col s3 center-align days'>");

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
            weatherDiv.append(forecastDiv)
            $("#parkInfo").append(weatherDiv)


        }

    })

}

// shows link if it is bad weather
function ifRaining(weatherCode) {

    if (weatherCode < 800) {
        rain = `<p> Looks like the weather is not great. Look up other activities in the area?</p>
        <p> <a href='www.travelocity.com' target='_blank'>Travelocity</a> </p>`
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
    // event.preventDefault();
    $("#parkList").hide();
    $("#parkInfo").show().empty();
    $("#goBack").show();

    var parkLat = $(this).data("lat");
    var parkLon = $(this).data("lon");
    var chosenPark = $(this).data("code");
    console.log(chosenPark);
    forecast(parkLat, parkLon);
    choosePark(chosenPark);
    getAlerts(chosenPark);
});

$("#add-park").on("click", function (event) {
    event.preventDefault();
    clear();
    $("#parkList").show();
    $("#parkInfo").hide();
    userInput = $("#user-input").val().trim();
    console.log(userInput);
    stateParks();
    $("#user-input").val("");
    saveUserInput();
});

$("#goBack").on("click", function () {
    // onLoad();
    // getUserInput();
    // $("#parkInfo").hide();
    $("#parkList").show();
})