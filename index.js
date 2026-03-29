require('dotenv').config({ path: './variables.env' });
const API_KEY = process.env.API_KEY;
const readline = require('readline');
const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
async function get_weather_data(city) {
    try {
        // Use the current weather API instead (simpler)
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found');
            } else if (response.status === 401) {
                throw new Error('Invalid API key');
            } else {
                throw new Error(`API error: ${response.status}`);
            }
        }
        
        let data = await response.json();
        return data;
        
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
        
    }
}

function displayWeatherData(data) {
    console.log('\n=== Weather Information ===');
    console.log(`City: ${data.name}, ${data.sys.country}`);
    console.log(`Temperature: ${data.main.temp}°C`);
    console.log(`Feels Like: ${data.main.feels_like}°C`);
    console.log(`Weather: ${data.weather[0].description}`);
    console.log(`Humidity: ${data.main.humidity}%`);
    console.log(`Wind Speed: ${data.wind.speed} m/s`);
    console.log(`Pressure: ${data.main.pressure} hPa`);
    console.log('==========================\n');
}
function askQuestion(prompt) {
  return new Promise((resolve, reject) => {
    // I call rl.question with a tiny callback:
    rl.question(prompt, (answer) => {
      // when user types something, this inner function runs
      resolve(answer);   // → this tells the Promise: "I’m done, value is `answer`"
    });
  });
}

async function promptCity() {
    
    const input = await askQuestion('enter the city name : ');
        if (!input || input.trim() === '') {
            console.log('City name cannot be empty');
            rl.close();
            
        }
        try {
            const weatherData = await get_weather_data(input.trim());
            displayWeatherData(weatherData);
        } catch (error) {
            console.log(`Error: invalide city name`,error.message);
        }
        
        rl.close();
    };


// Start the application
console.log('Weather Application Started');
promptCity();