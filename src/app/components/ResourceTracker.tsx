import React, { useState, useEffect } from 'react';
import { Ambulance, Shield, Truck, Users, Battery, MapPin, Navigation } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface Resource {
  id: string;
  type: 'ambulance' | 'police' | 'fire';
  name: string;
  status: 'available' | 'dispatched' | 'busy' | 'maintenance';
  location: string;
  fuel: number;
  crew: number;
  maxCrew: number;
  lastResponse: string;
  distance?: number;
}

export function ResourceTracker() {
  const [resources, setResources] = useState<Resource[]>([
    { id: 'AMB-001', type: 'ambulance', name: 'Ambulance Unit 7', status: 'available', location: 'Station A', fuel: 85, crew: 4, maxCrew: 4, lastResponse: '15 min ago', distance: 1.2 },
    { id: 'AMB-002', type: 'ambulance', name: 'Rapid Response 3', status: 'dispatched', location: 'En route', fuel: 72, crew: 3, maxCrew: 4, lastResponse: 'Active', distance: 3.5 },
    { id: 'AMB-003', type: 'ambulance', name: 'Metro Unit 5', status: 'busy', location: 'City Hospital', fuel: 60, crew: 4, maxCrew: 4, lastResponse: '5 min ago', distance: 5.8 },
    { id: 'POL-001', type: 'police', name: 'Patrol Car 12', status: 'available', location: 'District 1 HQ', fuel: 90, crew: 2, maxCrew: 2, lastResponse: '30 min ago', distance: 0.8 },
    { id: 'POL-002', type: 'police', name: 'Unit 45', status: 'dispatched', location: 'En route', fuel: 78, crew: 2, maxCrew: 2, lastResponse: 'Active', distance: 2.1 },
    { id: 'POL-003', type: 'police', name: 'K9 Unit 7', status: 'available', location: 'Central Station', fuel: 82, crew: 3, maxCrew: 3, lastResponse: '45 min ago', distance: 1.5 },
    { id: 'FIRE-001', type: 'fire', name: 'Engine 23', status: 'available', location: 'Fire Station 2', fuel: 88, crew: 6, maxCrew: 6, lastResponse: '2 hours ago', distance: 2.3 },
    { id: 'FIRE-002', type: 'fire', name: 'Ladder 14', status: 'maintenance', location: 'Maintenance Bay', fuel: 45, crew: 0, maxCrew: 4, lastResponse: 'N/A', distance: 0 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setResources(prev => prev.map(resource => ({
        ...resource,
        fuel: resource.status === 'dispatched' ? Math.max(20, resource.fuel - Math.random() * 2) : resource.fuel,
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'ambulance': return <Ambulance className="w-5 h-5" strokeWidth={2.5} />;
      case 'police': return <Shield className="w-5 h-5" strokeWidth={2.5} />;
      case 'fire': return <Truck className="w-5 h-5" strokeWidth={2.5} />;
      default: return <Users className="w-5 h-5" strokeWidth={2.5} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ambulance': return 'from-red-600 to-orange-600';
      case 'police': return 'from-blue-600 to-sky-600';
      case 'fire': return 'from-orange-600 to-red-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available': return <Badge className="bg-green-600 font-bold">Available</Badge>;
      case 'dispatched': return <Badge className="bg-purple-600 font-bold animate-pulse">Dispatched</Badge>;
      case 'busy': return <Badge className="bg-yellow-600 font-bold">Busy</Badge>;
      case 'maintenance': return <Badge variant="secondary" className="font-bold">Maintenance</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  const getFuelColor = (fuel: number) => {
    if (fuel > 70) return 'bg-green-600';
    if (fuel > 40) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const availableCount = resources.filter(r => r.status === 'available').length;
  const dispatchedCount = resources.filter(r => r.status === 'dispatched').length;
  const busyCount = resources.filter(r => r.status === 'busy').length;

  return (
    <Card className="p-6 shadow-lg border-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-teal-600 to-cyan-600 text-white p-3 rounded-xl shadow-lg">
            <Navigation className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="font-bold text-2xl display-text">Resource Tracker</h2>
            <p className="text-sm text-gray-600 font-medium">Real-time status of all emergency units</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-green-600 mb-1">Available</p>
              <p className="text-3xl font-bold text-green-900 display-text">{availableCount}</p>
            </div>
            <div className="bg-green-600 text-white p-3 rounded-xl">
              <Users className="w-6 h-6" strokeWidth={2.5} />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-purple-600 mb-1">Dispatched</p>
              <p className="text-3xl font-bold text-purple-900 display-text">{dispatchedCount}</p>
            </div>
            <div className="bg-purple-600 text-white p-3 rounded-xl">
              <Navigation className="w-6 h-6" strokeWidth={2.5} />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-yellow-600 mb-1">Busy</p>
              <p className="text-3xl font-bold text-yellow-900 display-text">{busyCount}</p>
            </div>
            <div className="bg-yellow-600 text-white p-3 rounded-xl">
              <Battery className="w-6 h-6" strokeWidth={2.5} />
            </div>
          </div>
        </Card>
      </div>

      {/* Resource List */}
      <div className="space-y-3">
        {resources.map((resource) => (
          <Card key={resource.id} className={`p-4 hover:shadow-lg transition-all ${resource.status === 'dispatched' ? 'ring-2 ring-purple-500' : ''}`}>
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${getTypeColor(resource.type)} text-white flex items-center justify-center shadow-lg`}>
                {getResourceIcon(resource.type)}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-lg">{resource.name}</h4>
                    <p className="text-sm text-gray-600 font-medium font-mono">{resource.id}</p>
                  </div>
                  {getStatusBadge(resource.status)}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" strokeWidth={2.5} />
                    <span className="font-medium text-gray-700 truncate">{resource.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500" strokeWidth={2.5} />
                    <span className="font-medium text-gray-700">{resource.crew}/{resource.maxCrew} crew</span>
                  </div>
                  {resource.distance !== undefined && resource.distance > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation className="w-4 h-4 text-gray-500" strokeWidth={2.5} />
                      <span className="font-medium text-gray-700">{resource.distance} mi</span>
                    </div>
                  )}
                  <div className="text-sm font-medium text-gray-600">
                    Last: {resource.lastResponse}
                  </div>
                </div>

                {/* Fuel Level */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <div className="flex items-center gap-1.5">
                      <Battery className="w-3.5 h-3.5 text-gray-600" strokeWidth={2.5} />
                      <span className="text-gray-700">Fuel Level</span>
                    </div>
                    <span className={`${resource.fuel < 40 ? 'text-red-600' : 'text-gray-700'}`}>
                      {resource.fuel.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={resource.fuel} className={`h-2 ${getFuelColor(resource.fuel)}`} />
                  {resource.fuel < 40 && (
                    <p className="text-xs text-red-600 font-bold mt-1">⚠️ Low fuel - refueling recommended</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
