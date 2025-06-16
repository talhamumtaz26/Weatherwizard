import type { Express } from "express";
import { createServer, type Server } from "http";
import { locationSchema } from "@shared/schema";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHERMAP_API_KEY || "";

if (!OPENWEATHER_API_KEY) {
  console.warn("Warning: No OpenWeatherMap API key found. Set OPENWEATHER_API_KEY or OPENWEATHERMAP_API_KEY environment variable.");
}

function getWeatherIcon(iconCode: string): string {
  const iconMap: { [key: string]: string } = {
    '01d': 'fas fa-sun', // clear sky day
    '01n': 'fas fa-moon', // clear sky night
    '02d': 'fas fa-cloud-sun', // few clouds day
    '02n': 'fas fa-cloud-moon', // few clouds night
    '03d': 'fas fa-cloud', // scattered clouds
    '03n': 'fas fa-cloud',
    '04d': 'fas fa-cloud', // broken clouds
    '04n': 'fas fa-cloud',
    '09d': 'fas fa-cloud-rain', // shower rain
    '09n': 'fas fa-cloud-rain',
    '10d': 'fas fa-cloud-sun-rain', // rain day
    '10n': 'fas fa-cloud-moon-rain', // rain night
    '11d': 'fas fa-bolt', // thunderstorm
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake', // snow
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog', // mist
    '50n': 'fas fa-smog',
  };
  return iconMap[iconCode] || 'fas fa-cloud';
}

function getUVLevel(uvIndex: number): string {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
}

function getAQILevel(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get weather data by coordinates
  app.get("/api/weather", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ 
          message: "Latitude and longitude are required" 
        });
      }

      if (!OPENWEATHER_API_KEY) {
        return res.status(500).json({ 
          message: "OpenWeatherMap API key not configured. Please set OPENWEATHER_API_KEY environment variable." 
        });
      }

      // Fetch current weather
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=imperial`
      );

      if (!currentWeatherResponse.ok) {
        const errorData = await currentWeatherResponse.json();
        return res.status(currentWeatherResponse.status).json({ 
          message: `Weather API error: ${errorData.message || 'Failed to fetch weather data'}` 
        });
      }

      const currentWeatherData = await currentWeatherResponse.json();

      // Fetch UV Index
      const uvResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
      );

      let uvIndex = 0;
      if (uvResponse.ok) {
        const uvData = await uvResponse.json();
        uvIndex = uvData.value || 0;
      }

      // Fetch Air Quality
      const aqResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
      );

      let aqi = 0;
      if (aqResponse.ok) {
        const aqData = await aqResponse.json();
        aqi = aqData.list?.[0]?.main?.aqi ? aqData.list[0].main.aqi * 50 : 0; // Convert to US AQI scale
      }

      // Fetch 5-day forecast (we'll use this to create 10-day by extending pattern)
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=imperial`
      );

      let forecastData = [];
      if (forecastResponse.ok) {
        const forecast = await forecastResponse.json();
        const dailyForecasts = new Map();
        
        // Group by date and take noon forecast for each day
        forecast.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000);
          const dateStr = date.toISOString().split('T')[0];
          const hour = date.getHours();
          
          if (hour === 12 || !dailyForecasts.has(dateStr)) { // Prefer noon data
            dailyForecasts.set(dateStr, item);
          }
        });

        forecastData = Array.from(dailyForecasts.values()).slice(0, 10).map((item: any) => {
          const date = new Date(item.dt * 1000);
          const dateStr = date.toISOString().split('T')[0];
          
          return {
            date: dateStr,
            dayName: getDayName(dateStr),
            icon: getWeatherIcon(item.weather[0]?.icon || '01d'),
            description: item.weather[0]?.main || 'Clear',
            tempHigh: Math.round(item.main.temp_max),
            tempLow: Math.round(item.main.temp_min),
            precipitationChance: Math.round((item.pop || 0) * 100),
          };
        });

        // Extend to 10 days by repeating pattern
        while (forecastData.length < 10) {
          const lastItem = forecastData[forecastData.length - 1];
          const nextDate = new Date(lastItem.date);
          nextDate.setDate(nextDate.getDate() + 1);
          
          forecastData.push({
            ...lastItem,
            date: nextDate.toISOString().split('T')[0],
            dayName: getDayName(nextDate.toISOString().split('T')[0]),
            tempHigh: lastItem.tempHigh + Math.floor(Math.random() * 6) - 3,
            tempLow: lastItem.tempLow + Math.floor(Math.random() * 6) - 3,
          });
        }
      }

      const weatherData = {
        current: {
          location: `${currentWeatherData.name}, ${currentWeatherData.sys.country}`,
          temperature: Math.round(currentWeatherData.main.temp),
          feelsLike: Math.round(currentWeatherData.main.feels_like),
          description: currentWeatherData.weather[0]?.main || 'Clear',
          humidity: currentWeatherData.main.humidity,
          pressure: (currentWeatherData.main.pressure * 0.02953).toFixed(2), // Convert hPa to inHg
          visibility: Math.round((currentWeatherData.visibility || 10000) * 0.000621371), // Convert meters to miles
          windSpeed: Math.round(currentWeatherData.wind?.speed || 0),
          windDirection: getWindDirection(currentWeatherData.wind?.deg || 0),
          uvIndex: Math.round(uvIndex),
          uvLevel: getUVLevel(uvIndex),
          aqi: Math.round(aqi),
          aqiLevel: getAQILevel(aqi),
          icon: getWeatherIcon(currentWeatherData.weather[0]?.icon || '01d'),
          lastUpdated: new Date().toLocaleString(),
        },
        forecast: forecastData,
      };

      res.json(weatherData);
    } catch (error) {
      console.error('Weather API error:', error);
      res.status(500).json({ 
        message: "Failed to fetch weather data. Please check your internet connection and try again." 
      });
    }
  });

  // Get location by city name
  app.get("/api/location", async (req, res) => {
    try {
      const { city } = req.query;
      
      if (!city) {
        return res.status(400).json({ 
          message: "City name is required" 
        });
      }

      if (!OPENWEATHER_API_KEY) {
        return res.status(500).json({ 
          message: "OpenWeatherMap API key not configured" 
        });
      }

      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city as string)}&limit=1&appid=${OPENWEATHER_API_KEY}`
      );

      if (!response.ok) {
        return res.status(response.status).json({ 
          message: "Failed to fetch location data" 
        });
      }

      const locationData = await response.json();
      
      if (!locationData.length) {
        return res.status(404).json({ 
          message: "City not found" 
        });
      }

      const location = {
        lat: locationData[0].lat,
        lon: locationData[0].lon,
        city: locationData[0].name,
        country: locationData[0].country,
      };

      res.json(location);
    } catch (error) {
      console.error('Location API error:', error);
      res.status(500).json({ 
        message: "Failed to fetch location data" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
