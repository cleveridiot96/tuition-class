
import React, { useState } from 'react';
import FormatConfirmationDialog from "@/components/FormatConfirmationDialog";
import { 
  exportDataBackup, 
  clearAllData, 
  clearAllMasterData, 
  seedInitialData 
} from "@/services/storageService";
import { toast } from "@/hooks/use-toast";
import FormatEventConnector from './FormatEventConnector';

interface FormatDataHandlerProps {
  onFormatComplete: () => void;
}

const FormatDataHandler = ({ onFormatComplete }: FormatDataHandlerProps) => {
  const [isFormatDialogOpen, setIsFormatDialogOpen] = useState(false);

  const handleFormatClick = () => {
    setIsFormatDialogOpen(true);
  };

  const handleFormatConfirm = async () => {
    try {
      console.log("Format operation starting...");
      toast({
        title: "Format in progress",
        description: "Creating backup and resetting data...",
      });
      
      // Create backup before formatting
      const backupData = exportDataBackup(true);
      console.log("Backup created:", backupData ? "Success" : "Failed");
      
      if (backupData) {
        // Save backup to localStorage
        localStorage.setItem('preFormatBackup', backupData);
        
        // Clear all localStorage completely
        localStorage.clear();
        
        // Small delay to ensure clearing is complete
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Seed with fresh initial data
        seedInitialData(true);
        
        // Another small delay before notifying the system
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Notify other components about the data change
        window.dispatchEvent(new Event('storage'));
        
        // Show success message
        toast({
          title: "Data Formatted Successfully",
          description: "All data has been completely reset. A backup was created automatically.",
        });
        
        // Trigger the completion callback
        setTimeout(() => {
          onFormatComplete();
        }, 500);
      } else {
        throw new Error("Failed to create backup data");
      }
    } catch (error) {
      console.error("Error during formatting:", error);
      toast({
        title: "Format Error",
        description: "There was a problem formatting the data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFormatDialogOpen(false);
    }
  };

  return (
    <>
      <FormatEventConnector onFormatClick={handleFormatClick} />
      <FormatConfirmationDialog
        isOpen={isFormatDialogOpen}
        onClose={() => setIsFormatDialogOpen(false)}
        onConfirm={handleFormatConfirm}
      />
    </>
  );
};

export { FormatDataHandler, type FormatDataHandlerProps };
