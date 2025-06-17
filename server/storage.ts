import { users, userLocations, weatherCache, type User, type InsertUser, type UserLocation, type InsertUserLocation, type WeatherCacheEntry, type InsertWeatherCache } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  // User locations
  getUserLocations(userId: number): Promise<UserLocation[]>;
  addUserLocation(insertLocation: InsertUserLocation): Promise<UserLocation>;
  setDefaultLocation(userId: number, locationId: number): Promise<void>;
  deleteUserLocation(id: number): Promise<void>;
  
  // Weather caching
  getCachedWeather(lat: number, lon: number): Promise<WeatherCacheEntry | undefined>;
  cacheWeatherData(insertCache: InsertWeatherCache): Promise<WeatherCacheEntry>;
  clearOldCache(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getUserLocations(userId: number): Promise<UserLocation[]> {
    return await db
      .select()
      .from(userLocations)
      .where(eq(userLocations.userId, userId))
      .orderBy(desc(userLocations.isDefault), desc(userLocations.createdAt));
  }

  async addUserLocation(insertLocation: InsertUserLocation): Promise<UserLocation> {
    // If this is set as default, remove default from other locations
    if (insertLocation.isDefault && insertLocation.userId) {
      await db
        .update(userLocations)
        .set({ isDefault: false })
        .where(eq(userLocations.userId, insertLocation.userId));
    }

    const [location] = await db
      .insert(userLocations)
      .values(insertLocation)
      .returning();
    return location;
  }

  async setDefaultLocation(userId: number, locationId: number): Promise<void> {
    // Remove default from all user locations
    await db
      .update(userLocations)
      .set({ isDefault: false })
      .where(eq(userLocations.userId, userId));

    // Set the specified location as default
    await db
      .update(userLocations)
      .set({ isDefault: true })
      .where(and(eq(userLocations.id, locationId), eq(userLocations.userId, userId)));
  }

  async deleteUserLocation(id: number): Promise<void> {
    await db.delete(userLocations).where(eq(userLocations.id, id));
  }

  async getCachedWeather(lat: number, lon: number): Promise<WeatherCacheEntry | undefined> {
    // Cache is valid for 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    
    const [cached] = await db
      .select()
      .from(weatherCache)
      .where(
        and(
          eq(weatherCache.lat, lat),
          eq(weatherCache.lon, lon)
        )
      )
      .orderBy(desc(weatherCache.cachedAt))
      .limit(1);

    if (cached && cached.cachedAt > tenMinutesAgo) {
      return cached;
    }
    
    return undefined;
  }

  async cacheWeatherData(insertCache: InsertWeatherCache): Promise<WeatherCacheEntry> {
    const [cached] = await db
      .insert(weatherCache)
      .values(insertCache)
      .returning();
    return cached;
  }

  async clearOldCache(): Promise<void> {
    // Remove cache entries older than 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    await db.delete(weatherCache).where(desc(weatherCache.cachedAt));
  }
}

export const storage = new DatabaseStorage();
