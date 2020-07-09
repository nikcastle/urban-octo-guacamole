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
