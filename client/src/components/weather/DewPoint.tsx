import React from 'react';
import { CurrentWeather } from '@shared/schema';

interface DewPointProps {
  currentWeather: CurrentWeather;
  temperatureSymbol?: string;
}

export function DewPoint({ currentWeather, temperatureSymbol = "°C" }: DewPointProps) {
  const dewPoint = currentWeather.dewPoint;
  
  return (
    <div className="glass-card p-4 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <i className="fas fa-tint text-blue-400 text-lg"></i>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Dew Point</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {dewPoint}{temperatureSymbol}
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {dewPoint < 10 ? 'Very dry air' :
           dewPoint < 13 ? 'Comfortable' :
           dewPoint < 16 ? 'Getting humid' :
           dewPoint < 18 ? 'Humid' :
           dewPoint < 21 ? 'Very humid' :
           dewPoint < 24 ? 'Oppressive' : 'Extremely oppressive'}
        </div>
      </div>
    </div>
  );
}