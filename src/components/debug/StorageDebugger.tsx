
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Database, Download, Trash2, Upload, Search, Server, X, Filter } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function StorageDebugger() {
  const [storageData, setStorageData] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('view');
  const [importData, setImportData] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showBackupConfirm, setShowBackupConfirm] = useState<boolean>(false);
  const [storageStats, setStorageStats] = useState<{[key: string]: number}>({});

  const handleDebugClick = () => {
    try {
      console.log("Debugging storage...");
      debugStorage();
      
      const allData: Record<string, any> = {};
      const stats: {[key: string]: number} = {};
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || 'null');
            allData[key] = data;
            
            // Calculate stats
            if (Array.isArray(data)) {
              stats[key] = data.length;
            } else if (typeof data === 'object' && data !== null) {
              stats[key] = Object.keys(data).length;
            } else {
              stats[key] = 1;
            }
          } catch (e) {
            allData[key] = localStorage.getItem(key);
            stats[key] = 1;
          }
        }
      }
      
      setStorageStats(stats);
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

  const handleClearData = () => {
    setShowBackupConfirm(true);
  };

  const proceedWithDataClear = (shouldBackup: boolean) => {
    if (shouldBackup) {
      handleExport();
    }
    
    clearAllData();
    handleDebugClick(); // Refresh view
    toast.success("All data cleared");
    setShowBackupConfirm(false);
  };

  const filteredStorageData = React.useMemo(() => {
    try {
      if ((!searchTerm.trim() && filterType === 'all') || !storageData) {
        return storageData;
      }

      const data = JSON.parse(storageData);
      const filteredData: Record<string, any> = {};
      
      Object.keys(data).forEach(key => {
        // Apply type filter
        if (filterType !== 'all') {
          if (filterType === 'master' && !isMasterData(key)) return;
          if (filterType === 'transaction' && !isTransactionData(key)) return;
          if (filterType === 'settings' && !isSettingsData(key)) return;
        }
        
        // Apply search term filter
        if (searchTerm.trim() && !key.toLowerCase().includes(searchTerm.toLowerCase())) {
          return;
        }
        
        filteredData[key] = data[key];
      });
      
      return JSON.stringify(filteredData, null, 2);
    } catch (e) {
      return storageData;
    }
  }, [storageData, searchTerm, filterType]);

  // Helper functions to categorize data
  const isMasterData = (key: string): boolean => {
    return ['agents', 'customers', 'suppliers', 'brokers', 'transporters', 'locations'].includes(key);
  };
  
  const isTransactionData = (key: string): boolean => {
    return ['purchases', 'sales', 'payments', 'receipts', 'inventory'].some(prefix => 
      key === prefix || key.startsWith(`${prefix}_`)
    );
  };
  
  const isSettingsData = (key: string): boolean => {
    return ['currentFinancialYear', 'settings', 'user'].some(prefix => key.startsWith(prefix));
  };

  // Count total entries
  const getTotalEntries = (): number => {
    return Object.values(storageStats).reduce((sum, count) => sum + count, 0);
  };

  return (
    <>
      <Dialog onOpenChange={(open) => { if (open) handleDebugClick(); }}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="flex gap-2 items-center"
          >
            <Database className="h-4 w-4" />
            Storage Manager
            {getTotalEntries() > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {getTotalEntries()} entries
              </Badge>
            )}
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
              <div className="flex flex-wrap gap-2 justify-between items-center">
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search keys..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-8"
                    />
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <select 
                      value={filterType} 
                      onChange={(e) => setFilterType(e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="all">All</option>
                      <option value="master">Master Data</option>
                      <option value="transaction">Transactions</option>
                      <option value="settings">Settings</option>
                    </select>
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleClearData}
                  className="flex gap-2 items-center"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All Data
                </Button>
              </div>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <pre className="text-sm">{filteredStorageData}</pre>
              </ScrollArea>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {Object.keys(storageStats).sort().map(key => (
                  <div 
                    key={key} 
                    className="p-2 border rounded flex items-center justify-between gap-1 text-sm"
                    onClick={() => {
                      setSearchTerm(key);
                      setFilterType('all');
                    }}
                    title={`View only ${key} data`}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="truncate flex-1">{key}</span>
                    <Badge variant="secondary">{storageStats[key]}</Badge>
                  </div>
                ))}
              </div>
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
      
      {/* Confirmation Dialog for Clearing Data */}
      <AlertDialog open={showBackupConfirm} onOpenChange={setShowBackupConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Backup Before Clearing?</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to backup your data before clearing? This will download a .json file with all your data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => proceedWithDataClear(false)} className="bg-destructive hover:bg-destructive/90">
              Clear Without Backup
            </AlertDialogAction>
            <AlertDialogAction onClick={() => proceedWithDataClear(true)}>
              Backup and Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
