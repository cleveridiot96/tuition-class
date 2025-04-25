
import React, { useState } from 'react';
import FormatConfirmationDialog from "@/components/FormatConfirmationDialog";
import { 
  completeFormatAllData,
  exportDataBackup,
  exportToExcel
} from "@/services/storageUtils";
import { toast } from "sonner";
import FormatEventConnector from './FormatEventConnector';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormatDataHandlerProps {
  onFormatComplete: () => void;
}

const FormatDataHandler = ({ onFormatComplete }: FormatDataHandlerProps) => {
  const [isFormatDialogOpen, setIsFormatDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [formatPassword, setFormatPassword] = useState("");
  const [exportPassword, setExportPassword] = useState("");
  const [formatType, setFormatType] = useState<"system" | "excel">("system");

  const handleFormatClick = () => {
    setIsPasswordDialogOpen(true);
  };

  const handlePasswordSubmit = () => {
    setIsPasswordDialogOpen(false);
    setIsFormatDialogOpen(true);
  };

  const handleExportClick = (type: "system" | "excel") => {
    setFormatType(type);
    setIsExportDialogOpen(true);
  };

  const handleExportSubmit = async () => {
    setIsExportDialogOpen(false);
    
    if (formatType === "system") {
      // Create a backup with timestamp in filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backupFilename = `backup-${timestamp}.json`;
      const jsonData = await exportDataBackup(backupFilename, false);
      
      if (jsonData) {
        // Create and download the file
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = backupFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } else if (formatType === "excel") {
      exportToExcel(exportPassword);
    }
  };

  const handleFormatConfirm = async () => {
    try {
      console.log("Format operation starting...");
      toast("Format in progress", {
        description: "Creating backup and resetting data...",
      });
      
      // Use our improved format function with password
      const formatSuccess = await completeFormatAllData(formatPassword);
      
      if (formatSuccess) {
        // Show success message
        toast("Data Formatted Successfully", {
          description: "All data has been completely reset. A backup was created automatically.",
        });
        
        // Trigger the completion callback
        setTimeout(() => {
          onFormatComplete();
        }, 500);
      }
    } catch (error) {
      console.error("Error during formatting:", error);
      toast("Format Error", {
        description: "There was a problem formatting the data. Please try again.",
      });
    } finally {
      setIsFormatDialogOpen(false);
    }
  };

  return (
    <>
      <FormatEventConnector 
        onFormatClick={handleFormatClick} 
        onExportSystemClick={() => handleExportClick("system")}
        onExportExcelClick={() => handleExportClick("excel")}
      />
      
      <FormatConfirmationDialog
        isOpen={isFormatDialogOpen}
        onClose={() => setIsFormatDialogOpen(false)}
        onConfirm={handleFormatConfirm}
      />
      
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Format Protection</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="formatPassword">Enter Format Password</Label>
            <Input 
              id="formatPassword" 
              type="password" 
              placeholder="Password"
              value={formatPassword}
              onChange={(e) => setFormatPassword(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formatType === "system" ? "System Backup" : "Excel Export"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {formatType === "excel" && (
              <>
                <Label htmlFor="exportPassword">Enter Export Password</Label>
                <Input 
                  id="exportPassword" 
                  type="password" 
                  placeholder="Password"
                  value={exportPassword}
                  onChange={(e) => setExportPassword(e.target.value)}
                  className="mt-2"
                />
              </>
            )}
            <p className="text-sm text-gray-500 mt-2">
              {formatType === "system" 
                ? "This will download a system backup file that can be used to restore the system." 
                : "This will export your data to Excel format for external use."}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportSubmit}>
              {formatType === "system" ? "Download Backup" : "Export to Excel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { FormatDataHandler, type FormatDataHandlerProps };
