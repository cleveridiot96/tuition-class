
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Download, Upload } from "lucide-react";
import { exportDataBackup, importDataBackup } from "@/services/storageService";
import PortableAppButton from "./dashboard/PortableAppButton";
import { toast } from "@/hooks/use-toast";

interface BackupRestoreControlsProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const BackupRestoreControls = ({ onRefresh, isRefreshing }: BackupRestoreControlsProps) => {
  const handleBackup = () => {
    try {
      const jsonData = exportDataBackup();
      if (jsonData) {
        const success = jsonData.length > 0;
        window.dispatchEvent(new CustomEvent('backup-created', { detail: { success } }));
      } else {
        window.dispatchEvent(new CustomEvent('backup-created', { detail: { success: false } }));
      }
    } catch (error) {
      console.error("Error during backup:", error);
      window.dispatchEvent(new CustomEvent('backup-created', { detail: { success: false } }));
    }
  };
  
  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          try {
            const success = importDataBackup(content);
            if (success) {
              onRefresh();
              toast({
                title: "Data Restored",
                description: "Your backup has been successfully restored."
              });
            }
          } catch (error) {
            console.error("Import error:", error);
            toast({
              title: "Restore Failed",
              description: "There was a problem importing your backup data.",
              variant: "destructive"
            });
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  };
  
  return (
    <Card className="mb-6 border border-gray-200 bg-white">
      <CardContent className="p-4 flex flex-wrap justify-between items-center gap-3">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            Refresh Data
          </Button>
            
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleBackup}
          >
            <Download size={16} />
            Backup Data
          </Button>
            
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleRestore}
          >
            <Upload size={16} />
            Restore Data
          </Button>
        </div>
        
        <PortableAppButton />
      </CardContent>
    </Card>
  );
};

export default BackupRestoreControls;
