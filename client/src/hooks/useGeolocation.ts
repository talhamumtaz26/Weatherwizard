import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  location: { lat: number; lon: number } | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
  });

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        location: null,
        loading: false,
        error: 'Geolocation is not supported by this browser',
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const handleSuccess = (position: GeolocationPosition) => {
      console.log('Location detected:', position.coords.latitude, position.coords.longitude);
      setState({
        location: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
        loading: false,
        error: null,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      console.log('Geolocation error:', error.code, error.message);
      let errorMessage = 'Unable to retrieve location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location in your browser settings.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information unavailable. Using default location.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out. Using default location.';
          break;
      }

      setState({
        location: null,
        loading: false,
        error: errorMessage,
      });
    };

    // Use fresh location data with more permissive settings
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: false, // Less strict for better compatibility
      timeout: 10000,
      maximumAge: 60000, // Allow 1 minute old location
    });
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const refreshLocation = useCallback(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return { ...state, refreshLocation };
}
