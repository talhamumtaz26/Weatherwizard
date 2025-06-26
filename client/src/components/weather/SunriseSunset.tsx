import { motion } from "framer-motion";
import { Sunrise, Sunset } from "lucide-react";
import type { CurrentWeather } from "@shared/schema";

interface SunriseSunsetProps {
  currentWeather: CurrentWeather;
}

export function SunriseSunset({ currentWeather }: SunriseSunsetProps) {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-sm mt-8 border border-white/20"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold text-white mb-6">Sun & Moon</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Sunrise className="h-8 w-8 text-yellow-400" />
          </div>
          <p className="text-sm text-white/70 mb-1">Sunrise</p>
          <p className="text-2xl font-bold text-white">{currentWeather.sunrise}</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Sunset className="h-8 w-8 text-orange-400" />
          </div>
          <p className="text-sm text-white/70 mb-1">Sunset</p>
          <p className="text-2xl font-bold text-white">{currentWeather.sunset}</p>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between text-sm text-white/70">
          <span>Current time of day:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            currentWeather.isDay 
              ? 'bg-yellow-400/20 text-yellow-300' 
              : 'bg-indigo-400/20 text-indigo-300'
          }`}>
            {currentWeather.isDay ? 'Day' : 'Night'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}