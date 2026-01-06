import React, { useState, useEffect } from 'react';
import { Camera, Maximize2, AlertTriangle, CheckCircle, Radio } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'offline' | 'alert';
  fps: number;
  resolution: string;
}

export function CameraGrid() {
  const [cameras, setCameras] = useState<CameraFeed[]>([
    { id: 'CAM-001', name: 'Shyambazar Five Point Crossing', location: 'North Kolkata', status: 'active', fps: 30, resolution: '1080p' },
    { id: 'CAM-002', name: 'College Street Junction', location: 'North Kolkata', status: 'active', fps: 30, resolution: '1080p' },
    { id: 'CAM-003', name: 'Bagbazar Street', location: 'North Kolkata', status: 'alert', fps: 30, resolution: '1080p' },
    { id: 'CAM-004', name: 'Belgachia Road', location: 'North Kolkata', status: 'active', fps: 30, resolution: '720p' },
    { id: 'CAM-005', name: 'Bidhan Sarani', location: 'North Kolkata', status: 'offline', fps: 0, resolution: '1080p' },
    { id: 'CAM-006', name: 'Dum Dum Metro Station', location: 'Dum Dum', status: 'active', fps: 30, resolution: '4K' },
    { id: 'CAM-007', name: 'Jessore Road', location: 'North Kolkata', status: 'active', fps: 30, resolution: '1080p' },
    { id: 'CAM-008', name: 'Baranagar Crossing', location: 'Baranagar', status: 'active', fps: 30, resolution: '1080p' },
  ]);

  const [detectionBoxes, setDetectionBoxes] = useState<Record<string, Array<{x: number, y: number}>>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add detection boxes to cameras
      const newBoxes: Record<string, Array<{x: number, y: number}>> = {};
      cameras.forEach(camera => {
        if (camera.status === 'active' && Math.random() > 0.6) {
          newBoxes[camera.id] = Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => ({
            x: Math.random() * 80 + 10,
            y: Math.random() * 70 + 15,
          }));
        }
      });
      setDetectionBoxes(newBoxes);
    }, 2000);

    return () => clearInterval(interval);
  }, [cameras]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'alert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-600">Active</Badge>;
      case 'offline': return <Badge variant="secondary">Offline</Badge>;
      case 'alert': return <Badge className="bg-red-600 animate-pulse">Alert</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className="p-6 shadow-lg border-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white p-3 rounded-xl shadow-lg">
            <Camera className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="font-bold text-2xl display-text">Camera Grid</h2>
            <p className="text-sm text-gray-600 font-medium">Live feeds from all monitoring stations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-100 border-2 border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-green-700">{cameras.filter(c => c.status === 'active').length} Active</span>
          </div>
          {cameras.some(c => c.status === 'alert') && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-100 border-2 border-red-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-600" strokeWidth={2.5} />
              <span className="text-sm font-bold text-red-700">{cameras.filter(c => c.status === 'alert').length} Alert</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cameras.map((camera) => (
          <Card key={camera.id} className="overflow-hidden border-2 hover:shadow-xl transition-all duration-300">
            {/* Camera Feed */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 aspect-video">
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `
                  linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px'
              }} />

              {/* Status indicator */}
              <div className="absolute top-2 left-2 z-10">
                <div className={`flex items-center gap-1.5 px-2 py-1 bg-black/80 rounded-lg border ${camera.status === 'alert' ? 'border-red-500' : 'border-gray-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(camera.status)} ${camera.status === 'active' ? 'animate-pulse' : ''}`} />
                  <span className="text-white text-xs font-bold font-mono">{camera.status.toUpperCase()}</span>
                </div>
              </div>

              {/* Camera ID */}
              <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-black/80 rounded-lg border border-gray-600">
                <span className="text-white text-xs font-bold font-mono">{camera.id}</span>
              </div>

              {/* Detection boxes */}
              {detectionBoxes[camera.id]?.map((box, idx) => (
                <div
                  key={idx}
                  className="absolute border-2 border-green-500 bg-green-500/10"
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: '15%',
                    height: '20%',
                  }}
                >
                  <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-green-500 text-white text-xs font-bold rounded">
                    Vehicle
                  </div>
                </div>
              ))}

              {/* Camera icon when offline */}
              {camera.status === 'offline' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-gray-600 text-center">
                    <Camera className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-xs font-bold">OFFLINE</p>
                  </div>
                </div>
              )}

              {/* Alert overlay */}
              {camera.status === 'alert' && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center animate-pulse">
                  <div className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    INCIDENT DETECTED
                  </div>
                </div>
              )}

              {/* Stats overlay */}
              <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                <div className="px-2 py-1 bg-black/80 rounded-lg border border-gray-600">
                  <span className="text-white text-xs font-bold font-mono">{camera.resolution}</span>
                </div>
                <div className="px-2 py-1 bg-black/80 rounded-lg border border-gray-600">
                  <span className="text-white text-xs font-bold font-mono">{camera.fps} FPS</span>
                </div>
              </div>
            </div>

            {/* Camera Info */}
            <div className="p-3 bg-white">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{camera.name}</h4>
                  <p className="text-xs text-gray-600 font-medium">{camera.location}</p>
                </div>
                {getStatusBadge(camera.status)}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs font-semibold"
              >
                <Maximize2 className="w-3 h-3 mr-1.5" />
                Expand View
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}