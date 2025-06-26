import { motion } from "framer-motion";
import { Sunrise, Sunset } from "lucide-react";
import type { CurrentWeather } from "@shared/schema";

interface SunriseSunsetProps {
  currentWeather: CurrentWeather;
}

export function SunriseSunset({ currentWeather }: SunriseSunsetProps) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-sm mt-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold text-gray-800 mb-6">Sun & Moon</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Sunrise className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Sunrise</p>
          <p className="text-2xl font-bold text-gray-800">{currentWeather.sunrise}</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Sunset className="h-8 w-8 text-orange-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Sunset</p>
          <p className="text-2xl font-bold text-gray-800">{currentWeather.sunset}</p>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Current time of day:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            currentWeather.isDay 
              ? 'bg-yellow-100 text-yellow-700' 
              : 'bg-indigo-100 text-indigo-700'
          }`}>
            {currentWeather.isDay ? 'Day' : 'Night'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}