import { z } from "zod";

export const weatherConditionSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

export const currentWeatherSchema = z.object({
  location: z.string(),
  temperature: z.number(),
  feelsLike: z.number(),
  description: z.string(),
  humidity: z.number(),
  pressure: z.number(),
  visibility: z.number(),
  windSpeed: z.number(),
  windDirection: z.string(),
  uvIndex: z.number(),
  uvLevel: z.string(),
  aqi: z.number(),
  aqiLevel: z.string(),
  icon: z.string(),
  lastUpdated: z.string(),
});

export const forecastDaySchema = z.object({
  date: z.string(),
  dayName: z.string(),
  icon: z.string(),
  description: z.string(),
  tempHigh: z.number(),
  tempLow: z.number(),
  precipitationChance: z.number(),
});

export const weatherDataSchema = z.object({
  current: currentWeatherSchema,
  forecast: z.array(forecastDaySchema),
});

export const locationSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export type WeatherCondition = z.infer<typeof weatherConditionSchema>;
export type CurrentWeather = z.infer<typeof currentWeatherSchema>;
export type ForecastDay = z.infer<typeof forecastDaySchema>;
export type WeatherData = z.infer<typeof weatherDataSchema>;
export type Location = z.infer<typeof locationSchema>;
