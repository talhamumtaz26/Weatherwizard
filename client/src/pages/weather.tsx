import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { WeatherHeader } from "@/components/weather/WeatherHeader";
import { WeatherDetailsGrid } from "@/components/weather/WeatherDetailsGrid";
import { WeatherForecast } from "@/components/weather/WeatherForecast";
import { LoadingSpinner } from "@/components/weather/LoadingSpinner";
import { SettingsPanel } from "@/components/weather/SettingsPanel";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useTemperatureUnits } from "@/hooks/useTemperatureUnits";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { WeatherData } from "@shared/schema";

export default function Weather() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [manualLocation, setManualLocation] = useState<{ lat: number; lon: number } | null>(null);
  const { location: gpsLocation, loading: locationLoading, error: locationError } = useGeolocation();
  const { units, updateUnits, convertTemperature, getTemperatureSymbol } = useTemperatureUnits();
  
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

  // Convert weather data to use selected temperature units
  const convertedWeatherData = weatherData ? {
    ...weatherData,
    current: {
      ...weatherData.current,
      temperature: convertTemperature(weatherData.current.temperature),
      feelsLike: convertTemperature(weatherData.current.feelsLike),
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <WeatherHeader 
        currentWeather={convertedWeatherData.current} 
        onSettingsClick={() => setIsSettingsOpen(true)}
        onLocationClick={handleLocationClick}
        temperatureSymbol={getTemperatureSymbol()}
      />
      
      <div className="max-w-6xl mx-auto px-4 py-6 md:px-6">
        <WeatherDetailsGrid 
          currentWeather={convertedWeatherData.current} 
          temperatureSymbol={getTemperatureSymbol()}
        />
        <WeatherForecast 
          forecast={convertedWeatherData.forecast} 
          temperatureSymbol={getTemperatureSymbol()}
        />
        
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
        currentUnits={units}
        onUnitsChange={updateUnits}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
}
