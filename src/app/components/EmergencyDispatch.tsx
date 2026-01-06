import React, { useState, useEffect } from 'react';
import { Ambulance, Shield, Hospital, MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface EmergencyService {
  id: string;
  name: string;
  type: 'ambulance' | 'police' | 'hospital';
  distance: number;
  eta: number;
  status: 'idle' | 'dispatched' | 'en-route' | 'arrived';
  contact: string;
  address: string;
  icon: React.ReactNode;
}

interface AccidentData {
  id: string;
  timestamp: Date;
  location: { lat: number; lng: number; address: string };
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  status: 'detecting' | 'confirmed' | 'dispatched' | 'responding';
}

interface EmergencyDispatchProps {
  accident: AccidentData | null;
}

export function EmergencyDispatch({ accident }: EmergencyDispatchProps) {
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    if (accident && accident.status === 'confirmed') {
      // Find nearest emergency services
      const nearestServices = findNearestServices(accident);
      setServices(nearestServices);
      
      // Auto-dispatch based on severity
      if (accident.severity === 'critical' || accident.severity === 'high') {
        setTimeout(() => dispatchAllServices(), 1000);
      }
    }
  }, [accident]);

  // Update ETA countdown
  useEffect(() => {
    if (services.some(s => s.status === 'en-route')) {
      const interval = setInterval(() => {
        setServices(prev => prev.map(service => {
          if (service.status === 'en-route' && service.eta > 0) {
            const newEta = service.eta - 0.1;
            if (newEta <= 0) {
              return { ...service, eta: 0, status: 'arrived' as const };
            }
            return { ...service, eta: newEta };
          }
          return service;
        }));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [services]);

  const findNearestServices = (accident: AccidentData): EmergencyService[] => {
    // Mock data for nearest services
    return [
      {
        id: 'AMB-001',
        name: 'North Kolkata Ambulance Unit 7',
        type: 'ambulance',
        distance: 1.2 + Math.random() * 2,
        eta: 3 + Math.random() * 4,
        status: 'idle',
        contact: '102',
        address: 'Shyambazar Street',
        icon: <Ambulance className="w-5 h-5" />
      },
      {
        id: 'POL-001',
        name: 'Shyambazar Police Station',
        type: 'police',
        distance: 0.8 + Math.random() * 1.5,
        eta: 2 + Math.random() * 3,
        status: 'idle',
        contact: '100',
        address: 'Bidhan Sarani',
        icon: <Shield className="w-5 h-5" />
      },
      {
        id: 'HOS-001',
        name: 'R.G. Kar Medical College',
        type: 'hospital',
        distance: 2.5 + Math.random() * 3,
        eta: 10 + Math.random() * 5,
        status: 'idle',
        contact: '+91 33 2555 5000',
        address: 'Belgachia Road',
        icon: <Hospital className="w-5 h-5" />
      }
    ];
  };

  const dispatchService = (serviceId: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, status: 'dispatched' as const }
        : service
    ));

    // Simulate dispatch delay then en-route
    setTimeout(() => {
      setServices(prev => prev.map(service => 
        service.id === serviceId 
          ? { ...service, status: 'en-route' as const }
          : service
      ));
    }, 1000);
  };

  const dispatchAllServices = () => {
    services.forEach(service => {
      if (service.status === 'idle') {
        dispatchService(service.id);
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'arrived': return 'bg-green-500';
      case 'en-route': return 'bg-blue-500';
      case 'dispatched': return 'bg-orange-500';
      case 'idle': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ambulance': return 'text-red-600 bg-red-50';
      case 'police': return 'text-blue-600 bg-blue-50';
      case 'hospital': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!accident) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <Shield className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No active emergency</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2>Emergency Dispatch</h2>
        {services.length > 0 && (
          <Button 
            onClick={dispatchAllServices}
            disabled={services.every(s => s.status !== 'idle')}
            size="sm"
          >
            Dispatch All
          </Button>
        )}
      </div>

      {/* Accident Info */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="bg-red-600 text-white p-2 rounded-lg">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">Accident Location</span>
              <Badge className={`${getSeverityColor(accident.severity)}`}>
                {accident.severity.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-gray-700">{accident.location.address}</p>
            <p className="text-xs text-gray-500 mt-1">
              {accident.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Services */}
      <div className="space-y-3">
        {services.map((service) => (
          <Card key={service.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className={`p-3 rounded-lg ${getTypeColor(service.type)}`}>
                {service.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.address}</p>
                  </div>
                  <Badge className={getStatusColor(service.status)}>
                    {service.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Navigation className="w-4 h-4" />
                    <span>{service.distance.toFixed(1)} mi</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{Math.ceil(service.eta)} min</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs">{service.contact}</span>
                  </div>
                </div>

                {/* ETA Progress Bar */}
                {service.status === 'en-route' && (
                  <div className="space-y-1">
                    <Progress 
                      value={100 - (service.eta / (service.eta + 3)) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-gray-600">
                      Arriving in {Math.ceil(service.eta)} minutes...
                    </p>
                  </div>
                )}

                {service.status === 'arrived' && (
                  <div className="bg-green-50 border border-green-200 rounded px-3 py-2">
                    <p className="text-sm text-green-700 font-medium">✓ Arrived at scene</p>
                  </div>
                )}

                {service.status === 'idle' && (
                  <Button
                    onClick={() => dispatchService(service.id)}
                    size="sm"
                    className="w-full"
                  >
                    Dispatch {service.type === 'ambulance' ? 'Ambulance' : service.type === 'police' ? 'Police' : 'Notify Hospital'}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );

  function getSeverityColor(severity: string) {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  }
}