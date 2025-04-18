import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Download, Upload, AlertTriangle } from "lucide-react";
import { exportDataBackup, importDataBackup, debugStorage } from "@/services/storageService";
import PortableAppButton from "./dashboard/PortableAppButton";

interface BackupRestoreControlsProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const BackupRestoreControls = ({ onRefresh, isRefreshing }: BackupRestoreControlsProps) => {
  const [isRestoring, setIsRestoring] = useState(false);

  const handleBackup = () => {
    try {
      const jsonData = exportDataBackup();
      
      if (!jsonData) {
        toast.error("Failed to create backup");
        return;
      }
      
      // Create a download link for the JSON data
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      // Generate filename with date
      const date = new Date();
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      a.download = `backup_${dateStr}.json`;
      a.href = url;
      a.click();
      
      URL.revokeObjectURL(url);
      toast.success("Backup created and downloaded successfully");
      
      window.dispatchEvent(new CustomEvent('backup-created', { detail: { success: true } }));
    } catch (error) {
      console.error("Error during backup:", error);
      toast.error("Error creating backup");
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
        setIsRestoring(true);
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const content = event.target?.result as string;
          try {
            if (!content) {
              toast.error("Backup file is empty");
              setIsRestoring(false);
              return;
            }
            
            // Debug the content
            console.log("Restore file size:", content.length, "bytes");
            
            // Log a sample of the content for debugging (first 100 chars)
            if (content.length > 100) {
              console.log("Sample content:", content.substring(0, 100) + "...");
            }
            
            // Attempt to parse the JSON to validate it before importing
            JSON.parse(content);
            
            // All good - proceed with import
            const success = importDataBackup(content);
            
            if (success) {
              toast.success("Data restored successfully");
              onRefresh();
              
              // Debug storage after restore
              setTimeout(() => {
                debugStorage();
              }, 500);
            } else {
              toast.error("Failed to restore data from backup");
            }
          } catch (error) {
            console.error("Import error:", error);
            toast.error("Invalid backup file format");
          } finally {
            setIsRestoring(false);
          }
        };
        
        reader.onerror = () => {
          toast.error("Error reading backup file");
          setIsRestoring(false);
        };
        
        reader.readAsText(file);
      }
    };
    
    input.click();
  };
  
  return (
    <Card className="mb-6 border border-gray-200 bg-white">
      <CardContent className="p-4 flex flex-wrap justify-between items-center gap-3">
        <div className="flex gap-3 flex-wrap">
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
            variant={isRestoring ? "destructive" : "outline"} 
            className="flex items-center gap-2"
            onClick={handleRestore}
            disabled={isRestoring}
          >
            {isRestoring ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {isRestoring ? "Restoring..." : "Restore Data"}
          </Button>
          
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            onClick={() => debugStorage()}
            title="Log storage info to console for debugging"
          >
            <AlertTriangle size={16} />
            Debug Storage
          </Button>
        </div>
        
        <PortableAppButton />
      </CardContent>
    </Card>
  );
};

export default BackupRestoreControls;
