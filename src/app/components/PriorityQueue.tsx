import React, { useState } from 'react';
import { ListOrdered, ChevronUp, ChevronDown, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { motion, Reorder } from 'motion/react';

interface AccidentData {
  id: string;
  timestamp: Date;
  location: { lat: number; lng: number; address: string };
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  status: 'detecting' | 'confirmed' | 'dispatched' | 'responding';
}

interface PriorityQueueProps {
  accidents: AccidentData[];
}

export function PriorityQueue({ accidents }: PriorityQueueProps) {
  const [queuedAccidents, setQueuedAccidents] = useState<AccidentData[]>(
    [...accidents].sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    })
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'from-red-600 to-red-700';
      case 'high': return 'from-orange-600 to-orange-700';
      case 'medium': return 'from-yellow-600 to-yellow-700';
      case 'low': return 'from-blue-600 to-blue-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge className="bg-red-600 font-bold">CRITICAL</Badge>;
      case 'high': return <Badge className="bg-orange-600 font-bold">HIGH</Badge>;
      case 'medium': return <Badge className="bg-yellow-600 font-bold">MEDIUM</Badge>;
      case 'low': return <Badge className="bg-blue-600 font-bold">LOW</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'detecting': return <Badge variant="outline" className="font-semibold">Detecting</Badge>;
      case 'confirmed': return <Badge className="bg-blue-600 font-semibold">Confirmed</Badge>;
      case 'dispatched': return <Badge className="bg-purple-600 font-semibold">Dispatched</Badge>;
      case 'responding': return <Badge className="bg-green-600 font-semibold">Responding</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPriorityScore = (accident: AccidentData) => {
    const severityScore = { critical: 100, high: 75, medium: 50, low: 25 };
    const ageMinutes = Math.floor((Date.now() - accident.timestamp.getTime()) / 60000);
    return severityScore[accident.severity] + ageMinutes;
  };

  return (
    <Card className="p-6 shadow-lg border-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-600 to-red-600 text-white p-3 rounded-xl shadow-lg">
            <ListOrdered className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="font-bold text-2xl display-text">Priority Queue</h2>
            <p className="text-sm text-gray-600 font-medium">Incidents sorted by urgency and severity</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-sm px-3 py-1.5 font-bold">
            {queuedAccidents.length} In Queue
          </Badge>
        </div>
      </div>

      {queuedAccidents.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ListOrdered className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">No Incidents in Queue</h3>
          <p className="text-sm text-gray-600">All incidents have been resolved</p>
        </div>
      ) : (
        <div className="space-y-3">
          <Reorder.Group axis="y" values={queuedAccidents} onReorder={setQueuedAccidents} className="space-y-3">
            {queuedAccidents.map((accident, index) => (
              <Reorder.Item key={accident.id} value={accident}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className={`p-4 border-l-4 bg-gradient-to-r from-white to-gray-50 hover:shadow-lg transition-all cursor-move ${
                    accident.severity === 'critical' ? 'border-l-red-600' :
                    accident.severity === 'high' ? 'border-l-orange-600' :
                    accident.severity === 'medium' ? 'border-l-yellow-600' :
                    'border-l-blue-600'
                  }`}>
                    <div className="flex items-start gap-4">
                      {/* Priority Number */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${getSeverityColor(accident.severity)} text-white flex items-center justify-center shadow-lg`}>
                        <span className="font-bold text-xl display-text">{index + 1}</span>
                      </div>

                      {/* Incident Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-lg font-mono">{accident.id}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mt-1">
                              <MapPin className="w-4 h-4" strokeWidth={2.5} />
                              <span className="truncate">{accident.location.address}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getSeverityBadge(accident.severity)}
                            {getStatusBadge(accident.status)}
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">
                            <Clock className="w-3.5 h-3.5" strokeWidth={2.5} />
                            <span>{accident.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">
                            <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2.5} />
                            <span>{accident.confidence.toFixed(1)}% confidence</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-lg">
                            <span className="font-mono">Priority: {getPriorityScore(accident)}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="text-xs font-semibold">
                            <ChevronUp className="w-3 h-3 mr-1" />
                            Increase Priority
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs font-semibold">
                            <ChevronDown className="w-3 h-3 mr-1" />
                            Decrease Priority
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {/* Queue Summary */}
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 display-text">
                  {queuedAccidents.filter(a => a.severity === 'critical').length}
                </div>
                <div className="text-xs font-semibold text-gray-700">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 display-text">
                  {queuedAccidents.filter(a => a.severity === 'high').length}
                </div>
                <div className="text-xs font-semibold text-gray-700">High</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 display-text">
                  {queuedAccidents.filter(a => a.severity === 'medium').length}
                </div>
                <div className="text-xs font-semibold text-gray-700">Medium</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 display-text">
                  {queuedAccidents.filter(a => a.severity === 'low').length}
                </div>
                <div className="text-xs font-semibold text-gray-700">Low</div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
}
