export const WEATHER_ICONS = {
  'clear-day': 'fas fa-sun',
  'clear-night': 'fas fa-moon',
  'partly-cloudy-day': 'fas fa-cloud-sun',
  'partly-cloudy-night': 'fas fa-cloud-moon',
  'cloudy': 'fas fa-cloud',
  'rain': 'fas fa-cloud-rain',
  'snow': 'fas fa-snowflake',
  'thunderstorm': 'fas fa-bolt',
  'fog': 'fas fa-smog',
  'wind': 'fas fa-wind',
} as const;

export const UV_LEVELS = {
  LOW: 'Low',
  MODERATE: 'Moderate',
  HIGH: 'High',
  VERY_HIGH: 'Very High',
  EXTREME: 'Extreme',
} as const;

export const AQI_LEVELS = {
  GOOD: 'Good',
  MODERATE: 'Moderate',
  UNHEALTHY_SENSITIVE: 'Unhealthy for Sensitive Groups',
  UNHEALTHY: 'Unhealthy',
  VERY_UNHEALTHY: 'Very Unhealthy',
  HAZARDOUS: 'Hazardous',
} as const;

export function getUVLevel(uvIndex: number): string {
  if (uvIndex <= 2) return UV_LEVELS.LOW;
  if (uvIndex <= 5) return UV_LEVELS.MODERATE;
  if (uvIndex <= 7) return UV_LEVELS.HIGH;
  if (uvIndex <= 10) return UV_LEVELS.VERY_HIGH;
  return UV_LEVELS.EXTREME;
}

export function getAQILevel(aqi: number): string {
  if (aqi <= 50) return AQI_LEVELS.GOOD;
  if (aqi <= 100) return AQI_LEVELS.MODERATE;
  if (aqi <= 150) return AQI_LEVELS.UNHEALTHY_SENSITIVE;
  if (aqi <= 200) return AQI_LEVELS.UNHEALTHY;
  if (aqi <= 300) return AQI_LEVELS.VERY_UNHEALTHY;
  return AQI_LEVELS.HAZARDOUS;
}

export function kelvinToFahrenheit(kelvin: number): number {
  return Math.round((kelvin - 273.15) * 9/5 + 32);
}

export function kelvinToCelsius(kelvin: number): number {
  return Math.round(kelvin - 273.15);
}

export function metersToMiles(meters: number): number {
  return Math.round(meters * 0.000621371);
}

export function hPaToInHg(hPa: number): string {
  return (hPa * 0.02953).toFixed(2);
}
