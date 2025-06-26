import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import type { ForecastDay } from "@shared/schema";

interface WeatherForecastProps {
  forecast: ForecastDay[];
  temperatureSymbol?: string;
}

export function WeatherForecast({ forecast, temperatureSymbol = "°F" }: WeatherForecastProps) {
  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-sm mb-8 border border-white/20"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center justify-center">
        <Calendar className="text-blue-300 mr-3 h-5 w-5" />
        10-Day Forecast
      </h2>
      
      <div className="space-y-4">
        {forecast.map((day, index) => (
          <motion.div
            key={day.date}
            className="flex items-center justify-center py-3 border-b border-white/20 last:border-b-0 hover:bg-white/10 rounded-lg px-2 transition-colors cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center flex-1 justify-start">
                <div className="w-16 text-sm font-medium text-white/90 text-center">
                  {day.dayName}
                </div>
                <div className="flex items-center mx-4">
                  <i className={`${day.icon} text-lg w-6 text-center`}></i>
                  <span className="ml-2 text-sm text-white/70 text-center">{day.description}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 justify-center">
                <div className="text-sm text-white/60 text-center">
                  <i className="fas fa-tint text-blue-300 mr-1"></i>
                  <span>{day.precipitationChance}%</span>
                </div>
                <div className="flex items-center space-x-2 min-w-[80px] justify-center">
                  <span className="text-sm font-medium text-white text-center">{day.tempHigh}{temperatureSymbol}</span>
                  <span className="text-sm text-white/60 text-center">{day.tempLow}{temperatureSymbol}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
