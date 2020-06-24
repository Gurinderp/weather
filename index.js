$(document).ready(function () {
  var cityName = "";
  $("#wicon").css("display", "none");

  $("#searchbtn").on("click", function (event) {
      event.preventDefault();
      cityName = $("#cityName").val().toLowerCase();
      $(".display").empty();
      createRow();
      renderWeather();
  });

  var createRow = function () {
      var button = $("<button>").text(cityName);
      button.addClass("locationname list-group-item list-group-item-action");
      button.attr("type", "button");
      $(".location-list").prepend(button);
  };


   $(".location-list").on("click", function (event) {
      cityName = event.target.value;
      render_weather_result();
      $(".display").empty();
  });

  var renderWeather = function () {
      var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&APPID=27860677e7cb41d47f94130f7cbd8ff9";

      var longtitude;
      var latitude;
      var nameDisplay;
      var iconCode;

      $.ajax({
          url: queryURL,
          method: "GET"
      }).then(function (res) {
          nameDisplay = res.name;
          iconCode = res.weather[0].icon;
          $(".temp").text(res.main.temp + " °F");
          $(".humidity").text(res.main.humidity + " %");
          $(".wind").text(res.wind.speed + " MPH");
          longtitude = res.coord.lon;
          latitude = res.coord.lat;

          var iconLink = "https://openweathermap.org/img/w/" + iconCode + ".png";

          var secondqueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=27860677e7cb41d47f94130f7cbd8ff9&lat=" + latitude + "&lon=" + longtitude;
          $.ajax({
              url: secondqueryURL,
              method: "GET"
          }).then(function (res) {
              $(".uvindex").text(res.value);
              $(".uvindex").css("background-color", "crimson");
              $(".nameDisplay").text(nameDisplay + " " + "(" + res.date_iso + ")");
              $('#wicon').attr('src', iconLink);
              $("#wicon").css("display", "block");
          });

          
          var secondicon;

          var thirdqueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=27860677e7cb41d47f94130f7cbd8ff9";
          $.ajax({
              url: thirdqueryURL,
              method: "GET"
          }).then(function (res) {

              var weekWeather = res.list;
              for (var i = 0; i < weekWeather.length; i = i + 8) {
                  var newDiv = $("<div>");
                  newDiv.addClass("col forecast");
                  secondicon = weekWeather[i].weather[0].icon;
                  var secIconLink = "https://openweathermap.org/img/w/" + secondicon + ".png";
                  var date = $("<h3>").text(weekWeather[i].dt_txt);
                  var icon = $("<img>").attr('src', secIconLink);
                  var temp = $("<p>").text("Temperature: " + weekWeather[i].main.temp + " °F");
                  var humidity = $("<p>").text("Humidity: " + weekWeather[i].main.humidity + " %");

                  newDiv.append(date, icon, temp, humidity);
                  $(".display").append(newDiv);
              };
          });

      });
  };
});