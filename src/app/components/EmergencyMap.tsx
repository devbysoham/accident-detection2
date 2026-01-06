import React, { useState, useEffect } from 'react';
import { MapPin, Ambulance, Shield, Hospital, Navigation, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';

interface AccidentData {
  id: string;
  timestamp: Date;
  location: { lat: number; lng: number; address: string };
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  status: 'detecting' | 'confirmed' | 'dispatched' | 'responding';
}

interface MapMarker {
  id: string;
  type: 'accident' | 'ambulance' | 'police' | 'hospital';
  lat: number;
  lng: number;
  label: string;
  status?: string;
}

interface EmergencyMapProps {
  accident: AccidentData | null;
}

// Mock nearby hospitals data - no external API needed
const getNearbyHospitals = (lat: number, lng: number) => {
  return [
    {
      id: 'hospital-1',
      type: 'hospital' as const,
      lat: lat + 0.03,
      lng: lng + 0.01,
      label: 'Central Medical Center',
      status: 'standby',
      distance: '2.1 km'
    },
    {
      id: 'hospital-2',
      type: 'hospital' as const,
      lat: lat - 0.025,
      lng: lng + 0.035,
      label: 'City General Hospital',
      status: 'standby',
      distance: '3.4 km'
    },
    {
      id: 'hospital-3',
      type: 'hospital' as const,
      lat: lat + 0.015,
      lng: lng - 0.04,
      label: 'Emergency Care Center',
      status: 'standby',
      distance: '2.8 km'
    }
  ];
};

export function EmergencyMap({ accident }: EmergencyMapProps) {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [ambulancePosition, setAmbulancePosition] = useState({ lat: 0, lng: 0 });
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (accident) {
        // Get nearby hospitals using mock data
        const nearbyHospitals = getNearbyHospitals(
          accident.location.lat,
          accident.location.lng
        );

        const newMarkers: MapMarker[] = [
          {
            id: 'accident',
            type: 'accident',
            lat: accident.location.lat,
            lng: accident.location.lng,
            label: 'Accident Scene',
            status: accident.status
          },
          {
            id: 'ambulance',
            type: 'ambulance',
            lat: accident.location.lat - 0.02,
            lng: accident.location.lng - 0.02,
            label: 'Ambulance Unit 7',
            status: 'en-route'
          },
          {
            id: 'police',
            type: 'police',
            lat: accident.location.lat - 0.015,
            lng: accident.location.lng + 0.015,
            label: 'Police Unit 3',
            status: 'en-route'
          },
          // Add the closest hospital
          ...nearbyHospitals.slice(0, 1)
        ];

        setMarkers(newMarkers);
        setAmbulancePosition({
          lat: accident.location.lat - 0.02,
          lng: accident.location.lng - 0.02
        });
        setMapError(null);
      }
    } catch (error) {
      console.error('Error setting up map markers:', error);
      setMapError('Failed to load map markers');
    }
  }, [accident]);

  // Animate ambulance moving toward accident
  useEffect(() => {
    if (!accident || markers.length === 0) return;

    const interval = setInterval(() => {
      setAmbulancePosition(prev => {
        const targetLat = accident.location.lat;
        const targetLng = accident.location.lng;

        const diffLat = targetLat - prev.lat;
        const diffLng = targetLng - prev.lng;

        // Check if ambulance is close enough to stop
        const distance = Math.sqrt(diffLat * diffLat + diffLng * diffLng);
        if (distance < 0.001) {
          return prev; // Stop moving
        }

        // Move 5% closer each step
        return {
          lat: prev.lat + diffLat * 0.05,
          lng: prev.lng + diffLng * 0.05
        };
      });
    }, 200);

    return () => clearInterval(interval);
  }, [accident, markers]);

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'accident':
        return <MapPin className="w-6 h-6 text-red-600" fill="red" />;
      case 'ambulance':
        return <Ambulance className="w-6 h-6 text-red-600" />;
      case 'police':
        return <Shield className="w-6 h-6 text-blue-600" />;
      case 'hospital':
        return <Hospital className="w-6 h-6 text-green-600" />;
      default:
        return null;
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'accident': return 'bg-red-100 border-red-600';
      case 'ambulance': return 'bg-red-50 border-red-500';
      case 'police': return 'bg-blue-50 border-blue-500';
      case 'hospital': return 'bg-green-50 border-green-500';
      default: return 'bg-gray-50 border-gray-500';
    }
  };

  if (!accident) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No location to display</p>
          <p className="text-xs text-gray-400 mt-2">Waiting for accident detection...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Live Location Tracking</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Real-time</span>
        </div>
      </div>

      {mapError && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">{mapError}</p>
        </div>
      )}

      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden border-2 border-gray-200" style={{ height: '900px' }}>
        {/* Grid background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />

        {/* Street names overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] text-xs text-gray-600 bg-white/90 px-2 py-1 rounded shadow-sm font-medium">
            Bidhan Sarani
          </div>
          <div className="absolute top-[50%] left-[30%] text-xs text-gray-600 bg-white/90 px-2 py-1 rounded shadow-sm transform -rotate-90 font-medium">
            College Street
          </div>
          <div className="absolute bottom-[30%] right-[20%] text-xs text-gray-600 bg-white/90 px-2 py-1 rounded shadow-sm font-medium">
            Belgachia Road
          </div>
          <div className="absolute top-[35%] right-[15%] text-xs text-gray-600 bg-white/90 px-2 py-1 rounded shadow-sm font-medium">
            Park Street
          </div>
        </div>

        {/* Route line from ambulance to accident */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line
            x1={`${((ambulancePosition.lng - accident.location.lng + 0.05) / 0.1) * 100}%`}
            y1={`${((ambulancePosition.lat - accident.location.lat + 0.05) / 0.1) * 100}%`}
            x2="50%"
            y2="50%"
            stroke="#EF4444"
            strokeWidth="3"
            strokeDasharray="8,4"
            opacity="0.7"
          />
        </svg>

        {/* Markers */}
        {markers.map((marker) => {
          const posX = marker.id === 'ambulance'
            ? ((ambulancePosition.lng - accident.location.lng + 0.05) / 0.1) * 100
            : ((marker.lng - accident.location.lng + 0.05) / 0.1) * 100;
          const posY = marker.id === 'ambulance'
            ? ((ambulancePosition.lat - accident.location.lat + 0.05) / 0.1) * 100
            : ((marker.lat - accident.location.lat + 0.05) / 0.1) * 100;

          return (
            <div
              key={marker.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
              style={{
                left: `${posX}%`,
                top: `${posY}%`
              }}
            >
              {/* Marker pin */}
              <div className={`relative ${marker.type === 'accident' ? 'z-20' : 'z-10'}`}>
                {/* Pulse animation for accident */}
                {marker.type === 'accident' && (
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                )}

                {/* Marker icon */}
                <div className={`relative border-2 rounded-full p-2 ${getMarkerColor(marker.type)} shadow-lg backdrop-blur-sm`}>
                  {getMarkerIcon(marker.type)}
                </div>

                {/* Label */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap">
                  <div className="bg-white px-3 py-1 rounded-full shadow-md border text-xs font-semibold">
                    {marker.label}
                  </div>
                  {marker.status && marker.id === 'ambulance' && (
                    <div className="text-center mt-1">
                      <div className="inline-flex items-center gap-1 bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
                        <Navigation className="w-3 h-3" />
                        <span>En Route</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Map controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button
            className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
            aria-label="Zoom in"
          >
            <span className="text-xl font-bold">+</span>
          </button>
          <button
            className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
            aria-label="Zoom out"
          >
            <span className="text-xl font-bold">−</span>
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs space-y-2 border border-gray-200">
          <div className="font-bold mb-2 text-gray-900">Legend</div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-600" fill="red" />
            <span className="text-gray-700">Accident Scene</span>
          </div>
          <div className="flex items-center gap-2">
            <Ambulance className="w-4 h-4 text-red-600" />
            <span className="text-gray-700">Ambulance</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700">Police</span>
          </div>
          <div className="flex items-center gap-2">
            <Hospital className="w-4 h-4 text-green-600" />
            <span className="text-gray-700">Hospital</span>
          </div>
        </div>
      </div>

      {/* Location Info */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-blue-900">{accident.location.address}</p>
            <p className="text-sm text-blue-700 mt-1">
              Coordinates: {accident.location.lat.toFixed(4)}, {accident.location.lng.toFixed(4)}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="px-2 py-1 bg-blue-100 rounded text-xs font-medium text-blue-800">
                ETA: 4 mins
              </div>
              <div className="px-2 py-1 bg-green-100 rounded text-xs font-medium text-green-800">
                Hospital: 2.1 km
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}