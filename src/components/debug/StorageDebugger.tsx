
import React from 'react';
import { Button } from "@/components/ui/button";
import { Database, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { debugStorage, clearAllData } from '@/services/storageUtils';

export function StorageDebugger() {
  const [storageData, setStorageData] = React.useState<string>('');

  const handleDebugClick = () => {
    try {
      debugStorage();
      const allData: Record<string, any> = {};
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
          } catch (e) {
            allData[key] = localStorage.getItem(key);
          }
        }
      }
      
      setStorageData(JSON.stringify(allData, null, 2));
    } catch (error) {
      console.error('Error debugging storage:', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleDebugClick}
          className="flex gap-2 items-center"
        >
          <Database className="h-4 w-4" />
          Debug Storage
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Storage Debug Info</DialogTitle>
          <DialogDescription>
            View current local storage state and manage data
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                if (window.confirm('This will clear all transaction data. Continue?')) {
                  clearAllData();
                  handleDebugClick(); // Refresh view
                }
              }}
              className="flex gap-2 items-center"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </Button>
          </div>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <pre className="text-sm">{storageData}</pre>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
