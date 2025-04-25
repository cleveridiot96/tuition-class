
import React, { useState } from 'react';
import FormatConfirmationDialog from "@/components/FormatConfirmationDialog";
import { 
  completeFormatAllData,
  exportDataBackup
} from "@/services/storageService";
import { toast } from "sonner";
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
      
      // Create a backup first
      await exportDataBackup(`backup-before-format-${new Date().toISOString()}.json`);
      
      // Use our improved format function that properly clears all data
      const formatSuccess = await completeFormatAllData();
      
      if (formatSuccess) {
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
        throw new Error("Format operation failed");
      }
    } catch (error) {
      console.error("Error during formatting:", error);
      toast({
        title: "Format Error",
        description: "There was a problem formatting the data. Please try again.",
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
