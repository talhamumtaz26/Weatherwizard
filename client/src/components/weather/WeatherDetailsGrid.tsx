import { motion } from "framer-motion";
import { ArrowUp, Droplets } from "lucide-react";
import type { CurrentWeather } from "@shared/schema";
import { Progress } from "@/components/ui/progress";

interface WeatherDetailsGridProps {
  currentWeather: CurrentWeather;
  temperatureSymbol?: string;
  speedSymbol?: string;
  distanceSymbol?: string;
}

export function WeatherDetailsGrid({ currentWeather, temperatureSymbol = "°F", speedSymbol = "mph", distanceSymbol = "mi" }: WeatherDetailsGridProps) {
  const getUVColor = (uvIndex: number) => {
    if (uvIndex <= 2) return "text-green-600 bg-green-100";
    if (uvIndex <= 5) return "text-yellow-600 bg-yellow-100";
    if (uvIndex <= 7) return "text-orange-600 bg-orange-100";
    if (uvIndex <= 10) return "text-red-600 bg-red-100";
    return "text-purple-600 bg-purple-100";
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return { text: "text-green-600", bg: "bg-green-100", color: "#10b981" };
    if (aqi <= 100) return { text: "text-yellow-600", bg: "bg-yellow-100", color: "#f59e0b" };
    if (aqi <= 150) return { text: "text-orange-600", bg: "bg-orange-100", color: "#f97316" };
    if (aqi <= 200) return { text: "text-red-600", bg: "bg-red-100", color: "#ef4444" };
    if (aqi <= 300) return { text: "text-purple-600", bg: "bg-purple-100", color: "#8b5cf6" };
    return { text: "text-red-800", bg: "bg-red-200", color: "#dc2626" };
  };

  const getAQIPosition = (aqi: number) => {
    if (aqi <= 50) return 10;
    if (aqi <= 100) return 30;
    if (aqi <= 150) return 50;
    if (aqi <= 200) return 70;
    if (aqi <= 300) return 85;
    return 95;
  };

  const getUVWidth = (uvIndex: number) => {
    return Math.min((uvIndex / 12) * 100, 100);
  };

  const getAQIWidth = (aqi: number) => {
    return Math.min((aqi / 300) * 100, 100);
  };

  const cards = [
    {
      title: "UV Index",
      icon: "fas fa-sun text-yellow-500",
      value: currentWeather.uvIndex,
      label: currentWeather.uvLevel,
      colorClass: getUVColor(currentWeather.uvIndex),
      progressWidth: getUVWidth(currentWeather.uvIndex),
      description: "Use sun protection between 10 AM - 4 PM",
    },
    {
      title: "Air Quality",
      icon: "fas fa-leaf text-green-500",
      value: currentWeather.aqi,
      label: currentWeather.aqiLevel,
      colorClass: `${getAQIColor(currentWeather.aqi).text} ${getAQIColor(currentWeather.aqi).bg}`,
      progressWidth: getAQIWidth(currentWeather.aqi),
      showAQIBar: true,
      aqiPosition: getAQIPosition(currentWeather.aqi),
      aqiColor: getAQIColor(currentWeather.aqi),
      description: "Air quality is satisfactory for most people",
    },
    {
      title: "Humidity",
      icon: "fas fa-tint text-blue-500",
      value: `${currentWeather.humidity}%`,
      label: "Comfortable",
      colorClass: "text-blue-600 bg-blue-100",
      progressWidth: currentWeather.humidity,
      description: `The dew point is ${Math.round(currentWeather.temperature - ((100 - currentWeather.humidity) / 5))}${temperatureSymbol} right now`,
    },
    {
      title: "Pressure",
      icon: "fas fa-thermometer-half text-purple-500",
      value: currentWeather.pressure,
      label: "in Hg",
      colorClass: "text-purple-600 bg-purple-100",
      showArrow: true,
      description: null,
    },
    {
      title: "Visibility",
      icon: "fas fa-eye text-indigo-500",
      value: currentWeather.visibility,
      label: distanceSymbol,
      colorClass: "text-indigo-600 bg-indigo-100",
      description: "Perfectly clear view",
    },
    {
      title: "Wind",
      icon: "fas fa-wind text-teal-500",
      value: currentWeather.windSpeed,
      label: speedSymbol,
      colorClass: "text-teal-600 bg-teal-100",
      windDirection: currentWeather.windDirection,
      description: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          className="bg-white rounded-2xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
            <i className={`${card.icon} text-xl`}></i>
          </div>
          
          <div className="mb-4">
            <div className="text-3xl font-bold text-gray-800">{card.value}</div>
            <div className={`text-sm font-medium ${card.colorClass.split(' ')[0]} rounded-full px-2 py-1 inline-block mt-1`}>
              {card.label}
            </div>
          </div>
          
          {card.progressWidth !== undefined && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${card.colorClass.split(' ')[0].replace('text-', 'bg-')}`}
                style={{ width: `${card.progressWidth}%` }}
              ></div>
            </div>
          )}
          
          {card.showArrow && (
            <div className="flex items-center text-sm text-gray-600">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span>Rising</span>
            </div>
          )}
          
          {card.windDirection && (
            <div className="flex items-center text-sm text-gray-600">
              <i className="fas fa-compass text-gray-400 mr-2"></i>
              <span>{card.windDirection}</span>
            </div>
          )}
          
          {card.description && (
            <p className="text-xs text-gray-600">{card.description}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
