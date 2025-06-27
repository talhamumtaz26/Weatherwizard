import { useState, useEffect } from 'react';

export interface SavedCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  isDefault?: boolean;
}

export function useCities() {
  const [cities, setCities] = useState<SavedCity[]>(() => {
    const saved = localStorage.getItem('weather-cities');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentCity, setCurrentCity] = useState<SavedCity | null>(() => {
    const saved = localStorage.getItem('weather-current-city');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('weather-cities', JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    if (currentCity) {
      localStorage.setItem('weather-current-city', JSON.stringify(currentCity));
    }
  }, [currentCity]);

  const addCity = (city: Omit<SavedCity, 'id'>) => {
    const newCity: SavedCity = {
      ...city,
      id: Date.now().toString(),
    };
    setCities(prev => [...prev, newCity]);
    return newCity;
  };

  const removeCity = (id: string) => {
    setCities(prev => prev.filter(city => city.id !== id));
    if (currentCity?.id === id) {
      setCurrentCity(null);
    }
  };

  const selectCity = (city: SavedCity) => {
    setCurrentCity(city);
  };

  const setDefaultCity = (id: string) => {
    setCities(prev => prev.map(city => ({
      ...city,
      isDefault: city.id === id
    })));
  };

  return {
    cities,
    currentCity,
    addCity,
    removeCity,
    selectCity,
    setDefaultCity,
    setCurrentCity
  };
}