import type { Express } from "express";
import { createServer, type Server } from "http";
import { locationSchema } from "@shared/schema";
import { storage } from "./storage";

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || "";

if (!WEATHER_API_KEY) {
  console.warn("Warning: No WeatherAPI key found. Set WEATHER_API_KEY environment variable.");
}

function getWeatherIcon(conditionText: string, isDay: boolean): string {
  const condition = conditionText.toLowerCase();
  
  if (condition.includes('sunny') || condition.includes('clear')) {
    return isDay ? 'fas fa-sun' : 'fas fa-moon';
  }
  if (condition.includes('partly cloudy') || condition.includes('few clouds')) {
    return isDay ? 'fas fa-cloud-sun' : 'fas fa-cloud-moon';
  }
  if (condition.includes('cloudy') || condition.includes('overcast')) {
    return 'fas fa-cloud';
  }
  if (condition.includes('rain') || condition.includes('drizzle')) {
    return isDay ? 'fas fa-cloud-sun-rain' : 'fas fa-cloud-rain';
  }
  if (condition.includes('thunder') || condition.includes('storm')) {
    return 'fas fa-bolt';
  }
  if (condition.includes('snow') || condition.includes('blizzard')) {
    return 'fas fa-snowflake';
  }
  if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) {
    return 'fas fa-smog';
  }
  if (condition.includes('wind')) {
    return 'fas fa-wind';
  }
  
  return isDay ? 'fas fa-sun' : 'fas fa-moon';
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

      if (!WEATHER_API_KEY) {
        return res.status(500).json({ 
          message: "WeatherAPI key not configured. Please set WEATHER_API_KEY environment variable." 
        });
      }

      // Check cache first
      const cachedWeather = await storage.getCachedWeather(parseFloat(lat as string), parseFloat(lon as string));
      if (cachedWeather) {
        return res.json(JSON.parse(cachedWeather.weatherData));
      }

      // Fetch current weather and forecast from WeatherAPI (includes everything we need)
      const weatherResponse = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=10&aqi=yes&alerts=no`
      );

      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json().catch(() => ({}));
        return res.status(weatherResponse.status).json({ 
          message: `Weather API error: ${errorData.error?.message || 'Failed to fetch weather data'}` 
        });
      }

      const weatherData = await weatherResponse.json();
      const current = weatherData.current;
      const location = weatherData.location;
      const forecast = weatherData.forecast.forecastday;

      // Format forecast data
      const forecastData: any[] = forecast.map((day: any) => {
        const date = day.date;
        return {
          date: date,
          dayName: getDayName(date),
          icon: getWeatherIcon(day.day.condition.text, true),
          description: day.day.condition.text,
          tempHigh: Math.round(day.day.maxtemp_f),
          tempLow: Math.round(day.day.mintemp_f),
          precipitationChance: Math.round(day.day.daily_chance_of_rain || day.day.daily_chance_of_snow || 0),
        };
      });

      const responseData = {
        current: {
          location: `${location.name}, ${location.country}`,
          temperature: Math.round(current.temp_f),
          feelsLike: Math.round(current.feelslike_f),
          description: current.condition.text,
          humidity: current.humidity,
          pressure: (current.pressure_in).toFixed(2),
          visibility: Math.round(current.vis_miles),
          windSpeed: Math.round(current.wind_mph),
          windDirection: current.wind_dir,
          uvIndex: Math.round(current.uv),
          uvLevel: getUVLevel(current.uv),
          aqi: Math.round(current.air_quality?.['us-epa-index'] * 50 || 0), // Convert to US AQI scale
          aqiLevel: getAQILevel(current.air_quality?.['us-epa-index'] * 50 || 0),
          icon: getWeatherIcon(current.condition.text, current.is_day === 1),
          sunrise: forecast[0]?.astro?.sunrise || "6:00 AM",
          sunset: forecast[0]?.astro?.sunset || "6:00 PM",
          isDay: current.is_day === 1,
          lastUpdated: new Date().toLocaleString(),
        },
        forecast: forecastData,
      };

      // Cache the weather data
      await storage.cacheWeatherData({
        lat: parseFloat(lat as string),
        lon: parseFloat(lon as string),
        weatherData: JSON.stringify(responseData),
      });

      res.json(responseData);
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

      if (!WEATHER_API_KEY) {
        return res.status(500).json({ 
          message: "WeatherAPI key not configured" 
        });
      }

      const response = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city as string)}`
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

  // User management endpoints
  app.post("/api/users", async (req, res) => {
    try {
      const userData = req.body;
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ 
        message: "Failed to create user" 
      });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(parseInt(id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ 
        message: "Failed to fetch user" 
      });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const user = await storage.updateUser(parseInt(id), updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ 
        message: "Failed to update user" 
      });
    }
  });

  // User locations endpoints
  app.get("/api/users/:id/locations", async (req, res) => {
    try {
      const { id } = req.params;
      const locations = await storage.getUserLocations(parseInt(id));
      res.json(locations);
    } catch (error) {
      console.error('Get user locations error:', error);
      res.status(500).json({ 
        message: "Failed to fetch user locations" 
      });
    }
  });

  app.post("/api/users/:id/locations", async (req, res) => {
    try {
      const { id } = req.params;
      const locationData = { ...req.body, userId: parseInt(id) };
      const location = await storage.addUserLocation(locationData);
      res.json(location);
    } catch (error) {
      console.error('Add user location error:', error);
      res.status(500).json({ 
        message: "Failed to add location" 
      });
    }
  });

  app.put("/api/users/:userId/locations/:locationId/default", async (req, res) => {
    try {
      const { userId, locationId } = req.params;
      await storage.setDefaultLocation(parseInt(userId), parseInt(locationId));
      res.json({ message: "Default location updated" });
    } catch (error) {
      console.error('Set default location error:', error);
      res.status(500).json({ 
        message: "Failed to set default location" 
      });
    }
  });

  app.delete("/api/locations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteUserLocation(parseInt(id));
      res.json({ message: "Location deleted" });
    } catch (error) {
      console.error('Delete location error:', error);
      res.status(500).json({ 
        message: "Failed to delete location" 
      });
    }
  });

  // Cache management endpoint
  app.delete("/api/cache/clear", async (req, res) => {
    try {
      await storage.clearOldCache();
      res.json({ message: "Cache cleared" });
    } catch (error) {
      console.error('Clear cache error:', error);
      res.status(500).json({ 
        message: "Failed to clear cache" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
