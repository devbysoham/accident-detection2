import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Camera, MapPin, Clock, Video, Cpu, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface AccidentData {
  id: string;
  timestamp: Date;
  location: { lat: number; lng: number; address: string };
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  status: 'detecting' | 'confirmed' | 'dispatched' | 'responding';
}

interface AccidentDetectionProps {
  onAccidentDetected: (accident: AccidentData) => void;
}

export function AccidentDetection({ onAccidentDetected }: AccidentDetectionProps) {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [detectionStatus, setDetectionStatus] = useState<string>('Monitoring traffic...');
  const [processingLoad, setProcessingLoad] = useState(45);
  const [detectionBoxes, setDetectionBoxes] = useState<Array<{x: number, y: number, w: number, h: number, label: string}>>([]);
  const [isScanning, setIsScanning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate AI vision processing
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setCurrentFrame(prev => prev + 1);
      setProcessingLoad(40 + Math.random() * 20);
      
      // Randomly show detection boxes for vehicles
      if (Math.random() > 0.7) {
        setDetectionBoxes([
          { x: 20 + Math.random() * 30, y: 30 + Math.random() * 20, w: 15, h: 10, label: 'Vehicle' },
          { x: 50 + Math.random() * 20, y: 40 + Math.random() * 20, w: 12, h: 8, label: 'Vehicle' },
          { x: 70 + Math.random() * 15, y: 50 + Math.random() * 15, w: 14, h: 9, label: 'Vehicle' },
        ]);
      }
      
      // Simulate random accident detection (5% chance every 3 seconds)
      if (Math.random() < 0.05) {
        simulateAccidentDetection();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  // Scanning animation
  useEffect(() => {
    if (!isMonitoring) return;

    const scanInterval = setInterval(() => {
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 1500);
    }, 4000);

    return () => clearInterval(scanInterval);
  }, [isMonitoring]);

  const simulateAccidentDetection = () => {
    const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
    const locations = [
      { lat: 22.6208, lng: 88.4035, address: 'Shyambazar Five Point Crossing, North Kolkata' },
      { lat: 22.5958, lng: 88.3697, address: 'College Street, North Kolkata' },
      { lat: 22.6123, lng: 88.3898, address: 'Belgachia, North Kolkata' },
      { lat: 22.6345, lng: 88.4102, address: 'Dum Dum Metro Station, North Kolkata' },
      { lat: 22.5876, lng: 88.3632, address: 'Bagbazar, North Kolkata' },
    ];

    const accident: AccidentData = {
      id: `ACC-${Date.now()}`,
      timestamp: new Date(),
      location: locations[Math.floor(Math.random() * locations.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      confidence: 85 + Math.random() * 15,
      status: 'detecting'
    };

    setDetectionStatus('⚠️ COLLISION DETECTED! Analyzing...');
    setDetectionBoxes([
      { x: 45, y: 45, w: 20, h: 15, label: '⚠️ ACCIDENT' }
    ]);
    
    onAccidentDetected(accident);

    setTimeout(() => {
      setDetectionStatus('Monitoring traffic...');
      setDetectionBoxes([]);
    }, 3000);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-2 rounded-lg">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2>AI Vision Monitoring</h2>
            <p className="text-xs text-gray-500">Neural Network v2.4</p>
          </div>
        </div>
        <Button
          variant={isMonitoring ? "default" : "outline"}
          onClick={() => setIsMonitoring(!isMonitoring)}
          size="sm"
        >
          {isMonitoring ? 'Stop' : 'Start'}
        </Button>
      </div>

      {/* Video Feed Simulation */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-20" />
        
        {/* Road/Traffic Simulation */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-gray-900/40">
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Scanning line effect */}
        {isScanning && (
          <div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"
            style={{
              animation: 'scan 1.5s ease-in-out',
              height: '20%',
            }}
          />
        )}
        
        {/* Status Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <div className="bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-red-500/50">
            <div className="flex items-center gap-2 text-white text-sm">
              <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
              <span className="font-semibold">{isMonitoring ? 'LIVE' : 'OFFLINE'}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-blue-500/50 text-white text-xs">
              <div className="flex items-center gap-1">
                <Video className="w-3 h-3" />
                <span>1080p • 30fps</span>
              </div>
            </div>
            <div className="bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-green-500/50 text-white text-xs">
              Frame: {currentFrame}
            </div>
          </div>
        </div>

        {/* Detection boxes */}
        {detectionBoxes.map((box, idx) => (
          <div
            key={idx}
            className={`absolute border-2 ${box.label === '⚠️ ACCIDENT' ? 'border-red-500 bg-red-500/20 animate-pulse' : 'border-green-500 bg-green-500/10'}`}
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.w}%`,
              height: `${box.h}%`,
            }}
          >
            <div className={`absolute -top-6 left-0 px-2 py-0.5 text-xs font-bold rounded ${box.label === '⚠️ ACCIDENT' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
              {box.label}
            </div>
          </div>
        ))}

        {/* Center camera icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-white/30 text-center">
            <Camera className="w-20 h-20 mx-auto mb-2" />
            <p className="text-sm">Traffic Camera - Intersection A7</p>
          </div>
        </div>

        {/* Detection Status */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className={`backdrop-blur-md px-4 py-3 rounded-lg border ${
            detectionStatus.includes('DETECTED') || detectionStatus.includes('COLLISION')
              ? 'bg-red-500/90 border-red-300' 
              : 'bg-black/80 border-gray-700'
          }`}>
            <div className="flex items-center gap-3">
              <Cpu className={`w-5 h-5 text-white ${isMonitoring ? 'animate-pulse' : ''}`} />
              <p className="text-white font-medium flex-1">{detectionStatus}</p>
              {isMonitoring && (
                <div className="flex items-center gap-2 text-white text-xs">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>AI Active</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Processing Stats */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-600">AI Processing Load</span>
            <span className="font-semibold text-gray-900">{processingLoad.toFixed(1)}%</span>
          </div>
          <Progress value={processingLoad} className="h-2" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <div className="text-xl font-bold text-green-700">{currentFrame}</div>
          <div className="text-xs text-green-600">Frames</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="text-xl font-bold text-blue-700">98.5%</div>
          <div className="text-xs text-blue-600">Accuracy</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <div className="text-xl font-bold text-purple-700">30 FPS</div>
          <div className="text-xs text-purple-600">Speed</div>
        </div>
      </div>
    </Card>
  );
}