import { useState, useEffect } from 'react';

export type TemperatureUnit = 'fahrenheit' | 'celsius';

export function useTemperatureUnits() {
  const [units, setUnits] = useState<TemperatureUnit>('fahrenheit');

  useEffect(() => {
    const savedUnits = localStorage.getItem('weatherapp_temperature_units') as TemperatureUnit;
    if (savedUnits && (savedUnits === 'fahrenheit' || savedUnits === 'celsius')) {
      setUnits(savedUnits);
    }
  }, []);

  const updateUnits = (newUnits: TemperatureUnit) => {
    setUnits(newUnits);
    localStorage.setItem('weatherapp_temperature_units', newUnits);
  };

  const convertTemperature = (tempF: number): number => {
    if (units === 'celsius') {
      return Math.round((tempF - 32) * 5/9);
    }
    return Math.round(tempF);
  };

  const getTemperatureSymbol = () => {
    return units === 'celsius' ? '°C' : '°F';
  };

  return {
    units,
    updateUnits,
    convertTemperature,
    getTemperatureSymbol,
  };
}