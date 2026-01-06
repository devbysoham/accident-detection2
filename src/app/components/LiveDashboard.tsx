import React, { useState, useEffect, useRef } from 'react';
import { Activity, TrendingUp, Users, Clock, MapPin, Zap, Upload, Video, X, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { Button } from './ui/button';

interface AccidentData {
  id: string;
  timestamp: Date;
  location: { lat: number; lng: number; address: string };
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  status: 'detecting' | 'confirmed' | 'dispatched' | 'responding';
}

interface LiveDashboardProps {
  accidents: AccidentData[];
  isMonitoring: boolean;
}

export function LiveDashboard({ accidents, isMonitoring }: LiveDashboardProps) {
  const [camerasActive, setCamerasActive] = useState(12);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCamerasActive(12 + Math.floor(Math.random() * 3));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        setUploadedVideo(file);
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleRemoveVideo = () => {
    setUploadedVideo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const recentIncidents = accidents.slice(-5).reverse();
  const activeIncidents = accidents.filter(a => a.status !== 'responding').length;

  return (
    <div className="space-y-4">
      {/* Real-time Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-5 bg-gradient-to-br from-emerald-50 via-green-100 to-teal-50 border-2 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">Active Cameras</p>
                <p className="text-3xl font-bold text-emerald-900 display-text tracking-tight">{camerasActive}<span className="text-xl text-emerald-600">/15</span></p>
              </div>
              <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white p-3.5 rounded-xl shadow-lg">
                <Activity className="w-6 h-6" strokeWidth={2.5} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1.5 rounded-lg w-fit">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
              <span>All systems operational</span>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-5 bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-1">Active Incidents</p>
                <p className="text-3xl font-bold text-orange-900 display-text tracking-tight">{activeIncidents}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-600 to-amber-700 text-white p-3.5 rounded-xl shadow-lg">
                <MapPin className="w-6 h-6" strokeWidth={2.5} />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Video Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-5 bg-gradient-to-br from-violet-50 via-purple-100 to-fuchsia-50 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">Video Analysis</p>
                <p className="text-sm font-bold text-purple-900 display-text tracking-tight">
                  {uploadedVideo ? 'Ready' : 'Upload File'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-violet-700 text-white p-3.5 rounded-xl shadow-lg">
                <Video className="w-6 h-6" strokeWidth={2.5} />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              accept="video/*"
            />
            {!uploadedVideo ? (
              <Button
                onClick={handleUploadClick}
                disabled={isUploading}
                size="sm"
                className="w-full font-bold bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" strokeWidth={2.5} />
                    Select Video
                  </>
                )}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleRemoveVideo}
                  variant="outline"
                  size="sm"
                  className="flex-1 font-bold border-2 border-red-200 text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </Button>
                <Button
                  size="sm"
                  className="flex-1 font-bold bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                >
                  <Activity className="w-4 h-4" strokeWidth={2.5} />
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity Feed */}
      {recentIncidents.length > 0 && (
        <Card className="p-5 shadow-lg border-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 text-white p-2 rounded-lg">
              <Activity className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-lg display-text">Recent Activity</h3>
          </div>
          <div className="space-y-2">
            {recentIncidents.map((incident, idx) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all border border-gray-200"
              >
                <div className={`w-3 h-3 rounded-full shadow-lg ${incident.severity === 'critical' ? 'bg-red-500 shadow-red-500/50' :
                  incident.severity === 'high' ? 'bg-orange-500 shadow-orange-500/50' :
                    incident.severity === 'medium' ? 'bg-yellow-500 shadow-yellow-500/50' :
                      'bg-blue-500 shadow-blue-500/50'
                  } animate-pulse`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate font-mono">{incident.id}</p>
                  <p className="text-xs text-gray-600 truncate font-medium">{incident.location.address}</p>
                </div>
                <div className="text-xs text-gray-500 font-semibold font-mono bg-white px-2.5 py-1 rounded-lg border">
                  {incident.timestamp.toLocaleTimeString()}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}