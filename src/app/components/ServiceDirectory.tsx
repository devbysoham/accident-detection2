import React, { useState } from 'react';
import { Ambulance, Shield, Hospital, Phone, Navigation, Clock, Users, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function ServiceDirectory() {
  const [selectedTab, setSelectedTab] = useState('ambulance');

  const ambulanceServices = [
    {
      id: 'AMB-001',
      name: 'North Kolkata Ambulance Unit 7',
      address: 'Shyambazar Street, North Kolkata',
      phone: '102',
      distance: 1.2,
      eta: 3,
      rating: 4.9,
      staff: 24,
      available: true,
      equipment: ['Defibrillator', 'Oxygen', 'Advanced Life Support']
    },
    {
      id: 'AMB-002',
      name: 'Rapid Response Unit 3',
      address: 'College Street, North Kolkata',
      phone: '102',
      distance: 2.5,
      eta: 5,
      rating: 4.8,
      staff: 18,
      available: true,
      equipment: ['Trauma Kit', 'ECG Monitor', 'IV Supplies']
    },
    {
      id: 'AMB-003',
      name: 'Dum Dum Emergency Services',
      address: 'Jessore Road, Dum Dum, North Kolkata',
      phone: '102',
      distance: 3.8,
      eta: 7,
      rating: 4.7,
      staff: 32,
      available: false,
      equipment: ['Ventilator', 'Surgical Kit', 'Blood Bank']
    }
  ];

  const policeStations = [
    {
      id: 'POL-001',
      name: 'Shyambazar Police Station',
      address: 'Bidhan Sarani, Shyambazar, North Kolkata',
      phone: '100',
      distance: 0.8,
      eta: 2,
      rating: 4.6,
      officers: 45,
      units: 8
    },
    {
      id: 'POL-002',
      name: 'Bagbazar Police Station',
      address: 'Bagbazar Street, North Kolkata',
      phone: '100',
      distance: 1.5,
      eta: 3,
      rating: 4.7,
      officers: 52,
      units: 12
    }
  ];

  const hospitals = [
    {
      id: 'HOS-001',
      name: 'R.G. Kar Medical College and Hospital',
      address: '1 Belgachia Road, North Kolkata',
      phone: '+91 33 2555 5000',
      distance: 2.5,
      eta: 10,
      rating: 4.8,
      beds: 350,
      trauma: 'Level I',
      departments: ['Emergency', 'Trauma', 'Surgery', 'ICU']
    },
    {
      id: 'HOS-002',
      name: 'Calcutta Medical College',
      address: '88 College Street, North Kolkata',
      phone: '+91 33 2241 5151',
      distance: 3.2,
      eta: 12,
      rating: 4.9,
      beds: 420,
      trauma: 'Level I',
      departments: ['Emergency', 'Cardiology', 'Neurology', 'Pediatrics']
    }
  ];

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="mb-2">Emergency Services Directory</h2>
        <p className="text-sm text-gray-600">Comprehensive list of nearest emergency responders</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="ambulance" className="flex items-center gap-2">
            <Ambulance className="w-4 h-4" />
            <span className="hidden sm:inline">Ambulance</span>
          </TabsTrigger>
          <TabsTrigger value="police" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Police</span>
          </TabsTrigger>
          <TabsTrigger value="hospital" className="flex items-center gap-2">
            <Hospital className="w-4 h-4" />
            <span className="hidden sm:inline">Hospitals</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ambulance" className="space-y-3">
          {ambulanceServices.map((service) => (
            <Card key={service.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 text-red-600 p-3 rounded-lg">
                  <Ambulance className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.address}</p>
                    </div>
                    <Badge variant={service.available ? "default" : "secondary"}>
                      {service.available ? 'Available' : 'Busy'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Navigation className="w-4 h-4" />
                      <span>{service.distance} mi away</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{service.eta} min ETA</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{service.staff} staff</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{service.rating} rating</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Equipment:</p>
                    <div className="flex flex-wrap gap-1">
                      {service.equipment.map((item, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" disabled={!service.available}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call {service.phone}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="police" className="space-y-3">
          {policeStations.map((station) => (
            <Card key={station.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{station.name}</h3>
                      <p className="text-sm text-gray-600">{station.address}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Navigation className="w-4 h-4" />
                      <span>{station.distance} mi away</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{station.eta} min ETA</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{station.officers} officers</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{station.rating} rating</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <Badge variant="outline" className="text-xs">
                      {station.units} patrol units available
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call {station.phone}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="hospital" className="space-y-3">
          {hospitals.map((hospital) => (
            <Card key={hospital.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                  <Hospital className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{hospital.name}</h3>
                      <p className="text-sm text-gray-600">{hospital.address}</p>
                    </div>
                    <Badge className="bg-green-600">
                      {hospital.trauma} Trauma
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Navigation className="w-4 h-4" />
                      <span>{hospital.distance} mi away</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{hospital.eta} min ETA</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{hospital.beds} beds</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{hospital.rating} rating</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Departments:</p>
                    <div className="flex flex-wrap gap-1">
                      {hospital.departments.map((dept, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {dept}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call {hospital.phone}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </Card>
  );
}