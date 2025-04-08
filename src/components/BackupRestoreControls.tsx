
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportDataBackup, importDataBackup } from "@/services/storageService";

interface BackupRestoreControlsProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const BackupRestoreControls = ({ onRefresh, isRefreshing }: BackupRestoreControlsProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      toast({
        title: "Backup Created",
        description: "Data backup successfully downloaded",
      });
    } else {
      toast({
        title: "Backup Failed",
        description: "There was a problem creating the backup",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-6 flex justify-center gap-4">
      <Button
        onClick={handleExportBackup}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Download size={20} />
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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".json"
        className="hidden"
      />
    </div>
  );
};

export default BackupRestoreControls;
