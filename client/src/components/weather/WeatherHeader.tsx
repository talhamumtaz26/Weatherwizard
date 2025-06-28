import { motion } from "framer-motion";
import { Settings, Sunrise, Sunset, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CurrentWeather } from "@shared/schema";

interface WeatherHeaderProps {
  currentWeather: CurrentWeather;
  onSettingsClick?: () => void;
  onLocationClick?: () => void;
  onRefreshLocation?: () => void;
  isRefreshingLocation?: boolean;
  temperatureSymbol?: string;
  speedSymbol?: string;
  distanceSymbol?: string;
}

export function WeatherHeader({ 
  currentWeather, 
  onSettingsClick, 
  onLocationClick,
  onRefreshLocation,
  isRefreshingLocation = false,
  temperatureSymbol = "°F",
  speedSymbol = "mph",
  distanceSymbol = "mi"
}: WeatherHeaderProps) {
  return (
    <div className="text-white px-4 py-6 md:px-6 md:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Location and Settings */}
        <div className="flex justify-between items-center mb-6">
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onLocationClick}
          >
            <i className="fas fa-map-marker-alt text-lg"></i>
            <span className="text-lg font-medium">{currentWeather.location}</span>
          </motion.div>
          <div className="flex items-center gap-2">
            {onRefreshLocation && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onRefreshLocation}
                disabled={isRefreshingLocation}
                className="p-2 rounded-full glass-morphism hover:bg-white/20 transition-colors text-white hover:text-white"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshingLocation ? 'animate-spin' : ''}`} />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onSettingsClick}
              className="p-2 rounded-full glass-morphism hover:bg-white/20 transition-colors text-white hover:text-white"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Current Weather Display */}
        <div className="text-center mb-8 flex flex-col items-center">
          {/* Current weather icon */}
          <motion.div 
            className="mb-4 flex justify-center"
            animate={{ y: [-10, 0, -10] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <i className={`${currentWeather.icon} text-6xl md:text-7xl text-yellow-300 drop-shadow-lg`}></i>
          </motion.div>
          
          {/* Temperature */}
          <motion.div 
            className="mb-6 flex justify-center items-center mt-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-8xl md:text-9xl font-bold text-white text-center">{Math.round(currentWeather.temperature)}</span>
            <span className="text-3xl font-bold text-white text-center">{temperatureSymbol}</span>
          </motion.div>
          
          {/* Weather Description */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-xl font-medium opacity-90 mb-2 text-center">{currentWeather.description}</p>
            <p className="text-lg opacity-85 mb-2 text-center">Feels like {currentWeather.feelsLike}{temperatureSymbol}</p>
            <p className="text-sm opacity-70 mb-1 text-center">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

          </motion.div>
        </div>


      </div>
    </div>
  );
}
