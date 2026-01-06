import React from 'react';
import { Clock, MapPin, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface AccidentData {
  id: string;
  timestamp: Date;
  location: { lat: number; lng: number; address: string };
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  status: 'detecting' | 'confirmed' | 'dispatched' | 'responding';
}

interface AccidentHistoryProps {
  accidents: AccidentData[];
  onSelectAccident: (accident: AccidentData) => void;
  selectedAccidentId?: string;
}

export function AccidentHistory({ accidents, onSelectAccident, selectedAccidentId }: AccidentHistoryProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'detecting': return <Loader className="w-4 h-4 animate-spin" />;
      case 'confirmed': return <AlertCircle className="w-4 h-4" />;
      case 'dispatched': return <Clock className="w-4 h-4" />;
      case 'responding': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detecting': return 'text-gray-600 bg-gray-100';
      case 'confirmed': return 'text-red-600 bg-red-100';
      case 'dispatched': return 'text-blue-600 bg-blue-100';
      case 'responding': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (accidents.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="mb-4">Incident History</h2>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No incidents detected</p>
          <p className="text-sm text-gray-400 mt-1">AI monitoring is active</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2>Incident History</h2>
        <Badge variant="outline">{accidents.length} Total</Badge>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-3">
          {accidents.slice().reverse().map((accident) => (
            <Card
              key={accident.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedAccidentId === accident.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => onSelectAccident(accident)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(accident.status)}`}>
                  {getStatusIcon(accident.status)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{accident.id}</span>
                        <Badge className={getSeverityColor(accident.severity)} size="sm">
                          {accident.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{accident.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(accident.confidence)}% confidence
                    </Badge>
                  </div>

                  <div className="flex items-start gap-1 text-sm text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{accident.location.address}</span>
                  </div>

                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(accident.status)}`}>
                    {getStatusIcon(accident.status)}
                    <span className="capitalize">{accident.status}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
