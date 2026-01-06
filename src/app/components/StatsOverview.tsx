import React from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, TrendingDown } from 'lucide-react';
import { Card } from './ui/card';

interface AccidentData {
  id: string;
  timestamp: Date;
  location: { lat: number; lng: number; address: string };
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  status: 'detecting' | 'confirmed' | 'dispatched' | 'responding';
}

interface StatsOverviewProps {
  accidents: AccidentData[];
}

export function StatsOverview({ accidents }: StatsOverviewProps) {
  const totalAccidents = accidents.length;
  const criticalAccidents = accidents.filter(a => a.severity === 'critical' || a.severity === 'high').length;
  const resolvedAccidents = accidents.filter(a => a.status === 'responding').length;
  const activeAccidents = accidents.filter(a => a.status !== 'responding').length;
  
  // Calculate average response time (simulated)
  const avgResponseTime = totalAccidents > 0 ? 4.2 : 0;

  const stats = [
    {
      label: 'Total Incidents',
      value: totalAccidents,
      icon: <Activity className="w-5 h-5" strokeWidth={2.5} />,
      gradient: 'from-blue-600 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      iconBg: 'bg-blue-100',
      trend: null
    },
    {
      label: 'Critical Cases',
      value: criticalAccidents,
      icon: <AlertTriangle className="w-5 h-5" strokeWidth={2.5} />,
      gradient: 'from-red-600 to-orange-600',
      bgGradient: 'from-red-50 to-orange-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      iconBg: 'bg-red-100',
      trend: null
    },
    {
      label: 'Active Responses',
      value: activeAccidents,
      icon: <Clock className="w-5 h-5" strokeWidth={2.5} />,
      gradient: 'from-amber-600 to-yellow-600',
      bgGradient: 'from-amber-50 to-yellow-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      iconBg: 'bg-amber-100',
      trend: null
    },
    {
      label: 'Resolved',
      value: resolvedAccidents,
      icon: <CheckCircle className="w-5 h-5" strokeWidth={2.5} />,
      gradient: 'from-emerald-600 to-green-600',
      bgGradient: 'from-emerald-50 to-green-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      iconBg: 'bg-emerald-100',
      trend: null
    },
    {
      label: 'Avg Response Time',
      value: `${avgResponseTime.toFixed(1)}m`,
      icon: <TrendingDown className="w-5 h-5" strokeWidth={2.5} />,
      gradient: 'from-purple-600 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      iconBg: 'bg-purple-100',
      trend: '-12% improvement'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`p-5 bg-gradient-to-br ${stat.bgGradient} border-2 ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.iconBg} shadow-sm`}>
              {stat.icon}
            </div>
          </div>
          <div className={`text-4xl font-bold mb-1 ${stat.textColor} display-text tracking-tight`}>{stat.value}</div>
          <div className="text-sm font-semibold text-gray-700">{stat.label}</div>
          {stat.trend && (
            <div className="text-xs text-green-700 mt-3 flex items-center gap-1 font-medium bg-green-100 px-2 py-1 rounded-full w-fit">
              <TrendingDown className="w-3 h-3" strokeWidth={3} />
              <span>{stat.trend}</span>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}