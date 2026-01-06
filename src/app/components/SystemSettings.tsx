import React, { useState } from 'react';
import { Settings, Bell, Volume2, Zap, Shield, Camera, Moon } from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

export function SystemSettings() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState([75]);
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [highSeverityOnly, setHighSeverityOnly] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [aiSensitivity, setAiSensitivity] = useState([85]);
  const [notificationLevel, setNotificationLevel] = useState('all');
  const [cameraRefreshRate, setCameraRefreshRate] = useState('30fps');

  return (
    <Card className="p-6 shadow-lg border-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-slate-700 to-gray-800 text-white p-3 rounded-xl shadow-lg">
          <Settings className="w-6 h-6" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="font-bold text-2xl display-text">System Settings</h2>
          <p className="text-sm text-gray-600 font-medium">Configure system preferences and alerts</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Notifications Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
            <h3 className="font-bold text-lg display-text">Notifications</h3>
          </div>
          <div className="space-y-4 pl-7">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="sound" className="font-semibold">Sound Alerts</Label>
                <p className="text-xs text-gray-600 mt-0.5">Play audio alerts for new incidents</p>
              </div>
              <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>

            {soundEnabled && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-semibold flex items-center gap-2">
                    <Volume2 className="w-4 h-4" strokeWidth={2.5} />
                    Volume Level
                  </Label>
                  <span className="text-sm font-bold text-gray-700">{volume[0]}%</span>
                </div>
                <Slider value={volume} onValueChange={setVolume} max={100} step={1} />
              </div>
            )}

            <div className="p-3 bg-gray-50 rounded-lg">
              <Label className="font-semibold mb-2 block">Notification Level</Label>
              <Select value={notificationLevel} onValueChange={setNotificationLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Incidents</SelectItem>
                  <SelectItem value="medium-up">Medium & Above</SelectItem>
                  <SelectItem value="high-critical">High & Critical Only</SelectItem>
                  <SelectItem value="critical">Critical Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="high-only" className="font-semibold">Priority Alerts Only</Label>
                <p className="text-xs text-gray-600 mt-0.5">Notify only for high/critical incidents</p>
              </div>
              <Switch id="high-only" checked={highSeverityOnly} onCheckedChange={setHighSeverityOnly} />
            </div>
          </div>
        </div>

        <Separator />

        {/* AI Detection Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
            <h3 className="font-bold text-lg display-text">AI Detection</h3>
          </div>
          <div className="space-y-4 pl-7">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="auto-dispatch" className="font-semibold">Auto-Dispatch</Label>
                <p className="text-xs text-gray-600 mt-0.5">Automatically dispatch emergency services</p>
              </div>
              <Switch id="auto-dispatch" checked={autoDispatch} onCheckedChange={setAutoDispatch} />
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Label className="font-semibold">Detection Sensitivity</Label>
                <span className="text-sm font-bold text-purple-700">{aiSensitivity[0]}%</span>
              </div>
              <Slider 
                value={aiSensitivity} 
                onValueChange={setAiSensitivity} 
                max={100} 
                min={50}
                step={5} 
              />
              <p className="text-xs text-gray-600 mt-2">
                {aiSensitivity[0] >= 90 ? 'High sensitivity - May increase false positives' :
                 aiSensitivity[0] >= 75 ? 'Balanced - Recommended setting' :
                 'Low sensitivity - May miss some incidents'}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Camera Settings Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Camera className="w-5 h-5 text-cyan-600" strokeWidth={2.5} />
            <h3 className="font-bold text-lg display-text">Camera Settings</h3>
          </div>
          <div className="space-y-4 pl-7">
            <div className="p-3 bg-gray-50 rounded-lg">
              <Label className="font-semibold mb-2 block">Refresh Rate</Label>
              <Select value={cameraRefreshRate} onValueChange={setCameraRefreshRate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select FPS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15fps">15 FPS (Low bandwidth)</SelectItem>
                  <SelectItem value="30fps">30 FPS (Balanced)</SelectItem>
                  <SelectItem value="60fps">60 FPS (High quality)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Appearance Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Moon className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
            <h3 className="font-bold text-lg display-text">Appearance</h3>
          </div>
          <div className="space-y-4 pl-7">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="dark-mode" className="font-semibold">Dark Mode</Label>
                <p className="text-xs text-gray-600 mt-0.5">Switch to dark theme</p>
              </div>
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button className="flex-1 font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
            Save Settings
          </Button>
          <Button variant="outline" className="flex-1 font-bold">
            Reset to Default
          </Button>
        </div>

        {/* Info Box */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
            <div>
              <h4 className="font-bold text-blue-900 text-sm mb-1">System Status</h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                All settings are saved locally and synchronized across the network. 
                Changes to AI sensitivity may require system restart to take effect.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
}
