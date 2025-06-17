import { z } from "zod";
import { pgTable, serial, text, integer, real, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

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
  pressure: z.string(),
  visibility: z.number(),
  windSpeed: z.number(),
  windDirection: z.string(),
  uvIndex: z.number(),
  uvLevel: z.string(),
  aqi: z.number(),
  aqiLevel: z.string(),
  icon: z.string(),
  sunrise: z.string(),
  sunset: z.string(),
  isDay: z.boolean(),
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

// Database Tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  preferredUnits: varchar("preferred_units", { length: 10 }).notNull().default("fahrenheit"), // fahrenheit or celsius
  defaultLocation: text("default_location"),
  defaultLat: real("default_lat"),
  defaultLon: real("default_lon"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const weatherCache = pgTable("weather_cache", {
  id: serial("id").primaryKey(),
  lat: real("lat").notNull(),
  lon: real("lon").notNull(),
  weatherData: text("weather_data").notNull(), // JSON string
  cachedAt: timestamp("cached_at").notNull().defaultNow(),
});

export const userLocations = pgTable("user_locations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  locationName: varchar("location_name", { length: 100 }).notNull(),
  lat: real("lat").notNull(),
  lon: real("lon").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  locations: many(userLocations),
}));

export const userLocationsRelations = relations(userLocations, ({ one }) => ({
  user: one(users, {
    fields: [userLocations.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserLocationSchema = createInsertSchema(userLocations).omit({
  id: true,
  createdAt: true,
});

export const insertWeatherCacheSchema = createInsertSchema(weatherCache).omit({
  id: true,
  cachedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserLocation = typeof userLocations.$inferSelect;
export type InsertUserLocation = z.infer<typeof insertUserLocationSchema>;
export type WeatherCacheEntry = typeof weatherCache.$inferSelect;
export type InsertWeatherCache = z.infer<typeof insertWeatherCacheSchema>;

export type WeatherCondition = z.infer<typeof weatherConditionSchema>;
export type CurrentWeather = z.infer<typeof currentWeatherSchema>;
export type ForecastDay = z.infer<typeof forecastDaySchema>;
export type WeatherData = z.infer<typeof weatherDataSchema>;
export type Location = z.infer<typeof locationSchema>;
