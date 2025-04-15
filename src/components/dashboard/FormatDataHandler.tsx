
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
      
      const backupJson = exportDataBackup(true);
      console.log("Backup created:", backupJson ? "Success" : "Failed");
      
      if (backupJson) {
        localStorage.setItem('preFormatBackup', backupJson);
        
        clearAllData();
        clearAllMasterData();
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        seedInitialData();
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        window.dispatchEvent(new Event('storage'));
        
        toast({
          title: "Data Formatted Successfully",
          description: "All data has been reset to initial state. A backup was created automatically.",
        });
        
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
