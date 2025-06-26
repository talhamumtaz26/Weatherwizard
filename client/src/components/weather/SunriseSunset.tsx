import { motion } from "framer-motion";
import { Sunrise, Sunset, Moon } from "lucide-react";
import type { CurrentWeather } from "@shared/schema";

interface SunriseSunsetProps {
  currentWeather: CurrentWeather;
}

export function SunriseSunset({ currentWeather }: SunriseSunsetProps) {
  // Calculate prayer times based on sunrise/sunset (simplified calculation)
  const calculatePrayerTimes = () => {
    const sunrise = new Date(`2024-01-01 ${currentWeather.sunrise}`);
    const sunset = new Date(`2024-01-01 ${currentWeather.sunset}`);
    
    // Simplified prayer time calculations
    const fajr = new Date(sunrise.getTime() - 90 * 60000); // 1.5 hours before sunrise
    const dhuhr = new Date((sunrise.getTime() + sunset.getTime()) / 2); // Midday
    const asr = new Date(sunset.getTime() - 3 * 60 * 60000); // 3 hours before sunset
    const maghrib = new Date(sunset.getTime() + 5 * 60000); // 5 minutes after sunset
    const isha = new Date(sunset.getTime() + 90 * 60000); // 1.5 hours after sunset

    return {
      fajr: fajr.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      dhuhr: dhuhr.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      asr: asr.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      maghrib: maghrib.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      isha: isha.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  const prayerTimes = calculatePrayerTimes();

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-sm mt-8 border border-white/20"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold text-white mb-6">Sun, Moon & Prayer Times</h2>
      
      {/* Sun & Moon Section */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Sunrise className="h-6 w-6 text-yellow-400" />
          </div>
          <p className="text-xs text-white/70 mb-1">Sunrise</p>
          <p className="text-lg font-bold text-white">{currentWeather.sunrise}</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Moon className="h-6 w-6 text-blue-300" />
          </div>
          <p className="text-xs text-white/70 mb-1">Current</p>
          <p className={`text-sm font-medium px-2 py-1 rounded-full ${
            currentWeather.isDay 
              ? 'bg-yellow-400/20 text-yellow-300' 
              : 'bg-indigo-400/20 text-indigo-300'
          }`}>
            {currentWeather.isDay ? 'Day' : 'Night'}
          </p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Sunset className="h-6 w-6 text-orange-400" />
          </div>
          <p className="text-xs text-white/70 mb-1">Sunset</p>
          <p className="text-lg font-bold text-white">{currentWeather.sunset}</p>
        </div>
      </div>
      
      {/* Prayer Times Section */}
      <div className="border-t border-white/20 pt-4">
        <h3 className="text-lg font-semibold text-white mb-4 text-center">
          <i className="fas fa-mosque text-green-400 mr-2"></i>
          Prayer Times (Namaz)
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="text-center bg-white/5 rounded-lg p-3">
            <div className="text-xs text-white/70 mb-1">Fajr</div>
            <div className="text-sm font-semibold text-white">{prayerTimes.fajr}</div>
          </div>
          
          <div className="text-center bg-white/5 rounded-lg p-3">
            <div className="text-xs text-white/70 mb-1">Dhuhr</div>
            <div className="text-sm font-semibold text-white">{prayerTimes.dhuhr}</div>
          </div>
          
          <div className="text-center bg-white/5 rounded-lg p-3">
            <div className="text-xs text-white/70 mb-1">Asr</div>
            <div className="text-sm font-semibold text-white">{prayerTimes.asr}</div>
          </div>
          
          <div className="text-center bg-white/5 rounded-lg p-3">
            <div className="text-xs text-white/70 mb-1">Maghrib</div>
            <div className="text-sm font-semibold text-white">{prayerTimes.maghrib}</div>
          </div>
          
          <div className="text-center bg-white/5 rounded-lg p-3 md:col-span-1 col-span-2">
            <div className="text-xs text-white/70 mb-1">Isha</div>
            <div className="text-sm font-semibold text-white">{prayerTimes.isha}</div>
          </div>
        </div>
        
        <div className="text-center mt-3">
          <p className="text-xs text-white/60">
            * Prayer times are calculated estimates based on sun times
          </p>
        </div>
      </div>
    </motion.div>
  );
}