import { useState, useEffect } from 'react';

interface GeolocationState {
  location: { lat: number; lon: number } | null;
  loading: boolean;
  error: Error | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: null,
        loading: false,
        error: new Error('Geolocation is not supported by this browser'),
      });
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
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
      let errorMessage = 'Unable to retrieve location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location services and refresh the page.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable. Please check your internet connection.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out. Please try again.';
          break;
      }

      setState({
        location: null,
        loading: false,
        error: new Error(errorMessage),
      });
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    });
  }, []);

  return state;
}
