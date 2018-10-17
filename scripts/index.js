/*-----------------------------------------------------------
 *
 * UI Element Module 
 * 
 * This Module Responsible For Cotrolling In Loader And Application UI
 * -----------------------------------------------------------
 */

const UI = (function() {
  // Variables
  let menu = document.querySelector("#menu-container");

  const showApp = () => {
    // Get loader element and hide it
    document.querySelector("#app-loader").classList.add("display-none");
    // Get main element and show it by removing hidden attribute
    document.querySelector("main").removeAttribute("hidden");
  };

  const loadApp = () => {
    // Get loader element and show it
    document.querySelector("#app-loader").classList.remove("display-none");
    // Get main element and show it by removing hidden attribute
    document.querySelector("main").setAttribute("hidden", true);
  };

  // Show menu
  const _showMenu = () => (menu.style.right = 0);
  // Hide menu
  const _hideMenu = () => (menu.style.right = "-65%");

  // Toggle hourly weather
  const _toggleHourlyWeather = () => {
    let hourlyweather = document.querySelector("#hourly-weather-wrapper"),
      arrow = document.querySelector("#toggle-hourly-weather").children[0],
      visible = hourlyweather.getAttribute("visible"),
      daliyWeather = document.querySelector("#daliy-weather-wrapper");

    if (visible == "false") {
      hourlyweather.setAttribute("visible", true);
      hourlyweather.style.bottom = 0;
      arrow.style.transform = "rotate(180deg)";
      daliyWeather.style.opacity = 0;
    } else if (visible == "true") {
      hourlyweather.setAttribute("visible", false);
      hourlyweather.style.bottom = "-100%";
      arrow.style.transform = "rotate(0deg)";
      daliyWeather.style.opacity = 1;
    } else {
      console.error(
        "Unknown status of hourly weather pannal and visible attribute"
      );
    }
  };

  const drawWeatherData = (data, Location) => {
    let currentlyData = data.currently,
      daliyData = data.daily.data,
      hourlyData = data.hourly.data,
      weekDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thusday",
        "Friday",
        "Saturday"
      ],
      daliyWeatherWrapper = document.querySelector("#daliy-weather-wrapper"),
      daliyWeatherModel,
      day,
      maxMinTemp,
      daliyIcon,
      hourlyWeatherWrapper = document.querySelector("#hourly-weather-wrapper"),
      hourlyWeatherModel,
      hourlyIcon,
      hour;

    // Set Current weather
    /* ====================== */
    // Set a location
    document.querySelectorAll(".location-label").forEach(e => {
      e.innerHTML = Location;
    });
    // Set main background
    document.querySelector(
      "main"
    ).style.backgroundImage = `url('./assets/images/bg-images/${
      currentlyData.icon
    }.jpg')`;
    // Set The icon
    document
      .querySelector("#currentlyIcon")
      .setAttribute(
        "src",
        `./assets/images/summary-icons/${currentlyData.icon}-white.png`
      );
    // Set Summary
    document.querySelector("#summery-label").innerHTML = currentlyData.summary;
    // Set temprature from fehrenheit to Clicies
    document.querySelector("#degrees-label").innerHTML =
      Math.round(((currentlyData.temperature - 32) * 5) / 9) + "&#176;";
    // Set humidity
    document.querySelector("#humidity-label").innerHTML =
      Math.round(currentlyData.humidity * 100) + "%";
    // Set Wind speed from mills -> K / h
    document.querySelector("#wind-speed-label").innerHTML =
      (currentlyData.windSpeed * 1.6093).toFixed(1) + "k/h";

    // Set Daliy weather
    /* ====================== */
    // Remove all elements except the model
    while (daliyWeatherWrapper.children[1]) {
      daliyWeatherWrapper.removeChild(daliyWeatherWrapper.children[1]);
    }

    // 7 fro days in week
    for (let i = 0; i < 7; i++) {
      // Copy weather box
      daliyWeatherModel = daliyWeatherWrapper.children[0].cloneNode(true);
      // Remove display-none class to show data
      daliyWeatherModel.classList.remove("display-none");
      // Set day
      day = weekDays[new Date(daliyData[i].time * 1000).getDay()];
      daliyWeatherModel.children[0].children[0].innerHTML = day;
      // Set max/min temperture for the next day in celicies
      maxMinTemp =
        Math.round(((daliyData[i].temperatureMax - 32) * 5) / 9) +
        "&#176;" +
        "/" +
        Math.round(((daliyData[i].temperatureMin - 32) * 5) / 9) +
        "&#176;";
      daliyWeatherModel.children[1].children[0].innerHTML = maxMinTemp;
      // Set daliy icon
      daliyIcon = daliyData[i].icon;
      daliyWeatherModel.children[1].children[1].children[0].setAttribute(
        "src",
        `./assets/images/summary-icons/${daliyIcon}-white.png`
      );
      // Append the model
      daliyWeatherWrapper.appendChild(daliyWeatherModel);
    }

    // Set the current day
    daliyWeatherWrapper.children[1].classList.add("current-day-of-week");

    // Set Hourly weather
    /* ====================== */
    // Remove all elements except the model
    while (hourlyWeatherWrapper.children[1]) {
      hourlyWeatherWrapper.removeChild(hourlyWeatherWrapper.children[1]);
    }

    // 24 for hours in day
    for (let i = 0; i < 24; i++) {
      // Copy weather box
      hourlyWeatherModel = hourlyWeatherWrapper.children[0].cloneNode(true);
      // Remove display-none class to show data
      hourlyWeatherModel.classList.remove("display-none");
      // Set hour
      hour = new Date(hourlyData[i].time * 1000).getHours();
      hourlyWeatherModel.children[0].children[0].innerHTML = `${hour}:00`;
      // Set Temperature
      hourlyWeatherModel.children[1].children[0].innerHTML =
        Math.round(((hourlyData[i].temperature - 32) * 5) / 9) + "&#176;";
      // Set icon
      hourlyIcon = hourlyData[i].icon;
      hourlyWeatherModel.children[1].children[1].children[0].setAttribute(
        "src",
        `./assets/images/summary-icons/${hourlyIcon}-grey.png`
      );

      // Append model
      hourlyWeatherWrapper.appendChild(hourlyWeatherModel);
    }

    UI.showApp();
  };

  // menu events
  document.querySelector("#open-menu-btn").addEventListener("click", _showMenu);
  document
    .querySelector("#close-menu-btn")
    .addEventListener("click", _hideMenu);
  // Hourly Weather event
  document
    .querySelector("#toggle-hourly-weather")
    .addEventListener("click", _toggleHourlyWeather);

  return {
    showApp,
    loadApp,
    drawWeatherData
  };
})();

/*-----------------------------------------------------------
 *
 * LOCALSTORAGE API Module
 * 
 * This Module Responsible For Saved, Getting, Deleting 
 * Cities Saved By User
 * -----------------------------------------------------------
 */
const LOCALSTORAGE = (function() {
  let savedCities = [];

  // Save city
  const save = Location => {
    savedCities.push(Location);
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
  };

  // Get Saved cities
  const get = () => {
    // Check there are cities saved in local storage
    if (localStorage.getItem("savedCities") != null) {
      savedCities = JSON.parse(localStorage.getItem("savedCities"));
    }
  };

  // Remove city
  const remove = index => {
    if (index < savedCities.length) {
      savedCities.splice(index, 1);
      localStorage.setItem("savedCities", JSON.stringify(savedCities));
    }
  };

  // getting saved cities
  const getSavedCities = () => savedCities;

  return {
    save,
    get,
    remove,
    getSavedCities
  };
})();

/*-----------------------------------------------------------
 *
 * SAVEDCITIES Moduel 
 * 
 * This Model Responsible For Saving the cities thata user add
 * In Mnue UI
 * -----------------------------------------------------------
 */
const SAVEDCITIES = (function() {
  let container = document.querySelector("#save-cities-wrapper");

  // Draw city data
  const drawCity = city => {
    let cityBox = document.createElement("div"),
      cityWrapper = document.createElement("div"),
      deleteWrapper = document.createElement("div"),
      cityTextNode = document.createElement("h1"),
      deleteCityBtn = document.createElement("button");

    // Add classes for elements thata created
    cityBox.classList.add("flex-container", "saved-city-box");
    cityTextNode.classList.add("set-city");
    cityTextNode.innerHTML = city;
    cityWrapper.classList.add("ripple", "set-city");
    deleteCityBtn.classList.add("ripple", "remove-saved-city-btn");
    deleteCityBtn.innerHTML = "-";
    // Append elements
    cityWrapper.appendChild(cityTextNode);
    cityBox.appendChild(cityWrapper);
    deleteWrapper.appendChild(deleteCityBtn);
    cityBox.appendChild(deleteWrapper);

    // Append all elements to conatiner
    container.appendChild(cityBox);
  };

  const _deleteCity = cityHTMLBtn => {
    let nodes = Array.prototype.slice.call(container.children),
      cityWrapper = cityHTMLBtn.closest(".saved-city-box"),
      cityIndex = nodes.indexOf(cityHTMLBtn);
    // Remove city from localstorage
    LOCALSTORAGE.remove(cityIndex);
    // Remove the city box
    cityWrapper.remove();
  };

  // Delete sved city eevnt
  document.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-saved-city-btn")) {
      _deleteCity(event.target);
    }
  });

  // Choose the city from localstorage to show it's weather
  document.addEventListener("click", function(event) {
    if (event.target.classList.contains("set-city")) {
      let nodes = Array.prototype.slice.call(container.children),
        cityWrapper = event.target.closest(".saved-city-box"),
        cityIndex = nodes.indexOf(cityWrapper),
        savedCities;
      LOCALSTORAGE.get();
      savedCities = LOCALSTORAGE.getSavedCities();

      WEATHER.getWeather(savedCities[cityIndex], false);
    }
  });

  return {
    drawCity
  };
})();
/*-----------------------------------------------------------
 *
 * GETLOCATION Moduel 
 * 
 * This Model Responsible For Getting The Data About The Loaction
 * To Search For Weather
 * -----------------------------------------------------------
 */

const GETLOCATION = (function() {
  // Variables
  let Location;
  const locationInput = document.querySelector("#location-input"),
    addCityBtn = document.querySelector("#add-city-btn");

  const _addCity = () => {
    Location = locationInput.value;
    locationInput.value = "";
    addCityBtn.classList.add("disabled");
    addCityBtn.setAttribute("disabled", "true");

    // Get weather data whene click add city btn event
    WEATHER.getWeather(Location, true);
  };

  // Input event
  locationInput.addEventListener("input", function() {
    let inputText = this.value.trim();

    // Check user write city in input
    if (inputText !== "") {
      addCityBtn.classList.remove("disabled");
      addCityBtn.removeAttribute("disabled");
    } else {
      addCityBtn.classList.add("disabled");
      addCityBtn.setAttribute("disabled", "true");
    }
  });

  // Add City Button event
  addCityBtn.addEventListener("click", _addCity);
})();

/*-----------------------------------------------------------
 *
 * WEATHER Model 
 * 
 * This Model Responsible For aquire weather data and then it
 * will pass to anthor module which will put the data on UI
 * 
 * -----------------------------------------------------------
 */
const WEATHER = (function() {
  const darkSkyKey = "2422dfd5b5bff628ed3fabc63384495c",
    geocoderKey = "6663817b2b65471d8b984fb7b4e3b0aa";

  const _getGeocoderURL = Location => {
    return `https://api.opencagedata.com/geocode/v1/json?q=${Location}&key=${geocoderKey}`;
  };

  const _getDarkSkyURL = (lat, lng) => {
    return `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkSkyKey}/${lat},${lng}`;
  };

  const _getDarkSkyData = (url, Location) => {
    axios
      .get(url)
      .then(res => {
        // Handle success
        UI.drawWeatherData(res.data, Location);
      })
      .catch(err => {
        // Handle error
        console.error(err);
      });
  };

  const getWeather = (Location, save) => {
    UI.loadApp();

    let geocodeURL = _getGeocoderURL(Location);

    axios
      .get(geocodeURL)
      .then(res => {
        // Handle success
        // Check user write a valid location/place
        if (res.data.results.length == 0) {
          console.error("Invalid Location");
          UI.showApp();
          return;
        }

        if (save) {
          // Save city/location
          LOCALSTORAGE.save(Location);
          SAVEDCITIES.drawCity(Location);
        }

        let lat = res.data.results[0].geometry.lat,
          lng = res.data.results[0].geometry.lng;

        let darkSkyURL = _getDarkSkyURL(lat, lng);

        _getDarkSkyData(darkSkyURL, Location);
      })
      .catch(err => {
        // Handle error
        console.error(err);
      });
  };

  return {
    getWeather
  };
})();

/*-----------------------------------------------------------
 *
 * Init 
 * 
 *
 * -----------------------------------------------------------
 */

window.addEventListener("load", function() {
  // Geting saved cities from localstorage
  LOCALSTORAGE.get();
  // Store the cities thata received from local storage
  let cities = LOCALSTORAGE.getSavedCities();
  // Show the weather of last city that user search about it
  if (cities.length != 0) {
    cities.forEach(city => {
      SAVEDCITIES.drawCity(city);
    });
    WEATHER.getWeather(cities[cities.length - 1], false);
  } else {
    UI.showApp();
  }
});
