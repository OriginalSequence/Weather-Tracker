const form = document.querySelector('form');
const submitBtn = document.querySelector('.submit-btn');
const error = document.querySelector('.error-msg');
const toggleSwitch = document.querySelector('.toggle-switch');
let isFahrenheit = false;
let currentData = null;  // Store the latest fetched data

form.addEventListener('submit', handleSubmit);
submitBtn.addEventListener('click', handleSubmit);
toggleSwitch.addEventListener('click', toggleUnit);

displayDefaultTemp();

function handleSubmit(e) {
  e.preventDefault();
  fetchWeather();
}

async function getWeatherData(location) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=9a37f19e3ac040c09e152941240208&q=${location}`,

    {
      mode: 'cors',
    }
  );
  if (response.status === 400) {
    throwErrorMsg();
  } else {
    error.style.display = 'none';
    const weatherData = await response.json();
    currentData = processData(weatherData);  // Store processed data
    displayData(currentData);
    reset();
  }
}

function throwErrorMsg() {
  error.style.display = 'block';
}

function processData(weatherData) {
  return {
    condition: weatherData.current.condition.text,
    feelsLike: {
      f: Math.round(weatherData.current.feelslike_f),
      c: Math.round(weatherData.current.feelslike_c),
    },
    currentTemp: {
      f: Math.round(weatherData.current.temp_f),
      c: Math.round(weatherData.current.temp_c),
    },
    wind: Math.round(weatherData.current.wind_mph),
    humidity: weatherData.current.humidity,
    location: weatherData.location.name.toUpperCase(),
    region: weatherData.location.country === 'United States of America'
      ? weatherData.location.region.toUpperCase()
      : weatherData.location.country.toUpperCase(),
  };
}

function displayData(data) {
  const tempUnit = isFahrenheit ? 'f' : 'c';
  const tempSymbol = isFahrenheit ? '°F' : '°C';

  document.querySelector('.condition').textContent = data.condition;
  document.querySelector('.location').textContent = `${data.location}, ${data.region}`;
  document.querySelector('.degrees').textContent = `${data.currentTemp[tempUnit]}${tempSymbol}`;
  document.querySelector('.feels-like').textContent = `FEELS LIKE: ${data.feelsLike[tempUnit]}${tempSymbol}`;
  document.querySelector('.wind-mph').textContent = `WIND: ${data.wind} MPH`;
  document.querySelector('.humidity').textContent = `HUMIDITY: ${data.humidity}%`;
}

function toggleUnit() {
  isFahrenheit = !isFahrenheit;
  if (currentData) {
    displayData(currentData);  // Re-display the stored data with the new unit
  } else {
    displayDefaultTemp();  // Update the default display
  }
}


function displayDefaultTemp() {
  const tempSymbol = isFahrenheit ? '°F' : '°C';
  document.querySelector('.degrees').textContent = `00${tempSymbol}`;
  document.querySelector('.feels-like').textContent = `FEELS LIKE: 00${tempSymbol}`;
}

function reset() {
  form.reset();
}

function fetchWeather() {
  const input = document.querySelector('input[type="text"]');
  const userLocation = input.value;
  getWeatherData(userLocation);
}
