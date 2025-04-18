
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Database, Download, Trash2, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  debugStorage, 
  clearAllData, 
  exportDataBackup, 
  importDataBackup,
} from '@/services/storageService';

export function StorageDebugger() {
  const [storageData, setStorageData] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('view');
  const [importData, setImportData] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleDebugClick = () => {
    try {
      console.log("Debugging storage...");
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
      
      console.log("Storage data:", allData);
      setStorageData(JSON.stringify(allData, null, 2));
    } catch (error) {
      console.error('Error debugging storage:', error);
      toast.error("Error accessing storage data");
    }
  };

  const handleExport = () => {
    try {
      const backup = exportDataBackup();
      if (backup) {
        // Create blob and download
        const blob = new Blob([backup], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success("Data backup exported successfully");
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error("Error creating data backup");
    }
  };

  const handleImport = () => {
    try {
      if (!importData.trim()) {
        toast.error("Please paste backup data first");
        return;
      }
      
      if (window.confirm('Importing data will replace all existing data. Continue?')) {
        const success = importDataBackup(importData);
        
        if (success) {
          toast.success("Data imported successfully");
          handleDebugClick(); // Refresh view
        } else {
          toast.error("Error importing data: Invalid format");
        }
      }
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error("Error importing data: Invalid JSON");
    }
  };

  const filteredStorageData = React.useMemo(() => {
    try {
      if (!searchTerm.trim() || !storageData) {
        return storageData;
      }

      const data = JSON.parse(storageData);
      const filteredData: Record<string, any> = {};
      
      Object.keys(data).forEach(key => {
        if (key.toLowerCase().includes(searchTerm.toLowerCase())) {
          filteredData[key] = data[key];
        }
      });
      
      return JSON.stringify(filteredData, null, 2);
    } catch (e) {
      return storageData;
    }
  }, [storageData, searchTerm]);

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
          Storage Manager
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Storage Manager</DialogTitle>
          <DialogDescription>
            View, export, import and manage application data
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="view" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="view">View Data</TabsTrigger>
            <TabsTrigger value="export">Export Data</TabsTrigger>
            <TabsTrigger value="import">Import Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative flex-1 max-w-sm">
                <Input
                  type="text"
                  placeholder="Search keys..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-8"
                />
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  if (window.confirm('This will clear all transaction data. Continue?')) {
                    clearAllData();
                    handleDebugClick(); // Refresh view
                    toast.success("All data cleared");
                  }
                }}
                className="flex gap-2 items-center"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </Button>
            </div>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <pre className="text-sm">{filteredStorageData}</pre>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="export" className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Export a backup of all application data. This file can be used to restore your data later.
            </div>
            <Button onClick={handleExport} className="flex gap-2 items-center">
              <Download className="h-4 w-4" />
              Download Backup
            </Button>
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="text-sm font-medium">Backup includes:</p>
              <ul className="text-sm mt-2 list-disc pl-5 space-y-1">
                <li>Master data (Agents, Suppliers, Customers, etc.)</li>
                <li>Transactions (Purchases, Sales, etc.)</li>
                <li>Configuration settings</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="import" className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Paste a previously exported backup to restore your data. This will replace all existing data.
            </div>
            <ScrollArea className="h-[300px] w-full border rounded-md">
              <textarea
                className="w-full h-full p-4 resize-none focus:outline-none"
                placeholder="Paste your backup JSON data here..."
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
              />
            </ScrollArea>
            <Button 
              onClick={handleImport}
              className="flex gap-2 items-center"
              disabled={!importData.trim()}
            >
              <Upload className="h-4 w-4" />
              Import Data
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
