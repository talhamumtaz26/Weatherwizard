import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, MapPin, Thermometer, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUnits: "fahrenheit" | "celsius";
  onUnitsChange: (units: "fahrenheit" | "celsius") => void;
  onLocationSelect: (lat: number, lon: number, city: string) => void;
}

export function SettingsPanel({ 
  isOpen, 
  onClose, 
  currentUnits, 
  onUnitsChange,
  onLocationSelect 
}: SettingsPanelProps) {
  const [searchCity, setSearchCity] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const searchLocationMutation = useMutation({
    mutationFn: async (city: string) => {
      const response = await apiRequest("GET", `/api/location?city=${encodeURIComponent(city)}`);
      return response.json();
    },
    onSuccess: (locationData) => {
      onLocationSelect(locationData.lat, locationData.lon, locationData.city);
      setSearchCity("");
      toast({
        title: "Location Updated",
        description: `Weather updated for ${locationData.city}, ${locationData.country}`,
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

  const handleUnitsToggle = (checked: boolean) => {
    const newUnits = checked ? "celsius" : "fahrenheit";
    onUnitsChange(newUnits);
    toast({
      title: "Units Changed",
      description: `Temperature units changed to ${newUnits === "celsius" ? "Celsius" : "Fahrenheit"}`,
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
                <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

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
                    <span className={`text-sm ${currentUnits === "fahrenheit" ? "font-medium" : "text-gray-400"}`}>
                      °F
                    </span>
                    <Switch
                      checked={currentUnits === "celsius"}
                      onCheckedChange={handleUnitsToggle}
                    />
                    <span className={`text-sm ${currentUnits === "celsius" ? "font-medium" : "text-gray-400"}`}>
                      °C
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

              {/* Popular Cities */}
              <div className="mt-6">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Popular Cities
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { name: "New York", country: "USA", lat: 40.7128, lon: -74.0060 },
                    { name: "London", country: "UK", lat: 51.5074, lon: -0.1278 },
                    { name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
                    { name: "Paris", country: "France", lat: 48.8566, lon: 2.3522 },
                    { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093 },
                  ].map((city) => (
                    <Button
                      key={city.name}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onLocationSelect(city.lat, city.lon, city.name);
                        toast({
                          title: "Location Updated",
                          description: `Weather updated for ${city.name}, ${city.country}`,
                        });
                      }}
                      className="justify-start text-left text-xs h-8"
                    >
                      <MapPin className="h-3 w-3 mr-2" />
                      {city.name}, {city.country}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}