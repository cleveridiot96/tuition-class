
import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navigation title="Settings" showBackButton pageType="settings" />
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white border-green-200 shadow mb-6">
          <CardHeader>
            <CardTitle className="text-green-800">Application Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Dark Mode</h3>
                <p className="text-sm text-gray-500">Enable dark mode for the application</p>
              </div>
              <Switch id="dark-mode" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Auto Backup</h3>
                <p className="text-sm text-gray-500">Automatically backup data every day</p>
              </div>
              <Switch id="auto-backup" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Notifications</h3>
                <p className="text-sm text-gray-500">Enable system notifications</p>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-green-200 shadow">
          <CardHeader>
            <CardTitle className="text-green-800">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Backup Data</h3>
              <p className="text-sm text-gray-500 mb-2">Create a backup of all your data</p>
              <Button variant="outline">Create Backup</Button>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Restore Data</h3>
              <p className="text-sm text-gray-500 mb-2">Restore data from a backup</p>
              <Button variant="outline">Restore from Backup</Button>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Export Data</h3>
              <p className="text-sm text-gray-500 mb-2">Export data to Excel</p>
              <Button variant="outline">Export to Excel</Button>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-red-600">Reset All Data</h3>
              <p className="text-sm text-gray-500 mb-2">This will delete all data. This action cannot be undone.</p>
              <Button variant="destructive">Reset All Data</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
