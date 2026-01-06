import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets, AlertTriangle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface WeatherData {
  condition: 'clear' | 'rain' | 'snow' | 'cloudy' | 'storm';
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  alert?: string;
}

interface WeatherAlertProps {
  location?: { lat: number; lng: number; address: string };
}

export function WeatherAlert({ location }: WeatherAlertProps) {
  const [weather, setWeather] = useState<WeatherData>({
    condition: 'clear',
    temperature: 72,
    humidity: 45,
    windSpeed: 8,
    visibility: 10,
  });

  useEffect(() => {
    // Simulate weather data updates
    const weatherConditions: Array<'clear' | 'rain' | 'snow' | 'cloudy' | 'storm'> = ['clear', 'rain', 'cloudy', 'storm'];
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    const alerts: Record<string, string> = {
      rain: 'Wet roads - Increased accident risk',
      snow: 'Icy conditions - Drive carefully',
      storm: 'Severe weather warning - High risk',
    };

    setWeather({
      condition: randomCondition,
      temperature: 50 + Math.random() * 40,
      humidity: 30 + Math.random() * 60,
      windSpeed: 5 + Math.random() * 20,
      visibility: randomCondition === 'storm' ? 2 + Math.random() * 3 : 8 + Math.random() * 2,
      alert: alerts[randomCondition],
    });
  }, [location]);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'clear': return <Sun className="w-6 h-6" strokeWidth={2.5} />;
      case 'rain': return <CloudRain className="w-6 h-6" strokeWidth={2.5} />;
      case 'snow': return <CloudSnow className="w-6 h-6" strokeWidth={2.5} />;
      case 'storm': return <CloudRain className="w-6 h-6" strokeWidth={2.5} />;
      default: return <Cloud className="w-6 h-6" strokeWidth={2.5} />;
    }
  };

  const getWeatherColor = () => {
    switch (weather.condition) {
      case 'clear': return 'from-yellow-500 to-orange-500';
      case 'rain': return 'from-blue-500 to-cyan-500';
      case 'snow': return 'from-blue-300 to-cyan-300';
      case 'storm': return 'from-gray-700 to-gray-800';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRiskLevel = () => {
    if (weather.condition === 'storm' || weather.visibility < 5) return 'high';
    if (weather.condition === 'rain' || weather.condition === 'snow') return 'medium';
    return 'low';
  };

  const getRiskBadge = () => {
    const risk = getRiskLevel();
    switch (risk) {
      case 'high': return <Badge className="bg-red-600 font-bold">HIGH RISK</Badge>;
      case 'medium': return <Badge className="bg-yellow-600 font-bold">MODERATE RISK</Badge>;
      default: return <Badge className="bg-green-600 font-bold">LOW RISK</Badge>;
    }
  };

  return (
    <Card className="p-5 shadow-lg border-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`bg-gradient-to-br ${getWeatherColor()} text-white p-3 rounded-xl shadow-lg`}>
            {getWeatherIcon()}
          </div>
          <div>
            <h3 className="font-bold text-lg display-text">Weather Conditions</h3>
            <p className="text-xs text-gray-600 font-medium">
              {location?.address || 'Current Location'}
            </p>
          </div>
        </div>
        {getRiskBadge()}
      </div>

      {/* Weather Alert */}
      {weather.alert && (
        <Card className="p-3 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" strokeWidth={2.5} />
            <p className="text-sm font-bold text-orange-900">{weather.alert}</p>
          </div>
        </Card>
      )}

      {/* Weather Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-1">
            <Sun className="w-4 h-4 text-orange-600" strokeWidth={2.5} />
            <span className="text-xs font-bold text-orange-700 uppercase">Temperature</span>
          </div>
          <p className="text-2xl font-bold text-orange-900 display-text">{weather.temperature.toFixed(0)}°F</p>
        </div>

        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
            <span className="text-xs font-bold text-blue-700 uppercase">Humidity</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 display-text">{weather.humidity.toFixed(0)}%</p>
        </div>

        <div className="p-3 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-4 h-4 text-cyan-600" strokeWidth={2.5} />
            <span className="text-xs font-bold text-cyan-700 uppercase">Wind Speed</span>
          </div>
          <p className="text-2xl font-bold text-cyan-900 display-text">{weather.windSpeed.toFixed(0)} mph</p>
        </div>

        <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-1">
            <Cloud className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
            <span className="text-xs font-bold text-purple-700 uppercase">Visibility</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 display-text">{weather.visibility.toFixed(1)} mi</p>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
        <h4 className="font-bold text-sm mb-2 text-gray-900">Impact on Response</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Response Time Impact:</span>
            <span className={`font-bold ${getRiskLevel() === 'high' ? 'text-red-600' : getRiskLevel() === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
              {getRiskLevel() === 'high' ? '+25%' : getRiskLevel() === 'medium' ? '+10%' : 'Normal'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Road Conditions:</span>
            <span className="font-bold text-gray-900 capitalize">{weather.condition}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
