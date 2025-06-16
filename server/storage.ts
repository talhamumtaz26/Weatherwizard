import { type WeatherData, type Location } from "@shared/schema";

export interface IStorage {
  // Weather data is fetched from external API, no persistent storage needed
  // but we can add caching if needed in the future
}

export class MemStorage implements IStorage {
  constructor() {
    // No persistent storage needed for weather data
  }
}

export const storage = new MemStorage();
