# Weather Application

## Overview

This is a full-stack weather application built with React and Express.js that provides real-time weather information and forecasts. The application uses external weather APIs to fetch current conditions and multi-day forecasts, with a clean and responsive user interface built using modern React patterns and shadcn/ui components.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom weather-themed color variables
- **Animations**: Framer Motion for smooth transitions and loading states
- **Icons**: Font Awesome for weather and UI icons

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: Built-in session handling with connect-pg-simple
- **Development Server**: Custom Vite integration for hot module replacement

### Database Schema
- **Users**: User authentication and profile management
- **User Locations**: Saved locations for quick weather access
- **Weather Cache**: Cached weather data to reduce API calls
- **Schema Management**: Drizzle Kit for migrations and schema updates

## Key Components

### Weather Display System
- **Current Weather**: Real-time conditions with temperature, humidity, pressure, UV index, and air quality
- **Weather Details Grid**: Comprehensive weather metrics with visual progress indicators
- **10-Day Forecast**: Extended weather predictions with daily highs/lows and precipitation chances
- **Weather Icons**: Dynamic icon selection based on conditions and time of day

### User Location Management
- **GPS Integration**: Automatic location detection using browser geolocation API
- **Manual Location Search**: City-based location search with external geocoding API
- **Location Storage**: Persistent user location preferences
- **Multiple Locations**: Support for saved favorite locations

### Settings and Preferences
- **Unit Conversion**: Support for Fahrenheit/Celsius, mph/kmh, miles/km
- **Local Storage**: Persistent user preferences across sessions
- **Responsive Design**: Mobile-first design with adaptive layouts

### Caching Strategy
- **Weather Data Caching**: Database-level caching to reduce external API calls
- **Cache Invalidation**: Time-based cache expiration for fresh data
- **Storage Abstraction**: Interface-based storage layer for flexibility

## Data Flow

1. **Location Acquisition**: User location obtained via GPS or manual search
2. **Weather API Request**: Server fetches weather data from external APIs
3. **Data Processing**: Raw weather data normalized and enhanced with icons/descriptions
4. **Caching**: Processed data cached in PostgreSQL for performance
5. **Client Response**: Structured weather data sent to React frontend
6. **UI Rendering**: Components render weather information with animations
7. **User Interaction**: Settings changes trigger re-renders with updated units

## External Dependencies

### Weather Data
- **Weather API**: External weather service integration (API key required)
- **Geocoding**: Location-based search and coordinate resolution

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Font Awesome**: Icon library for weather and UI elements
- **Framer Motion**: Animation library for smooth transitions

### Development Tools
- **Drizzle**: TypeScript ORM for PostgreSQL
- **Vite**: Fast build tool with HMR support
- **TanStack Query**: Server state management and caching

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: esbuild compiles TypeScript server to `dist/index.js`
- **Static Assets**: Frontend served from Express.js in production

### Environment Configuration
- **Database**: PostgreSQL connection via `DATABASE_URL`
- **Weather API**: External API key via `WEATHER_API_KEY`
- **Sessions**: Secure session configuration for production

### Replit Integration
- **Auto-scaling**: Configured for Replit's auto-scale deployment
- **Port Configuration**: Express server on port 5000, mapped to external port 80
- **Module System**: Uses Node.js 20 with PostgreSQL 16 support

### Development Workflow
- **Hot Reload**: Vite HMR for instant frontend updates
- **TypeScript**: Full type safety across frontend and backend
- **Database Migrations**: Drizzle Kit for schema management
- **Error Handling**: Comprehensive error boundaries and API error handling

## Changelog
```
Changelog:
- June 26, 2025. Initial setup
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```