import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AccidentData {
  id: string;
  timestamp: Date;
  location: { lat: number; lng: number; address: string };
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  status: 'detecting' | 'confirmed' | 'dispatched' | 'responding';
}

interface AnalyticsDashboardProps {
  accidents: AccidentData[];
}

export function AnalyticsDashboard({ accidents }: AnalyticsDashboardProps) {
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [severityData, setSeverityData] = useState<any[]>([]);
  const [hourlyData, setHourlyData] = useState<any[]>([]);

  useEffect(() => {
    // Generate time series data
    const last24Hours = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date().getHours() - (23 - i);
      return {
        hour: `${(hour + 24) % 24}:00`,
        incidents: Math.floor(Math.random() * 5),
        responses: Math.floor(Math.random() * 4),
      };
    });
    setTimeSeriesData(last24Hours);

    // Generate severity distribution
    const severityCounts = {
      critical: accidents.filter(a => a.severity === 'critical').length,
      high: accidents.filter(a => a.severity === 'high').length,
      medium: accidents.filter(a => a.severity === 'medium').length,
      low: accidents.filter(a => a.severity === 'low').length,
    };
    
    setSeverityData([
      { name: 'Critical', value: severityCounts.critical || 2, color: '#dc2626' },
      { name: 'High', value: severityCounts.high || 3, color: '#ea580c' },
      { name: 'Medium', value: severityCounts.medium || 5, color: '#f59e0b' },
      { name: 'Low', value: severityCounts.low || 4, color: '#3b82f6' },
    ]);

    // Generate hourly response data
    const hourlyStats = Array.from({ length: 12 }, (_, i) => ({
      time: `${i * 2}:00`,
      responseTime: 3 + Math.random() * 3,
      incidents: Math.floor(Math.random() * 8),
    }));
    setHourlyData(hourlyStats);
  }, [accidents]);

  return (
    <Card className="p-6 shadow-lg border-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-3 rounded-xl shadow-lg">
          <BarChart3 className="w-6 h-6" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="font-bold text-2xl display-text">Analytics Dashboard</h2>
          <p className="text-sm text-gray-600 font-medium">Real-time insights and trends</p>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-11 bg-gray-100 border-2">
          <TabsTrigger value="timeline" className="font-semibold text-sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="severity" className="font-semibold text-sm">
            <PieChartIcon className="w-4 h-4 mr-2" />
            Severity
          </TabsTrigger>
          <TabsTrigger value="performance" className="font-semibold text-sm">
            <Activity className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2 text-lg">24-Hour Incident Timeline</h3>
              <p className="text-sm text-gray-600 mb-4">Incidents and responses over the last 24 hours</p>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" stroke="#64748b" style={{ fontSize: '12px', fontWeight: 600 }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px', fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #e2e8f0', 
                    borderRadius: '12px',
                    fontWeight: 600
                  }} 
                />
                <Legend wrapperStyle={{ fontWeight: 600 }} />
                <Area 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="#dc2626" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorIncidents)" 
                  name="Incidents"
                />
                <Area 
                  type="monotone" 
                  dataKey="responses" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorResponses)" 
                  name="Responses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="severity">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-2 text-lg">Severity Distribution</h3>
              <p className="text-sm text-gray-600 mb-4">Breakdown of incidents by severity level</p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #e2e8f0', 
                      borderRadius: '12px',
                      fontWeight: 600
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="font-bold mb-2 text-lg">Severity Comparison</h3>
              <p className="text-sm text-gray-600 mb-4">Total incidents by severity category</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={severityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px', fontWeight: 600 }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px', fontWeight: 600 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #e2e8f0', 
                      borderRadius: '12px',
                      fontWeight: 600
                    }} 
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div>
            <h3 className="font-bold mb-2 text-lg">Response Time Trends</h3>
            <p className="text-sm text-gray-600 mb-4">Average response times throughout the day</p>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px', fontWeight: 600 }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px', fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #e2e8f0', 
                    borderRadius: '12px',
                    fontWeight: 600
                  }} 
                />
                <Legend wrapperStyle={{ fontWeight: 600 }} />
                <Line 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 5 }}
                  name="Response Time (min)"
                />
                <Line 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  name="Incidents"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
