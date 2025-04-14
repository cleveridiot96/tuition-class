
import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Settings as SettingsIcon, 
  Database, 
  CloudDownload, 
  RefreshCw, 
  Moon, 
  Sun,
  Download,
  Upload
} from "lucide-react";
import FontSizeControl from "@/components/FontSizeControl";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "@/components/ModeToggle";

const Settings = () => {
  const { toast } = useToast();

  const handleBackup = () => {
    toast({
      title: "Backup Started",
      description: "Creating backup of all data...",
    });
    
    // Simulate backup process
    setTimeout(() => {
      toast({
        title: "Backup Completed",
        description: "Data backup has been downloaded to your device.",
      });
    }, 1500);
  };

  const handleRestore = () => {
    // Implement restore functionality
    toast({
      title: "Restore Feature",
      description: "Please upload your backup file to restore data.",
    });
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="सेटिंग्स (Settings)" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold">
                <span className="flex items-center">
                  <SettingsIcon className="mr-2" size={24} />
                  Display Settings
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Theme</h3>
                    <p className="text-sm text-gray-500">Change app appearance</p>
                  </div>
                  <ModeToggle />
                </div>
                
                <div className="pt-2">
                  <h3 className="font-semibold text-lg mb-3">Font Size</h3>
                  <FontSizeControl />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold">
                <span className="flex items-center">
                  <Database className="mr-2" size={24} />
                  Data Management
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Backup Data</h3>
                    <p className="text-sm text-gray-500">Download a copy of all your data</p>
                  </div>
                  <Button 
                    onClick={handleBackup}
                    className="flex items-center gap-2"
                  >
                    <Download size={18} />
                    Backup
                  </Button>
                </div>
                
                <div className="flex justify-between items-center border-b pb-4 pt-2">
                  <div>
                    <h3 className="font-semibold text-lg">Restore Data</h3>
                    <p className="text-sm text-gray-500">Restore from a backup file</p>
                  </div>
                  <Button 
                    onClick={handleRestore}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Upload size={18} />
                    Restore
                  </Button>
                </div>
                
                <div className="pt-2">
                  <h3 className="font-semibold text-lg mb-3">Portable App</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <CloudDownload size={18} />
                      Create Portable Version
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <RefreshCw size={18} />
                      Sync Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold">About</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>App Name:</strong> Kisan Khata Sahayak</p>
                <p><strong>Version:</strong> 1.0.0</p>
                <p><strong>Description:</strong> Agricultural Business Management System - Portable Edition with Data Compression</p>
                <p className="text-sm text-gray-500 mt-4">© 2023-2024 Kisan Khata Sahayak</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
