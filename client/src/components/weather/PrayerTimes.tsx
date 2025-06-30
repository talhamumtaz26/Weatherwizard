import React, { useState, useEffect } from 'react';

interface PrayerTime {
  name: string;
  time: string;
  icon: string;
}

interface PrayerTimesProps {
  location?: { lat: number; lon: number };
}

export function PrayerTimes({ location }: PrayerTimesProps) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; timeLeft: string } | null>(null);

  const calculatePrayerTimes = () => {
    // Basic prayer time calculation for Karachi (will be made more accurate in production)
    const today = new Date();
    const prayers: PrayerTime[] = [
      { name: 'Fajr', time: '05:15', icon: 'fas fa-moon' },
      { name: 'Dhuhr', time: '12:30', icon: 'fas fa-sun' },
      { name: 'Asr', time: '16:45', icon: 'fas fa-cloud-sun' },
      { name: 'Maghrib', time: '18:30', icon: 'fas fa-sunset' },
      { name: 'Isha', time: '20:00', icon: 'fas fa-star' }
    ];
    
    setPrayerTimes(prayers);
    
    // Find next prayer and calculate time remaining
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    let nextPrayerTime = null;
    let nextPrayerName = '';
    
    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTimeInMinutes = hours * 60 + minutes;
      
      if (prayerTimeInMinutes > currentTime) {
        nextPrayerTime = prayerTimeInMinutes;
        nextPrayerName = prayer.name;
        break;
      }
    }
    
    // If no prayer found today, next is Fajr tomorrow
    if (!nextPrayerTime) {
      const fajrTime = prayers[0];
      const [hours, minutes] = fajrTime.time.split(':').map(Number);
      nextPrayerTime = (24 * 60) + (hours * 60 + minutes);
      nextPrayerName = fajrTime.name;
    }
    
    const timeLeftInMinutes = nextPrayerTime - currentTime;
    const hoursLeft = Math.floor(timeLeftInMinutes / 60);
    const minutesLeft = timeLeftInMinutes % 60;
    
    const timeLeftString = hoursLeft > 0 
      ? `${hoursLeft}h ${minutesLeft}m`
      : `${minutesLeft}m`;
    
    setNextPrayer({
      name: nextPrayerName,
      timeLeft: timeLeftString
    });
  };

  useEffect(() => {
    calculatePrayerTimes();
    const interval = setInterval(calculatePrayerTimes, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [location]);

  return (
    <div className="glass-card p-4 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <i className="fas fa-mosque text-green-500 text-lg"></i>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Prayer Times</span>
        </div>
        {nextPrayer && (
          <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
            Next: {nextPrayer.name} in {nextPrayer.timeLeft}
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        {prayerTimes.map((prayer, index) => {
          const isNext = nextPrayer?.name === prayer.name;
          return (
            <div 
              key={prayer.name}
              className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                isNext 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <i className={`${prayer.icon} ${isNext ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} text-sm`}></i>
                <span className={`font-medium ${isNext ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  {prayer.name}
                </span>
              </div>
              <span className={`text-sm font-mono ${isNext ? 'text-green-600 dark:text-green-400 font-bold' : 'text-gray-600 dark:text-gray-400'}`}>
                {prayer.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}