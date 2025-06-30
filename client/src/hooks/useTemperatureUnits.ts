import { useState, useEffect } from 'react';

export type TemperatureUnit = 'fahrenheit' | 'celsius';
export type SpeedUnit = 'mph' | 'kmh';
export type DistanceUnit = 'miles' | 'km';

export function useWeatherUnits() {
  const [temperatureUnits, setTemperatureUnits] = useState<TemperatureUnit>('celsius');
  const [speedUnits, setSpeedUnits] = useState<SpeedUnit>('kmh');
  const [distanceUnits, setDistanceUnits] = useState<DistanceUnit>('km');

  useEffect(() => {
    const savedTempUnits = localStorage.getItem('weatherapp_temperature_units') as TemperatureUnit;
    const savedSpeedUnits = localStorage.getItem('weatherapp_speed_units') as SpeedUnit;
    const savedDistanceUnits = localStorage.getItem('weatherapp_distance_units') as DistanceUnit;
    
    if (savedTempUnits && (savedTempUnits === 'fahrenheit' || savedTempUnits === 'celsius')) {
      setTemperatureUnits(savedTempUnits);
    }
    if (savedSpeedUnits && (savedSpeedUnits === 'mph' || savedSpeedUnits === 'kmh')) {
      setSpeedUnits(savedSpeedUnits);
    }
    if (savedDistanceUnits && (savedDistanceUnits === 'miles' || savedDistanceUnits === 'km')) {
      setDistanceUnits(savedDistanceUnits);
    }
  }, []);

  const updateTemperatureUnits = (newUnits: TemperatureUnit) => {
    setTemperatureUnits(newUnits);
    localStorage.setItem('weatherapp_temperature_units', newUnits);
  };

  const updateSpeedUnits = (newUnits: SpeedUnit) => {
    setSpeedUnits(newUnits);
    localStorage.setItem('weatherapp_speed_units', newUnits);
  };

  const updateDistanceUnits = (newUnits: DistanceUnit) => {
    setDistanceUnits(newUnits);
    localStorage.setItem('weatherapp_distance_units', newUnits);
  };

  const convertTemperature = (tempF: number): number => {
    if (temperatureUnits === 'celsius') {
      return Math.round((tempF - 32) * 5/9);
    }
    return Math.round(tempF);
  };

  const convertSpeed = (speedMph: number): number => {
    if (speedUnits === 'kmh') {
      return Math.round(speedMph * 1.60934);
    }
    return Math.round(speedMph);
  };

  const convertDistance = (distanceMiles: number): number => {
    if (distanceUnits === 'km') {
      return Math.round(distanceMiles * 1.60934);
    }
    return Math.round(distanceMiles);
  };

  const getTemperatureSymbol = () => {
    return temperatureUnits === 'celsius' ? '°C' : '°F';
  };

  const getSpeedSymbol = () => {
    return speedUnits === 'kmh' ? 'km/h' : 'mph';
  };

  const getDistanceSymbol = () => {
    return distanceUnits === 'km' ? 'km' : 'mi';
  };

  return {
    temperatureUnits,
    speedUnits,
    distanceUnits,
    updateTemperatureUnits,
    updateSpeedUnits,
    updateDistanceUnits,
    convertTemperature,
    convertSpeed,
    convertDistance,
    getTemperatureSymbol,
    getSpeedSymbol,
    getDistanceSymbol,
  };
}