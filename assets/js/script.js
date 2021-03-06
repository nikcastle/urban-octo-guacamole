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
// var entranceFee;


//clear function
function clear() {
    $("#parkList").empty()
    $("#appInfo").hide()
}

function clearParkInfo() {
    $("#columns").empty();
    $("#directions").empty();
    $("#campgrounds").empty();
    $("#selectedAlerts").empty();
    $("#fullName").empty();
    $("#weather").remove();
    
}

function autoComplete() {

    var stateCodes = ("AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY").split(" ");
    $( "#user-input" ).autocomplete({
        source: stateCodes
    });
    
}

// when page loads
function onLoad() {
    $("#appInfo").show();
    $("#parkList").hide();
    $("#parkInfo").hide();
    $("#goBack").hide();
    $("#progressbar").hide();
    clearStorage();
    autoComplete();
}


//gather info from NPS
function stateParks() {
    
    var queryURL = "https://developer.nps.gov/api/v1/parks?stateCode=" + userInput + "&api_key=8Mvx3Lnd1BgLAuyl8VNeOCL5jxVIYfmhBrnxwNWu";

    $("#progressbar").show();

    $.ajax({
        url: queryURL,
        method: "GET"

    }).then(function (response) {
        console.log(response);
        $("#progressbar").hide();
        for (var i = 0; i < response.data.length; i++) {
            lat = response.data[i].latitude;
            lon = response.data[i].longitude;
            // console.log(lat)
            var name = response.data[i].fullName;
            natParkCode = response.data[i].parkCode;
            entranceFee = response.data[i].entranceFees[0];

            var parkCard = $("<div class='col s12 m6 l4 xl3' id='parkSearchResults'>")
            var cardDiv = $("<div class='card large'> ");
            var imgDiv = $("<div class= 'card-image'>");
            var parkImage = $(`<img data-code="${natParkCode}" class='imgOfPark' src=''/>`);
            var parkName = $(`<span class = 'card-title'>${name}<span>`);

            var desDiv = $("<div class='card-content'>");
            var description = $(`<p> ${response.data[i].description}</p>`);

            var imgSrc = "";

            if (response.data[i].images.length === 0) {
                imgSrc = "assets/images/npsdefault.jpg"
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

    // - Campground Info -
    $.ajax({
        url: "https://developer.nps.gov/api/v1/campgrounds?parkCode=" + chosenPark + "&api_key=8Mvx3Lnd1BgLAuyl8VNeOCL5jxVIYfmhBrnxwNWu",
        method: "GET"
    }).then(function (response) {
        console.log(response);
        
        var campUl = $("<ul>");
        if (response.data.length < 1) {
            $("#campgrounds").append("<p> This park does not offer any camping. </p>");
            console.log("false")
            
        } else {
                for (var i = 0; i < response.data.length; i++) {
                console.log(response.data[i].name);
                var campLi = $("<li>").text(response.data[i].name);
                campUl.append(campLi);

                $("#campgrounds").append(campUl)
            }

        }
        
    })

    // - Park Directions & Activities List - 
    $.ajax({
        url: "https://developer.nps.gov/api/v1/parks?stateCode=" + userInput + "&api_key=8Mvx3Lnd1BgLAuyl8VNeOCL5jxVIYfmhBrnxwNWu",
        method: "GET"
    }).then(function (response) {


        for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].parkCode === chosenPark) {
                console.log(response.data[i].fullName);
                // var parkCard = $("<div>")
                // var actDiv = $("<ul>")
                $("#fullName").text(response.data[i].fullName);

                // var actTitle = $("<h5>").text("Available Activities: ");
                var acts = response.data[i].activities
                // var actLi = [];
                var actLi = $("#columns")

                // var direcDiv = $("<div>")
                // var direcTitle = $("<h5>").text("Directions to the Park: ")
                $("#directions").text(response.data[i].directionsInfo);


                for (var j = 0; j < acts.length; j++) {
                    var item = $("<li>").text(acts[j].name);
                    // actLi.push(item);
                    actLi.append(item);

                    // direcDiv.append(direcTitle, direcInfo);
                    // actDiv.append(actLi);
                    // parkCard.append(parkTitle, actTitle, actDiv, direcDiv, entDiv);
                    // $("#parkInfo").append(parkCard);
                }

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
        // var alertDiv = $("<div>");


        for (var i = 0; i < alerts.length; i++) {
            var alertDes = alerts[i].description;
            var alertCat = alerts[i].category;
            var alertTitle = alerts[i].title;

            var alertHead = $(`<h6> ${alertTitle} </h6>`);
            var alertSubhead = $(`<p> ${alertCat}</p>`);
            var alertInfo = $(`<p> ${alertDes} </p>`);

            $("#selectedAlerts").append(alertHead, alertSubhead, alertInfo);
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
        var weatherDiv = $("<div class='wrapper container' id='weather'>");
        var forecastDiv = $("<div class='row days center-align'>");
        var cardDiv = $("<div class='col s12 offset-m1 center-align'>");

        for (var i = 0; i < forecast.length; i++) {

            var weatherCode = forecast[i].weather.code
            console.log(weatherCode)
            var weatherDes = forecast[i].weather.description
            console.log(weatherDes)
            var iconCode = forecast[i].weather.icon

            var cardPanel = $("<div class = 'card-panel teal lighten-5 col s12 m3  center-align days'>");

            var date = $(`<h6> ${moment.unix(forecast[i].ts).format("M/D/YY")} </h6> `);
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
        <p> <a href='https://www.tripadvisor.com' target='_blank'>Trip Advisor</a> </p>`
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
    // clearParkInfo();
    $("#parkList").hide();
    $("#parkInfo").show();
    $("#goBack").show();
    var parkLat = $(this).data("lat");
    var parkLon = $(this).data("lon");
    var chosenPark = $(this).data("code");
    console.log(chosenPark);
    forecast(parkLat, parkLon);
    choosePark(chosenPark);
    getAlerts(chosenPark);
    // getEntFees(chosenPark);
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
    clearParkInfo();
});

$("#goBack").on("click", function () {
    // onLoad();
    // getUserInput();
    $("#parkInfo").hide();
    $("#parkList").show();
    clearParkInfo();
    
})

