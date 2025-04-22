
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { importDataBackup } from "@/services/storageService";
import { toast } from "sonner";

interface BackupRestoreDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  backupList: string[];
  onBackupRestored: () => void;
}

const BackupRestoreDialog = ({ 
  open, 
  setOpen, 
  backupList,
  onBackupRestored 
}: BackupRestoreDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);

  const handleRestore = async () => {
    if (!selectedBackup) {
      toast.error("Please select a backup to restore");
      return;
    }

    setIsLoading(true);
    try {
      const success = await importDataBackup(selectedBackup);
      if (success) {
        toast.success("Backup restored successfully");
        onBackupRestored();
      } else {
        toast.error("Failed to restore backup");
      }
    } catch (error) {
      console.error("Restore error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Restore from Backup</DialogTitle>
          <DialogDescription>
            Select a backup to restore from the list below.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-72 mt-4 border rounded-md">
          <div className="p-4">
            {backupList.length === 0 ? (
              <p className="text-center text-gray-500">No backups available</p>
            ) : (
              <div className="space-y-2">
                {backupList.map((backup) => (
                  <div
                    key={backup}
                    className={`p-2 border rounded-md cursor-pointer ${
                      selectedBackup === backup ? "bg-blue-100 border-blue-500" : ""
                    }`}
                    onClick={() => setSelectedBackup(backup)}
                  >
                    <p className="font-medium">{backup}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleRestore} 
            disabled={!selectedBackup || isLoading}
            className="bg-blue-600 text-white"
          >
            {isLoading ? "Restoring..." : "Restore Backup"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BackupRestoreDialog;
