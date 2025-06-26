import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { WeatherHeader } from "@/components/weather/WeatherHeader";
import { WeatherDetailsGrid } from "@/components/weather/WeatherDetailsGrid";
import { WeatherForecast } from "@/components/weather/WeatherForecast";
import { LoadingSpinner } from "@/components/weather/LoadingSpinner";
import { SettingsPanel } from "@/components/weather/SettingsPanel";
import { SunriseSunset } from "@/components/weather/SunriseSunset";
import { HourlyTemperature } from "@/components/weather/HourlyTemperature";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeatherUnits } from "@/hooks/useTemperatureUnits";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { WeatherData } from "@shared/schema";

export default function Weather() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [manualLocation, setManualLocation] = useState<{ lat: number; lon: number } | null>(null);
  const { location: gpsLocation, loading: locationLoading, error: locationError } = useGeolocation();
  const { 
    temperatureUnits, 
    speedUnits, 
    distanceUnits,
    updateTemperatureUnits, 
    updateSpeedUnits,
    updateDistanceUnits,
    convertTemperature, 
    convertSpeed,
    convertDistance,
    getTemperatureSymbol,
    getSpeedSymbol,
    getDistanceSymbol
  } = useWeatherUnits();
  
  // Use manual location if set, otherwise fall back to GPS location
  const location = manualLocation || gpsLocation;

  const { data: weatherData, isLoading: weatherLoading, error: weatherError } = useQuery<WeatherData>({
    queryKey: ['/api/weather', location?.lat, location?.lon],
    enabled: !!(location?.lat && location?.lon),
  });

  const isLoading = locationLoading || weatherLoading;
  const error = locationError || weatherError;

  const handleLocationSelect = (lat: number, lon: number, city: string) => {
    setManualLocation({ lat, lon });
    setIsSettingsOpen(false);
  };

  const handleLocationClick = () => {
    setIsSettingsOpen(true);
  };

  // Convert weather data to use selected units
  const convertedWeatherData = weatherData ? {
    ...weatherData,
    current: {
      ...weatherData.current,
      temperature: convertTemperature(weatherData.current.temperature),
      feelsLike: convertTemperature(weatherData.current.feelsLike),
      windSpeed: convertSpeed(weatherData.current.windSpeed),
      visibility: convertDistance(weatherData.current.visibility),
    },
    forecast: weatherData.forecast.map(day => ({
      ...day,
      tempHigh: convertTemperature(day.tempHigh),
      tempLow: convertTemperature(day.tempLow),
    })),
  } : null;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
        <Alert className="max-w-md bg-white">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load weather data. Please check your location settings and try again."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!convertedWeatherData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
        <Alert className="max-w-md bg-white">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No weather data available. Please ensure location services are enabled.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getDynamicBackground = () => {
    const currentWeather = convertedWeatherData?.current;
    if (!currentWeather) return "min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600";
    
    const description = currentWeather.description.toLowerCase();
    const isDay = currentWeather.isDay;
    
    // Weather-based backgrounds
    if (description.includes('rain') || description.includes('drizzle')) {
      return isDay 
        ? "min-h-screen bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 relative"
        : "min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black relative";
    }
    
    if (description.includes('snow')) {
      return isDay 
        ? "min-h-screen bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 relative"
        : "min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 relative";
    }
    
    if (description.includes('mist') || description.includes('fog') || description.includes('haze')) {
      return isDay 
        ? "min-h-screen bg-gradient-to-br from-gray-300 via-blue-300 to-blue-400 relative"
        : "min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 relative";
    }
    
    if (description.includes('cloud')) {
      return isDay 
        ? "min-h-screen bg-gradient-to-br from-gray-400 via-blue-400 to-blue-500 relative"
        : "min-h-screen bg-gradient-to-br from-gray-700 via-indigo-800 to-indigo-900 relative";
    }
    
    // Default clear weather
    return isDay 
      ? "min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative"
      : "min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative";
  };

  const getWeatherEffects = () => {
    const currentWeather = convertedWeatherData?.current;
    if (!currentWeather) return null;
    
    const description = currentWeather.description.toLowerCase();
    const isDay = currentWeather.isDay;
    
    // Night stars effect
    if (!isDay) {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 60 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                animationDuration: Math.random() * 2 + 2 + 's'
              }}
            />
          ))}
        </div>
      );
    }
    
    // Mist/fog effect
    if (description.includes('mist') || description.includes('fog')) {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/10 rounded-full blur-2xl animate-pulse"
              style={{
                width: '200px',
                height: '100px',
                top: Math.random() * 80 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: i * 2 + 's',
                animationDuration: '8s'
              }}
            />
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={getDynamicBackground()}>
      {getWeatherEffects()}
      <WeatherHeader 
        currentWeather={convertedWeatherData.current} 
        onSettingsClick={() => setIsSettingsOpen(true)}
        onLocationClick={handleLocationClick}
        temperatureSymbol={getTemperatureSymbol()}
        speedSymbol={getSpeedSymbol()}
        distanceSymbol={getDistanceSymbol()}
      />
      
      <div className="max-w-6xl mx-auto px-4 py-6 md:px-6 text-white">
        <HourlyTemperature 
          currentWeather={convertedWeatherData.current}
          temperatureSymbol={getTemperatureSymbol()}
        />
        <WeatherDetailsGrid 
          currentWeather={convertedWeatherData.current} 
          temperatureSymbol={getTemperatureSymbol()}
          speedSymbol={getSpeedSymbol()}
          distanceSymbol={getDistanceSymbol()}
        />
        <WeatherForecast 
          forecast={convertedWeatherData.forecast} 
          temperatureSymbol={getTemperatureSymbol()}
        />
        
        <SunriseSunset currentWeather={convertedWeatherData.current} />
        
        <div className="text-center py-6 text-gray-500 text-sm">
          <p>Weather data provided by WeatherAPI</p>
          <p className="mt-1">
            Last updated: <span>{convertedWeatherData.current.lastUpdated}</span>
          </p>
        </div>
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        temperatureUnits={temperatureUnits}
        speedUnits={speedUnits}
        distanceUnits={distanceUnits}
        onTemperatureUnitsChange={updateTemperatureUnits}
        onSpeedUnitsChange={updateSpeedUnits}
        onDistanceUnitsChange={updateDistanceUnits}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
}
