const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const cityInput = document.querySelector(".city-input"); 
const weatherCardsDiv = document.querySelector(".weather-cards")
const currentWeatherDiv = document.querySelector(".current-weather");


const API_KEY = "869e2d0ddadbd22e0db42ab1332bc428"; // API key for OpenWeatherMap API



const createWeatherCard = (cityName, weatheritem, index,) =>{
if (index === 0 ){
            return `<div class="weather-data">
            <div class="current-weather">
            <div class="details">
                <h2>${cityName} ( ${weatheritem.dt_txt.split(" ")[0]} )</h2>
                <h6>Temperature: ${(weatheritem.main.temp -273.15).toFixed(2)}°C</h6>
                <h6>Wind: ${weatheritem.wind.speed} M/S</h6>
                <h6>Humidity: ${weatheritem.main.humidity}%</h6>
            </div>`;
} 
                    else { return` <li class="card">
                    <h3>(${weatheritem.dt_txt.split(" ")[0]} )</h3>
                    <h6>Temp: ${(weatheritem.main.temp -273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatheritem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatheritem.main.humidity}%</h6>
                  </li>`;
}

}

const getWeatherDetails = (cityName ,lat ,lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
    });

cityInput.value = "";
currentWeatherDiv.innerHTML = " ";
    weatherCardsDiv.innerHTML = " ";


    fiveDaysForecast.forEach((weatheritem, index ) => {
        if(index === 0) {
            currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatheritem, index)); 
        } else {
            weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatheritem, index));
        }
     
    });
}).catch(() => {
    alert("An error occurred while fetching the weather forecast!");

});

}
 

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    
    console.log(cityName);
    const GEOCODING_API_URL =`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}` ;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name , lat ,lon } = data[0];

        getWeatherDetails(name ,lat ,lon);

    }).catch(() =>{
        alert("an error occured trying to fetch the coordinates")

    });
} 
const getUserCoordinates = ( ) =>{
    navigator.geolocation.getCurrentPosition(
        position =>{
            const {latitude, longitude} = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const { name } = data[0];

                getWeatherDetails(name ,latitude ,longitude);
            }).catch(() =>{
                alert("an error occured trying to fetch the city")
        
            });
        },
        error =>{
           if(error.code === error.PERMISSION_DENIED){
            alert("Geolocation request denied. Please reset location permission to grant access again.")
           }
        }
    );
}
searchButton.addEventListener("click", getCityCoordinates);
locationButton.addEventListener("click", getUserCoordinates);