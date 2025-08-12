# WeatherWizard Mobile App

This document provides instructions for building and running the WeatherWizard application as a mobile app using Capacitor.

## Prerequisites

1. Node.js and npm installed
2. Android Studio installed (for Android development)
3. JDK 11 or later

## Setup

The Capacitor setup has already been completed. The necessary dependencies have been installed and the Android platform has been added.

## Building the Mobile App

1. Build the web application and sync with Capacitor:
   ```
   npm run build-mobile
   ```

2. Open the Android project in Android Studio:
   ```
   npm run open-android
   ```

3. In Android Studio, you can:
   - Run the app on an emulator or connected device
   - Generate an APK for distribution

## Project Structure

- `android/` - Contains the Android native project
- `dist/public/` - Contains the built web assets that Capacitor uses
- `capacitor.config.ts` - Capacitor configuration file

## Permissions

The app requests the following permissions:
- `ACCESS_COARSE_LOCATION` - For approximate location access
- `ACCESS_FINE_LOCATION` - For precise location access
- `INTERNET` - For network access to fetch weather data

## Additional Notes

- The app uses the same codebase as the web version
- All UI components and functionality should work as expected on mobile
- Geolocation features will prompt users for permission when accessed