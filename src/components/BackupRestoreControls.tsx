
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, RefreshCw, TabletSmartphone, HardDrive, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportDataBackup, importDataBackup } from "@/services/storageService";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BackupRestoreControlsProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const BackupRestoreControls = ({ onRefresh, isRefreshing }: BackupRestoreControlsProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPortabilityDialog, setShowPortabilityDialog] = useState(false);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = importDataBackup(content);
      
      if (success) {
        toast({
          title: "Data Import Successful",
          description: "All data successfully imported",
        });
        onRefresh();
      } else {
        toast({
          title: "Import Failed",
          description: "There was a problem importing data",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleExportBackup = () => {
    const jsonData = exportDataBackup();
    if (jsonData) {
      // Create a blob and download it
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kisan-khata-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Save backup to localStorage as well for redundancy
      try {
        localStorage.setItem('lastBackup', jsonData);
        localStorage.setItem('lastBackupDate', new Date().toISOString());
        
        toast({
          title: "Backup Created",
          description: "Data backup successfully downloaded and saved locally",
        });
      } catch (error) {
        console.error("Error saving backup to localStorage:", error);
        
        toast({
          title: "Backup Downloaded",
          description: "Data backup downloaded successfully, but couldn't save a local copy",
        });
      }
    } else {
      toast({
        title: "Backup Failed",
        description: "There was a problem creating the backup",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="mt-6 flex justify-center gap-4">
        <Button
          onClick={handleExportBackup}
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Save size={20} />
          Backup
        </Button>
        <Button
          onClick={handleImportClick}
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Upload size={20} />
          Restore
        </Button>
        <Button
          onClick={onRefresh}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </Button>
        <Button
          onClick={() => setShowPortabilityDialog(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <TabletSmartphone size={20} />
          Portable Usage
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".json"
          className="hidden"
        />
      </div>

      <Dialog open={showPortabilityDialog} onOpenChange={setShowPortabilityDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Portable Usage Instructions</DialogTitle>
            <DialogDescription>
              Follow these steps to use this app on any device
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 text-sm">
            <div className="space-y-2">
              <h3 className="font-medium">Step 1: Export Your Data</h3>
              <p>Click the "Backup" button to download your data as a JSON file.</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Step 2: Get the Portable App</h3>
              <p>Download the full app by clicking the button below. This creates a portable version you can copy to any storage device.</p>
              <Button 
                onClick={() => {
                  toast({
                    title: "Instructions",
                    description: "Use the build command: 'npm run build' then copy the generated 'dist' folder to your portable storage device"
                  });
                }}
                className="flex items-center gap-2 w-full"
              >
                <HardDrive size={16} />
                Prepare Portable Version
              </Button>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Step 3: Use on Any Device</h3>
              <p>Copy the downloaded app to your pen drive. On any device, open the "launch.html" file in a web browser to start using the app.</p>
            </div>
            
            <div className="space-y-2 pt-2">
              <h3 className="font-medium">Device Compatibility:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Windows PC: Use any modern browser</li>
                <li>Android: Use Chrome browser</li>
                <li>iOS/iPad: Use Safari browser</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BackupRestoreControls;
