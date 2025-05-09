
import React from 'react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation title="Settings" showBackButton />
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <h2 className="text-xl font-medium text-gray-800 mb-4">General Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Portable Mode</p>
                  <p className="text-sm text-gray-500">Run application in offline portable mode</p>
                </div>
                <Button variant="outline">
                  Enabled
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Default Location</p>
                  <p className="text-sm text-gray-500">Set your default working location</p>
                </div>
                <Button variant="outline">
                  Change
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
