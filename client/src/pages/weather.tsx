import { useQuery } from "@tanstack/react-query";
import { WeatherHeader } from "@/components/weather/WeatherHeader";
import { WeatherDetailsGrid } from "@/components/weather/WeatherDetailsGrid";
import { WeatherForecast } from "@/components/weather/WeatherForecast";
import { LoadingSpinner } from "@/components/weather/LoadingSpinner";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { WeatherData } from "@shared/schema";

export default function Weather() {
  const { location, loading: locationLoading, error: locationError } = useGeolocation();

  const { data: weatherData, isLoading: weatherLoading, error: weatherError } = useQuery<WeatherData>({
    queryKey: ['/api/weather', location?.lat, location?.lon],
    enabled: !!(location?.lat && location?.lon),
  });

  const isLoading = locationLoading || weatherLoading;
  const error = locationError || weatherError;

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

  if (!weatherData) {
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
      <WeatherHeader currentWeather={weatherData.current} />
      
      <div className="max-w-6xl mx-auto px-4 py-6 md:px-6">
        <WeatherDetailsGrid currentWeather={weatherData.current} />
        <WeatherForecast forecast={weatherData.forecast} />
        
        <div className="text-center py-6 text-gray-500 text-sm">
          <p>Weather data provided by OpenWeatherMap API</p>
          <p className="mt-1">
            Last updated: <span>{weatherData.current.lastUpdated}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
