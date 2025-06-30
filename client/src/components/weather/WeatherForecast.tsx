import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import type { ForecastDay } from "@shared/schema";

interface WeatherForecastProps {
  forecast: ForecastDay[];
  temperatureSymbol?: string;
}

export function WeatherForecast({ forecast, temperatureSymbol = "°C" }: WeatherForecastProps) {
  return (
    <motion.div 
      className="glass-morphism rounded-2xl p-6 shadow-lg mb-8 backdrop-blur-md border border-white/30 dark:border-white/20"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center justify-center">
        <Calendar className="text-blue-300 mr-3 h-5 w-5" />
        10-Day Forecast
      </h2>
      
      <div className="space-y-2">
        {forecast.map((day, index) => {
          const today = new Date();
          const forecastDate = new Date(day.date);
          const dayNum = forecastDate.getDate().toString().padStart(2, '0');
          const monthNum = (forecastDate.getMonth() + 1).toString().padStart(2, '0');
          const isToday = index === 0;
          const isTomorrow = index === 1;
          
          return (
            <motion.div
              key={day.date}
              className={`flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-200 ${
                isToday
                  ? 'bg-white/20 border border-white/30' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
            >
              {/* Date and Day */}
              <div className="flex items-center space-x-3 min-w-[100px]">
                <div className="text-sm text-white/90 font-medium">
                  {dayNum}/{monthNum}
                </div>
                <div className="text-sm text-white/70">
                  {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : day.dayName?.substring(0, 3)}
                </div>
              </div>
              
              {/* Weather Icon and Rain Chance */}
              <div className="flex items-center space-x-3 flex-1 justify-center">
                <i className={`${day.icon} text-xl text-yellow-300`}></i>
                <div className="text-xs text-blue-300 flex items-center gap-1 bg-blue-500/20 px-2 py-1 rounded-full">
                  <i className="fas fa-tint text-xs"></i>
                  {day.precipitationChance || 0}%
                </div>
              </div>
              
              {/* Temperature Range */}
              <div className="flex items-center space-x-2 min-w-[80px] justify-end">
                <span className="text-sm font-bold text-white">{day.tempHigh}</span>
                <span className="text-xs text-white/50">{day.tempLow}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
