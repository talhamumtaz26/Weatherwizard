import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import type { ForecastDay } from "@shared/schema";

interface WeatherForecastProps {
  forecast: ForecastDay[];
}

export function WeatherForecast({ forecast }: WeatherForecastProps) {
  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 shadow-sm mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Calendar className="text-blue-500 mr-3 h-5 w-5" />
        10-Day Forecast
      </h2>
      
      <div className="space-y-4">
        {forecast.map((day, index) => (
          <motion.div
            key={day.date}
            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded-lg px-2 transition-colors cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center flex-1">
              <div className="w-16 text-sm font-medium text-gray-600">
                {day.dayName}
              </div>
              <div className="flex items-center mx-4">
                <i className={`${day.icon} text-lg w-6`}></i>
                <span className="ml-2 text-sm text-gray-600">{day.description}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                <i className="fas fa-tint text-blue-400 mr-1"></i>
                <span>{day.precipitationChance}%</span>
              </div>
              <div className="flex items-center space-x-2 min-w-[80px] justify-end">
                <span className="text-sm font-medium text-gray-800">{day.tempHigh}°</span>
                <span className="text-sm text-gray-500">{day.tempLow}°</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
