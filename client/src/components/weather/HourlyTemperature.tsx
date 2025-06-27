import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { CurrentWeather } from "@shared/schema";

interface HourlyTemperatureProps {
  currentWeather: CurrentWeather;
  temperatureSymbol?: string;
}

export function HourlyTemperature({ currentWeather, temperatureSymbol = "°F" }: HourlyTemperatureProps) {
  // Generate hourly data for next 24 hours (mock data based on current weather)
  const generateHourlyData = () => {
    const hourlyData = [];
    const now = new Date();
    const baseTemp = currentWeather.temperature;
    
    for (let i = 0; i < 24; i++) {
      const hour = new Date(now.getTime() + i * 60 * 60 * 1000);
      // Simulate temperature variation throughout the day
      const tempVariation = Math.sin((hour.getHours() - 6) * Math.PI / 12) * 8;
      const temperature = Math.round(baseTemp + tempVariation + (Math.random() - 0.5) * 4);
      
      hourlyData.push({
        time: hour.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          hour12: true 
        }),
        temperature,
        icon: currentWeather.icon,
        isNow: i === 0
      });
    }
    
    return hourlyData;
  };

  const hourlyData = generateHourlyData();

  return (
    <motion.div
      className="glass-morphism rounded-2xl p-6 shadow-lg mb-8 backdrop-blur-md border border-white/30 dark:border-white/20"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >

      
      <div className="overflow-x-auto scrollbar-hide touch-pan-x">
        <div className="flex space-x-4 pb-2" style={{ scrollBehavior: 'smooth' }}>
          {hourlyData.map((hour, index) => (
            <motion.div
              key={index}
              className={`flex-shrink-0 text-center p-3 rounded-lg min-w-[80px] flex flex-col items-center justify-center ${
                hour.isNow ? 'bg-white/20 border border-white/30' : 'bg-white/5'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.02 }}
            >
              <div className="text-xs text-white/70 mb-2 text-center">
                {hour.isNow ? 'Now' : hour.time}
              </div>
              <div className="mb-2 flex justify-center">
                <i className={`${hour.icon} text-lg text-yellow-300 text-center`}></i>
              </div>
              <div className="text-sm font-semibold text-white text-center">
                {hour.temperature}{temperatureSymbol}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}