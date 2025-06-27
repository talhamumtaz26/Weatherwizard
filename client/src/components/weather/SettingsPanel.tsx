import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, MapPin, Thermometer, Plus, Wind, Eye, Moon, Sun, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { useCities, type SavedCity } from "@/hooks/useCities";

import type { TemperatureUnit, SpeedUnit, DistanceUnit } from "@/hooks/useTemperatureUnits";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  temperatureUnits: TemperatureUnit;
  speedUnits: SpeedUnit;
  distanceUnits: DistanceUnit;
  onTemperatureUnitsChange: (units: TemperatureUnit) => void;
  onSpeedUnitsChange: (units: SpeedUnit) => void;
  onDistanceUnitsChange: (units: DistanceUnit) => void;
  onLocationSelect: (lat: number, lon: number, city: string) => void;
}

export function SettingsPanel({ 
  isOpen, 
  onClose, 
  temperatureUnits,
  speedUnits,
  distanceUnits,
  onTemperatureUnitsChange,
  onSpeedUnitsChange,
  onDistanceUnitsChange,
  onLocationSelect 
}: SettingsPanelProps) {
  const [searchCity, setSearchCity] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { theme, toggleTheme, isDark } = useTheme();
  const { cities, addCity, removeCity, selectCity } = useCities();

  const searchLocationMutation = useMutation({
    mutationFn: async (city: string) => {
      const response = await apiRequest("GET", `/api/location?city=${encodeURIComponent(city)}`);
      return response.json();
    },
    onSuccess: (locationData) => {
      // Add city to saved cities list
      const newCity = addCity({
        name: locationData.city,
        lat: locationData.lat,
        lon: locationData.lon,
        country: locationData.country,
      });
      
      // Select the new city and load its weather
      selectCity(newCity);
      onLocationSelect(locationData.lat, locationData.lon, locationData.city);
      setSearchCity("");
      
      toast({
        title: "City Added",
        description: `${locationData.city} has been added to your saved cities`,
      });
    },
    onError: (error) => {
      console.error("Location search error:", error);
      toast({
        title: "Location Not Found",
        description: "Please check the city name and try again.",
        variant: "destructive",
      });
    },
  });

  const handleCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      searchLocationMutation.mutate(searchCity.trim());
    }
  };

  const handleTemperatureUnitsToggle = (checked: boolean) => {
    const newUnits = checked ? "celsius" : "fahrenheit";
    onTemperatureUnitsChange(newUnits);
    toast({
      title: "Units Changed",
      description: `Temperature units changed to ${newUnits === "celsius" ? "Celsius" : "Fahrenheit"}`,
    });
  };

  const handleSpeedUnitsToggle = (checked: boolean) => {
    const newUnits = checked ? "kmh" : "mph";
    onSpeedUnitsChange(newUnits);
    toast({
      title: "Units Changed",
      description: `Speed units changed to ${newUnits === "kmh" ? "km/h" : "mph"}`,
    });
  };

  const handleDistanceUnitsToggle = (checked: boolean) => {
    const newUnits = checked ? "km" : "miles";
    onDistanceUnitsChange(newUnits);
    toast({
      title: "Units Changed",
      description: `Distance units changed to ${newUnits === "km" ? "kilometers" : "miles"}`,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Dark Mode Toggle */}
              <Card className="p-4 mb-6 glass-morphism border border-white/30 dark:border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isDark ? <Moon className="h-5 w-5 text-purple-500" /> : <Sun className="h-5 w-5 text-yellow-500" />}
                    <div>
                      <Label className="text-sm font-medium text-white">Dark Mode</Label>
                      <p className="text-xs text-white/70">
                        Toggle between light and dark themes
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isDark}
                    onCheckedChange={toggleTheme}
                  />
                </div>
              </Card>

              {/* Multiple Cities */}
              <Card className="p-4 mb-6 glass-morphism border border-white/30 dark:border-white/20">
                <div className="mb-4">
                  <Label className="text-sm font-medium text-white flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Saved Cities
                  </Label>
                  <p className="text-xs text-white/70 mt-1">
                    Add cities for quick weather access
                  </p>
                </div>

                {/* City Search */}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (searchCity.trim()) {
                    searchLocationMutation.mutate(searchCity.trim());
                  }
                }} className="mb-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Search for a city..."
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={searchLocationMutation.isPending || !searchCity.trim()}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {searchLocationMutation.isPending ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </form>
                
                {cities.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {cities.map((city) => (
                      <div key={city.id} className="flex items-center justify-between p-2 bg-white/10 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{city.name}</p>
                          <p className="text-xs text-white/60">{city.country}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              selectCity(city);
                              onLocationSelect(city.lat, city.lon, city.name);
                            }}
                            className="text-white hover:bg-white/20"
                          >
                            Select
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeCity(city.id)}
                            className="text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Temperature Units */}
              <Card className="p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Thermometer className="h-5 w-5 text-blue-500" />
                    <div>
                      <Label className="text-sm font-medium">Temperature Units</Label>
                      <p className="text-xs text-gray-500">
                        Choose between Fahrenheit and Celsius
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${temperatureUnits === "fahrenheit" ? "font-medium" : "text-gray-400"}`}>
                      °F
                    </span>
                    <Switch
                      checked={temperatureUnits === "celsius"}
                      onCheckedChange={handleTemperatureUnitsToggle}
                    />
                    <span className={`text-sm ${temperatureUnits === "celsius" ? "font-medium" : "text-gray-400"}`}>
                      °C
                    </span>
                  </div>
                </div>
              </Card>

              {/* Speed Units */}
              <Card className="p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Wind className="h-5 w-5 text-green-500" />
                    <div>
                      <Label className="text-sm font-medium">Speed Units</Label>
                      <p className="text-xs text-gray-500">
                        Choose between mph and km/h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${speedUnits === "mph" ? "font-medium" : "text-gray-400"}`}>
                      mph
                    </span>
                    <Switch
                      checked={speedUnits === "kmh"}
                      onCheckedChange={handleSpeedUnitsToggle}
                    />
                    <span className={`text-sm ${speedUnits === "kmh" ? "font-medium" : "text-gray-400"}`}>
                      km/h
                    </span>
                  </div>
                </div>
              </Card>

              {/* Distance Units */}
              <Card className="p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-5 w-5 text-purple-500" />
                    <div>
                      <Label className="text-sm font-medium">Distance Units</Label>
                      <p className="text-xs text-gray-500">
                        Choose between miles and kilometers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${distanceUnits === "miles" ? "font-medium" : "text-gray-400"}`}>
                      mi
                    </span>
                    <Switch
                      checked={distanceUnits === "km"}
                      onCheckedChange={handleDistanceUnitsToggle}
                    />
                    <span className={`text-sm ${distanceUnits === "km" ? "font-medium" : "text-gray-400"}`}>
                      km
                    </span>
                  </div>
                </div>
              </Card>

              {/* Location Search */}
              <Card className="p-4 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-green-500" />
                    <div>
                      <Label className="text-sm font-medium">Change Location</Label>
                      <p className="text-xs text-gray-500">
                        Search for a city to get weather data
                      </p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleCitySearch} className="space-y-3">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Enter city name..."
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        className="pr-10"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!searchCity.trim() || searchLocationMutation.isPending}
                    >
                      {searchLocationMutation.isPending ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Search Location
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Plus className="h-5 w-5 text-purple-500" />
                    <Label className="text-sm font-medium">Quick Actions</Label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition((position) => {
                            onLocationSelect(
                              position.coords.latitude,
                              position.coords.longitude,
                              "Current Location"
                            );
                            toast({
                              title: "Location Updated",
                              description: "Using your current location",
                            });
                          });
                        }
                      }}
                      className="text-xs"
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      Current GPS
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Clear cache and refresh
                        queryClient.invalidateQueries({ queryKey: ['/api/weather'] });
                        toast({
                          title: "Data Refreshed",
                          description: "Weather data has been updated",
                        });
                      }}
                      className="text-xs"
                    >
                      <i className="fas fa-refresh h-3 w-3 mr-1"></i>
                      Refresh
                    </Button>
                  </div>
                </div>
              </Card>


            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}