
// Function to fetch weather data for a specific location
async function getWeatherData(location) {
  const apiKey = 'e043cabe9078e2c2a910c388d8144a0c';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Function to display weather data
function displayWeatherData(data) {
  const weatherDisplay = document.getElementById('weatherDisplay');
  weatherDisplay.innerHTML = `
      <h2>${data.name}<span style="font-size: 1.5em;">&#127758;</span></h2>

      <div class="tempcontainer"><p>Temperature: ${data.main.temp}°C</p></div>
      <div class="humcontainer"><p>Humidity: ${data.main.humidity}%</p></div>
      <div class="wcontainer"><p>Weather: ${data.weather[0].description}</p></div>
      <div class="wscontainer"><p>Wind Speed: ${data.wind.speed} m/s</p></div>
  `;

  // Set background image based on weather description
  const weatherBackgrounds = {
      'clear sky': 'url("https://img.freepik.com/premium-photo/clear-sky-blue-professional-advertising-photography_925376-8738.jpg?w=740")',
      'few clouds': 'url("https://img.freepik.com/free-photo/minimalist-photorealistic-road_23-2150953009.jpg?t=st=1713087368~exp=1713090968~hmac=078f86a0ef772e9ddf7b28712eadf283cc18b346ef32f1ac0e542e14f2a82d30&w=826")',
      'scattered clouds': 'url("https://img.freepik.com/premium-photo/texture-background-field-with-clouds-sky_761066-52528.jpg?w=740")',
      'overcast clouds': 'url("https://t4.ftcdn.net/jpg/06/60/46/93/240_F_660469357_g3pyPsUwEywxBxyEWkapszd0y54BvfWo.jpg")',
      'haze':'url("https://guardian.ng/wp-content/uploads/2022/01/Hazy-weather.jpg")'

  };

  const backgroundUrl = weatherBackgrounds[data.weather[0].description.toLowerCase()];
  if (backgroundUrl) {
      document.body.style.backgroundImage = backgroundUrl;
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundSize = 'cover';
  }
}

// Function to fetch forecast data for a specific location
async function getForecastData(location) {
  const apiKey = 'e043cabe9078e2c2a910c388d8144a0c';
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function displayForecastData(data) {
  const forecastDisplay = document.getElementById('forecastDisplay');
  forecastDisplay.innerHTML = '<h2>5-Days Forecast</h2>';

  // Group forecast data by date
  const groupedData = {};
  data.list.forEach((item) => {
      const date = new Date(item.dt_txt);
      const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      if (!groupedData[formattedDate]) {
          groupedData[formattedDate] = [];
      }
      groupedData[formattedDate].push({ time, ...item });
  });

  // Create a clickable list of dates
  Object.keys(groupedData).forEach((date) => {
      const dateElement = document.createElement('div');
      dateElement.classList.add('date-container');
      dateElement.textContent = date;
      dateElement.addEventListener('click', () => {
          displayDetailedForecast(groupedData[date]);
      });
      forecastDisplay.appendChild(dateElement);
  });

  // Function to display detailed forecast for a specific date
  function displayDetailedForecast(items) {
      forecastDisplay.innerHTML = '<h2>Detailed Forecast</h2>';

      items.forEach((item) => {
          const detailElement = document.createElement('div');
          detailElement.innerHTML = `
              <p><b>Time:</b> ${item.time}</p>
              <p>Temperature: ${item.main.temp}°C</p>
              <p>Weather: ${item.weather[0].description}</p>
              <p>Wind Speed: ${item.wind.speed} m/s</p>
          `;
          forecastDisplay.appendChild(detailElement);
      });

      // Add a button to return to the list of dates
      const backButton = document.createElement('button');
      backButton.textContent = 'Back to Dates';
      backButton.addEventListener('click', () => {
          displayDatesList();
      });
      forecastDisplay.appendChild(backButton);
  }

  function displayDatesList() {
  forecastDisplay.innerHTML = '<h2>5-Days Forecast</h2>';
  Object.keys(groupedData).forEach((date) => {
  const dateElement = document.createElement('div');
  dateElement.classList.add('date-container');
  dateElement.textContent = date;
  dateElement.addEventListener('click', () => {
      displayDetailedForecast(groupedData[date]);
  });

  // Find the highest and lowest temperatures for the date
  const temperatures = groupedData[date].map(item => item.main.temp);
  const highestTemp = Math.max(...temperatures);
  const lowestTemp = Math.min(...temperatures);

  // Display the highest and lowest temperatures
  const tempRangeElement = document.createElement('div');
  tempRangeElement.classList.add('temp-range');
  tempRangeElement.textContent = `High: ${highestTemp}°C, Low: ${lowestTemp}°C`;

  dateElement.appendChild(tempRangeElement);
  forecastDisplay.appendChild(dateElement);
});
}

}

// Function to get weather data for the city entered in the search box
async function getWeather() {
  const city = document.getElementById('cityInput').value;
  const weatherData = await getWeatherData(city);
  displayWeatherData(weatherData);
  const forecastData = await getForecastData(city);
  displayForecastData(forecastData);
}

// Function to get the user's current location
function getCurrentLocation() {
return new Promise((resolve, reject) => {
navigator.geolocation.getCurrentPosition(resolve, reject);
});
}

// Function to get weather data for the user's current location
async function getWeatherForCurrentLocation() {
try {
const position = await getCurrentLocation();
const { latitude, longitude } = position.coords;
const apiKey = 'e043cabe9078e2c2a910c388d8144a0c';
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
const response = await fetch(url);
const data = await response.json();
return data;
} catch (error) {
console.error('Error getting location:', error);
}
}

// Call the getWeatherForCurrentLocation function to display weather for the user's current location
getWeatherForCurrentLocation().then((weatherData) => {
displayWeatherData(weatherData);
getForecastData(weatherData.name).then((forecastData) => {
displayForecastData(forecastData);
});
});

window.onload = () => {
getWeatherForCurrentLocation().then((weatherData) => {
displayWeatherData(weatherData);
getForecastData(weatherData.name).then((forecastData) => {
  displayForecastData(forecastData);
});
});
};