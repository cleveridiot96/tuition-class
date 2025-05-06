import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Upload, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";
import { exportDataBackup, importDataBackup } from '@/services/backup/backupRestore';
import { useHotkeys, showAvailableShortcuts } from '@/hooks/useHotkeys';

interface BackupRestoreControlsProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const BackupRestoreControls: React.FC<BackupRestoreControlsProps> = ({
  onRefresh,
  isRefreshing = false,
}) => {
  // Register keyboard shortcuts
  useHotkeys([
    { key: 'h', alt: true, handler: showAvailableShortcuts, description: "Show keyboard shortcuts" }
  ]);
  
  const handleRefreshClick = () => {
    toast.info("Refreshing application data...");
    if (onRefresh) onRefresh();
  };

  const handleBackup = async () => {
    toast.info("Creating backup...");
    try {
      const fileName = `backup-${new Date().toISOString().split('T')[0]}.json`;
      const backup = await exportDataBackup(fileName);
      if (backup) {
        toast.success("Backup created successfully", { 
          description: "Your data has been exported to a file." 
        });
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error("Failed to create backup", {
        description: "An error occurred while creating your backup."
      });
    }
  };

  const handleRestore = () => {
    try {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.json';
      
      fileInput.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        
        if (target.files && target.files.length) {
          const file = target.files[0];
          
          toast.info("Restoring data from backup...");
          importDataBackup(file)
            .then(success => {
              if (success) {
                toast.success("Data restored successfully", {
                  description: "Your data has been restored from backup."
                });
                
                if (onRefresh) {
                  setTimeout(() => onRefresh(), 500);
                }
              } else {
                toast.error("Failed to restore data", {
                  description: "The backup file format is not valid."
                });
              }
            })
            .catch(error => {
              console.error('Error restoring data:', error);
              toast.error("Failed to restore data", {
                description: "An error occurred while processing the backup file."
              });
            });
        }
      };
      
      fileInput.click();
    } catch (error) {
      console.error('Error setting up file input:', error);
      toast.error("Failed to open file selector", {
        description: "Please try again or use the Storage Manager."
      });
    }
  };

  const handleShowShortcuts = () => {
    showAvailableShortcuts();
  };

  return (
    <div className="flex flex-col md:flex-row justify-center gap-3 w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
        <Button
          variant="outline"
          size="lg"
          onClick={handleRefreshClick}
          disabled={isRefreshing}
          className="flex items-center justify-center gap-2 py-4 border-blue-200"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          Refresh Data
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={handleBackup}
          className="flex items-center justify-center gap-2 py-4 border-blue-200"
        >
          <Download size={16} />
          Backup Data
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={handleRestore}
          className="flex items-center justify-center gap-2 py-4 border-blue-200"
        >
          <Upload size={16} />
          Restore Data
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={handleShowShortcuts}
          className="flex items-center justify-center gap-2 py-4 border-blue-200"
        >
          <AlertTriangle size={16} />
          Show Shortcuts
        </Button>
      </div>
    </div>
  );
};

export default BackupRestoreControls;
