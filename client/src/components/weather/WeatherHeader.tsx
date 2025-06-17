import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CurrentWeather } from "@shared/schema";

interface WeatherHeaderProps {
  currentWeather: CurrentWeather;
  onSettingsClick?: () => void;
  onLocationClick?: () => void;
  temperatureSymbol?: string;
  speedSymbol?: string;
  distanceSymbol?: string;
}

export function WeatherHeader({ 
  currentWeather, 
  onSettingsClick, 
  onLocationClick, 
  temperatureSymbol = "°F" 
}: WeatherHeaderProps) {
  return (
    <div className="weather-gradient text-white px-4 py-6 md:px-6 md:py-8">
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
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onSettingsClick}
            className="p-2 rounded-full glass-morphism hover:bg-white/20 transition-colors text-white hover:text-white"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Current Weather Display */}
        <div className="text-center mb-8">
          {/* Current weather icon */}
          <motion.div 
            className="mb-4"
            animate={{ y: [-10, 0, -10] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <i className={`${currentWeather.icon} text-6xl md:text-7xl text-yellow-300 drop-shadow-lg`}></i>
          </motion.div>
          
          {/* Temperature */}
          <motion.div 
            className="mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-6xl md:text-7xl font-light">{currentWeather.temperature}</span>
            <span className="text-2xl font-light">{temperatureSymbol}</span>
          </motion.div>
          
          {/* Weather Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-xl font-medium opacity-90 mb-2">{currentWeather.description}</p>
            <p className="text-sm opacity-75">Feels like {currentWeather.feelsLike}{temperatureSymbol}</p>
          </motion.div>
        </div>

        {/* Today's Highlights Quick View */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="glass-morphism rounded-xl p-4 text-center">
            <i className="fas fa-tint text-blue-300 text-lg mb-2"></i>
            <p className="text-xs opacity-75">Humidity</p>
            <p className="text-lg font-semibold">{currentWeather.humidity}%</p>
          </div>
          <div className="glass-morphism rounded-xl p-4 text-center">
            <i className="fas fa-wind text-green-300 text-lg mb-2"></i>
            <p className="text-xs opacity-75">Wind</p>
            <p className="text-lg font-semibold">{currentWeather.windSpeed} mph</p>
          </div>
          <div className="glass-morphism rounded-xl p-4 text-center">
            <i className="fas fa-eye text-purple-300 text-lg mb-2"></i>
            <p className="text-xs opacity-75">Visibility</p>
            <p className="text-lg font-semibold">{currentWeather.visibility} mi</p>
          </div>
          <div className="glass-morphism rounded-xl p-4 text-center">
            <i className="fas fa-thermometer-half text-orange-300 text-lg mb-2"></i>
            <p className="text-xs opacity-75">Pressure</p>
            <p className="text-lg font-semibold">{currentWeather.pressure}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
